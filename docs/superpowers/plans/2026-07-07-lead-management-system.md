# Lead Management System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture every LeadForm submission to Firestore (source of truth) + Google Sheet (mirror), notify via Gmail + Telegram, and give the owner a private `/admin` dashboard to search/filter/manage leads and one-click WhatsApp them.

**Architecture:** A Google Apps Script web app is the sole backend. It holds all secrets (Firestore service-account key, Telegram token, admin password) in Script Properties. The React site POSTs leads to it and the `/admin` dashboard reads/writes through it — Firestore is never touched directly from the browser.

**Tech Stack:** React 18 + TypeScript + Vite (existing), Google Apps Script (`.gs`, V8 runtime), Firestore REST API (service-account OAuth2 auth), Google Sheets (`SpreadsheetApp`), Gmail (`MailApp`), Telegram Bot API (plain HTTPS).

## Global Constraints

- No secrets in browser bundle or in the git repo. Telegram token, admin password, Firestore service-account key live only in Apps Script Script Properties (spec: Architecture).
- Firestore is the single source of truth; Google Sheets is a mirror/reporting layer only — dashboard, exports, and stats always read Firestore via Apps Script, never the Sheet (spec: Architecture).
- Capture all 10 existing form fields plus `submissionId`, `createdAt`, `pageUrl`, `referrer`, `userAgent`, `device`, `browser`, `status`, `notes`, `updatedAt` — no field dropped (spec: Data Model).
- POST to Apps Script uses `Content-Type: text/plain` (Apps Script can't answer a CORS preflight); body is still JSON, parsed server-side with `JSON.parse(e.postData.contents)` (spec: Non-obvious decisions).
- On network failure, client shows a state distinct from success — "Saved on this device — we'll finish sending it once you're back online" — never implies the lead already reached the server (spec: Error Handling).
- Every external channel (Firestore/Sheet/Gmail/Telegram) fails independently (try/catch); a channel failure never fails the whole submission and is logged to an `_errors` sheet (spec: Error Handling).
- No CAPTCHA / bot defense beyond server-side validation (spec: Out of Scope).
- No test framework is configured in this repo (per CLAUDE.md) — verification is `npx tsc -b --noEmit`, `npm run lint`, and manual exercise. Apps Script has no local test runner; its logic is verified by manual invocation via `clasp run` or the Apps Script editor's "Run" button and reading `Logger.log` output / the `_errors` sheet.
- `admin password` and `chat_id`/token values are never printed back into any file this plan creates — only referenced by Script Properties key name.

---

## Part A — Apps Script Backend (Google account setup + `.gs` code)

This part lives outside the React app. Files are committed to the repo under `server/apps-script/` **for reference only** — Apps Script itself is deployed by pasting this code into the Apps Script editor (script.google.com), not by any build step in this repo.

### Task 1: Firestore service-account auth helper

**Files:**
- Create: `server/apps-script/FirestoreAuth.gs`

**Interfaces:**
- Produces: `getFirestoreAccessToken(): string` — returns a valid OAuth2 bearer token, used by every Firestore REST call in later tasks.

- [ ] **Step 1: Get a Firebase service account**

In the Firebase console for project `meptrasoft` (the URL you shared: https://console.firebase.google.com/u/0/project/meptrasoft/overview):
1. Gear icon → **Project settings** → **Service accounts** tab.
2. Click **Generate new private key** → downloads a JSON file. It contains `client_email`, `private_key`, `project_id`.
3. Keep this file local — never commit it. You'll paste three of its fields into Apps Script Script Properties in Task 2.

- [ ] **Step 2: Write the JWT-signing + token-exchange helper**

```javascript
// server/apps-script/FirestoreAuth.gs

/**
 * Returns a short-lived OAuth2 access token for the Firestore REST API,
 * authenticated as the service account whose credentials live in
 * Script Properties (FB_SA_CLIENT_EMAIL, FB_SA_PRIVATE_KEY, FB_PROJECT_ID).
 * Cached for 55 minutes (tokens are valid 60) to avoid re-signing on every call.
 */
function getFirestoreAccessToken() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('fs_access_token');
  if (cached) return cached;

  var props = PropertiesService.getScriptProperties();
  var clientEmail = props.getProperty('FB_SA_CLIENT_EMAIL');
  var privateKey = props.getProperty('FB_SA_PRIVATE_KEY').replace(/\\n/g, '\n');

  var header = { alg: 'RS256', typ: 'JWT' };
  var now = Math.floor(new Date().getTime() / 1000);
  var claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/datastore',
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

  cache.put('fs_access_token', body.access_token, 55 * 60);
  return body.access_token;
}
```

- [ ] **Step 3: Set the three service-account Script Properties**

In the Apps Script project (created in Task 2, Step 1) → **Project Settings** (gear icon) → **Script Properties** → add:
- `FB_PROJECT_ID` = the `project_id` field from the downloaded JSON (`meptrasoft`)
- `FB_SA_CLIENT_EMAIL` = the `client_email` field from the downloaded JSON
- `FB_SA_PRIVATE_KEY` = the `private_key` field from the downloaded JSON, pasted exactly as-is (it contains literal `\n` sequences — the code above converts them back to real newlines)

- [ ] **Step 4: Verify manually**

In the Apps Script editor, temporary test function:
```javascript
function _test_auth() {
  Logger.log(getFirestoreAccessToken());
}
```
Run `_test_auth` (Run menu → select function → Run). Expected: `Logger.log` shows a long string starting with `ya29.`. Delete `_test_auth` after confirming — it was only for manual verification.

- [ ] **Step 5: Commit the reference file**

```bash
git add server/apps-script/FirestoreAuth.gs
git commit -m "docs: add Firestore service-account auth helper for Apps Script backend"
```

---

### Task 2: Firestore REST read/write wrapper + Sheet/email/Telegram senders

**Files:**
- Create: `server/apps-script/Firestore.gs`
- Create: `server/apps-script/Notify.gs`

**Interfaces:**
- Consumes: `getFirestoreAccessToken()` from Task 1.
- Produces: `firestoreCreateDoc(collection, docId, fields)`, `firestoreUpdateDoc(collection, docId, fields)`, `firestoreDeleteDoc(collection, docId)`, `firestoreListDocs(collection)` — used by `Code.gs` in Task 3. `appendLeadToSheet(lead)`, `sendLeadEmail(lead)`, `sendLeadTelegram(lead)`, `logError(context, err, payload)` — used by `Code.gs` in Task 3.

- [ ] **Step 1: Firestore REST wrapper**

Firestore REST documents use a typed-value wrapper (`{stringValue: "x"}` etc). Since every lead field is a string (dates/UA/notes all serialize fine as strings, `submissionId` is a string), a single `toFirestoreFields`/`fromFirestoreFields` pair covers this project — no need for number/boolean typed values.

```javascript
// server/apps-script/Firestore.gs

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

function firestoreCreateDoc(collection, docId, fields) {
  return firestoreRequest(
    'patch',
    '/' + collection + '/' + docId,
    { fields: toFirestoreFields(fields) }
  );
}

function firestoreUpdateDoc(collection, docId, fields) {
  return firestoreCreateDoc(collection, docId, fields); // patch is upsert-by-id, same call
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
```

- [ ] **Step 2: Sheet mirror, email, Telegram, error log senders**

```javascript
// server/apps-script/Notify.gs

/** Google Sheet is a mirror/reporting layer only — never read back as source of truth. */
function appendLeadToSheet(lead) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Leads') ||
    SpreadsheetApp.openById(sheetId).insertSheet('Leads');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(LEAD_COLUMNS);
  }
  sheet.appendRow(LEAD_COLUMNS.map(function (col) { return lead[col] || ''; }));
}

function sendLeadEmail(lead) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  var body = LEAD_COLUMNS.map(function (col) {
    return col + ': ' + (lead[col] || '');
  }).join('\n');
  MailApp.sendEmail(to, 'New lead: ' + lead.name, body);
}

function sendLeadTelegram(lead) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('TG_TOKEN');
  var chatId = props.getProperty('TG_CHAT_ID');
  var lines = [
    'New lead: ' + lead.name,
    'Phone: ' + lead.phone,
    'Interest: ' + lead.interest,
    'Preferred contact: ' + lead.preferredContact,
    lead.whatsappNumber ? 'WhatsApp: ' + lead.whatsappNumber : null,
    lead.college ? 'College: ' + lead.college : null,
    lead.year ? 'Year: ' + lead.year : null,
    lead.location ? 'Location: ' + lead.location : null,
    lead.message ? 'Message: ' + lead.message : null
  ].filter(function (l) { return l; });

  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: { chat_id: chatId, text: lines.join('\n') },
    muteHttpExceptions: true
  });
}

/** Every channel failure lands here instead of failing the whole submission. */
function logError(context, err, payload) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('_errors') ||
    SpreadsheetApp.openById(sheetId).insertSheet('_errors');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp', 'context', 'error', 'payload']);
  }
  sheet.appendRow([
    new Date().toISOString(),
    context,
    String(err && err.message ? err.message : err),
    JSON.stringify(payload)
  ]);
}
```

- [ ] **Step 3: Set remaining Script Properties**

Add to the same Apps Script project's Script Properties (from Task 1, Step 3):
- `SHEET_ID` = `1V-V7zAlC1r1S7yUs1XMEwDnCnDGCyeFkEFsM5I6csRI`
- `NOTIFY_EMAIL` = `parthasarathysankar03@gmail.com`
- `TG_TOKEN` = the Telegram bot token
- `TG_CHAT_ID` = `5822234223`
- `ADMIN_USER` = `ParthaSarathy`
- `ADMIN_PASS` = `Partha@321`

- [ ] **Step 4: Verify manually**

Temporary test function using a fake lead object matching `LEAD_COLUMNS` (defined in Task 3, Step 1 — add that constant before running this test):
```javascript
function _test_notify() {
  var lead = { submissionId: 'test-1', createdAt: new Date().toISOString(), name: 'Test User', phone: '9999999999', interest: 'A course', preferredContact: 'WhatsApp', whatsappNumber: '9999999999', college: '', year: '', location: '', message: 'test', pageUrl: '', referrer: '', userAgent: '', device: '', browser: '', status: 'New', notes: '', updatedAt: '' };
  appendLeadToSheet(lead);
  sendLeadEmail(lead);
  sendLeadTelegram(lead);
}
```
Run it. Expected: a new row in the "Leads" tab of the Sheet, an email in the inbox, and a Telegram message in the chat. Delete `_test_notify` after confirming.

- [ ] **Step 5: Commit**

```bash
git add server/apps-script/Firestore.gs server/apps-script/Notify.gs
git commit -m "docs: add Firestore REST wrapper and Sheet/email/Telegram notifiers"
```

---

### Task 3: `doPost`/`doGet` router — submit, login, list, update, delete

**Files:**
- Create: `server/apps-script/Code.gs`

**Interfaces:**
- Consumes: `firestoreCreateDoc`/`firestoreUpdateDoc`/`firestoreDeleteDoc`/`firestoreListDocs` (Task 2), `appendLeadToSheet`/`sendLeadEmail`/`sendLeadTelegram`/`logError` (Task 2).
- Produces: the deployed web app URL, consumed by the React client in Task 4 (`VITE_LEADS_ENDPOINT`) and Task 8 (`adminApi.ts`).

- [ ] **Step 1: Shared column list + `doPost` submit/login/update/delete**

```javascript
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

  var record = {};
  LEAD_COLUMNS.forEach(function (col) { record[col] = lead[col] || ''; });
  record.createdAt = new Date().toISOString();
  record.status = 'New';
  record.notes = '';
  record.updatedAt = record.createdAt;

  var firestoreOk = false;
  try {
    firestoreCreateDoc('leads', record.submissionId, record);
    firestoreOk = true;
  } catch (err) {
    logError('firestore_create', err, record);
  }

  try { appendLeadToSheet(record); } catch (err) { logError('sheet_append', err, record); }
  try { sendLeadEmail(record); } catch (err) { logError('email_send', err, record); }
  try { sendLeadTelegram(record); } catch (err) { logError('telegram_send', err, record); }

  return jsonResponse({ ok: firestoreOk });
}

function handleLogin(body) {
  var props = PropertiesService.getScriptProperties();
  if (body.username === props.getProperty('ADMIN_USER') && body.password === props.getProperty('ADMIN_PASS')) {
    var token = Utilities.getUuid();
    CacheService.getScriptCache().put('session_' + token, '1', 6 * 60 * 60); // 6h
    return jsonResponse({ ok: true, token: token });
  }
  return jsonResponse({ ok: false, error: 'invalid_credentials' });
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

  try {
    firestoreDeleteDoc('leads', submissionId);
  } catch (err) {
    logError('firestore_delete', err, { submissionId: submissionId });
    return jsonResponse({ ok: false, error: 'firestore_delete_failed' });
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
```

- [ ] **Step 2: Deploy as web app**

Apps Script editor → **Deploy** → **New deployment** → type: **Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy → copy the web app URL (`https://script.google.com/macros/s/XXXX/exec`).

- [ ] **Step 3: Verify manually with curl**

```bash
curl -X POST "<web-app-url>" -H "Content-Type: text/plain" -d '{"action":"submit","lead":{"submissionId":"curl-test-1","name":"Curl Test","phone":"9999999999","interest":"A course"}}'
```
Expected: `{"ok":true}`. Check the Sheet "Leads" tab and Telegram/email for the test entry.

```bash
curl -X POST "<web-app-url>" -H "Content-Type: text/plain" -d '{"action":"login","username":"ParthaSarathy","password":"Partha@321"}'
```
Expected: `{"ok":true,"token":"<uuid>"}`.

```bash
curl "<web-app-url>?action=list&token=<uuid-from-above>"
```
Expected: `{"ok":true,"leads":[...]}` including `curl-test-1`.

- [ ] **Step 4: Commit**

```bash
git add server/apps-script/Code.gs
git commit -m "docs: add Apps Script router for submit/login/list/update/delete"
```

---

### Task 4: `SETUP.md` for the Apps Script backend

**Files:**
- Create: `server/apps-script/SETUP.md`

- [ ] **Step 1: Write the setup guide**

```markdown
# Apps Script Backend Setup

One-time setup, done by the site owner (not part of the app build).

## 1. Create the Apps Script project
1. Go to https://script.google.com → New project.
2. Delete the default `Code.gs` content, paste in this repo's `FirestoreAuth.gs`, `Firestore.gs`, `Notify.gs`, `Code.gs` (one file each, matching names).

## 2. Firestore service account
1. https://console.firebase.google.com/u/0/project/meptrasoft/overview → gear icon → Project settings → Service accounts.
2. Generate new private key → downloads a JSON file.
3. In Firestore (Firebase console → Firestore Database), set security rules to deny all client access:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
   Only the Apps Script service-account token (server-side) can read/write.

## 3. Script Properties
Apps Script project → Project Settings (gear) → Script Properties → add:
| Key | Value |
|---|---|
| `FB_PROJECT_ID` | from the service-account JSON, `project_id` |
| `FB_SA_CLIENT_EMAIL` | from the service-account JSON, `client_email` |
| `FB_SA_PRIVATE_KEY` | from the service-account JSON, `private_key` (paste as-is) |
| `SHEET_ID` | the Sheet's id from its URL |
| `NOTIFY_EMAIL` | email to receive new-lead notifications |
| `TG_TOKEN` | Telegram bot token from @BotFather |
| `TG_CHAT_ID` | Telegram chat/group id to notify |
| `ADMIN_USER` | dashboard login username |
| `ADMIN_PASS` | dashboard login password |

## 4. Deploy
Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → Deploy.
Copy the `/exec` URL — this is `VITE_LEADS_ENDPOINT` for the React app's `.env`.

## 5. Redeploying after code changes
Existing deployments don't pick up new code automatically. After editing any `.gs` file:
Deploy → Manage deployments → pick the deployment → Edit (pencil) → Version: New version → Deploy.
```

- [ ] **Step 2: Commit**

```bash
git add server/apps-script/SETUP.md
git commit -m "docs: add Apps Script backend setup guide"
```

---

## Part B — Client Capture (React)

### Task 5: Device/browser UA parser

**Files:**
- Create: `src/lib/device.ts`

**Interfaces:**
- Produces: `parseDevice(userAgent: string): { device: string; browser: string }` — used by Task 6.

- [ ] **Step 1: Write the parser**

```typescript
// src/lib/device.ts

/** Coarse device class from a raw User-Agent string. */
function classifyDevice(ua: string): string {
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

/** Best-effort browser name + version from a raw User-Agent string. */
function classifyBrowser(ua: string): string {
  const patterns: [RegExp, string][] = [
    [/edg\/([\d.]+)/i, "Edge"],
    [/opr\/([\d.]+)/i, "Opera"],
    [/chrome\/([\d.]+)/i, "Chrome"],
    [/firefox\/([\d.]+)/i, "Firefox"],
    [/version\/([\d.]+).*safari/i, "Safari"],
  ];
  for (const [pattern, name] of patterns) {
    const match = ua.match(pattern);
    if (match) return `${name} ${match[1]}`;
  }
  return "Unknown";
}

export function parseDevice(userAgent: string): { device: string; browser: string } {
  return { device: classifyDevice(userAgent), browser: classifyBrowser(userAgent) };
}
```

- [ ] **Step 2: Inline sample-UA check**

No test runner is configured in this repo (CLAUDE.md). Verify with a throwaway Node check instead of a test file:

```bash
node -e "
const ua = {
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  chromeDesktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  androidChrome: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
};
console.log(ua);
"
```
Then manually trace `parseDevice` against each string:
- `iphone` → device `mobile` (matches `/mobile|android|iphone/i`), browser `Safari 17.0`.
- `chromeDesktop` → device `desktop`, browser `Chrome 120.0.0.0`.
- `androidChrome` → device `mobile`, browser `Chrome 120.0.0.0` (Chrome pattern matches before Safari would even apply).

Confirm these by temporarily calling `parseDevice` from the browser console on the dev server (`npm run dev`, open devtools console, `import("/src/lib/device.ts").then(m => console.log(m.parseDevice(navigator.userAgent)))`) — expect output matching your current browser.

- [ ] **Step 3: Commit**

```bash
git add src/lib/device.ts
git commit -m "feat: add device/browser classifier for lead capture"
```

---

### Task 6: Lead payload builder + submit with local retry queue

**Files:**
- Create: `src/lib/leads.ts`
- Modify: `src/data/content.ts:34-37` (remove the now-unused `callmebot` block)
- Modify: `.env.example` (create if absent) and local `.env`

**Interfaces:**
- Consumes: `parseDevice` (Task 5).
- Produces: `LeadPayload` type, `buildLeadPayload(formValues): LeadPayload`, `submitLead(payload: LeadPayload): Promise<{ok: boolean}>`, `flushQueuedLeads(): Promise<void>` — used by Task 7 (`LeadForm.tsx`).

- [ ] **Step 1: Write `leads.ts`**

```typescript
// src/lib/leads.ts
import { parseDevice } from "@/lib/device";

export interface LeadFormValues {
  name: string;
  phone: string;
  interest: string;
  preferredContact: string;
  whatsappNumber: string;
  college: string;
  year: string;
  location: string;
  message: string;
}

export interface LeadPayload extends LeadFormValues {
  submissionId: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  device: string;
  browser: string;
}

const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;
const QUEUE_KEY = "meptrasoft_lead_queue";

export function buildLeadPayload(values: LeadFormValues): LeadPayload {
  const { device, browser } = parseDevice(navigator.userAgent);
  return {
    ...values,
    submissionId: crypto.randomUUID(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    device,
    browser,
  };
}

function readQueue(): LeadPayload[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeQueue(queue: LeadPayload[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

function enqueue(payload: LeadPayload) {
  writeQueue([...readQueue(), payload]);
}

async function postLead(payload: LeadPayload): Promise<boolean> {
  if (!ENDPOINT) return false;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "submit", lead: payload }),
    });
    const body = await res.json();
    return !!body.ok;
  } catch {
    return false;
  }
}

/** Returns {ok:true} only if the lead actually reached the server this call. */
export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean }> {
  const ok = await postLead(payload);
  if (!ok) enqueue(payload);
  return { ok };
}

/** Retries anything queued from a prior failed submission. Call on app/page load. */
export async function flushQueuedLeads(): Promise<void> {
  const queue = readQueue();
  if (queue.length === 0) return;
  const remaining: LeadPayload[] = [];
  for (const payload of queue) {
    const ok = await postLead(payload);
    if (!ok) remaining.push(payload);
  }
  writeQueue(remaining);
}
```

- [ ] **Step 2: Remove the unused CallMeBot config**

In `src/data/content.ts`, delete lines 26-37 (the `callmebot` comment + property) — replaced by `VITE_LEADS_ENDPOINT`.

- [ ] **Step 3: Add the env var placeholder**

Create `.env.example`:
```
VITE_LEADS_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
```

Create local `.env` (gitignored — confirm `.env` is in `.gitignore`; if not, add it) with your real deployed Apps Script URL from Task 3, Step 2.

- [ ] **Step 4: Verify `.gitignore` covers `.env`**

```bash
grep -n "^\.env$" .gitignore || echo ".env" >> .gitignore
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/leads.ts src/data/content.ts .env.example .gitignore
git commit -m "feat: add lead payload builder and submit-with-retry-queue"
```

---

### Task 7: Rewire `LeadForm` to use `submitLead`

**Files:**
- Modify: `src/components/ui/LeadForm.tsx:1-2,101-123,125-181`

**Interfaces:**
- Consumes: `buildLeadPayload`, `submitLead`, `flushQueuedLeads` (Task 6).

- [ ] **Step 1: Update imports and submit handler**

Replace the import block (`src/components/ui/LeadForm.tsx:1-5`):
```typescript
import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { buildLeadPayload, flushQueuedLeads, submitLead } from "@/lib/leads";
```
(drops the now-unused `site` import from `@/data/content` since `callmebot` was removed in Task 6 — confirm no other symbol from `site` is used in this file before removing the import; if one is, keep the import and just drop the removed reference.)

- [ ] **Step 2: Add a submit-state and rewrite `handleSubmit`**

Replace `const [submitted, setSubmitted] = useState(false);` (line 69) with:
```typescript
  const [submitState, setSubmitState] = useState<"idle" | "submitted" | "queued">("idle");
```

Add, right after the `formId` line (was line 71):
```typescript
  useEffect(() => {
    flushQueuedLeads();
  }, []);
```

Replace `handleSubmit` (lines 101-123):
```typescript
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    const whatsappNumber = values.whatsappSameAsPhone ? values.phone : values.whatsappNumber;
    const payload = buildLeadPayload({
      name: values.name,
      phone: values.phone,
      interest: values.interest,
      preferredContact: values.preferredContact,
      whatsappNumber,
      college: values.college,
      year: values.year,
      location: values.location,
      message: values.message,
    });

    const { ok } = await submitLead(payload);
    setSubmitState(ok ? "submitted" : "queued");
  }
```

- [ ] **Step 3: Update the confirmation UI to branch on `submitState`**

Replace `if (submitted) {` (line 125) with `if (submitState !== "idle") {`. Inside that block, after the existing `rows` construction and before the `return (`, no change needed to `rows`. In the JSX, replace the two `<p>` elements (lines 159-163):
```tsx
        <div>
          <p className="text-xl font-bold tracking-[-0.01em]">
            {submitState === "submitted" ? "Meptrasoft team will contact you" : "Saved on this device"}
          </p>
          <p className={cn("mt-2 text-sm", isDark ? "text-hero-soft" : "text-slate-500")}>
            {submitState === "submitted"
              ? `We'll reach out via ${values.preferredContact} shortly — keep your phone handy.`
              : "We'll finish sending it once you're back online — no need to resubmit."}
          </p>
        </div>
```

- [ ] **Step 4: Manual verification**

`npm run dev`. Fill and submit the form with `VITE_LEADS_ENDPOINT` pointed at the deployed Apps Script URL from Task 3. Expected: confirmation shows "Meptrasoft team will contact you"; a new Firestore doc, Sheet row, email, and Telegram message all appear.

Then temporarily set `VITE_LEADS_ENDPOINT=https://invalid.example.invalid` in `.env`, restart dev server, submit again. Expected: confirmation shows "Saved on this device" — confirms the failure path never claims success. Restore the real endpoint afterward.

- [ ] **Step 5: Typecheck and lint**

```bash
npx tsc -b --noEmit
npm run lint
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/LeadForm.tsx
git commit -m "feat: submit leads to Apps Script backend with offline retry queue"
```

---

## Part C — Admin Dashboard (read)

### Task 8: `adminApi.ts` client wrapper

**Files:**
- Create: `src/lib/adminApi.ts`

**Interfaces:**
- Produces: `Lead` type, `login(username, password): Promise<{ok: boolean; token?: string}>`, `listLeads(token): Promise<{ok: boolean; leads?: Lead[]}>`, `updateLead(token, submissionId, updates): Promise<{ok: boolean}>`, `deleteLead(token, submissionId): Promise<{ok: boolean}>`, `getToken()/setToken()/clearToken()` (sessionStorage-backed) — used by Tasks 9-15.

- [ ] **Step 1: Write the wrapper**

```typescript
// src/lib/adminApi.ts

export type LeadStatus = "New" | "Contacted" | "Follow-up" | "Closed" | "Converted";

export interface Lead {
  submissionId: string;
  createdAt: string;
  name: string;
  phone: string;
  interest: string;
  preferredContact: string;
  whatsappNumber: string;
  college: string;
  year: string;
  location: string;
  message: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  device: string;
  browser: string;
  status: LeadStatus;
  notes: string;
  updatedAt: string;
}

const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;
const TOKEN_KEY = "meptrasoft_admin_token";

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function post(body: Record<string, unknown>) {
  if (!ENDPOINT) return { ok: false, error: "missing_endpoint" };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function login(username: string, password: string) {
  return post({ action: "login", username, password }) as Promise<{ ok: boolean; token?: string; error?: string }>;
}

export async function listLeads(token: string) {
  if (!ENDPOINT) return { ok: false, error: "missing_endpoint" };
  const res = await fetch(`${ENDPOINT}?action=list&token=${encodeURIComponent(token)}`);
  return res.json() as Promise<{ ok: boolean; leads?: Lead[]; error?: string }>;
}

export async function updateLead(token: string, submissionId: string, updates: Partial<Lead>) {
  return post({ action: "update", token, submissionId, updates }) as Promise<{ ok: boolean; error?: string }>;
}

export async function deleteLead(token: string, submissionId: string) {
  return post({ action: "delete", token, submissionId }) as Promise<{ ok: boolean; error?: string }>;
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc -b --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/adminApi.ts
git commit -m "feat: add admin API client for Apps Script backend"
```

---

### Task 9: `/admin` route + login gate

**Files:**
- Create: `src/pages/Admin.tsx`
- Create: `src/components/admin/AdminLogin.tsx`
- Modify: `src/App.tsx:1-12,58-59`

**Interfaces:**
- Consumes: `login`, `getToken`, `setToken`, `clearToken` (Task 8).
- Produces: exported `Admin` default component mounted at `/admin`, rendering `AdminLogin` when unauthenticated and `AdminDashboard` (Task 10) when authenticated.

- [ ] **Step 1: `AdminLogin` component**

```tsx
// src/components/admin/AdminLogin.tsx
import { useState } from "react";
import { login } from "@/lib/adminApi";

export function AdminLogin({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await login(username, password);
    setLoading(false);
    if (result.ok && result.token) {
      onSuccess(result.token);
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-xl font-bold text-navy-800">Admin login</h1>
        <label className="mb-1 block text-sm font-semibold text-navy-800">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded border border-line-200 px-3 py-2"
          autoComplete="username"
        />
        <label className="mb-1 block text-sm font-semibold text-navy-800">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border border-line-200 px-3 py-2"
          autoComplete="current-password"
        />
        {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-navy-800 py-2.5 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: `Admin` page**

```tsx
// src/pages/Admin.tsx
import { useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getToken, setToken, clearToken } from "@/lib/adminApi";

export default function Admin() {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  function handleLoginSuccess(newToken: string) {
    setToken(newToken);
    setTokenState(newToken);
  }

  function handleLogout() {
    clearToken();
    setTokenState(null);
  }

  if (!token) return <AdminLogin onSuccess={handleLoginSuccess} />;
  return <AdminDashboard token={token} onLogout={handleLogout} />;
}
```

(`AdminDashboard` doesn't exist yet — created in Task 10. This task's own verification step therefore happens after Task 10; skip ahead only for the route wiring check below, which doesn't require it to render fully.)

- [ ] **Step 3: Add the route, outside the marketing `<Layout>`**

In `src/App.tsx`, add the lazy import alongside the others (after line 11):
```typescript
const Admin = lazy(() => import("@/pages/Admin"));
```
Add a top-level route (sibling of the `<Route element={<Layout />}>` block, so `/admin` has no site header/footer), inserted before the closing `</Routes>` (was line 60-61):
```tsx
        <Route path="*" element={<Home />} />
      </Route>
      <Route
        path="/admin"
        element={
          <Suspense fallback={null}>
            <Admin />
          </Suspense>
        }
      />
    </Routes>
```

- [ ] **Step 4: Typecheck (expect a failure until Task 10 exists)**

```bash
npx tsc -b --noEmit
```
Expected: error `Cannot find module '@/components/admin/AdminDashboard'`. This is expected at this point in the plan — Task 10 creates it. Do not commit yet.

- [ ] **Step 5: Commit is deferred to the end of Task 10**, since `Admin.tsx` doesn't compile without `AdminDashboard`. Proceed directly to Task 10.

---

### Task 10: `AdminDashboard` — list, search, filter, paginate, stats

**Files:**
- Create: `src/components/admin/AdminDashboard.tsx`
- Create: `src/components/admin/StatsBar.tsx`
- Create: `src/components/admin/LeadTable.tsx`

**Interfaces:**
- Consumes: `Lead`, `listLeads` (Task 8); `AdminLogin`/`Admin` (Task 9) render this as their authenticated view.
- Produces: `AdminDashboard({ token, onLogout }): JSX.Element` (default export target for Task 9's import — export as named `AdminDashboard`, matching the import in `Admin.tsx`). `LeadDetailDrawer` (Task 12) and status/notes editing (Task 14) are added as follow-on tasks that extend this same file — this task renders a read-only table + stats + drawer placeholder.

- [ ] **Step 1: `StatsBar`**

```tsx
// src/components/admin/StatsBar.tsx
import type { Lead, LeadStatus } from "@/lib/adminApi";

const STATUSES: LeadStatus[] = ["New", "Contacted", "Follow-up", "Closed", "Converted"];

export function StatsBar({ leads }: { leads: Lead[] }) {
  const counts = STATUSES.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }));
  const today = new Date().toDateString();
  const todayCount = leads.filter((l) => new Date(l.createdAt).toDateString() === today).length;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      <div className="rounded-lg border border-line-200 bg-white p-4">
        <p className="text-2xl font-bold text-navy-800">{leads.length}</p>
        <p className="text-xs text-slate-500">Total leads</p>
      </div>
      <div className="rounded-lg border border-line-200 bg-white p-4">
        <p className="text-2xl font-bold text-navy-800">{todayCount}</p>
        <p className="text-xs text-slate-500">Today</p>
      </div>
      {counts.map(({ status, count }) => (
        <div key={status} className="rounded-lg border border-line-200 bg-white p-4">
          <p className="text-2xl font-bold text-navy-800">{count}</p>
          <p className="text-xs text-slate-500">{status}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: `LeadTable`**

```tsx
// src/components/admin/LeadTable.tsx
import type { Lead } from "@/lib/adminApi";

export function LeadTable({ leads, onSelect }: { leads: Lead[]; onSelect: (lead: Lead) => void }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-line-200 text-left text-slate-500">
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Phone</th>
          <th className="py-2 pr-4">Interest</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2 pr-4">Created</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr
            key={lead.submissionId}
            className="cursor-pointer border-b border-line-200 hover:bg-slate-50"
            onClick={() => onSelect(lead)}
          >
            <td className="py-2 pr-4 font-medium text-navy-800">{lead.name}</td>
            <td className="py-2 pr-4">{lead.phone}</td>
            <td className="py-2 pr-4">{lead.interest}</td>
            <td className="py-2 pr-4">
              <span className="rounded-full bg-aqua-400/15 px-2.5 py-0.5 text-xs font-semibold text-aqua-700">
                {lead.status}
              </span>
            </td>
            <td className="py-2 pr-4 text-slate-500">{new Date(lead.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 3: `AdminDashboard`**

```tsx
// src/components/admin/AdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { listLeads, type Lead, type LeadStatus } from "@/lib/adminApi";
import { StatsBar } from "@/components/admin/StatsBar";
import { LeadTable } from "@/components/admin/LeadTable";

const PAGE_SIZE = 20;
const STATUS_FILTERS: (LeadStatus | "All")[] = ["All", "New", "Contacted", "Follow-up", "Closed", "Converted"];

export function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Lead | null>(null);

  async function load() {
    setLoading(true);
    const result = await listLeads(token);
    if (result.ok && result.leads) {
      setLeads([...result.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [token]);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== "All" && lead.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.college.toLowerCase().includes(q)
      );
    });
  }, [leads, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-800">Leads</h1>
        <button onClick={onLogout} className="text-sm font-semibold text-slate-500 hover:text-navy-800">
          Log out
        </button>
      </div>

      <StatsBar leads={leads} />

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name, phone, college..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-64 rounded border border-line-200 px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number]);
            setPage(1);
          }}
          className="rounded border border-line-200 px-3 py-2 text-sm"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button onClick={load} className="rounded border border-line-200 px-3 py-2 text-sm font-semibold">
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="rounded-lg border border-line-200 bg-white p-4">
          <LeadTable leads={pageItems} onSelect={setSelected} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Page {page} of {totalPages} ({filtered.length} leads)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-line-200 px-3 py-1 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-line-200 px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/30"
          onClick={() => setSelected(null)}
        >
          <div
            className="h-full w-full max-w-md overflow-y-auto bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-slate-500">
              Detail drawer placeholder — extended in a later task with edit/notes/delete/WhatsApp.
            </p>
            <button onClick={() => setSelected(null)} className="mt-4 text-sm font-semibold text-navy-800">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Typecheck and lint**

```bash
npx tsc -b --noEmit
npm run lint
```
Expected: no errors (the Task 9 `AdminDashboard` import now resolves).

- [ ] **Step 5: Manual verification**

`npm run dev`, visit `/admin`. Log in with the credentials in `ADMIN_USER`/`ADMIN_PASS`. Expected: stats bar shows real counts from Firestore, table lists leads, search narrows by name/phone/college, status filter narrows by status, pagination works with 20+ leads (submit test leads via the public form if needed to exceed one page), clicking a row opens the placeholder drawer.

- [ ] **Step 6: Commit (also includes Task 9's files, deferred there)**

```bash
git add src/App.tsx src/pages/Admin.tsx src/components/admin/AdminLogin.tsx src/components/admin/AdminDashboard.tsx src/components/admin/StatsBar.tsx src/components/admin/LeadTable.tsx
git commit -m "feat: add /admin dashboard with login, stats, search, filter, pagination"
```

---

## Part D — Admin Dashboard (write)

### Task 11: Detail drawer with full record view

**Files:**
- Create: `src/components/admin/LeadDetailDrawer.tsx`
- Modify: `src/components/admin/AdminDashboard.tsx` (replace the placeholder drawer block)

**Interfaces:**
- Consumes: `Lead` (Task 8).
- Produces: `LeadDetailDrawer({ lead, onClose }): JSX.Element`, extended in Task 12 with editing.

- [ ] **Step 1: `LeadDetailDrawer` (read-only fields first)**

```tsx
// src/components/admin/LeadDetailDrawer.tsx
import type { Lead } from "@/lib/adminApi";

const FIELD_LABELS: [keyof Lead, string][] = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["interest", "Interest"],
  ["preferredContact", "Preferred contact"],
  ["whatsappNumber", "WhatsApp"],
  ["college", "College"],
  ["year", "Year"],
  ["location", "Location"],
  ["message", "Message"],
  ["pageUrl", "Page URL"],
  ["referrer", "Referrer"],
  ["device", "Device"],
  ["browser", "Browser"],
  ["userAgent", "User agent"],
  ["createdAt", "Created"],
  ["updatedAt", "Updated"],
];

export function LeadDetailDrawer({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-800">{lead.name}</h2>
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-navy-800">
            Close
          </button>
        </div>
        <dl className="divide-y divide-line-200 text-sm">
          {FIELD_LABELS.map(([key, label]) => (
            <div key={key} className="flex justify-between gap-4 py-2">
              <dt className="text-slate-500">{label}</dt>
              <dd className="text-right font-medium text-navy-800 break-all">{String(lead[key] || "—")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into `AdminDashboard`**

In `src/components/admin/AdminDashboard.tsx`, add the import:
```typescript
import { LeadDetailDrawer } from "@/components/admin/LeadDetailDrawer";
```
Replace the placeholder drawer block (the `{selected && (...)}` JSX from Task 10 Step 3) with:
```tsx
      {selected && <LeadDetailDrawer lead={selected} onClose={() => setSelected(null)} />}
```

- [ ] **Step 3: Typecheck and manual check**

```bash
npx tsc -b --noEmit
```
`npm run dev`, `/admin`, click a row. Expected: drawer shows all fields including device/browser/UA/page URL/referrer.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/LeadDetailDrawer.tsx src/components/admin/AdminDashboard.tsx
git commit -m "feat: add lead detail drawer with full record view"
```

---

### Task 12: Status change, notes, edit, delete

**Files:**
- Modify: `src/components/admin/LeadDetailDrawer.tsx`
- Modify: `src/components/admin/AdminDashboard.tsx`

**Interfaces:**
- Consumes: `updateLead`, `deleteLead` (Task 8).
- Produces: `LeadDetailDrawer` now accepts `token`, `onUpdated`, `onDeleted` props.

- [ ] **Step 1: Extend `LeadDetailDrawer` with status/notes/edit/delete**

Replace the full content of `src/components/admin/LeadDetailDrawer.tsx`:
```tsx
// src/components/admin/LeadDetailDrawer.tsx
import { useState } from "react";
import { deleteLead, updateLead, type Lead, type LeadStatus } from "@/lib/adminApi";

const STATUSES: LeadStatus[] = ["New", "Contacted", "Follow-up", "Closed", "Converted"];

const FIELD_LABELS: [keyof Lead, string][] = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["interest", "Interest"],
  ["preferredContact", "Preferred contact"],
  ["whatsappNumber", "WhatsApp"],
  ["college", "College"],
  ["year", "Year"],
  ["location", "Location"],
  ["message", "Message"],
  ["pageUrl", "Page URL"],
  ["referrer", "Referrer"],
  ["device", "Device"],
  ["browser", "Browser"],
  ["userAgent", "User agent"],
  ["createdAt", "Created"],
  ["updatedAt", "Updated"],
];

const EDITABLE_FIELDS: (keyof Lead)[] = ["name", "phone", "college", "year", "location", "message"];

export function LeadDetailDrawer({
  lead,
  token,
  onClose,
  onUpdated,
  onDeleted,
}: {
  lead: Lead;
  token: string;
  onClose: () => void;
  onUpdated: (lead: Lead) => void;
  onDeleted: (submissionId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Lead>(lead);
  const [notes, setNotes] = useState(lead.notes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveUpdates(updates: Partial<Lead>) {
    setSaving(true);
    setError(null);
    const result = await updateLead(token, lead.submissionId, updates);
    setSaving(false);
    if (result.ok) {
      onUpdated({ ...lead, ...draft, ...updates });
    } else {
      setError("Save failed — try again");
    }
  }

  async function handleStatusChange(status: LeadStatus) {
    await saveUpdates({ status });
  }

  async function handleNotesBlur() {
    if (notes !== lead.notes) await saveUpdates({ notes });
  }

  async function handleEditSave() {
    const updates: Partial<Lead> = {};
    EDITABLE_FIELDS.forEach((key) => {
      if (draft[key] !== lead[key]) updates[key] = draft[key];
    });
    await saveUpdates(updates);
    setEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete lead "${lead.name}"? This cannot be undone.`)) return;
    setSaving(true);
    const result = await deleteLead(token, lead.submissionId);
    setSaving(false);
    if (result.ok) {
      onDeleted(lead.submissionId);
      onClose();
    } else {
      setError("Delete failed — try again");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-800">{lead.name}</h2>
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-navy-800">
            Close
          </button>
        </div>

        <label className="mb-1 block text-sm font-semibold text-navy-800">Status</label>
        <select
          value={lead.status}
          onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
          disabled={saving}
          className="mb-4 w-full rounded border border-line-200 px-3 py-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label className="mb-1 block text-sm font-semibold text-navy-800">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          rows={3}
          disabled={saving}
          className="mb-4 w-full rounded border border-line-200 px-3 py-2 text-sm"
        />

        {error && <p className="mb-3 text-sm font-medium text-red-500">{error}</p>}

        <dl className="divide-y divide-line-200 text-sm">
          {FIELD_LABELS.map(([key, label]) => (
            <div key={key} className="flex items-center justify-between gap-4 py-2">
              <dt className="text-slate-500">{label}</dt>
              {editing && EDITABLE_FIELDS.includes(key) ? (
                <input
                  value={String(draft[key])}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  className="w-40 rounded border border-line-200 px-2 py-1 text-right"
                />
              ) : (
                <dd className="text-right font-medium text-navy-800 break-all">{String(lead[key] || "—")}</dd>
              )}
            </div>
          ))}
        </dl>

        <div className="mt-6 flex gap-2">
          {editing ? (
            <>
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="flex-1 rounded bg-navy-800 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setDraft(lead);
                  setEditing(false);
                }}
                className="flex-1 rounded border border-line-200 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 rounded border border-line-200 py-2 text-sm font-semibold"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={saving}
            className="flex-1 rounded border border-red-300 py-2 text-sm font-semibold text-red-500 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `AdminDashboard` to pass new props and handle callbacks**

In `src/components/admin/AdminDashboard.tsx`, replace the drawer render line from Task 11:
```tsx
      {selected && (
        <LeadDetailDrawer
          lead={selected}
          token={token}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setLeads((prev) => prev.map((l) => (l.submissionId === updated.submissionId ? updated : l)));
            setSelected(updated);
          }}
          onDeleted={(submissionId) => {
            setLeads((prev) => prev.filter((l) => l.submissionId !== submissionId));
          }}
        />
      )}
```

- [ ] **Step 3: Typecheck and lint**

```bash
npx tsc -b --noEmit
npm run lint
```
Expected: no errors.

- [ ] **Step 4: Manual verification**

`/admin` → open a lead → change status (confirm it updates immediately in the table's badge after closing/reopening or via `Refresh`) → add a note, click outside the textarea to blur (confirm saved by reopening the drawer) → click Edit, change name, Save (confirm table reflects new name) → click Delete, confirm the browser confirm dialog, confirm row disappears from the table and from Firestore (re-run the `list` curl from Task 3 Step 3 if you want server-side confirmation).

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/LeadDetailDrawer.tsx src/components/admin/AdminDashboard.tsx
git commit -m "feat: add status change, notes, edit, and delete to lead detail drawer"
```

---

## Part E — Export + WhatsApp

### Task 13: CSV export

**Files:**
- Create: `src/lib/exportLeads.ts`
- Modify: `src/components/admin/AdminDashboard.tsx`

**Interfaces:**
- Produces: `exportLeadsToCsv(leads: Lead[]): void` — triggers a browser download.

- [ ] **Step 1: Write the CSV exporter**

```typescript
// src/lib/exportLeads.ts
import type { Lead } from "@/lib/adminApi";

const COLUMNS: (keyof Lead)[] = [
  "submissionId", "createdAt", "name", "phone", "interest", "preferredContact",
  "whatsappNumber", "college", "year", "location", "message",
  "pageUrl", "referrer", "device", "browser", "status", "notes", "updatedAt",
];

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toCsv(leads: Lead[]): string {
  const header = COLUMNS.join(",");
  const rows = leads.map((lead) => COLUMNS.map((col) => escapeCsvCell(String(lead[col] ?? ""))).join(","));
  return [header, ...rows].join("\n");
}

function download(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportLeadsToCsv(leads: Lead[]): void {
  download(`leads-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(leads), "text/csv");
}

/** Excel opens an HTML table saved with an .xls extension without needing a charting library. */
export function exportLeadsToExcel(leads: Lead[]): void {
  const header = COLUMNS.map((c) => `<th>${c}</th>`).join("");
  const rows = leads
    .map((lead) => `<tr>${COLUMNS.map((col) => `<td>${String(lead[col] ?? "")}</td>`).join("")}</tr>`)
    .join("");
  const html = `<table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table>`;
  download(`leads-${new Date().toISOString().slice(0, 10)}.xls`, html, "application/vnd.ms-excel");
}
```

- [ ] **Step 2: Add export buttons to `AdminDashboard`**

Add the import:
```typescript
import { exportLeadsToCsv, exportLeadsToExcel } from "@/lib/exportLeads";
```
In the controls row (the `<div className="mb-4 flex flex-wrap gap-3">` block from Task 10), add after the Refresh button:
```tsx
        <button
          onClick={() => exportLeadsToCsv(filtered)}
          className="rounded border border-line-200 px-3 py-2 text-sm font-semibold"
        >
          Export CSV
        </button>
        <button
          onClick={() => exportLeadsToExcel(filtered)}
          className="rounded border border-line-200 px-3 py-2 text-sm font-semibold"
        >
          Export Excel
        </button>
```

- [ ] **Step 3: Typecheck and manual verification**

```bash
npx tsc -b --noEmit
```
`/admin` → apply a search/filter → Export CSV → open the downloaded file, confirm only the filtered rows are present with all 18 columns. Export Excel → open in Excel/LibreOffice, confirm it opens as a table (not raw HTML text).

- [ ] **Step 4: Commit**

```bash
git add src/lib/exportLeads.ts src/components/admin/AdminDashboard.tsx
git commit -m "feat: add CSV and Excel export to admin dashboard"
```

---

### Task 14: One-click WhatsApp summary

**Files:**
- Create: `src/lib/whatsappSummary.ts`
- Modify: `src/components/admin/LeadDetailDrawer.tsx`

**Interfaces:**
- Produces: `formatWhatsAppSummary(lead: Lead): string`, `copyAndOpenWhatsApp(lead: Lead): Promise<void>`.

- [ ] **Step 1: Write the summary + clipboard/open helper**

```typescript
// src/lib/whatsappSummary.ts
import type { Lead } from "@/lib/adminApi";

const WHATSAPP_NUMBER = "919345984804";

export function formatWhatsAppSummary(lead: Lead): string {
  const lines = [
    `*New lead: ${lead.name}*`,
    `Phone: ${lead.phone}`,
    `Interest: ${lead.interest}`,
    `Preferred contact: ${lead.preferredContact}`,
    lead.whatsappNumber && `WhatsApp: ${lead.whatsappNumber}`,
    lead.college && `College: ${lead.college}`,
    lead.year && `Year: ${lead.year}`,
    lead.location && `Location: ${lead.location}`,
    lead.message && `Message: ${lead.message}`,
    `Status: ${lead.status}`,
    lead.notes && `Notes: ${lead.notes}`,
  ].filter(Boolean);
  return lines.join("\n");
}

function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textarea);
    }
  });
}

export async function copyAndOpenWhatsApp(lead: Lead): Promise<{ copied: boolean }> {
  const summary = formatWhatsAppSummary(lead);
  let copied = true;
  try {
    await copyText(summary);
  } catch {
    copied = false;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank", "noopener,noreferrer");
  return { copied };
}
```

- [ ] **Step 2: Add the WhatsApp button to `LeadDetailDrawer`**

Add the import to `src/components/admin/LeadDetailDrawer.tsx`:
```typescript
import { copyAndOpenWhatsApp } from "@/lib/whatsappSummary";
```
Add local state near the other `useState` calls:
```typescript
  const [toast, setToast] = useState<string | null>(null);
```
Add a handler:
```typescript
  async function handleWhatsApp() {
    const { copied } = await copyAndOpenWhatsApp(lead);
    setToast(
      copied
        ? "Summary copied — paste it into the Leads-group chat"
        : "Couldn't copy automatically — select and copy the summary manually"
    );
    setTimeout(() => setToast(null), 4000);
  }
```
Add the button into the action row, alongside Edit/Delete (three-button row becomes four — wrap to two rows for space):
```tsx
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={handleWhatsApp}
            className="flex-1 rounded bg-green-600 py-2 text-sm font-semibold text-white"
          >
            WhatsApp
          </button>
          {/* existing Edit/Save/Cancel/Delete buttons follow, unchanged */}
        </div>
```
(Merge this into the existing action-row `<div>` from Task 12 Step 1 rather than duplicating it — add the WhatsApp button as the first child of that same flex container.)

Add the toast render, just before the closing `</div>` of the drawer panel:
```tsx
        {toast && (
          <div className="mt-3 rounded bg-navy-800 px-3 py-2 text-center text-xs font-medium text-white">
            {toast}
          </div>
        )}
```

- [ ] **Step 3: Typecheck and manual verification**

```bash
npx tsc -b --noEmit
```
`/admin` → open a lead → click WhatsApp → confirm a new tab opens to `https://wa.me/919345984804` and pasting (Ctrl+V) into any text field shows the formatted summary with all populated fields.

- [ ] **Step 4: Commit**

```bash
git add src/lib/whatsappSummary.ts src/components/admin/LeadDetailDrawer.tsx
git commit -m "feat: add one-click WhatsApp summary copy to lead detail drawer"
```

---

## Final Verification (whole system)

- [ ] **Step 1: Full typecheck and lint**

```bash
npx tsc -b --noEmit
npm run lint
npm run build
```
Expected: all three succeed with no errors.

- [ ] **Step 2: End-to-end manual pass**

1. Submit the public LeadForm (all field combinations: a student interest with college/year/location filled, and a non-student interest with those fields absent).
2. Confirm: Firestore doc created (via `/admin` list or the `list` curl), Sheet row appended, email received, Telegram message received.
3. Log into `/admin`, confirm the new lead appears with correct stats.
4. Search by phone, filter by status, paginate (submit enough leads to cross a page boundary, or temporarily lower `PAGE_SIZE` for the test).
5. Open detail drawer, change status, add a note, edit a field, confirm each persists after refresh.
6. Export CSV and Excel, confirm all columns and only filtered rows.
7. Click WhatsApp, confirm clipboard + new tab.
8. Delete a test lead, confirm it's gone from the table and from Firestore.

- [ ] **Step 3: Confirm no secrets committed**

```bash
git log --all -p -- server/apps-script/ | grep -iE "private_key|BEGIN PRIVATE KEY|bot[0-9]+:AA" || echo "clean"
git status --short
```
Expected: `clean`, and `.env` shows as untracked/ignored, not staged.
