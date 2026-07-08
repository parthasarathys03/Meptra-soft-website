# Apps Script Backend Setup

One-time setup, done by the site owner (not part of the app build).

## 1. Create the Apps Script project
1. Go to https://script.google.com → New project.
2. Delete the default `Code.gs` content, paste in this repo's `FirestoreAuth.gs`, `Firestore.gs`, `Notify.gs`, `Storage.gs`, `Code.gs` (one file each, matching names).

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

## 4. Resume storage (Google Drive)

Resumes upload into a folder named **`Meptrasoft_resumes_careers`** in the Drive
of the "Execute as: Me" account (step 5) — the script finds it by name, creating
it on first use, and stores every resume there, nothing else.

**REQUIRED — authorize the Drive scope once (do this after step 5's deploy):**
A web app running from an external POST request never shows Google's OAuth
consent screen, so the Drive scope stays unauthorized and every upload fails
with `You do not have permission to perform that action` (visible in the
`_errors` sheet, context `resume_upload`). To grant it:

1. In the Apps Script editor, open `Storage.gs`.
2. In the function dropdown at the top, select **`authorizeDrive`** → click **Run**.
3. A consent dialog appears — approve the Google Drive permission for the
   "Execute as: Me" account.
4. The run's log should print `Drive authorized OK`. From now on the deployed
   web app inherits the grant and resume uploads work.

Re-run `authorizeDrive` any time the Drive scope changes or after switching the
owning account.

## 5. Deploy
Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → Deploy.
Copy the `/exec` URL — this is `VITE_LEADS_ENDPOINT` for the React app's `.env`.

Then complete the one-time Drive authorization in section 4.

## 6. Redeploying after code changes
Existing deployments don't pick up new code automatically. After editing any `.gs` file:
Deploy → Manage deployments → pick the deployment → Edit (pencil) → Version: New version → Deploy.
If the edit added a new Google service (e.g. first time `DriveApp` was added),
also re-run `authorizeDrive` (section 4) so the new scope is consented.
