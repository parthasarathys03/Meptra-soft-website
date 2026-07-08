// server/apps-script/Storage.gs

function storageBucketName() {
  var bucket = PropertiesService.getScriptProperties().getProperty('FB_STORAGE_BUCKET');
  if (!bucket) throw new Error('FB_STORAGE_BUCKET script property is not set');
  return bucket;
}

/**
 * Uploads a base64-encoded resume to the configured bucket at
 * resumes/{submissionId}-{filename}, makes that one object public-read,
 * and returns its public URL. Throws on any failure (caller decides
 * whether to fail the whole request or clean up).
 */
function uploadResumeToBucket(base64, filename, mimeType, submissionId) {
  var token = getFirestoreAccessToken();
  var bucket = storageBucketName();
  var objectName = 'resumes/' + submissionId + '-' + filename;
  var bytes = Utilities.base64Decode(base64);

  var uploadResponse = UrlFetchApp.fetch(
    'https://storage.googleapis.com/upload/storage/v1/b/' + bucket + '/o?uploadType=media&name=' + encodeURIComponent(objectName),
    {
      method: 'post',
      contentType: mimeType || 'application/octet-stream',
      headers: { Authorization: 'Bearer ' + token },
      payload: bytes,
      muteHttpExceptions: true
    }
  );
  if (uploadResponse.getResponseCode() >= 300) {
    throw new Error('Resume upload failed (' + uploadResponse.getResponseCode() + '): ' + uploadResponse.getContentText());
  }

  var aclResponse = UrlFetchApp.fetch(
    'https://storage.googleapis.com/storage/v1/b/' + bucket + '/o/' + encodeURIComponent(objectName) + '/acl',
    {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token },
      payload: JSON.stringify({ entity: 'allUsers', role: 'READER' }),
      muteHttpExceptions: true
    }
  );
  if (aclResponse.getResponseCode() >= 300) {
    throw new Error('Resume ACL update failed (' + aclResponse.getResponseCode() + '): ' + aclResponse.getContentText());
  }

  return 'https://storage.googleapis.com/' + bucket + '/' + objectName;
}

/** Best-effort delete of a resume object, given its public URL. */
function deleteResumeFromBucket(resumeUrl) {
  if (!resumeUrl) return;
  var token = getFirestoreAccessToken();
  var bucket = storageBucketName();
  var prefix = 'https://storage.googleapis.com/' + bucket + '/';
  if (resumeUrl.indexOf(prefix) !== 0) throw new Error('resumeUrl does not match configured bucket: ' + resumeUrl);
  var objectName = resumeUrl.slice(prefix.length);

  var response = UrlFetchApp.fetch(
    'https://storage.googleapis.com/storage/v1/b/' + bucket + '/o/' + encodeURIComponent(objectName),
    {
      method: 'delete',
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    }
  );
  if (response.getResponseCode() >= 300 && response.getResponseCode() !== 404) {
    throw new Error('Resume delete failed (' + response.getResponseCode() + '): ' + response.getContentText());
  }
}
