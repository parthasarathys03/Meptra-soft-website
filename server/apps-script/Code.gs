// server/apps-script/Code.gs

var LEAD_COLUMNS = [
  'submissionId', 'createdAt', 'name', 'phone', 'interest', 'preferredContact',
  'whatsappNumber', 'college', 'year', 'location', 'message',
  'pageUrl', 'referrer', 'userAgent', 'device', 'browser',
  'status', 'notes', 'updatedAt'
];

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

  return jsonResponse({ ok: false, error: 'unknown_action' });
}

function doGet(e) {
  if (e.parameter.action === 'list') return handleList(e.parameter);
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
