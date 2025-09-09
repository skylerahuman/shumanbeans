import { Resend } from 'resend';
import { RESEND_API_KEY, FROM_EMAIL } from '$env/static/private';
import type { RSVPData } from './googleSheets.js';

const resend = new Resend(RESEND_API_KEY);

export async function sendRSVPConfirmation(rsvpData: RSVPData): Promise<void> {
  try {
    console.log('📧 Sending RSVP confirmation email...');

    const attendeeNamesText = rsvpData.attendeeNames.join(', ');
    const childrenText = rsvpData.hasChildren && rsvpData.childrenNames.length > 0 
      ? rsvpData.childrenNames.join(', ') 
      : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>RSVP Confirmation - Chloe & Skyler's Wedding</title>
          <style>
            body {
              font-family: Georgia, 'Times New Roman', serif;
              line-height: 1.6;
              color: #3B2F2F;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #FEF7ED;
            }
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #8B5A2B;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #8B5A2B;
              margin: 0;
              font-size: 28px;
            }
            .emoji {
              font-size: 24px;
              margin: 0 5px;
            }
            .details {
              background-color: #F9F5F1;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .detail-row {
              margin: 10px 0;
            }
            .label {
              font-weight: bold;
              color: #8B5A2B;
            }
            .wedding-info {
              background-color: #FEF7ED;
              border: 2px solid #8B5A2B;
              padding: 20px;
              border-radius: 6px;
              text-align: center;
              margin: 30px 0;
            }
            .wedding-info h2 {
              color: #8B5A2B;
              margin-top: 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #E5E5E5;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span class="emoji">🎉</span>
                RSVP Confirmed!
                <span class="emoji">💕</span>
              </h1>
              <p>Thank you for celebrating with Chloe & Skyler</p>
            </div>

            <p>Dear ${rsvpData.primaryName},</p>
            
            <p>We're absolutely thrilled that you'll be joining us for our wedding celebration! Your RSVP has been confirmed, and we can't wait to see you on our special day.</p>

            <div class="details">
              <h3 style="color: #8B5A2B; margin-top: 0;">Your RSVP Details:</h3>
              <div class="detail-row">
                <span class="label">Attendees:</span> ${attendeeNamesText}
              </div>
              <div class="detail-row">
                <span class="label">Total Guests:</span> ${rsvpData.attendanceCount}
              </div>
              ${childrenText ? `<div class="detail-row"><span class="label">Children:</span> ${childrenText}</div>` : ''}
              ${rsvpData.dietaryRestrictions ? `<div class="detail-row"><span class="label">Dietary Notes:</span> ${rsvpData.dietaryRestrictions}</div>` : ''}
            </div>

            <div class="wedding-info">
              <h2>Wedding Details</h2>
              <p><strong>Date:</strong> November 22, 2025</p>
              <p><strong>Time:</strong> 2:30 PM</p>
              <p><strong>Location:</strong> Details to follow</p>
              <p><em>Formal invitation with venue details will be sent separately</em></p>
            </div>

            ${rsvpData.specialMessage ? `
            <div class="details">
              <h3 style="color: #8B5A2B; margin-top: 0;">Your Sweet Message:</h3>
              <p style="font-style: italic;">"${rsvpData.specialMessage}"</p>
              <p style="text-align: center; color: #8B5A2B;">Thank you for these kind words! ☕💕</p>
            </div>
            ` : ''}

            <p>We're so grateful to have you as part of our celebration. If you have any questions or need to make changes to your RSVP, please don't hesitate to reach out to Skyler at <strong>423-370-6198</strong>.</p>

            <p>Looking forward to celebrating with you!</p>
            
            <p style="text-align: center; margin-top: 30px;">
              <em>With love and gratitude,</em><br>
              <strong style="color: #8B5A2B; font-size: 18px;">Chloe & Skyler</strong><br>
              <span class="emoji">☕💕</span>
            </p>

            <div class="footer">
              <p>The Shumanbeans Wedding • November 22, 2025</p>
              <p>"Two hearts, one journey, endless coffee"</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
RSVP Confirmed! 🎉💕

Dear ${rsvpData.primaryName},

We're absolutely thrilled that you'll be joining us for our wedding celebration! Your RSVP has been confirmed, and we can't wait to see you on our special day.

Your RSVP Details:
- Attendees: ${attendeeNamesText}
- Total Guests: ${rsvpData.attendanceCount}
${childrenText ? `- Children: ${childrenText}` : ''}
${rsvpData.dietaryRestrictions ? `- Dietary Notes: ${rsvpData.dietaryRestrictions}` : ''}

Wedding Details:
Date: November 22, 2025
Time: 2:30 PM
Location: Details to follow

Formal invitation with venue details will be sent separately.

${rsvpData.specialMessage ? `Your Sweet Message: "${rsvpData.specialMessage}" - Thank you for these kind words! ☕💕` : ''}

We're so grateful to have you as part of our celebration. If you have any questions or need to make changes to your RSVP, please don't hesitate to reach out to Skyler at 423-370-6198.

Looking forward to celebrating with you!

With love and gratitude,
Chloe & Skyler ☕💕

The Shumanbeans Wedding • November 22, 2025
"Two hearts, one journey, endless coffee"
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [rsvpData.email],
      subject: '🎉 RSVP Confirmed - Chloe & Skyler\'s Wedding',
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      throw new Error(`Email sending failed: ${result.error.message}`);
    }

    console.log('✅ RSVP confirmation email sent successfully');
    console.log('📧 Email ID:', result.data?.id);
    console.log('📬 Sent to:', rsvpData.email);

  } catch (error) {
    console.error('❌ Error sending RSVP confirmation email:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    
    throw error;
  }
}
