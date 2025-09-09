import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { GOOGLE_SHEET_ID, GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } from '$env/static/private';
import { weddingGuestList, type Guest } from './guestList.js';

export interface RSVPData {
  primaryName: string;
  email: string;
  attendeeNames: string[];
  attendanceCount: number;
  hasChildren: boolean;
  childrenNames: string[];
  dietaryRestrictions: string;
  favoriteCoffee: string;
  favoriteSong: string;
  specialMessage: string;
}

async function getGoogleSheet() {
  try {
    // Validate environment variables
    if (!GOOGLE_SHEET_ID || !GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) {
      throw new Error('Missing required Google Sheets environment variables: GOOGLE_SHEET_ID, GOOGLE_PRIVATE_KEY, or GOOGLE_CLIENT_EMAIL');
    }

    // Create JWT auth using environment variables
    const serviceAccountAuth = new JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines in private key
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.error('❌ Error connecting to Google Sheets:', error);
    if (error instanceof Error) {
      throw new Error(`Google Sheets authentication failed: ${error.message}`);
    }
    throw new Error('Google Sheets authentication failed with unknown error');
  }
}

export async function appendRSVPToSheet(rsvpData: RSVPData): Promise<void> {
  try {
    console.log('📊 Attempting to append RSVP to Google Sheets...');
    
    const doc = await getGoogleSheet();
    
    // Get the RSVPs sheet
    const rsvpSheet = doc.sheetsByTitle['RSVPs'];
    if (!rsvpSheet) {
      throw new Error('RSVPs sheet not found. Please run sheet initialization first.');
    }
    
    // Format the data for the RSVPs sheet
    const timestamp = new Date().toISOString();
    const attendeeNamesString = rsvpData.attendeeNames.join(', ');
    const childrenNamesString = rsvpData.childrenNames.join(', ');
    
    const rowData = {
      Timestamp: timestamp,
      'Primary Name': rsvpData.primaryName,
      Email: rsvpData.email,
      'Attendee Names': attendeeNamesString,
      'Total Attendance Count': rsvpData.attendanceCount,
      'Has Children': rsvpData.hasChildren ? 'Yes' : 'No',
      'Children Names': childrenNamesString,
      'Dietary Restrictions': rsvpData.dietaryRestrictions,
      'Favorite Coffee': rsvpData.favoriteCoffee,
      'Favorite Song': rsvpData.favoriteSong,
      'Special Message': rsvpData.specialMessage
    };

    // Add the row to the RSVPs sheet
    await rsvpSheet.addRow(rowData);
    console.log('✅ Successfully added RSVP to RSVPs sheet');

    // Update the Invites sheet to mark attendees as having RSVPed
    await updateInviteStatus(doc, rsvpData.attendeeNames);

    console.log('📋 RSVP processing completed:', { 
      primaryName: rsvpData.primaryName, 
      email: rsvpData.email,
      attendanceCount: rsvpData.attendanceCount 
    });
  } catch (error) {
    console.error('❌ Error adding RSVP to Google Sheets:', error);
    
    // Log the specific error details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Re-throw the error so it can be handled by the calling function
    throw error;
  }
}

async function updateInviteStatus(doc: GoogleSpreadsheet, attendeeNames: string[]): Promise<void> {
  try {
    console.log('🔄 Updating invite status for attendees...');
    
    const invitesSheet = doc.sheetsByTitle['Invites'];
    if (!invitesSheet) {
      console.log('⚠️ Invites sheet not found, skipping status update');
      return;
    }

    // Get all rows from the Invites sheet
    const rows = await invitesSheet.getRows();
    
    // Update status for each attendee
    for (const attendeeName of attendeeNames) {
      const matchingRow = rows.find(row => 
        row.get('Name') && row.get('Name').toLowerCase().trim() === attendeeName.toLowerCase().trim()
      );
      
      if (matchingRow) {
        matchingRow.set('RSVP Status', 'Confirmed');
        await matchingRow.save();
        console.log(`✅ Updated ${attendeeName} status to Confirmed`);
      } else {
        console.log(`⚠️ Could not find ${attendeeName} in Invites sheet`);
      }
    }
    
    console.log('✅ Invite status updates completed');
  } catch (error) {
    console.error('❌ Error updating invite status:', error);
    // Don't throw here - RSVP was already saved successfully
  }
}

export async function initializeWorksheets(): Promise<void> {
  try {
    console.log('🔧 Initializing Google Sheets worksheets...');
    
    const doc = await getGoogleSheet();
    
    // Initialize RSVPs sheet
    await initializeRSVPSheet(doc);
    
    // Initialize Invites sheet
    await initializeInvitesSheet(doc);
    
    console.log('✅ All worksheets initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing worksheets:', error);
    throw error;
  }
}

async function initializeRSVPSheet(doc: GoogleSpreadsheet): Promise<void> {
  console.log('📝 Setting up RSVPs sheet...');
  
  // Find or create RSVPs sheet
  let rsvpSheet = doc.sheetsByTitle['RSVPs'];
  if (!rsvpSheet) {
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
    console.log('✅ RSVPs sheet created with headers');
  } else {
    console.log('📋 RSVPs sheet already exists');
  }
}

async function initializeInvitesSheet(doc: GoogleSpreadsheet): Promise<void> {
  console.log('📝 Setting up Invites sheet...');
  
  // Find or create Invites sheet
  let invitesSheet = doc.sheetsByTitle['Invites'];
  if (!invitesSheet) {
    invitesSheet = await doc.addSheet({
      title: 'Invites',
      headerValues: [
        'Name',
        'Category',
        'Address',
        'Notes',
        'Invite Sent',
        'RSVP Status'
      ]
    });
    
    // Add all guests to the Invites sheet
    const guestRows = weddingGuestList.map(guest => ({
      Name: guest.name,
      Category: guest.category,
      Address: guest.address || '',
      Notes: guest.notes || '',
      'Invite Sent': guest.inviteSent,
      'RSVP Status': 'Pending'
    }));
    
    await invitesSheet.addRows(guestRows);
    console.log(`✅ Invites sheet created with ${weddingGuestList.length} guests`);
  } else {
    console.log('📋 Invites sheet already exists');
  }
}

// Legacy function for backwards compatibility
export async function initializeSheetHeaders(): Promise<void> {
  return initializeWorksheets();
}
