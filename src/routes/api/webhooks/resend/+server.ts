import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Get the webhook payload
    const payload = await request.json();
    
    // Log the webhook event for debugging
    console.log('📧 Resend webhook received:', {
      type: payload.type,
      data: payload.data,
      timestamp: new Date().toISOString()
    });
    
    // Handle different event types
    switch (payload.type) {
      case 'email.sent':
        console.log(`✅ Email sent: ${payload.data.email_id} to ${payload.data.to[0]}`);
        break;
        
      case 'email.delivered':
        console.log(`📬 Email delivered: ${payload.data.email_id}`);
        break;
        
      case 'email.opened':
        console.log(`👀 Email opened: ${payload.data.email_id}`);
        break;
        
      case 'email.bounced':
        console.log(`❌ Email bounced: ${payload.data.email_id} - ${payload.data.reason}`);
        break;
        
      case 'email.complained':
        console.log(`⚠️ Email complaint: ${payload.data.email_id}`);
        break;
        
      default:
        console.log(`📨 Unknown webhook event: ${payload.type}`);
    }
    
    // Return 200 OK to acknowledge receipt
    return json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Error processing Resend webhook:', error);
    
    // Return 200 even on error to prevent Resend retries
    return json({ success: false, error: 'Webhook processing failed' }, { status: 200 });
  }
};

// Handle GET requests for webhook verification (if needed)
export const GET: RequestHandler = async () => {
  return json({ 
    message: 'Resend webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
};
