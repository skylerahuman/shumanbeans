#!/usr/bin/env node
/**
 * Setup script to initialize Google Sheets with proper structure
 * Run with: node setup-sheets.js
 */

import 'dotenv/config';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Import guest list data directly
const weddingGuestList = [
  // Bridal Party - Bridesmaids
  { name: "Hannah Williams", category: "Bridal Party - Bridesmaids", inviteSent: true },
  { name: "Lydia Williams", category: "Bridal Party - Bridesmaids", inviteSent: true },
  { name: "Rachel Williams", category: "Bridal Party - Bridesmaids", inviteSent: true },
  { name: "Gates Foster", category: "Bridal Party - Bridesmaids", inviteSent: true },
  { name: "Kim Matson", category: "Bridal Party - Bridesmaids", inviteSent: true },
  { name: "Alexie Innman", category: "Bridal Party - Bridesmaids", inviteSent: true },
  { name: "Emma Madewell", category: "Bridal Party - Bridesmaids", inviteSent: true },
  { name: "Helene", category: "Bridal Party - Bridesmaids", inviteSent: true },
  { name: "Abby Shuman", category: "Bridal Party - Bridesmaids", inviteSent: true },

  // Bridal Party - Groomsmen
  { name: "Harrison Jump", category: "Bridal Party - Groomsmen", inviteSent: true },
  { name: "Jacob Hooker", category: "Bridal Party - Groomsmen", address: "2 Van Cleve St, Fort Oglethorpe 30742", inviteSent: true },
  { name: "Adam", category: "Bridal Party - Groomsmen", address: "301 Bayberry Dr, Algonquin IL 60102", inviteSent: true },
  { name: "Sam Slate", category: "Bridal Party - Groomsmen", inviteSent: true },
  { name: "Noah Huffman", category: "Bridal Party - Groomsmen", address: "7302 Noah Reid Rd, Chattanooga 37421", inviteSent: true },
  { name: "Chris Cox", category: "Bridal Party - Groomsmen", address: "125 Fox Run Cir N, Flintstone GA 30725", inviteSent: true },
  { name: "David Williams", category: "Bridal Party - Groomsmen", inviteSent: true },
  { name: "Richard Zolnik", category: "Bridal Party - Groomsmen", address: "24 Rock Haven Ln, Chickamauga, GA 30707", inviteSent: true },

  // Bridal Party Plus Ones
  { name: "Cameron", category: "Bridal Party Plus Ones", notes: "Abby's boyfriend", inviteSent: true },
  { name: "Jonah", category: "Bridal Party Plus Ones", inviteSent: true },
  { name: "Madison Hooker", category: "Bridal Party Plus Ones", inviteSent: true },
  { name: "Elianna", category: "Bridal Party Plus Ones", inviteSent: true },
  { name: "Anna Huffman", category: "Bridal Party Plus Ones", inviteSent: true },
  { name: "Mackenzie Cox", category: "Bridal Party Plus Ones", inviteSent: true },
  { name: "Brooke Zolnik", category: "Bridal Party Plus Ones", inviteSent: true },

  // Family
  { name: "Shae Williams", category: "Family", notes: "plus Hylan?", inviteSent: true },
  { name: "Joseph Williams", category: "Family", inviteSent: true },
  { name: "Sherri Williams", category: "Family", inviteSent: true },
  { name: "Buckshot Shuman", category: "Family", inviteSent: true },
  { name: "Deanna Shuman", category: "Family", address: "163 Fieldbrook Xing, Holly Springs GA 30115", inviteSent: true },

  // Extended Family
  { name: "Papa Williams", category: "Extended Family", inviteSent: true },
  { name: "Peggie Williams", category: "Extended Family", inviteSent: true },
  { name: "Arthur Williams", category: "Extended Family", inviteSent: true },
  { name: "Aunt Margie", category: "Extended Family", inviteSent: true },
  { name: "Uncle Dwight", category: "Extended Family", inviteSent: true },
  { name: "Uncle Wayne", category: "Extended Family", inviteSent: true },
  { name: "Aunt Carol", category: "Extended Family", inviteSent: true },
  { name: "Dean Yunghans", category: "Extended Family", inviteSent: true },
  { name: "Carol Yunghans", category: "Extended Family", inviteSent: true },
  { name: "Sasha Yunghans", category: "Extended Family", inviteSent: true },
  { name: "Carl Yunghans", category: "Extended Family", inviteSent: true },
  { name: "Alec Yunghans", category: "Extended Family", inviteSent: true },
  { name: "Erin Yunghans", category: "Extended Family", notes: "new last name", inviteSent: true },
  { name: "David", category: "Extended Family", notes: "Erin's husband", inviteSent: true },
  { name: "Aunt Beth", category: "Extended Family", inviteSent: true },
  { name: "Uncle Mike", category: "Extended Family", inviteSent: true },
  { name: "Nicole Knyfd", category: "Extended Family", inviteSent: true },
  { name: "Aunt Samra", category: "Extended Family", inviteSent: true },
  { name: "Sissy Williams", category: "Extended Family", inviteSent: true },
  { name: "Bobby Williams", category: "Extended Family", inviteSent: true },
  { name: "Robbie Williams", category: "Extended Family", inviteSent: true },
  { name: "Johnie Williams", category: "Extended Family", inviteSent: true },
  { name: "Uncle Tommy", category: "Extended Family", inviteSent: true },
  { name: "Howard Shuman", category: "Extended Family", inviteSent: true },
  { name: "Dell Shuman", category: "Extended Family", address: "566 Rad Denmark Road, Brooklet GA 30415", inviteSent: true },
  { name: "Miles Erikson", category: "Extended Family", inviteSent: true },
  { name: "Madison Erikson", category: "Extended Family", address: "1501 Estates Way, Pooler GA 31322", inviteSent: true },
  { name: "Mark Erikson", category: "Extended Family", notes: "Include on invitation to Miles?", inviteSent: true },

  // Friends
  { name: "Kena Fomung", category: "Friends", inviteSent: true },
  { name: "Cloe Slade", category: "Friends", notes: "plus one", inviteSent: true },
  { name: "Ruth Hinchman", category: "Friends", inviteSent: true },
  { name: "Annagrace Innman", category: "Friends", inviteSent: true },
  { name: "Ethan", category: "Friends", inviteSent: true },
  { name: "Leah Porter", category: "Friends", inviteSent: true },
  { name: "Abigail Purnell", category: "Friends", inviteSent: true },
  { name: "Hanneke Smith", category: "Friends", inviteSent: true },
  { name: "Justin Cortese", category: "Friends", inviteSent: true },
  { name: "Grace Cortese", category: "Friends", address: "203 Tree Hill Lane, Hubert NC 28539", inviteSent: true },
  { name: "Jordan Thompson", category: "Friends", inviteSent: true },
  { name: "Lynea Thompson", category: "Friends", address: "503 North St, Decorah IA 52101", inviteSent: true },
  { name: "Preston Sherwood", category: "Friends", inviteSent: true },
  { name: "Matthew Morgan", category: "Friends", inviteSent: true },
  { name: "Mollie", category: "Friends", inviteSent: true },

  // Family Friends
  { name: "Amanda Cole", category: "Family Friends", inviteSent: true },
  { name: "Cass Cole", category: "Family Friends", inviteSent: true },
  { name: "Susan Foster", category: "Family Friends", inviteSent: true },
  { name: "Jeff Foster", category: "Family Friends", inviteSent: true },
  { name: "Lori Crow", category: "Family Friends", inviteSent: true },
  { name: "Chris Crow", category: "Family Friends", inviteSent: true },
  { name: "Anita Fast", category: "Family Friends", inviteSent: true },
  { name: "Ken Fast", category: "Family Friends", inviteSent: true },
  { name: "Lauri Slade", category: "Family Friends", inviteSent: true },
  { name: "Pat Slade", category: "Family Friends", inviteSent: true },
  { name: "Dana Mossburg", category: "Family Friends", inviteSent: true },
  { name: "Scott Mossburg", category: "Family Friends", inviteSent: true },
  { name: "Karen Porter", category: "Family Friends", inviteSent: true },
  { name: "Davis Porter", category: "Family Friends", inviteSent: true },
  { name: "Janet Haman", category: "Family Friends", inviteSent: true },
  { name: "Steve Haman", category: "Family Friends", inviteSent: true },
  { name: "Dave Mitchell", category: "Family Friends", inviteSent: true },
  { name: "Bridgette Mitchell", category: "Family Friends", address: "1922 Ballroom Road, Decorah IA 52101", inviteSent: true },
  { name: "Billy Huebner", category: "Family Friends", inviteSent: true },
  { name: "Tyler Brandeau", category: "Family Friends", address: "709 Jobee Creek Cove Nashville, TN 37214", inviteSent: true },
  { name: "Andrew Rez Hasley", category: "Family Friends", address: "325 Fairview Rd Dickson, TN 37055", inviteSent: true },
  { name: "Donovan Pavone", category: "Family Friends", address: "391 Ridgewater Dr Marietta, GA 30068", inviteSent: true },

  // Church
  { name: "Jacob Hargett", category: "Church", address: "6 Dalewood", inviteSent: true },
  { name: "Cem Brinkley", category: "Church", inviteSent: true },
  { name: "Eileen Brinkley", category: "Church", inviteSent: true },
  { name: "Ethan Brinkley", category: "Church", address: "40 North Victor Drive, Flintstone GA 30725", inviteSent: true },
  { name: "Nathan White", category: "Church", inviteSent: true },
  { name: "Courtney White", category: "Church", address: "104 Hardy Rd Lookout Mountain GA 30750", inviteSent: true },
  { name: "Benniah Woodrow", category: "Church", inviteSent: true },
  { name: "Katelyn Woodrow", category: "Church", address: "4907 Sunbeam Ave #A, Chattanooga, TN 37411", inviteSent: true },
  { name: "Tom Stafford", category: "Church", address: "336 North Lula Forrest Trail Rising Fawn GA 30738", inviteSent: true },
  { name: "Jordan Poveda", category: "Church", inviteSent: true },
  { name: "Eduardo Poveda", category: "Church", address: "1439 Mari Jon Dr, Chattanooga, TN 37421", inviteSent: true },
  { name: "Keith Jewett", category: "Church", inviteSent: true },
  { name: "Cameron Jewett", category: "Church", address: "116 Topaz St, Rossville, GA 30741", inviteSent: true },
  { name: "Jeremy Banxton", category: "Church", inviteSent: true },
  { name: "Dawn Banxton", category: "Church", address: "1254 Lytle Rd Chickamauga GA 30707", inviteSent: true },
  { name: "Ben Nilsen", category: "Church", inviteSent: true },
  { name: "Shelby Nilsen", category: "Church", address: "5907 Browntown Rd Chattanooga 37415", inviteSent: true },
  { name: "Ricky Lobach", category: "Church", inviteSent: true },
  { name: "Stephanie Lobach", category: "Church", inviteSent: true },

  // Coworkers
  { name: "Nour Moustafa", category: "Coworkers", address: "33 11th St NE, Unit 2011, Atlanta, GA 30309", inviteSent: true },
  { name: "Syed Jahanzeb", category: "Coworkers", address: "5935 W Hausman Rd, Unit 49, San Antonio, TX 78249", inviteSent: true },

  // Vendors/Volunteers
  { name: "Charity Hargett", category: "Vendors/Volunteers", inviteSent: true },
  { name: "Sarah Smith", category: "Vendors/Volunteers", notes: "Photographer", inviteSent: true },
  { name: "Videographer", category: "Vendors/Volunteers", inviteSent: true },
];

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
  for (let i = 0; i < 11; i++) {
    const cell = rsvpSheet.getCell(0, i);
    cell.textFormat = { bold: true };
    cell.backgroundColor = { red: 0.85, green: 0.85, blue: 0.85 };
  }
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
  for (let i = 0; i < 6; i++) {
    const cell = invitesSheet.getCell(0, i);
    cell.textFormat = { bold: true };
    cell.backgroundColor = { red: 0.85, green: 0.85, blue: 0.85 };
  }

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
