import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TOKEN_PATH = path.resolve(__dirname, 'tokens.json');

async function debugGbpApiCall() {
  const clientId = process.env.GBP_CLIENT_ID;
  const clientSecret = process.env.GBP_CLIENT_SECRET;

  if (!fs.existsSync(TOKEN_PATH)) {
    console.error('❌ Error: tokens.json missing.');
    process.exit(1);
  }

  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost:3000/oauth2callback');
  oauth2Client.setCredentials(tokens);

  const endpoint = 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts';

  console.log('==================================================');
  console.log('  GOOGLE BUSINESS PROFILE API - DIAGNOSTIC EXECUTION');
  console.log('==================================================\n');
  console.log('HTTP REQUEST METHOD: GET');
  console.log('EXACT TARGET ENDPOINT:', endpoint);

  // Obtain current access token
  const accessTokenRes = await oauth2Client.getAccessToken();
  const accessToken = accessTokenRes.token;

  console.log('AUTHORIZATION HEADER:', `Bearer ${accessToken ? accessToken.substring(0, 15) + '...' : 'MISSING'}`);
  console.log('\n---------------- Sending Request ----------------\n');

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    console.log('HTTP STATUS CODE:', response.status, response.statusText);
    console.log('\nRESPONSE HEADERS:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    const textBody = await response.text();
    console.log('\nRESPONSE BODY (JSON):');
    try {
      const jsonBody = JSON.parse(textBody);
      console.log(JSON.stringify(jsonBody, null, 2));
    } catch {
      console.log(textBody);
    }
  } catch (err) {
    console.error('FETCH ERROR:', err.message);
  }
}

debugGbpApiCall();
