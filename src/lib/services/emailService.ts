import { Resend } from 'resend';
import { RESEND_API_KEY, FROM_EMAIL } from '$env/static/private';

// Initialize Resend client with error handling and production debugging
let resend: Resend;
try {
  console.log('🔧 Initializing Resend client...');
  
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  if (!FROM_EMAIL) {
    throw new Error('FROM_EMAIL environment variable is not set');
  }
  
  // Log configuration (without exposing sensitive data)
  console.log('📧 Email service configuration:', {
    hasApiKey: !!RESEND_API_KEY,
    apiKeyLength: RESEND_API_KEY?.length,
    apiKeyPrefix: RESEND_API_KEY?.substring(0, 8) + '...',
    fromEmail: FROM_EMAIL,
    timestamp: new Date().toISOString()
  });
  
  resend = new Resend(RESEND_API_KEY);
  console.log('✅ Resend client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Resend client:', error);
  throw error;
}

export interface RSVPEmailData {
  primaryName: string;
  email: string;
  attending: string;
  dietaryRestrictions?: string;
  guestCount: number;
  plusOneDetails?: string;
  message?: string;
}

/**
 * Validates email address format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sends RSVP confirmation email using Resend API
 * Follows Resend best practices for error handling and response processing
 */
export async function sendRSVPConfirmationEmail(rsvpData: RSVPEmailData): Promise<void> {
  console.log('🚀 Starting RSVP email send process...', {
    recipient: rsvpData.email,
    primaryName: rsvpData.primaryName,
    timestamp: new Date().toISOString()
  });

  // Validate input data
  if (!rsvpData.email || !isValidEmail(rsvpData.email)) {
    const error = `Invalid email address: ${rsvpData.email}`;
    console.error('❌ Email validation failed:', error);
    throw new Error(error);
  }
  
  if (!rsvpData.primaryName?.trim()) {
    const error = 'Primary name is required for email sending';
    console.error('❌ Name validation failed:', error);
    throw new Error(error);
  }

  const isAttending = rsvpData.attending.toLowerCase() === 'yes';
  const subject = isAttending 
    ? `RSVP Confirmed - We can't wait to celebrate with you!`
    : `RSVP Received - Thank you for letting us know`;

  console.log('📝 Generating email content...', {
    isAttending,
    subject,
    hasHtml: true,
    hasText: true
  });

  const htmlContent = generateRSVPEmailHTML(rsvpData, isAttending);
  const textContent = generateRSVPEmailText(rsvpData, isAttending);

  console.log('📧 Preparing to send email via Resend API...', {
    from: `Skyler & Chloe <${FROM_EMAIL}>`,
    to: rsvpData.email,
    subject,
    htmlLength: htmlContent.length,
    textLength: textContent.length,
    timestamp: new Date().toISOString()
  });
  
  try {
    // Use Resend API with both HTML and text content for better deliverability
    const emailPayload = {
      from: `Skyler & Chloe <${FROM_EMAIL}>`,
      to: [rsvpData.email],
      subject,
      html: htmlContent,
      text: textContent, // Include plain text version for better deliverability
      // Add tags for tracking and analytics
      tags: [
        { name: 'type', value: 'rsvp-confirmation' },
        { name: 'attending', value: isAttending ? 'yes' : 'no' }
      ],
      // Add headers for better email client handling
      headers: {
        'X-Entity-Ref-ID': `rsvp-${Date.now()}-${rsvpData.email.replace('@', '-at-')}`
      }
    };

    console.log('🔄 Calling Resend API...', {
      payloadKeys: Object.keys(emailPayload),
      timestamp: new Date().toISOString()
    });

    const response = await resend.emails.send(emailPayload);

    console.log('📨 Resend API response received:', {
      hasData: !!response.data,
      hasError: !!response.error,
      dataKeys: response.data ? Object.keys(response.data) : [],
      timestamp: new Date().toISOString()
    });

    // Handle Resend API response according to their documentation
    if (response.error) {
      console.error('❌ Resend API returned error:', {
        error: response.error,
        errorType: typeof response.error,
        errorKeys: typeof response.error === 'object' ? Object.keys(response.error) : [],
        timestamp: new Date().toISOString()
      });
      throw new Error(`Resend API error: ${response.error.message || JSON.stringify(response.error)}`);
    }

    if (!response.data?.id) {
      console.error('❌ Unexpected Resend response format:', {
        response,
        hasData: !!response.data,
        dataType: typeof response.data,
        timestamp: new Date().toISOString()
      });
      throw new Error('Email sent but no message ID received from Resend');
    }

    console.log('✅ RSVP confirmation email sent successfully:', {
      messageId: response.data.id,
      to: rsvpData.email,
      subject,
      attending: isAttending,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    // Enhanced error logging with context
    const errorDetails = {
      error: error instanceof Error ? error.message : String(error),
      errorType: typeof error,
      errorName: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      recipient: rsvpData.email,
      primaryName: rsvpData.primaryName,
      fromEmail: FROM_EMAIL,
      hasApiKey: !!RESEND_API_KEY,
      apiKeyLength: RESEND_API_KEY?.length,
      timestamp: new Date().toISOString()
    };

    console.error('❌ Email service error details:', errorDetails);
    
    // Re-throw with additional context for upstream handling
    if (error instanceof Error) {
      throw new Error(`Failed to send RSVP confirmation email: ${error.message}`);
    }
    throw new Error(`Failed to send RSVP confirmation email: ${String(error)}`);
  }
}

/**
 * Generates plain text version of the RSVP email for better deliverability
 */
function generateRSVPEmailText(rsvpData: RSVPEmailData, isAttending: boolean): string {
  const attendingMessage = isAttending 
    ? '🎉 Wonderful! We\'re so excited you can join us!'
    : 'We\'re sorry you can\'t make it, but thank you for letting us know.';

  const rsvpDetails = [
    `Primary Contact: ${rsvpData.primaryName}`,
    `Email: ${rsvpData.email}`,
    `Total Guests: ${rsvpData.guestCount}`,
    rsvpData.plusOneDetails ? `Additional Attendees: ${rsvpData.plusOneDetails}` : '',
    rsvpData.dietaryRestrictions ? `Dietary Restrictions: ${rsvpData.dietaryRestrictions}` : '',
    rsvpData.message ? `Special Message: ${rsvpData.message}` : ''
  ].filter(Boolean).join('\n');

  const nextSteps = isAttending 
    ? `What's Next?
We'll be sending out more details about the ceremony and reception as we get closer to the big day. Keep an eye on your inbox!

If you need to make any changes to your RSVP, please contact us directly.`
    : 'If your plans change and you\'re able to attend, please let us know as soon as possible.';

  return `
Skyler & Chloe
Thank you for your RSVP!

Dear ${rsvpData.primaryName},

Thank you for responding to our wedding invitation! We've received your RSVP and wanted to send you this confirmation.

${attendingMessage}

Your RSVP Details:
${rsvpDetails}

${nextSteps}

With love and excitement,
Skyler & Chloe

Need help? If you have any questions or need to make changes to your RSVP, please contact us at ${FROM_EMAIL}

The Shumanbeans Wedding
"Two hearts, one journey, endless coffee"
  `.trim();
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
          <h1 style="margin: 0; font-size: 28px;">Skyler & Chloe</h1>
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
            <p style="font-size: 20px; color: #667eea; margin: 10px 0;"><strong>Skyler & Chloe</strong></p>
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
