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

## 4. Resume storage (Google Drive)

No manual setup needed. On the first resume upload, the script finds a folder
named **`Meptrasoft_resumes_careers`** in the Drive of the "Execute as: Me"
account (step 5) — creating it if it doesn't exist yet — and stores every
resume there, nothing else. The first run will prompt that account to
authorize the Drive scope; approve it.

## 5. Deploy
Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → Deploy.
Copy the `/exec` URL — this is `VITE_LEADS_ENDPOINT` for the React app's `.env`.

## 6. Redeploying after code changes
Existing deployments don't pick up new code automatically. After editing any `.gs` file:
Deploy → Manage deployments → pick the deployment → Edit (pencil) → Version: New version → Deploy.
