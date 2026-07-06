# Lead Management System — Design

**Date:** 2026-07-06
**Project:** Meptrasoft AI Technologies marketing site (React 18 + TS + Vite + Tailwind v4, no backend)
**Status:** Approved architecture, pending spec review

## Goal

Capture every LeadForm submission to a durable store, notify the team instantly on
multiple channels, and give the owner a private admin dashboard to manage leads —
all using free services, no server to operate.

## Architecture

A single **Google Apps Script web app** is the backend hub. It holds every secret
(Telegram bot token, admin password, Firestore access, Sheet id) in Script Properties,
so nothing sensitive ships in the browser bundle.

```
Public site (browser)
  LeadForm ──POST(JSON)──▶ Apps Script Web App  [holds ALL secrets]
                              ├─ Firestore (REST write)   — durable DB, source of truth
                              ├─ Google Sheet (appendRow) — live spreadsheet mirror
                              ├─ Gmail (MailApp.sendEmail) — parthasarathysankar03@gmail.com
                              └─ Telegram sendMessage      — owner chat/group

Admin dashboard (browser, /admin on same site)
  login (POST creds → Apps Script verifies → returns session token)
  list/search/filter/paginate/stats  ──GET──▶  Apps Script (reads Firestore)
  status · notes · edit · delete      ──POST──▶ Apps Script (writes Firestore + Sheet)
  export CSV/Excel   — built client-side from fetched rows
  WhatsApp button    — copies formatted summary to clipboard + opens wa.me/919345984804
```

### Why this approach
- **Secrets never reach the browser.** Token, password, Sheet id, Firestore creds live only in Apps Script Script Properties.
- **Firestore stays private.** Browser never gets DB credentials; all reads/writes proxy through Apps Script, so leads are never world-readable.
- **100% free, no billing card.** Apps Script, Firestore (Spark plan), Gmail, Telegram Bot API are all free tiers. Firebase Cloud Functions was rejected because it now requires the Blaze billing plan.

### Trust boundary / known limits (accepted)
- Apps Script web app is deployed "execute as me, anyone can access" so the public form can POST. The endpoint is unauthenticated by design; abuse mitigation is server-side validation + rate note (see Error Handling). No CAPTCHA per requirements.
- Admin auth is a shared username/password verified server-side, returning an opaque session token stored in `sessionStorage`. This is lightweight auth, adequate for a single-owner dashboard, not multi-user RBAC.

## Data Model

One lead document (Firestore collection `leads`, mirrored as one Sheet row).

| Field | Source | Notes |
|---|---|---|
| `submissionId` | generated | `crypto.randomUUID()` client-side, dedupe key |
| `createdAt` | server | Apps Script `new Date().toISOString()` |
| `name` | form | required |
| `phone` | form | required, validated |
| `interest` | form | enum |
| `preferredContact` | form | WhatsApp / Call |
| `whatsappNumber` | form | resolved (same-as-phone or explicit) |
| `college` | form | student interests only |
| `year` | form | student interests only |
| `location` | form | student interests only |
| `message` | form | optional |
| `pageUrl` | browser | `location.href` |
| `referrer` | browser | `document.referrer` |
| `userAgent` | browser | raw UA string |
| `device` | browser | parsed: mobile/tablet/desktop |
| `browser` | browser | parsed: name + version |
| `status` | system | `New` \| `Contacted` \| `Follow-up` \| `Closed` \| `Converted` |
| `notes` | admin | free text, default empty |
| `updatedAt` | server | set on any admin edit |

No field is dropped: all 10 current form fields captured, even when hidden (student
fields serialize as empty strings for non-student interests).

## Components

### 1. Client capture (`src/lib/leads.ts`)
- `buildLeadPayload(formValues)` — assembles the full record: form fields + `submissionId` + browser/device/UA parsing (`src/lib/device.ts`).
- `submitLead(payload)` — POSTs JSON to the Apps Script URL (URL from `import.meta.env.VITE_LEADS_ENDPOINT`). Uses `fetch` with `Content-Type: text/plain` to avoid a CORS preflight Apps Script can't answer. Returns `{ok}`; never blocks the success UI on channel failures.
- `LeadForm.tsx` `handleSubmit` calls `submitLead` (replaces the current CallMeBot fetch). Success UI unchanged. On network failure, the lead is queued to `localStorage` and retried on next load (best-effort, so a flaky network never silently loses a lead).

### 2. Apps Script backend (`server/apps-script/Code.gs` — committed for reference, deployed manually)
- `doPost(e)` — routes by `action`:
  - `submit` — validate → write Firestore (REST, service-account or Firebase Web API key + open-write-to-Apps-Script only) → append Sheet row → send Gmail → send Telegram. Each channel wrapped in try/catch; failures logged to a `_errors` sheet, never fail the submission.
  - `login` — verify username/password from Script Properties, return a random session token (kept in a short-lived cache).
  - `update` / `delete` — require valid token; mutate Firestore + Sheet.
- `doGet(e)` — `action=list` (token-gated): returns leads JSON for the dashboard, supports server-side paging params.
- Config via `PropertiesService.getScriptProperties()`: `TG_TOKEN`, `TG_CHAT_ID`, `ADMIN_USER`, `ADMIN_PASS`, `SHEET_ID`, `FB_PROJECT`, `FB_KEY`, `NOTIFY_EMAIL`.
- `SETUP.md` documents: create Sheet, create Telegram bot via @BotFather, get chat id, set Script Properties, deploy as web app, paste URL into site `.env`.

### 3. Admin dashboard (`src/pages/Admin.tsx` + `src/components/admin/*`)
- Route `/admin` added to `src/App.tsx` (lazy-loaded, not in public nav).
- `AdminLogin` — username/password form → stores session token in `sessionStorage`.
- `AdminDashboard`:
  - **Stats bar** — total, by-status counts, today/this-week (see dataviz skill for the stat tiles).
  - **Controls** — text search (name/phone/college), status filter, date filter, page size.
  - **Table** — paginated rows, status badge, quick status change.
  - **Detail drawer** — full record, editable notes, edit fields, delete (confirm).
  - **Export** — CSV always; Excel via a tiny client-side `.xls` HTML-table trick (no new heavy dep) or SheetJS if approved.
  - **WhatsApp** — per-lead button: copies formatted summary to clipboard (`navigator.clipboard.writeText`) and opens `https://wa.me/919345984804` in a new tab. Toast tells the user to paste into the "Leads-group".
- All data ops go through `src/lib/adminApi.ts` (wraps the Apps Script GET/POST with the token).

## Data Flow

1. User submits form → `buildLeadPayload` → `submitLead` POSTs to Apps Script.
2. Apps Script validates, writes Firestore + Sheet, fires Gmail + Telegram.
3. Owner opens `/admin`, logs in, dashboard GETs leads from Firestore via Apps Script.
4. Owner changes status / adds notes → POST update → Firestore + Sheet updated.
5. Owner clicks WhatsApp → summary copied, wa.me opens → paste into group.

## Error Handling
- **Client:** validation before submit (existing rules kept). Network failure → queue in `localStorage`, retry next load, show success anyway (lead not lost). Clipboard API failure → fallback `execCommand('copy')` + manual-copy textarea.
- **Server:** every external channel (Firestore/Sheet/Gmail/Telegram) in its own try/catch; a failure is logged to an `_errors` sheet with the payload so nothing is lost silently. `submit` returns 200 as long as at least the Sheet or Firestore write succeeds.
- **Auth:** invalid token → 401 JSON → dashboard clears token, returns to login.

## Testing
No test framework configured. Verification plan:
- `npx tsc -b --noEmit` and `npm run lint` clean.
- Manual: submit a lead in dev → confirm Sheet row, Firestore doc, email, Telegram message.
- Manual: `/admin` login, list, search/filter/paginate, status change, note, edit, delete, CSV export, WhatsApp copy.
- Device/UA parser unit-checked against a few sample UA strings inline.

## Build Phases (implementation order)
1. **Backend + capture** — Apps Script `submit` + Firestore + Sheet + email + Telegram; client `leads.ts`/`device.ts`; rewire `LeadForm`. (Deliverable: leads land everywhere + notify.)
2. **Dashboard read** — `/admin` route, login, list, stats, search/filter/paginate, detail view.
3. **Dashboard write** — status, notes, edit, delete.
4. **Export + WhatsApp** — CSV/Excel, one-click WhatsApp copy.

Each phase is independently shippable.

## Out of Scope (YAGNI)
- Multi-user roles / real IAM.
- CAPTCHA / bot defense beyond server validation (per requirements).
- Realtime dashboard updates (poll/refresh button is enough).
- Firebase Cloud Functions (billing plan required).
```

## Non-obvious decisions to note
- `text/plain` POST is deliberate — Apps Script web apps cannot respond to a CORS preflight, so an `application/json` content-type would fail from the browser. The body is still JSON, parsed with `JSON.parse(e.postData.contents)` server-side.
- Firestore is written from Apps Script via REST using the Firebase Web API key with security rules that deny all direct client access — only the server key path is used.
