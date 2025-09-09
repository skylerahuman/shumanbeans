import { google } from 'googleapis';
import { GOOGLE_SHEETS_API_KEY, GOOGLE_SHEET_ID } from '$env/static/private';

const sheets = google.sheets('v4');

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

export async function appendRSVPToSheet(rsvpData: RSVPData): Promise<void> {
  try {
    console.log('📊 Attempting to append RSVP to Google Sheets...');
    
    // Format the data for the sheet
    const timestamp = new Date().toISOString();
    const attendeeNamesString = rsvpData.attendeeNames.join(', ');
    const childrenNamesString = rsvpData.childrenNames.join(', ');
    
    const rowData = [
      timestamp,
      rsvpData.primaryName,
      rsvpData.email,
      attendeeNamesString,
      rsvpData.attendanceCount.toString(),
      rsvpData.hasChildren ? 'Yes' : 'No',
      childrenNamesString,
      rsvpData.dietaryRestrictions,
      rsvpData.favoriteCoffee,
      rsvpData.favoriteSong,
      rsvpData.specialMessage
    ];

    // Set up authentication
    google.options({
      auth: GOOGLE_SHEETS_API_KEY
    });

    // Append data to the sheet
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'A:K', // Columns A through K
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData]
      }
    });

    if (result.status === 200) {
      console.log('✅ Successfully added RSVP to Google Sheets');
      console.log('📋 Data:', { 
        primaryName: rsvpData.primaryName, 
        email: rsvpData.email,
        attendanceCount: rsvpData.attendanceCount 
      });
    } else {
      throw new Error(`Unexpected response status: ${result.status}`);
    }
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
    
    const headers = [
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
    ];

    google.options({
      auth: GOOGLE_SHEETS_API_KEY
    });

    // Check if headers already exist
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'A1:K1'
    });

    if (!existingData.data.values || existingData.data.values.length === 0) {
      // Add headers if they don't exist
      await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'A1:K1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers]
        }
      });
      console.log('✅ Headers added to Google Sheet');
    } else {
      console.log('📋 Headers already exist in Google Sheet');
    }
  } catch (error) {
    console.error('❌ Error initializing sheet headers:', error);
    throw error;
  }
}
