import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TOKEN_PATH = path.resolve(__dirname, 'tokens.json');

const clientId = process.env.GBP_CLIENT_ID;
const clientSecret = process.env.GBP_CLIENT_SECRET;
const redirectUri = process.env.GBP_REDIRECT_URI || 'http://localhost:3000/oauth2callback';
const parsedUri = new url.URL(redirectUri);
const PORT = parseInt(parsedUri.port || '3000', 10);

if (!clientId || !clientSecret) {
  console.error('\n❌ ERROR: GBP_CLIENT_ID and GBP_CLIENT_SECRET are required in your .env file!');
  console.error('Please create/update your .env file with:');
  console.error('  GBP_CLIENT_ID="your-google-client-id"');
  console.error('  GBP_CLIENT_SECRET="your-google-client-secret"\n');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const SCOPES = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/business.manage',
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('\n======================================================');
console.log('  GOOGLE BUSINESS PROFILE MCP - OAUTH AUTHENTICATION  ');
console.log('======================================================\n');
console.log('Please open the following authorization URL in your web browser:\n');
console.log(`\x1b[36m${authUrl}\x1b[0m\n`);
console.log('Listening on http://localhost:3000/oauth2callback for authorization code...\n');

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = url.parse(req.url, true);
    if (reqUrl.pathname === '/oauth2callback') {
      const code = reqUrl.query.code;
      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Authentication Successful!</h1><p>You can close this tab now and return to the terminal.</p>');

        const { tokens } = await oauth2Client.getToken(code);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

        console.log('✅ OAuth tokens successfully saved to:', TOKEN_PATH);
        console.log('Refresh token obtained:', tokens.refresh_token ? 'YES' : 'NO');
        console.log('\nYour Google Business Profile MCP Server is now fully authenticated and ready!\n');

        server.close();
        process.exit(0);
      }
    }
  } catch (err) {
    console.error('Error during OAuth callback:', err.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error during authentication.');
  }
});

server.listen(PORT);
