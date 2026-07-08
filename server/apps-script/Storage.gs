// server/apps-script/Storage.gs

function resumeDriveFolderId() {
  var folderId = PropertiesService.getScriptProperties().getProperty('RESUME_DRIVE_FOLDER_ID');
  if (!folderId) throw new Error('RESUME_DRIVE_FOLDER_ID script property is not set');
  return folderId;
}

/**
 * Uploads a base64-encoded resume to the configured Google Drive folder as
 * {submissionId}-{filename}, shares it "anyone with the link can view", and
 * returns its Drive view URL. Throws on any failure (caller decides whether
 * to fail the whole request or clean up).
 */
function uploadResumeToDrive(base64, filename, mimeType, submissionId) {
  var folder = DriveApp.getFolderById(resumeDriveFolderId());
  var bytes = Utilities.base64Decode(base64);
  var blob = Utilities.newBlob(bytes, mimeType || 'application/octet-stream', submissionId + '-' + filename);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

/** Best-effort delete (trash) of a resume file, given its Drive view URL. */
function deleteResumeFromDrive(resumeUrl) {
  if (!resumeUrl) return;
  var match = resumeUrl.match(/\/d\/([^/]+)/);
  var fileId = match ? match[1] : null;
  if (!fileId) throw new Error('Could not parse Drive file id from resumeUrl: ' + resumeUrl);

  try {
    var file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
  } catch (err) {
    // File already deleted/missing — treat as success, matching the
    // 404-tolerant delete semantics the rest of the pipeline expects.
    if (String(err && err.message).indexOf('not found') === -1) throw err;
  }
}
