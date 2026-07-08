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
| `RESUME_DRIVE_FOLDER_ID` | Google Drive folder id for resume uploads (see Resume storage setup below) |

## 4. Resume storage (Google Drive)

1. In Google Drive, create a folder to hold applicant resumes (e.g. "Meptrasoft Resumes").
2. Open the folder and copy its id from the URL: `https://drive.google.com/drive/folders/`**`<FOLDER_ID>`**.
3. In the Apps Script project, add a new Script Property: `RESUME_DRIVE_FOLDER_ID` = that folder id.
4. The script uploads/deletes files as the Apps Script project's own authorized user (the "Execute as: Me" account from step 5) — no service account or extra IAM grant is needed. The first deployment/run will prompt that account to authorize the Drive scope; approve it.

## 5. Deploy
Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → Deploy.
Copy the `/exec` URL — this is `VITE_LEADS_ENDPOINT` for the React app's `.env`.

## 6. Redeploying after code changes
Existing deployments don't pick up new code automatically. After editing any `.gs` file:
Deploy → Manage deployments → pick the deployment → Edit (pencil) → Version: New version → Deploy.
