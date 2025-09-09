import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { readFile } from 'fs/promises';
import { GOOGLE_SHEET_ID } from '$env/static/private';

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
    // Try to read the service account JSON file
    const serviceAccountPath = './google-service-account.json';
    const serviceAccountJson = await readFile(serviceAccountPath, 'utf8');
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    const serviceAccountAuth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.error('❌ Error loading Google service account credentials:', error);
    throw new Error('Google service account credentials not found or invalid. Please ensure google-service-account.json is properly configured.');
  }
}

export async function appendRSVPToSheet(rsvpData: RSVPData): Promise<void> {
  try {
    console.log('📊 Attempting to append RSVP to Google Sheets...');
    
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByIndex[0]; // Use first sheet
    
    // Format the data for the sheet
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

    // Add the row to the sheet
    await sheet.addRow(rowData);

    console.log('✅ Successfully added RSVP to Google Sheets');
    console.log('📋 Data:', { 
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

export async function initializeSheetHeaders(): Promise<void> {
  try {
    console.log('🔧 Initializing Google Sheet headers...');
    
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByIndex[0]; // Use first sheet
    
    // Load the header row to check if headers exist
    const rows = await sheet.getRows({ limit: 1 });
    
    if (rows.length === 0) {
      // If no rows exist, set the header row
      await sheet.setHeaderRow([
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
      ]);
      console.log('✅ Headers added to Google Sheet');
    } else {
      console.log('📋 Headers already exist in Google Sheet');
    }
  } catch (error) {
    console.error('❌ Error initializing sheet headers:', error);
    throw error;
  }
}
