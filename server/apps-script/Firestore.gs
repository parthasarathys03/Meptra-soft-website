function firestoreBaseUrl() {
  var projectId = PropertiesService.getScriptProperties().getProperty('FB_PROJECT_ID');
  return 'https://firestore.googleapis.com/v1/projects/' + projectId + '/databases/(default)/documents';
}

function toFirestoreFields(obj) {
  var fields = {};
  for (var key in obj) {
    fields[key] = { stringValue: String(obj[key] == null ? '' : obj[key]) };
  }
  return fields;
}

function fromFirestoreFields(fields) {
  var obj = {};
  for (var key in fields) {
    obj[key] = fields[key].stringValue !== undefined ? fields[key].stringValue : '';
  }
  return obj;
}

function firestoreRequest(method, path, body) {
  var token = getFirestoreAccessToken();
  var options = {
    method: method,
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  };
  if (body) options.payload = JSON.stringify(body);
  var response = UrlFetchApp.fetch(firestoreBaseUrl() + path, options);
  var code = response.getResponseCode();
  if (code >= 300) {
    throw new Error('Firestore ' + method + ' ' + path + ' failed (' + code + '): ' + response.getContentText());
  }
  return JSON.parse(response.getContentText());
}

function firestoreGetDoc(collection, docId) {
  try {
    var result = firestoreRequest('get', '/' + collection + '/' + docId, null);
    if (result && result.fields) {
      var obj = fromFirestoreFields(result.fields);
      obj.submissionId = obj.submissionId || docId;
      return obj;
    }
    return null;
  } catch (err) {
    return null;
  }
}

function firestoreCreateDoc(collection, docId, fields) {
  return firestoreRequest(
    'patch',
    '/' + collection + '/' + docId,
    { fields: toFirestoreFields(fields) }
  );
}

function firestoreUpdateDoc(collection, docId, fields) {
  var maskParams = Object.keys(fields)
    .map(function (key) { return 'updateMask.fieldPaths=' + encodeURIComponent(key); })
    .join('&');
  return firestoreRequest(
    'patch',
    '/' + collection + '/' + docId + '?' + maskParams,
    { fields: toFirestoreFields(fields) }
  );
}

function firestoreDeleteDoc(collection, docId) {
  return firestoreRequest('delete', '/' + collection + '/' + docId, null);
}

function firestoreListDocs(collection) {
  var result = firestoreRequest('get', '/' + collection + '?pageSize=1000', null);
  var docs = result.documents || [];
  return docs.map(function (doc) {
    var idParts = doc.name.split('/');
    var id = idParts[idParts.length - 1];
    var obj = fromFirestoreFields(doc.fields);
    obj.submissionId = obj.submissionId || id;
    return obj;
  });
}
