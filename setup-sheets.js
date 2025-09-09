#!/usr/bin/env node
/**
 * Setup script to initialize Google Sheets with proper structure
 * Run with: node setup-sheets.js
 */

import 'dotenv/config';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { weddingGuestList } from './src/lib/services/guestList.js';

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;

async function setupSheets() {
  try {
    console.log('🔧 Setting up Google Sheets...\n');

    // Validate environment variables
    if (!GOOGLE_SHEET_ID || !GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) {
      throw new Error('Missing required environment variables: GOOGLE_SHEET_ID, GOOGLE_PRIVATE_KEY, or GOOGLE_CLIENT_EMAIL');
    }

    // Create JWT auth
    const serviceAccountAuth = new JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    console.log(`📊 Connected to spreadsheet: "${doc.title}"`);
    console.log(`🔗 URL: https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit\n`);

    // Setup RSVPs Sheet
    await setupRSVPsSheet(doc);

    // Setup Invites Sheet  
    await setupInvitesSheet(doc);

    console.log('\n✅ Google Sheets setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • RSVPs sheet: Ready for RSVP submissions`);
    console.log(`   • Invites sheet: ${weddingGuestList.length} guests loaded`);
    console.log('\n🎯 Next steps:');
    console.log('   1. Open the spreadsheet in Google Sheets');
    console.log('   2. Apply conditional formatting to highlight RSVP statuses');
    console.log('   3. Test the RSVP form to ensure everything works');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

async function setupRSVPsSheet(doc) {
  console.log('📝 Setting up RSVPs sheet...');

  // Check if RSVPs sheet exists
  let rsvpSheet = doc.sheetsByTitle['RSVPs'];
  
  if (rsvpSheet) {
    console.log('   ℹ️ RSVPs sheet already exists, skipping...');
    return;
  }

  // Create RSVPs sheet
  rsvpSheet = await doc.addSheet({
    title: 'RSVPs',
    headerValues: [
      'Timestamp',
      'Primary Name', 
      'Email',
      'Attendee Names',
      'Total Attendance Count',
      'Has Children',
      'Children Names',
      'Dietary Restrictions',
      'Favorite Coffee',
      'Favorite Song',
      'Special Message'
    ]
  });

  // Format the header row
  await rsvpSheet.loadCells('A1:K1');
  const headerRange = rsvpSheet.getCellsInRange('A1:K1')[0];
  headerRange.forEach(cell => {
    cell.textFormat = { bold: true };
    cell.backgroundColor = { red: 0.85, green: 0.85, blue: 0.85 };
  });
  await rsvpSheet.saveUpdatedCells();

  console.log('   ✅ RSVPs sheet created with headers');
}

async function setupInvitesSheet(doc) {
  console.log('📝 Setting up Invites sheet...');

  // Check if Invites sheet exists
  let invitesSheet = doc.sheetsByTitle['Invites'];
  
  if (invitesSheet) {
    console.log('   ℹ️ Invites sheet already exists, clearing and repopulating...');
    await invitesSheet.clear();
  } else {
    invitesSheet = await doc.addSheet({ title: 'Invites' });
  }

  // Set headers
  await invitesSheet.setHeaderRow([
    'Name',
    'Category', 
    'Address',
    'Notes',
    'Invite Sent',
    'RSVP Status'
  ]);

  // Add all guests
  const guestRows = weddingGuestList.map(guest => ({
    Name: guest.name,
    Category: guest.category,
    Address: guest.address || '',
    Notes: guest.notes || '',
    'Invite Sent': guest.inviteSent,
    'RSVP Status': 'Pending'
  }));

  await invitesSheet.addRows(guestRows);

  // Format the sheet
  await invitesSheet.loadCells(`A1:F${weddingGuestList.length + 1}`);
  
  // Format header row
  const headerRange = invitesSheet.getCellsInRange('A1:F1')[0];
  headerRange.forEach(cell => {
    cell.textFormat = { bold: true };
    cell.backgroundColor = { red: 0.85, green: 0.85, blue: 0.85 };
  });

  // Apply conditional formatting for RSVP Status
  // This will need to be done manually in Google Sheets UI for now
  await invitesSheet.saveUpdatedCells();

  console.log(`   ✅ Invites sheet created with ${weddingGuestList.length} guests`);
  console.log('   📝 Manual step: Add conditional formatting in Google Sheets:');
  console.log('      • Green background for "Confirmed" RSVP Status');  
  console.log('      • Light pink background for "Pending" RSVP Status');
}

// Run the setup
setupSheets();
