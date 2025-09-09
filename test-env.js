#!/usr/bin/env node
/**
 * Test script to validate Google Sheets environment variables
 * Run with: node test-env.js
 */

import 'dotenv/config';

const requiredEnvVars = [
  'GOOGLE_SHEET_ID',
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'RESEND_API_KEY',
  'FROM_EMAIL'
];

console.log('🔧 Checking environment variables...\n');

let allSet = true;

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  if (!value) {
    console.log(`❌ ${envVar}: Not set`);
    allSet = false;
  } else if (envVar === 'GOOGLE_PRIVATE_KEY') {
    // Check if private key has proper format
    if (value.includes('BEGIN PRIVATE KEY') && value.includes('END PRIVATE KEY')) {
      console.log(`✅ ${envVar}: Set (${value.length} chars)`);
    } else {
      console.log(`⚠️  ${envVar}: Set but may not be properly formatted (${value.length} chars)`);
      console.log('   Expected format: "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');
    }
  } else if (envVar === 'GOOGLE_CLIENT_EMAIL') {
    // Check if email looks like service account email
    if (value.includes('@') && value.includes('.iam.gserviceaccount.com')) {
      console.log(`✅ ${envVar}: Set (${value})`);
    } else {
      console.log(`⚠️  ${envVar}: Set but doesn't look like service account email (${value})`);
    }
  } else {
    // For other variables, just show length for security
    console.log(`✅ ${envVar}: Set (${value.length} chars)`);
  }
}

if (allSet) {
  console.log('\n🎉 All required environment variables are set!');
  console.log('\nNext steps:');
  console.log('1. Make sure your Google Sheet is shared with the service account email');
  console.log('2. Test the RSVP form at /rsvp');
} else {
  console.log('\n❌ Some required environment variables are missing.');
  console.log('Please check your .env file and compare with .env.example');
}

console.log('\n📄 Don\'t forget to set these same variables in your DigitalOcean App Platform environment!');
