# Career Applications Pipeline — Design

**Date:** 2026-07-08
**Project:** Meptrasoft AI Technologies marketing site (React 18 + TS + Vite + Tailwind v4, no backend)
**Status:** Approved architecture, pending spec review
**Builds on:** [2026-07-06-lead-management-system-design.md](./2026-07-06-lead-management-system-design.md) — same Apps Script web app, same admin dashboard shell.

## Goal

Give the Careers page a real submission pipeline identical in spirit to the Contact
page's LeadForm: applicant fills a form (incl. resume upload), it lands durably in
Firestore + a Sheet mirror, the resume file lands in Cloud Storage, the team is
notified by email + Telegram, and the admin gets a second dashboard tab
("Applications") to view/edit/delete applicants — same free-tier, no-server
architecture as leads. No WhatsApp/mailto deep-link workaround — this replaces that
entirely, same UX shape as `LeadForm` (submit → success screen → edit/submit another).

## Architecture

Reuses the **same single Apps Script web app** as the lead pipeline — one endpoint,
one set of Script Properties, one admin session. Adds a new `applications`
Firestore collection, a new "Applications" Sheet tab, and a Cloud Storage bucket for
resume files, all inside the same Firebase/GCP project already backing Firestore
(a Firebase project ships a default GCS bucket, typically `<project-id>.appspot.com`
— no new project needed, just grant the existing service account Storage access).

```
Public site (browser)
  ApplyModal ──POST(JSON, resume as base64)──▶ Apps Script Web App
                              ├─ Cloud Storage (resume upload)   — resumes/{submissionId}-{filename}
                              ├─ Firestore (REST write)          — collection "applications"
                              ├─ Google Sheet "Applications" tab — appendRow mirror
                              ├─ Gmail (MailApp.sendEmail)        — same NOTIFY_EMAIL as leads
                              └─ Telegram sendMessage             — same TG_CHAT_ID as leads

Admin dashboard (browser, /admin)
  Tabs: [ Leads | Applications ]
  Applications tab:
    list/search/filter        ──GET──▶  Apps Script (reads Firestore "applications")
    status · notes · edit · delete ──POST──▶ Apps Script (writes Firestore + Sheet + deletes bucket object)
    resume link                — opens the Cloud Storage public URL in a new tab
    export CSV                 — built client-side from fetched rows (reuses exportLeads pattern)
```

### Why this approach
- **One backend to operate.** Same Apps Script deployment, same secrets, same admin login — no second system to maintain.
- **Resume storage matches the existing trust model.** Like Firestore, the bucket is written only by the service account from server-side code; the browser never holds storage credentials. No new npm dependency (no `firebase` client SDK).
- **Consistent applicant UX.** Submit → durable record → success screen, same as the Contact form — no more manual "attach your resume and hit send" step.

### Trust boundary / known limits (accepted)
- Resume upload rides the same unauthenticated-by-design POST endpoint as leads; abuse mitigation is server-side file-size/type validation, same as leads' field validation. No CAPTCHA.
- Resume objects are stored with public-read ACL on that one object (not the whole bucket) so the admin dashboard can link straight to the file without a signing step. Object names are unguessable (`{submissionId}-{filename}`, submissionId is a UUID), so this is "unlisted," not access-controlled — acceptable for resumes, which applicants send you anyway.
- Offline retry queue (localStorage) includes the base64 resume blob. A queued application can be up to ~7MB (5MB file → ~6.7MB base64) sitting in localStorage until connectivity returns. Fine for the occasional retry; not designed for many queued applications at once.

## Data Model

New Firestore collection `applications`, mirrored as rows in a new "Applications" Sheet tab.

| Field | Source | Notes |
|---|---|---|
| `submissionId` | generated | `crypto.randomUUID()` client-side, dedupe key, also used in the resume object name |
| `createdAt` | server | Apps Script `new Date().toISOString()` |
| `updatedAt` | server | set on every admin edit |
| `name` | form | required |
| `phone` | form | required, validated (reuses `isValidPhone` from leads) |
| `email` | form | required, validated |
| `roleTitle` | form | preset from the card the applicant clicked "Apply" on |
| `resumeUrl` | server | Cloud Storage public URL, set after upload succeeds |
| `resumeFileName` | form | original filename, for display |
| `status` | admin | enum: New / Reviewing / Shortlisted / Rejected / Hired (mirrors lead status shape) |
| `notes` | admin | free text |
| `pageUrl` / `referrer` / `userAgent` / `device` / `browser` | client | same telemetry fields as leads, via existing `parseDevice` helper |

`APPLICATION_COLUMNS` (Apps Script, mirrors `LEAD_COLUMNS`): `['submissionId', 'createdAt', 'name', 'phone', 'email', 'roleTitle', 'resumeUrl', 'resumeFileName', 'pageUrl', 'referrer', 'userAgent', 'device', 'browser', 'status', 'notes', 'updatedAt']` — defines both the Sheet header row and per-row value order.

## Frontend

- **`src/lib/applications.ts`** (new, mirrors `src/lib/leads.ts`):
  - `buildApplicationPayload(fields, submissionId)` — attaches telemetry, same shape as `buildLeadPayload`.
  - `fileToBase64(file)` — `FileReader.readAsDataURL()`, strips the `data:...;base64,` prefix.
  - `submitApplication(payload)` — POSTs `{action:"apply", application: payload}` as `text/plain` (same CORS-avoidance trick as `postLead`). On failure, enqueues into a new `localStorage["meptrasoft_application_queue"]` key.
  - `flushQueuedApplications()` — retried on `ApplyModal` mount, same pattern as `flushQueuedLeads`.
- **`src/components/ui/ApplyModal.tsx`** (rewritten): fields name, phone, email, resume file (`accept=".pdf,.doc,.docx"`, client-validated ≤5MB and MIME/extension check before encoding). Removes all `wa.me`/`mailto:` code. States: idle → submitting → submitted/queued, mirroring `LeadForm`'s `<dl>` summary + "Submit another" / "Edit details" actions.
- **`src/lib/adminApi.ts`** (extended): `listApplications`, `updateApplication`, `deleteApplication` — same token/session, new Apps Script actions `list_apps`/`update_app`/`delete_app`. New `Application` interface.

## Admin Dashboard

- `AdminDashboard.tsx` gains a two-tab switcher: **Leads** / **Applications** (mirrors the existing single-list layout, just tab-scoped state + fetch call).
- **`ApplicationTable.tsx`** (new, mirrors `LeadTable.tsx`): columns name, role, phone, email, resume (link), status, appliedAt. Row actions: View, Delete.
- **`ApplicationDetailDrawer.tsx`** (new, mirrors `LeadDetailDrawer.tsx`): editable fields (name, phone, email, roleTitle), status dropdown, notes (blur-save), resume link opens in new tab, Delete (confirms, then removes Firestore doc + Sheet row + Storage object). Accepted limitation: no resume re-upload from the admin drawer — if a corrected resume is needed, delete and have the applicant reapply. Matches leads, which also have no re-upload-style field.
- CSV export button reuses the `exportLeads.ts` pattern (new `exportApplicationsToCsv`), including the same CSV-injection sanitization.

## Backend (Apps Script, `server/apps-script/`)

- **`Storage.gs`** (new): `uploadResumeToBucket(base64, filename, mimeType, submissionId)` — gets an OAuth token via the existing `FirestoreAuth.gs` flow, extended to also request scope `https://www.googleapis.com/auth/devstorage.read_write`. PUTs to `https://storage.googleapis.com/upload/storage/v1/b/{FB_STORAGE_BUCKET}/o?uploadType=media&name=resumes/{submissionId}-{filename}`, then sets that one object's ACL to public-read via the Storage JSON API, and returns its public URL (`https://storage.googleapis.com/{bucket}/resumes/...`).
- **`Code.gs`**: new `action:"apply"` in `doPost` — validates fields + resume size/type server-side. **Idempotency (mirrors `handleSubmit`'s lead dedupe):** first `firestoreGetDoc('applications', submissionId)` — if it already exists, skip re-upload/re-create entirely and return `{ok:true}` immediately (handles offline-queue retries and double-clicks without duplicating the resume or the doc). Only if no existing doc: calls `uploadResumeToBucket`, then `firestoreCreateDoc('applications', submissionId, record)`. **Orphan cleanup:** if `firestoreCreateDoc` throws after the upload succeeded, best-effort `deleteResumeFromBucket` before returning the error, so a client retry (same submissionId) starts clean instead of leaking an unreferenced resume. Only after the Firestore write succeeds: append the Sheet row and fire notify — both best-effort (log and continue, don't fail the response), same as leads. New `doGet` action `list_apps` (token-gated, mirrors `list`). New `doPost` actions `update_app` / `delete_app`.
  - **`delete_app` order (mirrors `handleDelete`):** 1) `firestoreDeleteDoc('applications', submissionId)` — if this fails, abort and return an error, nothing else runs. 2) Best-effort `deleteApplicationFromSheet(submissionId)` — log and continue on failure. 3) Best-effort `deleteResumeFromBucket(resumeUrl)` — log and continue on failure (an orphaned resume object with no doc is a low-cost leak, not worth failing the delete over).
- **`Notify.gs`**: `sendApplicationEmail(application)` / `sendApplicationTelegram(application)` — same `NOTIFY_EMAIL`/`TG_CHAT_ID` script properties as leads, different message template (name, role, phone, email, resume link).
- **New Script Property:** `FB_STORAGE_BUCKET` — the bucket name (you'll set this after confirming/creating the bucket in the Firebase/GCP console and granting the existing service account the **Storage Object Admin** role on it).

## Error Handling

- Client: required-field + phone/email format validation before submit (reuses existing validators where possible); resume type/size checked before base64 encoding even starts (fail fast, no wasted encode on a 40MB file).
- Server: re-validates resume size/type as a backstop (never trust the client); if the Storage upload fails, the whole `apply` action fails (no orphaned Firestore doc without a resume) and the client falls back to the offline queue for retry.
- Offline queue: identical retry-on-mount pattern to leads, scoped to its own localStorage key so a stuck application never blocks the lead queue or vice versa.

## Dependency Check

No new npm packages. `FileReader`/base64 encoding is browser-native (used only in
`ApplyModal.tsx`), no Firebase client SDK, no polyfills needed for the `es2020`
Vite build target. Backend adds no new Apps Script libraries — `Storage.gs` uses
the same `UrlFetchApp` + OAuth-token pattern already used by `Firestore.gs`.

## Testing / Verification

- Frontend: `npm run build`, `npm run lint`, `npx tsc -b --noEmit` must all pass.
- Manual UI pass (dev server): submit a real small PDF through the Apply modal, confirm success screen, confirm offline-queue path by throttling network.
- **Cannot be verified from this repo alone:** the Apps Script deployment and GCS bucket/service-account grant are external, manual steps (per `server/apps-script/SETUP.md` conventions) — after deploying the updated script and setting `FB_STORAGE_BUCKET`, a real end-to-end submission (resume lands in bucket, doc in Firestore, row in Sheet, email + Telegram fire, admin dashboard shows it) needs to be done once by the site owner before this is considered live-verified.
