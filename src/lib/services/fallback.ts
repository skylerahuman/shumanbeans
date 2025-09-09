// Fallback services for testing when dependencies aren't installed
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
  console.log('📊 [FALLBACK] Would append to Google Sheets:', {
    primaryName: rsvpData.primaryName,
    email: rsvpData.email,
    attendanceCount: rsvpData.attendanceCount
  });
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('✅ [FALLBACK] Simulated Google Sheets append completed');
}

export async function sendRSVPConfirmation(rsvpData: RSVPData): Promise<void> {
  console.log('📧 [FALLBACK] Would send confirmation email to:', rsvpData.email);
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 300));
  
  console.log('✅ [FALLBACK] Simulated email send completed');
}

export async function initializeSheetHeaders(): Promise<void> {
  console.log('🔧 [FALLBACK] Would initialize Google Sheet headers');
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 200));
  
  console.log('✅ [FALLBACK] Simulated sheet headers initialization completed');
}
