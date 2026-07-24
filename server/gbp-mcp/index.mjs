import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TOKEN_PATH = path.resolve(__dirname, 'tokens.json');

// Initialize Google OAuth2 Client
function getOAuth2Client() {
  const clientId = process.env.GBP_CLIENT_ID;
  const clientSecret = process.env.GBP_CLIENT_SECRET;
  const redirectUri = process.env.GBP_REDIRECT_URI || 'http://localhost:3000/oauth2callback';

  if (!clientId || !clientSecret) {
    throw new Error('GBP_CLIENT_ID and GBP_CLIENT_SECRET must be set in .env or environment variables.');
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oauth2Client.setCredentials(tokens);
  } else if (process.env.GBP_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.GBP_REFRESH_TOKEN,
    });
  }

  return oauth2Client;
}

// Create MCP Server Instance
const server = new Server(
  {
    name: 'google-business-profile-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Available Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'gbp_list_accounts',
        description: 'List all Google Business Profile accounts accessible by the authenticated user.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'gbp_list_locations',
        description: 'List all business locations for a specific Google Business Profile account.',
        inputSchema: {
          type: 'object',
          properties: {
            accountName: {
              type: 'string',
              description: 'The account resource name (e.g., accounts/101567890123456789012)',
            },
          },
          required: ['accountName'],
        },
      },
      {
        name: 'gbp_upload_media',
        description: 'Upload a local image/screenshot to a Google Business Profile location media library.',
        inputSchema: {
          type: 'object',
          properties: {
            accountName: {
              type: 'string',
              description: 'The account resource name (e.g. accounts/123456)',
            },
            locationName: {
              type: 'string',
              description: 'The location resource name (e.g. locations/789012)',
            },
            filePath: {
              type: 'string',
              description: 'Absolute path to local screenshot file to upload (e.g. C:/.../gbp-photos-export/meptrasoft-ai-home-page-gbp-hero.png)',
            },
            category: {
              type: 'string',
              enum: ['COVER', 'PROFILE', 'LOGO', 'EXTERIOR', 'INTERIOR', 'PRODUCT', 'AT_WORK', 'TEAM', 'ADDITIONAL'],
              description: 'Category of the media item on GBP',
            },
          },
          required: ['accountName', 'locationName', 'filePath'],
        },
      },
      {
        name: 'gbp_list_media',
        description: 'List all uploaded media items (photos and videos) for a business location.',
        inputSchema: {
          type: 'object',
          properties: {
            accountName: { type: 'string' },
            locationName: { type: 'string' },
          },
          required: ['accountName', 'locationName'],
        },
      },
      {
        name: 'gbp_create_post',
        description: 'Create a local post / update / announcement on the Google Business Profile listing.',
        inputSchema: {
          type: 'object',
          properties: {
            accountName: { type: 'string' },
            locationName: { type: 'string' },
            summary: { type: 'string', description: 'Main text content of the update post' },
            actionUrl: { type: 'string', description: 'Optional CTA button destination link (e.g. https://www.meptrasoftai.in)' },
            actionType: { type: 'string', enum: ['LEARN_MORE', 'BOOK', 'ORDER', 'SHOP', 'SIGN_UP'], description: 'CTA button type' },
          },
          required: ['accountName', 'locationName', 'summary'],
        },
      },
    ],
  };
});

// Handle Tool Calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const auth = getOAuth2Client();

    if (name === 'gbp_list_accounts') {
      const mybusinessaccountmanagement = google.mybusinessaccountmanagement({ version: 'v1', auth });
      const res = await mybusinessaccountmanagement.accounts.list();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(res.data, null, 2),
          },
        ],
      };
    }

    if (name === 'gbp_list_locations') {
      const mybusinessbusinessinformation = google.mybusinessbusinessinformation({ version: 'v1', auth });
      const res = await mybusinessbusinessinformation.accounts.locations.list({
        parent: args.accountName,
        readMask: 'name,title,storefrontAddress,websiteUri,phoneNumbers,categories',
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(res.data, null, 2),
          },
        ],
      };
    }

    if (name === 'gbp_upload_media') {
      const { accountName, locationName, filePath, category = 'ADDITIONAL' } = args;
      if (!fs.existsSync(filePath)) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Error: File not found at path: ${filePath}` }],
        };
      }

      // Convert image to base64 or upload bytes via mybusiness v4 media.create endpoint
      const fileBytes = fs.readFileSync(filePath);
      const base64Data = fileBytes.toString('base64');

      const url = `https://mybusiness.googleapis.com/v4/${accountName}/${locationName}/media`;
      const res = await auth.request({
        url,
        method: 'POST',
        data: {
          mediaFormat: 'PHOTO',
          locationAssociation: { category },
          sourceUrl: '', // Or upload directly via binary bytes
          data: base64Data,
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: `Successfully uploaded screenshot ${path.basename(filePath)} to Google Business Profile!\nResponse: ${JSON.stringify(res.data, null, 2)}`,
          },
        ],
      };
    }

    if (name === 'gbp_list_media') {
      const { accountName, locationName } = args;
      const url = `https://mybusiness.googleapis.com/v4/${accountName}/${locationName}/media`;
      const res = await auth.request({ url, method: 'GET' });
      return {
        content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }],
      };
    }

    if (name === 'gbp_create_post') {
      const { accountName, locationName, summary, actionUrl, actionType = 'LEARN_MORE' } = args;
      const url = `https://mybusiness.googleapis.com/v4/${accountName}/${locationName}/localPosts`;
      const postBody = {
        languageCode: 'en-US',
        summary,
        topicType: 'STANDARD',
      };

      if (actionUrl) {
        postBody.actionType = actionType;
        postBody.callToAction = {
          actionType,
          url: actionUrl,
        };
      }

      const res = await auth.request({
        url,
        method: 'POST',
        data: postBody,
      });

      return {
        content: [
          {
            type: 'text',
            text: `Successfully created Google Business Profile post!\nResponse: ${JSON.stringify(res.data, null, 2)}`,
          },
        ],
      };
    }

    return {
      isError: true,
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
    };
  } catch (err) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Error executing ${name}: ${err.message}\n${err.stack || ''}`,
        },
      ],
    };
  }
});

// Start MCP Stdio Transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Google Business Profile MCP Server running on stdio');
}

main().catch((err) => {
  console.error('Fatal MCP Server error:', err);
  process.exit(1);
});
