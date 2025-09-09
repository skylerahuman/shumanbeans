import { Resend } from 'resend';
import { RESEND_API_KEY, FROM_EMAIL } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export interface RSVPEmailData {
  primaryName: string;
  email: string;
  attending: string;
  dietaryRestrictions?: string;
  guestCount: number;
  plusOneDetails?: string;
  message?: string;
}

export async function sendRSVPConfirmationEmail(rsvpData: RSVPEmailData): Promise<void> {
  const isAttending = rsvpData.attending.toLowerCase() === 'yes';
  const subject = isAttending 
    ? `RSVP Confirmed - We can't wait to celebrate with you!`
    : `RSVP Received - Thank you for letting us know`;

  const htmlContent = generateRSVPEmailHTML(rsvpData, isAttending);

  const { data, error } = await resend.emails.send({
    from: `Skyler & Hannah <${FROM_EMAIL}>`,
    to: [rsvpData.email],
    subject,
    html: htmlContent,
  });

  if (error) {
    console.error('Failed to send RSVP confirmation email:', error);
    throw new Error(`Failed to send confirmation email: ${error.message}`);
  }

  console.log('RSVP confirmation email sent successfully:', data?.id);
}

function generateRSVPEmailHTML(rsvpData: RSVPEmailData, isAttending: boolean): string {
  const baseStyles = `
    font-family: 'Georgia', serif;
    line-height: 1.6;
    color: #2c3e50;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `;

  const headerStyles = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px 20px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  `;

  const contentStyles = `
    background: #ffffff;
    padding: 30px 20px;
    border: 1px solid #e1e8ed;
    border-top: none;
    border-radius: 0 0 10px 10px;
  `;

  const attendingMessage = isAttending 
    ? `
      <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #155724;"><strong>🎉 Wonderful! We're so excited you can join us!</strong></p>
      </div>
    `
    : `
      <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #721c24;"><strong>We're sorry you can't make it, but thank you for letting us know.</strong></p>
      </div>
    `;

  const rsvpDetails = `
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #495057;">Your RSVP Details:</h3>
      <ul style="list-style: none; padding: 0;">
        <li style="padding: 5px 0;"><strong>Primary Contact:</strong> ${rsvpData.primaryName}</li>
        <li style="padding: 5px 0;"><strong>Email:</strong> ${rsvpData.email}</li>
        <li style="padding: 5px 0;"><strong>Total Guests:</strong> ${rsvpData.guestCount}</li>
        ${rsvpData.plusOneDetails ? `<li style="padding: 5px 0;"><strong>Additional Attendees:</strong> ${rsvpData.plusOneDetails}</li>` : ''}
        ${rsvpData.dietaryRestrictions ? `<li style="padding: 5px 0;"><strong>Dietary Restrictions:</strong> ${rsvpData.dietaryRestrictions}</li>` : ''}
        ${rsvpData.message ? `<li style="padding: 5px 0;"><strong>Special Message:</strong> ${rsvpData.message}</li>` : ''}
      </ul>
    </div>
  `;

  const nextSteps = isAttending 
    ? `
      <div style="margin: 30px 0;">
        <h3 style="color: #495057;">What's Next?</h3>
        <p>We'll be sending out more details about the ceremony and reception as we get closer to the big day. Keep an eye on your inbox!</p>
        <p>If you need to make any changes to your RSVP, please contact us directly.</p>
      </div>
    `
    : `
      <div style="margin: 30px 0;">
        <p>If your plans change and you're able to attend, please let us know as soon as possible.</p>
      </div>
    `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RSVP Confirmation</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5;">
      <div style="${baseStyles}">
        <div style="${headerStyles}">
          <h1 style="margin: 0; font-size: 28px;">Skyler & Hannah</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Thank you for your RSVP!</p>
        </div>
        
        <div style="${contentStyles}">
          <p>Dear ${rsvpData.primaryName},</p>
          
          <p>Thank you for responding to our wedding invitation! We've received your RSVP and wanted to send you this confirmation.</p>
          
          ${attendingMessage}
          
          ${rsvpDetails}
          
          ${nextSteps}
          
          <div style="margin: 30px 0; text-align: center; border-top: 1px solid #dee2e6; padding-top: 20px;">
            <p>With love and excitement,</p>
            <p style="font-size: 20px; color: #667eea; margin: 10px 0;"><strong>Skyler & Hannah</strong></p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background: #e9ecef; border-radius: 5px; font-size: 14px; color: #6c757d;">
            <p style="margin: 0;"><strong>Need help?</strong> If you have any questions or need to make changes to your RSVP, please contact us at ${FROM_EMAIL}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
