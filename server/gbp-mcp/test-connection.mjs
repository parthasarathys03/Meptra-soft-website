import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TOKEN_PATH = path.resolve(__dirname, 'tokens.json');

async function testGBPConnection() {
  console.log('Testing Google Business Profile API Connection...\n');

  if (!fs.existsSync(TOKEN_PATH)) {
    console.error('❌ tokens.json not found!');
    process.exit(1);
  }

  const clientId = process.env.GBP_CLIENT_ID;
  const clientSecret = process.env.GBP_CLIENT_SECRET;
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost:3000/oauth2callback');
  oauth2Client.setCredentials(tokens);

  try {
    const mybusinessaccountmanagement = google.mybusinessaccountmanagement({ version: 'v1', auth: oauth2Client });
    const accountsRes = await mybusinessaccountmanagement.accounts.list();

    console.log('✅ Connected to Google Business Profile Account Management API!');
    console.log('Accounts Found:', JSON.stringify(accountsRes.data, null, 2));

    if (accountsRes.data.accounts && accountsRes.data.accounts.length > 0) {
      const accountName = accountsRes.data.accounts[0].name;
      console.log(`\nFetching locations for account ${accountName}...`);
      
      const mybusinessbusinessinformation = google.mybusinessbusinessinformation({ version: 'v1', auth: oauth2Client });
      const locationsRes = await mybusinessbusinessinformation.accounts.locations.list({
        parent: accountName,
        readMask: 'name,title,storefrontAddress,websiteUri,categories',
      });

      console.log('Locations Found:', JSON.stringify(locationsRes.data, null, 2));
    }
  } catch (err) {
    console.error('❌ API Test Error:', err.message);
    if (err.response && err.response.data) {
      console.error('Details:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

testGBPConnection();
