# Career Applications Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Careers page's WhatsApp/mailto "Apply" popup with a real submission pipeline (Firestore + Sheet mirror + resume in Cloud Storage + email/Telegram notify), and add an "Applications" tab to the existing admin dashboard, mirroring the lead pipeline's architecture exactly.

**Architecture:** Same single Apps Script web app already used for leads (`server/apps-script/`). New Firestore collection `applications`, new "Applications" Sheet tab, resumes uploaded to the Firebase project's default GCS bucket via the same service-account OAuth flow already used for Firestore. Frontend adds `src/lib/applications.ts` (mirrors `leads.ts`), rewrites `ApplyModal.tsx`, extends `adminApi.ts`, and adds `ApplicationTable.tsx` / `ApplicationDetailDrawer.tsx` (mirror the Lead equivalents) plus a two-tab switcher in `AdminDashboard.tsx`.

**Tech Stack:** React 18 + TypeScript + Vite, Google Apps Script (`.gs`, ES5-style `var`), Firestore REST API, Google Cloud Storage JSON API. No test framework configured — verification is `npm run build` / `npm run lint` / `npx tsc -b --noEmit` for frontend, `node --check` for `.gs` syntax, plus a manual end-to-end pass.

## Global Constraints

- No new npm dependencies (per spec's Dependency Check) — resume encoding uses browser-native `FileReader`, no Firebase client SDK.
- All backend secrets stay in Apps Script Script Properties — nothing sensitive ships in the browser bundle.
- Resume cap: 5MB, required field, `.pdf`/`.doc`/`.docx` only (client + server validation).
- `apply` action must be idempotent on `submissionId` (dedupe check via `firestoreGetDoc` before upload/create) — see spec's edge-case fixes.
- `delete_app` order: Firestore delete first (abort on failure) → best-effort Sheet delete → best-effort bucket-object delete, matching `handleDelete`'s pattern in `Code.gs`.
- If `firestoreCreateDoc` fails after a successful resume upload, best-effort delete the orphaned resume object before returning the error.
- `APPLICATION_COLUMNS` (exact, used for Firestore record shape + Sheet header/row order):
  `['submissionId', 'createdAt', 'name', 'phone', 'email', 'roleTitle', 'resumeUrl', 'resumeFileName', 'pageUrl', 'referrer', 'userAgent', 'device', 'browser', 'status', 'notes', 'updatedAt']`
- Admin edit has no resume re-upload (accepted limitation, matches leads).
- Spec: `docs/superpowers/specs/2026-07-08-career-applications-design.md`

---

### Task 1: Backend — Cloud Storage upload/delete helper + scope extension

**Files:**
- Create: `server/apps-script/Storage.gs`
- Modify: `server/apps-script/FirestoreAuth.gs` (extend OAuth scope)
- Modify: `server/apps-script/SETUP.md` (document bucket + IAM step)

**Interfaces:**
- Produces: `uploadResumeToBucket(base64, filename, mimeType, submissionId)` → returns `String` public URL, throws on failure.
- Produces: `deleteResumeFromBucket(resumeUrl)` → returns nothing, throws on failure (caller wraps in try/catch — best-effort per Global Constraints).
- Consumes: `getFirestoreAccessToken()` from `FirestoreAuth.gs` (already exists) — must now also carry the storage scope.

- [ ] **Step 1: Extend the OAuth scope in `FirestoreAuth.gs`**

Open `server/apps-script/FirestoreAuth.gs`. Change line 22 from:
```javascript
    scope: 'https://www.googleapis.com/auth/datastore',
```
to:
```javascript
    scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/devstorage.read_write',
```
Also rename the cache key so a stale datastore-only token isn't reused — change line 11-12 from:
```javascript
  var cached = cache.get('fs_access_token');
  if (cached) return cached;
```
to:
```javascript
  var cached = cache.get('gcp_access_token');
  if (cached) return cached;
```
and line 52 from:
```javascript
  cache.put('fs_access_token', body.access_token, 55 * 60);
```
to:
```javascript
  cache.put('gcp_access_token', body.access_token, 55 * 60);
```

- [ ] **Step 2: Verify syntax**

Run: `node --check "c:\Users\New User\Documents\mep\Meptra-soft-website\server\apps-script\FirestoreAuth.gs"`
Expected: no output (valid syntax).

- [ ] **Step 3: Create `Storage.gs`**

```javascript
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
```

- [ ] **Step 4: Verify syntax**

Run: `node --check "c:\Users\New User\Documents\mep\Meptra-soft-website\server\apps-script\Storage.gs"`
Expected: no output (valid syntax).

- [ ] **Step 5: Document the bucket setup step**

Open `server/apps-script/SETUP.md`, find the section describing `FB_SA_CLIENT_EMAIL`/`FB_SA_PRIVATE_KEY`/`FB_PROJECT_ID`/`SHEET_ID` script properties (read the file first to match its existing format), and add a new entry directly after it:

```markdown
### Resume storage (Cloud Storage)

1. In the Firebase console for this project, open **Build → Storage** and note the default bucket name (usually `<project-id>.appspot.com`). If Storage has never been enabled, enable it once — the free Spark plan default bucket is sufficient.
2. In Google Cloud Console → IAM, grant the existing service account (the one whose key is in `FB_SA_CLIENT_EMAIL`) the **Storage Object Admin** role on that bucket.
3. In the Apps Script project, add a new Script Property: `FB_STORAGE_BUCKET` = the bucket name from step 1.
```

- [ ] **Step 6: Commit**

```bash
git add server/apps-script/Storage.gs server/apps-script/FirestoreAuth.gs server/apps-script/SETUP.md
git commit -m "feat(apps-script): add Cloud Storage upload/delete helpers for resumes"
```

---

### Task 2: Backend — Sheet mirror + notify functions for applications

**Files:**
- Modify: `server/apps-script/Notify.gs`

**Interfaces:**
- Consumes: nothing new (uses existing `PropertiesService`, `SpreadsheetApp`, `MailApp`, `UrlFetchApp` globals).
- Produces: `appendApplicationToSheet(application)`, `updateApplicationInSheet(application)` → `Boolean`, `deleteApplicationFromSheet(submissionId)`, `sendApplicationEmail(application)`, `sendApplicationTelegram(application)`.
- Depends on global `APPLICATION_COLUMNS` array, defined in Task 3's `Code.gs` change — but since `.gs` files share one global scope in Apps Script, declare `APPLICATION_COLUMNS` in `Code.gs` (Task 3) and reference it here; **do this task second is fine since Apps Script has no per-file imports, but to keep this repo's plain-Node syntax check passing per-file, do not reference `APPLICATION_COLUMNS` inside this file's top-level code** — pass it as a parameter instead is unnecessary complexity; simplest fix: define `APPLICATION_COLUMNS` in `Code.gs` in Task 3, and since `node --check` only validates syntax (not undefined globals), this file referencing that global is syntactically fine and will work correctly once deployed together in Apps Script (all `.gs` files share one global namespace there). No action needed beyond noting this.

- [ ] **Step 1: Append the new functions to `Notify.gs`**

Add to the end of `server/apps-script/Notify.gs`:

```javascript

/** Google Sheet is a mirror/reporting layer only — never read back as source of truth. */
function appendApplicationToSheet(application) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Applications') ||
    SpreadsheetApp.openById(sheetId).insertSheet('Applications');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(APPLICATION_COLUMNS);
  }
  sheet.appendRow(APPLICATION_COLUMNS.map(function (col) { return application[col] || ''; }));
}

/** Update the row in Google Sheet that matches the application's submissionId. */
function updateApplicationInSheet(application) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName('Applications');
  if (!sheet) return false;

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;

  var data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (String(data[i][0]) === application.submissionId) {
      var rowNum = i + 2;
      var rowValues = APPLICATION_COLUMNS.map(function (col) { return application[col] || ''; });
      sheet.getRange(rowNum, 1, 1, APPLICATION_COLUMNS.length).setValues([rowValues]);
      return true;
    }
  }
  return false;
}

/** Delete the row from Google Sheet that matches the given submissionId (column 1). */
function deleteApplicationFromSheet(submissionId) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName('Applications');
  if (!sheet) return;

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  var data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (String(data[i][0]) === submissionId) {
      sheet.deleteRow(i + 2);
      return;
    }
  }
}

function sendApplicationEmail(application) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  var body = APPLICATION_COLUMNS.map(function (col) {
    return col + ': ' + (application[col] || '');
  }).join('\n');
  MailApp.sendEmail(to, 'New job application: ' + application.name + ' — ' + application.roleTitle, body);
}

function sendApplicationTelegram(application) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('TG_TOKEN');
  var chatId = props.getProperty('TG_CHAT_ID');
  var lines = [
    'New application: ' + application.name,
    'Role: ' + application.roleTitle,
    'Phone: ' + application.phone,
    'Email: ' + application.email,
    application.resumeUrl ? 'Resume: ' + application.resumeUrl : null
  ].filter(function (l) { return l; });

  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: { chat_id: chatId, text: lines.join('\n') },
    muteHttpExceptions: true
  });
}
```

- [ ] **Step 2: Verify syntax**

Run: `node --check "c:\Users\New User\Documents\mep\Meptra-soft-website\server\apps-script\Notify.gs"`
Expected: no output (valid syntax).

- [ ] **Step 3: Commit**

```bash
git add server/apps-script/Notify.gs
git commit -m "feat(apps-script): add Sheet mirror + email/Telegram notify for applications"
```

---

### Task 3: Backend — `apply`/`list_apps`/`update_app`/`delete_app` actions in Code.gs

**Files:**
- Modify: `server/apps-script/Code.gs`

**Interfaces:**
- Consumes: `firestoreGetDoc`, `firestoreCreateDoc`, `firestoreUpdateDoc`, `firestoreDeleteDoc`, `firestoreListDocs` (from `Firestore.gs`, existing); `uploadResumeToBucket`, `deleteResumeFromBucket` (Task 1); `appendApplicationToSheet`, `updateApplicationInSheet`, `deleteApplicationFromSheet`, `sendApplicationEmail`, `sendApplicationTelegram` (Task 2); `jsonResponse`, `requireValidToken`, `logError` (existing, this file).
- Produces: `APPLICATION_COLUMNS` global array (consumed by Task 2's functions and the frontend's expectations); routes `action:"apply"` (POST), `action:"list_apps"` (GET), `action:"update_app"` (POST), `action:"delete_app"` (POST).

- [ ] **Step 1: Add `APPLICATION_COLUMNS` and the max resume size constant**

In `server/apps-script/Code.gs`, right after the existing `LEAD_COLUMNS` block (after line 8), add:

```javascript

var APPLICATION_COLUMNS = [
  'submissionId', 'createdAt', 'name', 'phone', 'email', 'roleTitle',
  'resumeUrl', 'resumeFileName', 'pageUrl', 'referrer', 'userAgent',
  'device', 'browser', 'status', 'notes', 'updatedAt'
];

var MAX_RESUME_BASE64_LENGTH = Math.ceil(5 * 1024 * 1024 * 4 / 3); // ~5MB file → base64 length ceiling
```

- [ ] **Step 2: Route the new actions in `doPost`/`doGet`**

Replace:
```javascript
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
```
with:
```javascript
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
```

- [ ] **Step 3: Add `handleApply`, `handleListApplications`, `handleUpdateApplication`, `handleDeleteApplication`**

Append to the end of `server/apps-script/Code.gs`:

```javascript

function handleApply(body) {
  var application = body.application || {};
  if (!application.name || !application.phone || !application.email || !application.submissionId) {
    return jsonResponse({ ok: false, error: 'missing_required_fields' });
  }
  if (!application.resumeBase64 || !application.resumeFileName) {
    return jsonResponse({ ok: false, error: 'missing_resume' });
  }
  if (application.resumeBase64.length > MAX_RESUME_BASE64_LENGTH) {
    return jsonResponse({ ok: false, error: 'resume_too_large' });
  }

  // Idempotency: a retried submission (offline queue or double-click) with the
  // same submissionId must not re-upload the resume or create a duplicate doc.
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
    resumeUrl = uploadResumeToBucket(
      application.resumeBase64,
      application.resumeFileName,
      application.resumeMimeType,
      application.submissionId
    );
  } catch (err) {
    logError('resume_upload', err, { submissionId: application.submissionId });
    return jsonResponse({ ok: false, error: 'resume_upload_failed' });
  }

  var record = {};
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
    try { deleteResumeFromBucket(resumeUrl); } catch (cleanupErr) { logError('resume_cleanup', cleanupErr, record); }
    return jsonResponse({ ok: false, error: 'firestore_create_failed' });
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
      deleteResumeFromBucket(existing.resumeUrl);
    } catch (err) {
      logError('resume_delete', err, { submissionId: submissionId });
    }
  }

  return jsonResponse({ ok: true });
}
```

- [ ] **Step 4: Verify syntax**

Run: `node --check "c:\Users\New User\Documents\mep\Meptra-soft-website\server\apps-script\Code.gs"`
Expected: no output (valid syntax).

- [ ] **Step 5: Commit**

```bash
git add server/apps-script/Code.gs
git commit -m "feat(apps-script): add apply/list_apps/update_app/delete_app actions"
```

---

### Task 4: Frontend — `src/lib/applications.ts`

**Files:**
- Create: `src/lib/applications.ts`

**Interfaces:**
- Consumes: `parseDevice` from `@/lib/device` (existing).
- Produces: `ApplicationFormValues` interface `{name, phone, email, roleTitle}`, `ApplicationPayload` interface (extends it with telemetry + `resumeBase64`, `resumeFileName`, `resumeMimeType`, `submissionId`), `buildApplicationPayload(values, resume, submissionId?)`, `fileToBase64(file): Promise<string>`, `submitApplication(payload): Promise<{ok: boolean}>`, `flushQueuedApplications(): Promise<void>`. These names/shapes are consumed by Task 6 (`ApplyModal.tsx`).

- [ ] **Step 1: Write `src/lib/applications.ts`**

```typescript
// src/lib/applications.ts
import { parseDevice } from "@/lib/device";

export interface ApplicationFormValues {
  name: string;
  phone: string;
  email: string;
  roleTitle: string;
}

export interface ApplicationPayload extends ApplicationFormValues {
  submissionId: string;
  resumeBase64: string;
  resumeFileName: string;
  resumeMimeType: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  device: string;
  browser: string;
}

const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;
const QUEUE_KEY = "meptrasoft_application_queue";

/** Strips the `data:...;base64,` prefix FileReader adds, leaving raw base64. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.slice(result.indexOf(",") + 1);
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function buildApplicationPayload(
  values: ApplicationFormValues,
  resume: { base64: string; fileName: string; mimeType: string },
  submissionId?: string
): ApplicationPayload {
  const { device, browser } = parseDevice(navigator.userAgent);
  return {
    ...values,
    submissionId: submissionId || crypto.randomUUID(),
    resumeBase64: resume.base64,
    resumeFileName: resume.fileName,
    resumeMimeType: resume.mimeType,
    pageUrl: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    device,
    browser,
  };
}

function readQueue(): ApplicationPayload[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeQueue(queue: ApplicationPayload[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // localStorage unavailable (private browsing, quota) — queueing is best-effort
  }
}

function enqueue(payload: ApplicationPayload) {
  writeQueue([...readQueue(), payload]);
}

async function postApplication(payload: ApplicationPayload): Promise<boolean> {
  if (!ENDPOINT) return false;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "apply", application: payload }),
    });
    const body = await res.json();
    return !!body.ok;
  } catch {
    return false;
  }
}

/** Returns {ok:true} only if the application actually reached the server this call. */
export async function submitApplication(payload: ApplicationPayload): Promise<{ ok: boolean }> {
  const ok = await postApplication(payload);
  if (!ok) enqueue(payload);
  return { ok };
}

/** Retries anything queued from a prior failed submission. Call on ApplyModal mount. */
export async function flushQueuedApplications(): Promise<void> {
  const queue = readQueue();
  if (queue.length === 0) return;
  const remaining: ApplicationPayload[] = [];
  for (const payload of queue) {
    const ok = await postApplication(payload);
    if (!ok) remaining.push(payload);
  }
  writeQueue(remaining);
}
```

- [ ] **Step 2: Typecheck**

Run: `cd "c:\Users\New User\Documents\mep\Meptra-soft-website" && npx tsc -b --noEmit`
Expected: no errors (existing errors in unrelated files, if any, are pre-existing — this file must add none).

- [ ] **Step 3: Commit**

```bash
git add src/lib/applications.ts
git commit -m "feat: add applications submission client (mirrors leads.ts pattern)"
```

---

### Task 5: Frontend — extend `adminApi.ts` with Application CRUD

**Files:**
- Modify: `src/lib/adminApi.ts`

**Interfaces:**
- Produces: `ApplicationStatus` type (`"New" | "Reviewing" | "Shortlisted" | "Rejected" | "Hired"`), `Application` interface, `listApplications(token)`, `updateApplication(token, submissionId, updates)`, `deleteApplication(token, submissionId)`. Consumed by Task 8, 9, 10.

- [ ] **Step 1: Append to `src/lib/adminApi.ts`**

Add after the existing `deleteLead` function (end of file):

```typescript

export type ApplicationStatus = "New" | "Reviewing" | "Shortlisted" | "Rejected" | "Hired";

export interface Application {
  submissionId: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  roleTitle: string;
  resumeUrl: string;
  resumeFileName: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  device: string;
  browser: string;
  status: ApplicationStatus;
  notes: string;
  updatedAt: string;
}

export async function listApplications(token: string) {
  if (!ENDPOINT) return { ok: false, error: "missing_endpoint" };
  try {
    const res = await fetch(`${ENDPOINT}?action=list_apps&token=${encodeURIComponent(token)}`);
    return (await res.json()) as { ok: boolean; applications?: Application[]; error?: string };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function updateApplication(token: string, submissionId: string, updates: Partial<Application>) {
  return post({ action: "update_app", token, submissionId, updates }) as Promise<{ ok: boolean; error?: string }>;
}

export async function deleteApplication(token: string, submissionId: string) {
  return post({ action: "delete_app", token, submissionId }) as Promise<{ ok: boolean; error?: string }>;
}
```

- [ ] **Step 2: Typecheck**

Run: `cd "c:\Users\New User\Documents\mep\Meptra-soft-website" && npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/adminApi.ts
git commit -m "feat: add Application type + list/update/delete admin API calls"
```

---

### Task 6: Frontend — rewrite `ApplyModal.tsx`

**Files:**
- Modify: `src/components/ui/ApplyModal.tsx`

**Interfaces:**
- Consumes: `buildApplicationPayload`, `fileToBase64`, `flushQueuedApplications`, `submitApplication` from `@/lib/applications` (Task 4).
- Produces: same public props `{roleTitle, onClose}` — no change needed in `src/pages/Careers.tsx`.

- [ ] **Step 1: Replace the full contents of `src/components/ui/ApplyModal.tsx`**

```tsx
import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  buildApplicationPayload,
  fileToBase64,
  flushQueuedApplications,
  submitApplication,
} from "@/lib/applications";

export interface ApplyModalProps {
  roleTitle: string;
  onClose: () => void;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
}

const initialState: FormState = { name: "", phone: "", email: "" };
const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

function isValidPhone(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length === 10 || (digits.length === 12 && digits.startsWith("91"));
}

function hasAcceptedExtension(fileName: string) {
  const lower = fileName.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/** Applies through the same backend pipeline as the Contact form's LeadForm. */
export function ApplyModal({ roleTitle, onClose }: ApplyModalProps) {
  const [values, setValues] = useState<FormState>(initialState);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string; resume?: string }>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitted" | "queued">("idle");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = useId();

  useEffect(() => {
    flushQueuedApplications();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleFileChange(file: File | null) {
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (!hasAcceptedExtension(file.name)) {
      setErrors((prev) => ({ ...prev, resume: "Only PDF, DOC, or DOCX files are accepted" }));
      setResumeFile(null);
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setErrors((prev) => ({ ...prev, resume: "File is too large — max 5MB" }));
      setResumeFile(null);
      return;
    }
    setErrors((prev) => ({ ...prev, resume: undefined }));
    setResumeFile(file);
  }

  function validate() {
    const nextErrors: typeof errors = {};
    if (!values.name.trim()) nextErrors.name = "Name is required";
    if (!values.phone.trim()) nextErrors.phone = "Phone number is required";
    else if (!isValidPhone(values.phone)) nextErrors.phone = "Enter a valid 10-digit phone number";
    if (!values.email.trim()) nextErrors.email = "Email is required";
    if (!resumeFile) nextErrors.resume = "Resume is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate() || isSubmitting || !resumeFile) return;

    setIsSubmitting(true);
    const subId = submissionId || crypto.randomUUID();
    try {
      const base64 = await fileToBase64(resumeFile);
      const payload = buildApplicationPayload(
        { name: values.name, phone: values.phone, email: values.email, roleTitle },
        { base64, fileName: resumeFile.name, mimeType: resumeFile.type },
        subId
      );
      const { ok } = await submitApplication(payload);
      setSubmissionId(subId);
      setSubmitState(ok ? "submitted" : "queued");
    } catch {
      setSubmitState("queued");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewSubmission() {
    setValues(initialState);
    setResumeFile(null);
    setSubmissionId(null);
    setSubmitState("idle");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020810]/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel relative w-full max-w-md rounded-[var(--radius-lg)] p-6 text-hero-ink md:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-hero-soft transition-colors hover:bg-white/10 hover:text-hero-ink"
        >
          <Icon name="close" size={16} />
        </button>

        {submitState !== "idle" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center" role="status" aria-live="polite">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-aqua-400/20">
              <Icon name="check" size={32} className="text-aqua-400" />
            </span>
            <p className="text-lg font-bold tracking-[-0.01em]">
              {submitState === "submitted" ? "Application received" : "Saved on this device"}
            </p>
            <p className="text-sm text-hero-soft">
              {submitState === "submitted"
                ? `Your application for ${roleTitle} is in — we'll reach out if it's a fit.`
                : "We'll finish sending it once you're back online — no need to reapply."}
            </p>
            <div className="mt-2 flex w-full flex-col gap-2">
              <Button type="button" variant="amber" size="md" onClick={handleNewSubmission}>
                Apply to another role
              </Button>
              <Button type="button" variant="outline-light" size="md" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="eyebrow text-aqua-300">Apply</p>
            <h2 id={`${formId}-title`} className="mt-1 text-xl font-bold tracking-[-0.01em]">
              {roleTitle}
            </h2>

            <form className="mt-5 flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor={`${formId}-name`} className="text-[13px] font-semibold text-hero-ink">
                  Name <span aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-name`}
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your name"
                  className={cn(
                    "neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[15px] text-hero-ink outline-none placeholder:text-hero-faint",
                    errors.name && "outline outline-2 outline-red-500"
                  )}
                />
                {errors.name && <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor={`${formId}-phone`} className="text-[13px] font-semibold text-hero-ink">
                  Phone <span aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  autoComplete="tel"
                  inputMode="tel"
                  value={values.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className={cn(
                    "neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[15px] text-hero-ink outline-none placeholder:text-hero-faint",
                    errors.phone && "outline outline-2 outline-red-500"
                  )}
                />
                {errors.phone && <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor={`${formId}-email`} className="text-[13px] font-semibold text-hero-ink">
                  Email <span aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  className={cn(
                    "neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[15px] text-hero-ink outline-none placeholder:text-hero-faint",
                    errors.email && "outline outline-2 outline-red-500"
                  )}
                />
                {errors.email && <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor={`${formId}-resume`} className="text-[13px] font-semibold text-hero-ink">
                  Resume <span aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-resume`}
                  type="file"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.resume}
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  className={cn(
                    "neu-field mt-1.5 w-full rounded-[var(--radius-md)] px-4 py-2.5 text-[13px] text-hero-soft outline-none",
                    "file:mr-3 file:rounded-full file:border-0 file:bg-aqua-400/20 file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-aqua-300",
                    errors.resume && "outline outline-2 outline-red-500"
                  )}
                />
                <p className="mt-1.5 text-[12px] text-hero-faint">PDF, DOC, or DOCX — max 5MB</p>
                {errors.resume && <p className="mt-1.5 text-[13px] font-medium text-red-500">{errors.resume}</p>}
              </div>

              <Button type="submit" variant="amber" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Send application"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `cd "c:\Users\New User\Documents\mep\Meptra-soft-website" && npx tsc -b --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ApplyModal.tsx
git commit -m "feat: wire ApplyModal to the real applications backend, drop WhatsApp/mailto"
```

---

### Task 7: Frontend — `src/lib/exportApplications.ts`

**Files:**
- Create: `src/lib/exportApplications.ts`

**Interfaces:**
- Consumes: `Application` from `@/lib/adminApi` (Task 5).
- Produces: `exportApplicationsToCsv(applications)`, `exportApplicationsToExcel(applications)`. Consumed by Task 10.

- [ ] **Step 1: Write `src/lib/exportApplications.ts`**

```typescript
import type { Application } from "@/lib/adminApi";

const COLUMNS: (keyof Application)[] = [
  "submissionId", "createdAt", "name", "phone", "email", "roleTitle",
  "resumeUrl", "resumeFileName", "pageUrl", "referrer", "device", "browser",
  "status", "notes", "updatedAt",
];

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

/** Neutralize CSV/Excel formula injection: a leading =, +, -, or @ makes
 * spreadsheet apps treat the cell as a live formula. Prefixing with a
 * single quote forces text interpretation. */
function sanitizeFormulaCell(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toCsv(applications: Application[]): string {
  const header = COLUMNS.join(",");
  const rows = applications.map((app) => COLUMNS.map((col) => escapeCsvCell(sanitizeFormulaCell(String(app[col] ?? "")))).join(","));
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

export function exportApplicationsToCsv(applications: Application[]): void {
  download(`applications-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(applications), "text/csv");
}

/** Excel opens an HTML table saved with an .xls extension without needing a charting library. */
export function exportApplicationsToExcel(applications: Application[]): void {
  const header = COLUMNS.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
  const rows = applications
    .map((app) => `<tr>${COLUMNS.map((col) => `<td>${escapeHtml(sanitizeFormulaCell(String(app[col] ?? "")))}</td>`).join("")}</tr>`)
    .join("");
  const html = `<table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table>`;
  download(`applications-${new Date().toISOString().slice(0, 10)}.xls`, html, "application/vnd.ms-excel");
}
```

- [ ] **Step 2: Typecheck**

Run: `cd "c:\Users\New User\Documents\mep\Meptra-soft-website" && npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/exportApplications.ts
git commit -m "feat: add CSV/Excel export for applications"
```

---

### Task 8: Frontend — `ApplicationTable.tsx`

**Files:**
- Create: `src/components/admin/ApplicationTable.tsx`

**Interfaces:**
- Consumes: `Application` from `@/lib/adminApi` (Task 5).
- Produces: `ApplicationTable({applications, onSelect, onDelete})` component. Consumed by Task 10.

- [ ] **Step 1: Write `src/components/admin/ApplicationTable.tsx`**

```tsx
// src/components/admin/ApplicationTable.tsx
import { useState } from "react";
import type { Application } from "@/lib/adminApi";

export function ApplicationTable({
  applications,
  onSelect,
  onDelete,
}: {
  applications: Application[];
  onSelect: (application: Application) => void;
  onDelete: (submissionId: string) => Promise<boolean>;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDeleteClick(application: Application) {
    if (!window.confirm(`Delete application from "${application.name}"? This removes it from Firebase, Google Sheets, and the resume file, and cannot be undone.`)) return;
    setDeletingId(application.submissionId);
    await onDelete(application.submissionId);
    setDeletingId(null);
  }

  if (applications.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">No applications found.</p>;
  }

  return (
    <table className="w-full min-w-[860px] border-collapse text-sm">
      <thead>
        <tr className="border-b border-line-200 text-left text-slate-600">
          <th className="whitespace-nowrap py-2 pr-4">Name</th>
          <th className="whitespace-nowrap py-2 pr-4">Role</th>
          <th className="whitespace-nowrap py-2 pr-4">Phone</th>
          <th className="whitespace-nowrap py-2 pr-4">Email</th>
          <th className="whitespace-nowrap py-2 pr-4">Resume</th>
          <th className="whitespace-nowrap py-2 pr-4">Status</th>
          <th className="whitespace-nowrap py-2 pr-4">Applied</th>
          <th className="whitespace-nowrap py-2 pr-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((application) => (
          <tr key={application.submissionId} className="border-b border-line-200 hover:bg-slate-50">
            <td className="whitespace-nowrap py-2 pr-4 font-medium text-navy-800">{application.name}</td>
            <td className="whitespace-nowrap py-2 pr-4 text-navy-800">{application.roleTitle}</td>
            <td className="whitespace-nowrap py-2 pr-4 text-navy-800">{application.phone}</td>
            <td className="whitespace-nowrap py-2 pr-4 text-navy-800">{application.email}</td>
            <td className="whitespace-nowrap py-2 pr-4">
              {application.resumeUrl ? (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-teal-600 hover:underline"
                >
                  View
                </a>
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </td>
            <td className="whitespace-nowrap py-2 pr-4">
              <span className="rounded-full bg-aqua-400/20 px-2.5 py-0.5 text-xs font-semibold text-navy-800">
                {application.status}
              </span>
            </td>
            <td className="whitespace-nowrap py-2 pr-4 text-slate-600">
              {new Date(application.createdAt).toLocaleString()}
            </td>
            <td className="whitespace-nowrap py-2 pr-4">
              <div className="flex gap-2">
                <button
                  onClick={() => onSelect(application)}
                  className="rounded border border-navy-800 px-3 py-1 text-xs font-semibold text-navy-800 hover:bg-navy-800 hover:text-white"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteClick(application)}
                  disabled={deletingId === application.submissionId}
                  className="rounded border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                >
                  {deletingId === application.submissionId ? "Deleting…" : "Delete"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `cd "c:\Users\New User\Documents\mep\Meptra-soft-website" && npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/ApplicationTable.tsx
git commit -m "feat: add ApplicationTable admin component"
```

---

### Task 9: Frontend — `ApplicationDetailDrawer.tsx`

**Files:**
- Create: `src/components/admin/ApplicationDetailDrawer.tsx`

**Interfaces:**
- Consumes: `Application`, `ApplicationStatus`, `updateApplication`, `deleteApplication` from `@/lib/adminApi` (Task 5).
- Produces: `ApplicationDetailDrawer({application, token, onClose, onUpdated, onDeleted})`. Consumed by Task 10.

- [ ] **Step 1: Write `src/components/admin/ApplicationDetailDrawer.tsx`**

```tsx
// src/components/admin/ApplicationDetailDrawer.tsx
import { useState } from "react";
import { deleteApplication, updateApplication, type Application, type ApplicationStatus } from "@/lib/adminApi";

const STATUSES: ApplicationStatus[] = ["New", "Reviewing", "Shortlisted", "Rejected", "Hired"];

const FIELD_LABELS: [keyof Application, string][] = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["roleTitle", "Role"],
  ["resumeFileName", "Resume file"],
  ["pageUrl", "Page URL"],
  ["referrer", "Referrer"],
  ["device", "Device"],
  ["browser", "Browser"],
  ["userAgent", "User agent"],
  ["createdAt", "Applied"],
  ["updatedAt", "Updated"],
];

const EDITABLE_FIELDS: (keyof Application)[] = ["name", "phone", "email", "roleTitle"];

export function ApplicationDetailDrawer({
  application,
  token,
  onClose,
  onUpdated,
  onDeleted,
}: {
  application: Application;
  token: string;
  onClose: () => void;
  onUpdated: (application: Application) => void;
  onDeleted: (submissionId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Application>(application);
  const [notes, setNotes] = useState(application.notes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveUpdates(updates: Partial<Application>): Promise<boolean> {
    setSaving(true);
    setError(null);
    const result = await updateApplication(token, application.submissionId, updates);
    setSaving(false);
    if (result.ok) {
      onUpdated({ ...application, ...updates });
    } else {
      setError("Save failed — try again");
    }
    return result.ok;
  }

  async function handleStatusChange(status: ApplicationStatus) {
    await saveUpdates({ status });
  }

  async function handleNotesBlur() {
    if (notes !== application.notes) await saveUpdates({ notes });
  }

  async function handleEditSave() {
    const updates: Partial<Application> = {};
    EDITABLE_FIELDS.forEach((key) => {
      if (draft[key] !== application[key]) (updates as Record<string, unknown>)[key] = draft[key];
    });
    const ok = await saveUpdates(updates);
    if (ok) setEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete application from "${application.name}"? This cannot be undone.`)) return;
    setSaving(true);
    const result = await deleteApplication(token, application.submissionId);
    setSaving(false);
    if (result.ok) {
      onDeleted(application.submissionId);
      onClose();
    } else {
      setError("Delete failed — try again");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto overscroll-contain bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-800">{application.name}</h2>
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-navy-800">
            Close
          </button>
        </div>

        {application.resumeUrl && (
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-block rounded bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-500"
          >
            Open resume
          </a>
        )}

        <label className="mb-1 block text-sm font-semibold text-navy-800">Status</label>
        <select
          value={application.status}
          onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
          disabled={saving}
          className="mb-4 w-full rounded border border-line-200 px-3 py-2 text-sm text-navy-800"
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
          className="mb-4 w-full rounded border border-line-200 px-3 py-2 text-sm text-navy-800 placeholder:text-slate-400"
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
                  className="w-40 rounded border border-line-200 px-2 py-1 text-right text-navy-800"
                />
              ) : (
                <dd className="text-right font-medium text-navy-800 break-all">{String(application[key] || "—")}</dd>
              )}
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
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
                  setDraft(application);
                  setEditing(false);
                }}
                className="flex-1 rounded border border-line-200 py-2 text-sm font-semibold text-navy-800"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 rounded border border-line-200 py-2 text-sm font-semibold text-navy-800"
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

- [ ] **Step 2: Typecheck**

Run: `cd "c:\Users\New User\Documents\mep\Meptra-soft-website" && npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/ApplicationDetailDrawer.tsx
git commit -m "feat: add ApplicationDetailDrawer admin component"
```

---

### Task 10: Frontend — two-tab switcher in `AdminDashboard.tsx`

**Files:**
- Modify: `src/components/admin/AdminDashboard.tsx`

**Interfaces:**
- Consumes: `listApplications`, `deleteApplication`, `Application`, `ApplicationStatus` from `@/lib/adminApi` (Task 5); `ApplicationTable` (Task 8); `ApplicationDetailDrawer` (Task 9); `exportApplicationsToCsv`, `exportApplicationsToExcel` (Task 7).

- [ ] **Step 1: Replace the full contents of `src/components/admin/AdminDashboard.tsx`**

```tsx
// src/components/admin/AdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { deleteLead, listLeads, type Lead, type LeadStatus } from "@/lib/adminApi";
import { deleteApplication, listApplications, type Application, type ApplicationStatus } from "@/lib/adminApi";
import { StatsBar } from "@/components/admin/StatsBar";
import { LeadTable } from "@/components/admin/LeadTable";
import { LeadDetailDrawer } from "@/components/admin/LeadDetailDrawer";
import { ApplicationTable } from "@/components/admin/ApplicationTable";
import { ApplicationDetailDrawer } from "@/components/admin/ApplicationDetailDrawer";
import { exportLeadsToCsv, exportLeadsToExcel } from "@/lib/exportLeads";
import { exportApplicationsToCsv, exportApplicationsToExcel } from "@/lib/exportApplications";

const PAGE_SIZE = 20;
const STATUS_FILTERS: (LeadStatus | "All")[] = ["All", "New", "Contacted", "Follow-up", "Closed", "Converted"];
const APPLICATION_STATUS_FILTERS: (ApplicationStatus | "All")[] = ["All", "New", "Reviewing", "Shortlisted", "Rejected", "Hired"];

function LeadsPanel({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleTableWhatsApp(copied: boolean) {
    setToast(copied ? "Summary copied — paste it into WhatsApp" : "Couldn't copy automatically — copy it manually");
    setTimeout(() => setToast(null), 4000);
  }

  async function handleDelete(submissionId: string): Promise<boolean> {
    const result = await deleteLead(token, submissionId);
    if (result.ok) {
      setLeads((prev) => prev.filter((l) => l.submissionId !== submissionId));
      setToast("Lead deleted from Firebase & Google Sheets");
      setTimeout(() => setToast(null), 4000);
      return true;
    } else {
      setToast("Delete failed — try again");
      setTimeout(() => setToast(null), 4000);
      return false;
    }
  }

  async function load() {
    setLoading(true);
    const result = await listLeads(token);
    if (result.ok && result.leads) {
      setLeads([...result.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } else {
      onLogout();
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
    <>
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
          className="w-full rounded border border-line-200 px-3 py-2 text-sm text-navy-800 placeholder:text-slate-400 sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number]);
            setPage(1);
          }}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm text-navy-800 sm:flex-none"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={load}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Refresh
        </button>
        <button
          onClick={() => exportLeadsToCsv(filtered)}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Export CSV
        </button>
        <button
          onClick={() => exportLeadsToExcel(filtered)}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Export Excel
        </button>
      </div>

      {toast && (
        <div className="mb-4 rounded bg-navy-800 px-3 py-2 text-center text-xs font-medium text-white">{toast}</div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="rounded-lg border border-line-200 bg-white p-4">
          <p className="mb-2 text-xs text-slate-500 sm:hidden">Swipe the table left/right to see all columns →</p>
          <div className="overflow-x-auto">
            <LeadTable leads={pageItems} onSelect={setSelected} onWhatsApp={handleTableWhatsApp} onDelete={handleDelete} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-slate-600">
              Page {page} of {totalPages} ({filtered.length} leads)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-line-200 px-3 py-1 text-navy-800 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-line-200 px-3 py-1 text-navy-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
}

function ApplicationsPanel({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof APPLICATION_STATUS_FILTERS)[number]>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Application | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function handleDelete(submissionId: string): Promise<boolean> {
    const result = await deleteApplication(token, submissionId);
    if (result.ok) {
      setApplications((prev) => prev.filter((a) => a.submissionId !== submissionId));
      setToast("Application deleted from Firebase & Google Sheets");
      setTimeout(() => setToast(null), 4000);
      return true;
    } else {
      setToast("Delete failed — try again");
      setTimeout(() => setToast(null), 4000);
      return false;
    }
  }

  async function load() {
    setLoading(true);
    const result = await listApplications(token);
    if (result.ok && result.applications) {
      setApplications([...result.applications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } else {
      onLogout();
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [token]);

  const filtered = useMemo(() => {
    return applications.filter((application) => {
      if (statusFilter !== "All" && application.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        application.name.toLowerCase().includes(q) ||
        application.phone.includes(q) ||
        application.email.toLowerCase().includes(q) ||
        application.roleTitle.toLowerCase().includes(q)
      );
    });
  }, [applications, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name, phone, email, role..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full rounded border border-line-200 px-3 py-2 text-sm text-navy-800 placeholder:text-slate-400 sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as (typeof APPLICATION_STATUS_FILTERS)[number]);
            setPage(1);
          }}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm text-navy-800 sm:flex-none"
        >
          {APPLICATION_STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={load}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Refresh
        </button>
        <button
          onClick={() => exportApplicationsToCsv(filtered)}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Export CSV
        </button>
        <button
          onClick={() => exportApplicationsToExcel(filtered)}
          className="flex-1 rounded border border-line-200 px-3 py-2 text-sm font-semibold text-navy-800 sm:flex-none"
        >
          Export Excel
        </button>
      </div>

      {toast && (
        <div className="mb-4 rounded bg-navy-800 px-3 py-2 text-center text-xs font-medium text-white">{toast}</div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="rounded-lg border border-line-200 bg-white p-4">
          <p className="mb-2 text-xs text-slate-500 sm:hidden">Swipe the table left/right to see all columns →</p>
          <div className="overflow-x-auto">
            <ApplicationTable applications={pageItems} onSelect={setSelected} onDelete={handleDelete} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-slate-600">
              Page {page} of {totalPages} ({filtered.length} applications)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-line-200 px-3 py-1 text-navy-800 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-line-200 px-3 py-1 text-navy-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <ApplicationDetailDrawer
          application={selected}
          token={token}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setApplications((prev) => prev.map((a) => (a.submissionId === updated.submissionId ? updated : a)));
            setSelected(updated);
          }}
          onDeleted={(submissionId) => {
            setApplications((prev) => prev.filter((a) => a.submissionId !== submissionId));
          }}
        />
      )}
    </>
  );
}

export function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"leads" | "applications">("leads");

  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-50 p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("leads")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tab === "leads" ? "bg-navy-800 text-white" : "text-navy-800 hover:bg-navy-800/10"}`}
          >
            Leads
          </button>
          <button
            onClick={() => setTab("applications")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tab === "applications" ? "bg-navy-800 text-white" : "text-navy-800 hover:bg-navy-800/10"}`}
          >
            Applications
          </button>
        </div>
        <button onClick={onLogout} className="text-sm font-semibold text-slate-500 hover:text-navy-800">
          Log out
        </button>
      </div>

      {tab === "leads" ? (
        <LeadsPanel token={token} onLogout={onLogout} />
      ) : (
        <ApplicationsPanel token={token} onLogout={onLogout} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint + build**

Run: `cd "c:\Users\New User\Documents\mep\Meptra-soft-website" && npx tsc -b --noEmit && npm run lint && npm run build`
Expected: all three succeed with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/AdminDashboard.tsx
git commit -m "feat: add Applications tab to admin dashboard alongside Leads"
```

---

### Task 11: Manual end-to-end verification pass

**Files:** none (verification only).

- [ ] **Step 1: Run the full frontend check suite**

Run: `cd "c:\Users\New User\Documents\mep\Meptra-soft-website" && npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 2: Manual UI smoke test (dev server)**

Run: `cd "c:\Users\New User\Documents\mep\Meptra-soft-website" && npm run dev`
- Open `/careers`, click "Apply" on any role.
- Fill name/phone/email, attach a small PDF, submit.
- Confirm the success screen ("Application received" or "Saved on this device" if `VITE_LEADS_ENDPOINT` isn't set in your local `.env").
- Try submitting with no resume attached — confirm the "Resume is required" error shows and the form does not submit.
- Try attaching a file over 5MB or a `.txt` file — confirm the client-side error shows.

- [ ] **Step 3: Flag what still needs the site owner**

State clearly to the user (this is not something the coding agent can complete): the Apps Script project must be redeployed with the updated `.gs` files, the `FB_STORAGE_BUCKET` script property must be set per `server/apps-script/SETUP.md`, and the service account must be granted Storage Object Admin on that bucket — per the spec's Testing/Verification section, a real end-to-end submission (resume lands in bucket, doc in Firestore, row in the new "Applications" sheet tab, email + Telegram fire, admin dashboard's Applications tab shows it) should be done once by the site owner after that deployment, before considering this feature live-verified.

- [ ] **Step 4: Final commit (if any smoke-test fixes were needed)**

If Step 2 surfaced any bugs, fix them in the relevant task's file, re-run Step 1, then:
```bash
git add -A
git commit -m "fix: address issues found in career-applications smoke test"
```
