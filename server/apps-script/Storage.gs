// server/apps-script/Storage.gs

var RESUME_DRIVE_FOLDER_NAME = 'Meptrasoft_resumes_careers';

/**
 * ONE-TIME: run this manually from the Apps Script editor after deploying the
 * Drive-based storage code. Web-app POST requests never show the OAuth consent
 * screen, so the Drive scope stays unauthorized and every resume upload fails
 * with "You do not have permission...". Running any DriveApp function from the
 * editor triggers the consent prompt for the whole project's scopes — approve
 * it once and the deployed web app (Execute as: Me) inherits the grant.
 *
 * This also round-trips the exact upload path (find/create folder → create file
 * → share → trash) so a clean run proves resumes will store correctly.
 */
function authorizeDrive() {
  var folder = resumeDriveFolder();
  var file = folder.createFile(
    Utilities.newBlob('authorization test — safe to ignore', 'text/plain', '__authorize_test.txt')
  );
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  var url = file.getUrl();
  file.setTrashed(true);
  Logger.log('Drive authorized OK. Folder "%s" ready. Test file URL was: %s', RESUME_DRIVE_FOLDER_NAME, url);
  return 'Drive authorized OK — resumes will store in folder "' + RESUME_DRIVE_FOLDER_NAME + '".';
}

/** Finds the dedicated resumes folder by name, creating it on first use. */
function resumeDriveFolder() {
  var existing = DriveApp.getFoldersByName(RESUME_DRIVE_FOLDER_NAME);
  if (existing.hasNext()) return existing.next();
  return DriveApp.createFolder(RESUME_DRIVE_FOLDER_NAME);
}

/**
 * Uploads a base64-encoded resume to the dedicated Drive folder
 * (created/found by name — only resumes live in it) as
 * {submissionId}-{filename}, shares it "anyone with the link can view",
 * and returns its Drive view URL. Throws on any failure (caller decides
 * whether to fail the whole request or clean up).
 */
function uploadResumeToDrive(base64, filename, mimeType, submissionId) {
  var folder = resumeDriveFolder();
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
