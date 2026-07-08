// server/apps-script/Code.gs

var LEAD_COLUMNS = [
  'submissionId', 'createdAt', 'name', 'phone', 'interest', 'preferredContact',
  'whatsappNumber', 'college', 'year', 'location', 'message',
  'pageUrl', 'referrer', 'userAgent', 'device', 'browser',
  'status', 'notes', 'updatedAt'
];

var APPLICATION_COLUMNS = [
  'submissionId', 'createdAt', 'name', 'phone', 'email', 'roleTitle',
  'resumeUrl', 'resumeFileName', 'pageUrl', 'referrer', 'userAgent',
  'device', 'browser', 'status', 'notes', 'updatedAt'
];

var MAX_RESUME_BASE64_LENGTH = Math.ceil(5 * 1024 * 1024 * 4 / 3); // ~5MB file → base64 length ceiling

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function requireValidToken(token) {
  var cache = CacheService.getScriptCache();
  return !!token && cache.get('session_' + token) === '1';
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ ok: false, error: 'invalid_json' });
  }

  if (body.action === 'submit') return handleSubmit(body);
  if (body.action === 'login') return handleLogin(body);
  if (body.action === 'update') return handleUpdate(body);
  if (body.action === 'delete') return handleDelete(body);
  if (body.action === 'apply') return handleApply(body);
  if (body.action === 'update_app') return handleUpdateApplication(body);
  if (body.action === 'delete_app') return handleDeleteApplication(body);

  return jsonResponse({ ok: false, error: 'unknown_action' });
}

function doGet(e) {
  if (e.parameter.action === 'list') return handleList(e.parameter);
  if (e.parameter.action === 'list_apps') return handleListApplications(e.parameter);
  return jsonResponse({ ok: false, error: 'unknown_action' });
}

function handleSubmit(body) {
  var lead = body.lead || {};
  if (!lead.name || !lead.phone || !lead.submissionId) {
    return jsonResponse({ ok: false, error: 'missing_required_fields' });
  }

  var existing = null;
  try {
    existing = firestoreGetDoc('leads', lead.submissionId);
  } catch (err) {
    // Ignore, assume new lead
  }

  var record = {};
  LEAD_COLUMNS.forEach(function (col) { record[col] = lead[col] || ''; });

  var firestoreOk = false;

  if (existing) {
    // Preserve existing metadata
    record.createdAt = existing.createdAt || new Date().toISOString();
    record.status = existing.status || 'New';
    record.notes = existing.notes || '';
    record.updatedAt = new Date().toISOString();

    try {
      firestoreCreateDoc('leads', record.submissionId, record);
      firestoreOk = true;
    } catch (err) {
      logError('firestore_update_submit', err, record);
    }

    try {
      var sheetUpdated = updateLeadInSheet(record);
      if (!sheetUpdated) {
        appendLeadToSheet(record);
      }
    } catch (err) {
      logError('sheet_update_submit', err, record);
    }
  } else {
    record.createdAt = new Date().toISOString();
    record.status = 'New';
    record.notes = '';
    record.updatedAt = record.createdAt;

    try {
      firestoreCreateDoc('leads', record.submissionId, record);
      firestoreOk = true;
    } catch (err) {
      logError('firestore_create', err, record);
    }

    try { appendLeadToSheet(record); } catch (err) { logError('sheet_append', err, record); }
    try { sendLeadEmail(record); } catch (err) { logError('email_send', err, record); }
    try { sendLeadTelegram(record); } catch (err) { logError('telegram_send', err, record); }
  }

  return jsonResponse({ ok: firestoreOk });
}

function handleLogin(body) {
  var props = PropertiesService.getScriptProperties();
  var validUser = body.username === props.getProperty('ADMIN_USER');
  var validPass = body.password === props.getProperty('ADMIN_PASS');

  if (validUser && validPass) {
    var token = Utilities.getUuid();
    CacheService.getScriptCache().put('session_' + token, '1', 6 * 60 * 60); // 6h
    return jsonResponse({ ok: true, token: token });
  }
  if (!validUser && !validPass) {
    return jsonResponse({ ok: false, error: 'invalid_both' });
  }
  if (!validUser) {
    return jsonResponse({ ok: false, error: 'invalid_username' });
  }
  return jsonResponse({ ok: false, error: 'invalid_password' });
}

function handleUpdate(body) {
  if (!requireValidToken(body.token)) return jsonResponse({ ok: false, error: 'unauthorized' });
  var submissionId = body.submissionId;
  if (!submissionId) return jsonResponse({ ok: false, error: 'missing_submissionId' });

  var updates = body.updates || {};
  updates.updatedAt = new Date().toISOString();
  try {
    firestoreUpdateDoc('leads', submissionId, updates);
  } catch (err) {
    logError('firestore_update', err, { submissionId: submissionId, updates: updates });
    return jsonResponse({ ok: false, error: 'firestore_update_failed' });
  }
  return jsonResponse({ ok: true });
}

function handleDelete(body) {
  if (!requireValidToken(body.token)) return jsonResponse({ ok: false, error: 'unauthorized' });
  var submissionId = body.submissionId;
  if (!submissionId) return jsonResponse({ ok: false, error: 'missing_submissionId' });

  // 1. Delete from Firestore
  try {
    firestoreDeleteDoc('leads', submissionId);
  } catch (err) {
    logError('firestore_delete', err, { submissionId: submissionId });
    return jsonResponse({ ok: false, error: 'firestore_delete_failed' });
  }

  // 2. Delete matching row from Google Sheet
  try {
    deleteLeadFromSheet(submissionId);
  } catch (err) {
    logError('sheet_delete', err, { submissionId: submissionId });
    // Firestore already deleted — don't fail the whole request, just log the sheet error
  }

  return jsonResponse({ ok: true });
}

function handleList(params) {
  if (!requireValidToken(params.token)) return jsonResponse({ ok: false, error: 'unauthorized' });
  try {
    var leads = firestoreListDocs('leads');
    return jsonResponse({ ok: true, leads: leads });
  } catch (err) {
    logError('firestore_list', err, {});
    return jsonResponse({ ok: false, error: 'firestore_list_failed' });
  }
}

var ACCEPTED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx'];

function hasAcceptedResumeExtension(fileName) {
  var lower = String(fileName).toLowerCase();
  for (var i = 0; i < ACCEPTED_RESUME_EXTENSIONS.length; i++) {
    if (lower.indexOf(ACCEPTED_RESUME_EXTENSIONS[i], lower.length - ACCEPTED_RESUME_EXTENSIONS[i].length) !== -1) {
      return true;
    }
  }
  return false;
}

function handleApply(body) {
  var application = body.application || {};
  if (!application.name || !application.phone || !application.email || !application.submissionId) {
    return jsonResponse({ ok: false, error: 'missing_required_fields' });
  }
  if (!application.resumeBase64 || !application.resumeFileName) {
    return jsonResponse({ ok: false, error: 'missing_resume' });
  }
  if (!hasAcceptedResumeExtension(application.resumeFileName)) {
    return jsonResponse({ ok: false, error: 'invalid_resume_type' });
  }
  if (application.resumeBase64.length > MAX_RESUME_BASE64_LENGTH) {
    return jsonResponse({ ok: false, error: 'resume_too_large' });
  }

  // Idempotency: a retried submission (offline queue or double-click) with the
  // same submissionId must not re-upload the resume or create a duplicate doc.
  // The check-then-act sequence below is guarded by a script lock so two
  // near-simultaneous requests with the same submissionId can't both pass the
  // dedupe check before either writes.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // wait up to 10s for the lock
  } catch (err) {
    return jsonResponse({ ok: false, error: 'apply_lock_timeout' });
  }

  var record;
  try {
    var existing = null;
    try {
      existing = firestoreGetDoc('applications', application.submissionId);
    } catch (err) {
      // Ignore, assume new application
    }
    if (existing) {
      return jsonResponse({ ok: true });
    }

    var resumeUrl;
    try {
      resumeUrl = uploadResumeToDrive(
        application.resumeBase64,
        application.resumeFileName,
        application.resumeMimeType,
        application.submissionId
      );
    } catch (err) {
      logError('resume_upload', err, { submissionId: application.submissionId });
      return jsonResponse({ ok: false, error: 'resume_upload_failed' });
    }

    record = {};
    APPLICATION_COLUMNS.forEach(function (col) { record[col] = application[col] || ''; });
    record.resumeUrl = resumeUrl;
    record.createdAt = new Date().toISOString();
    record.status = 'New';
    record.notes = '';
    record.updatedAt = record.createdAt;

    try {
      firestoreCreateDoc('applications', record.submissionId, record);
    } catch (err) {
      logError('firestore_create_application', err, record);
      try { deleteResumeFromDrive(resumeUrl); } catch (cleanupErr) { logError('resume_cleanup', cleanupErr, record); }
      return jsonResponse({ ok: false, error: 'firestore_create_failed' });
    }
  } finally {
    lock.releaseLock();
  }

  try { appendApplicationToSheet(record); } catch (err) { logError('sheet_append_application', err, record); }
  try { sendApplicationEmail(record); } catch (err) { logError('email_send_application', err, record); }
  try { sendApplicationTelegram(record); } catch (err) { logError('telegram_send_application', err, record); }

  return jsonResponse({ ok: true });
}

function handleListApplications(params) {
  if (!requireValidToken(params.token)) return jsonResponse({ ok: false, error: 'unauthorized' });
  try {
    var applications = firestoreListDocs('applications');
    return jsonResponse({ ok: true, applications: applications });
  } catch (err) {
    logError('firestore_list_applications', err, {});
    return jsonResponse({ ok: false, error: 'firestore_list_failed' });
  }
}

function handleUpdateApplication(body) {
  if (!requireValidToken(body.token)) return jsonResponse({ ok: false, error: 'unauthorized' });
  var submissionId = body.submissionId;
  if (!submissionId) return jsonResponse({ ok: false, error: 'missing_submissionId' });

  var updates = body.updates || {};
  updates.updatedAt = new Date().toISOString();
  try {
    firestoreUpdateDoc('applications', submissionId, updates);
  } catch (err) {
    logError('firestore_update_application', err, { submissionId: submissionId, updates: updates });
    return jsonResponse({ ok: false, error: 'firestore_update_failed' });
  }
  try {
    var merged = firestoreGetDoc('applications', submissionId) || updates;
    updateApplicationInSheet(merged);
  } catch (err) {
    logError('sheet_update_application', err, { submissionId: submissionId });
  }
  return jsonResponse({ ok: true });
}

function handleDeleteApplication(body) {
  if (!requireValidToken(body.token)) return jsonResponse({ ok: false, error: 'unauthorized' });
  var submissionId = body.submissionId;
  if (!submissionId) return jsonResponse({ ok: false, error: 'missing_submissionId' });

  var existing = null;
  try {
    existing = firestoreGetDoc('applications', submissionId);
  } catch (err) {
    // Ignore — proceed with delete attempt regardless
  }

  try {
    firestoreDeleteDoc('applications', submissionId);
  } catch (err) {
    logError('firestore_delete_application', err, { submissionId: submissionId });
    return jsonResponse({ ok: false, error: 'firestore_delete_failed' });
  }

  try {
    deleteApplicationFromSheet(submissionId);
  } catch (err) {
    logError('sheet_delete_application', err, { submissionId: submissionId });
  }

  if (existing && existing.resumeUrl) {
    try {
      deleteResumeFromDrive(existing.resumeUrl);
    } catch (err) {
      logError('resume_delete', err, { submissionId: submissionId });
    }
  }

  return jsonResponse({ ok: true });
}
