// server/apps-script/FirestoreAuth.gs

/**
 * Returns a short-lived OAuth2 access token for the Firestore REST API,
 * authenticated as the service account whose credentials live in
 * Script Properties (FB_SA_CLIENT_EMAIL, FB_SA_PRIVATE_KEY, FB_PROJECT_ID).
 * Cached for 55 minutes (tokens are valid 60) to avoid re-signing on every call.
 */
function getFirestoreAccessToken() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('gcp_access_token');
  if (cached) return cached;

  var props = PropertiesService.getScriptProperties();
  var clientEmail = props.getProperty('FB_SA_CLIENT_EMAIL');
  var privateKey = props.getProperty('FB_SA_PRIVATE_KEY').replace(/\\n/g, '\n');

  var header = { alg: 'RS256', typ: 'JWT' };
  var now = Math.floor(new Date().getTime() / 1000);
  var claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/devstorage.read_write',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  var base64url = function (obj) {
    return Utilities.base64EncodeWebSafe(JSON.stringify(obj)).replace(/=+$/, '');
  };

  var toSign = base64url(header) + '.' + base64url(claimSet);
  var signatureBytes = Utilities.computeRsaSha256Signature(toSign, privateKey);
  var signature = Utilities.base64EncodeWebSafe(signatureBytes).replace(/=+$/, '');
  var jwt = toSign + '.' + signature;

  var response = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    },
    muteHttpExceptions: true
  });

  var body = JSON.parse(response.getContentText());
  if (!body.access_token) {
    throw new Error('Firestore auth failed: ' + response.getContentText());
  }

  cache.put('gcp_access_token', body.access_token, 55 * 60);
  return body.access_token;
}
