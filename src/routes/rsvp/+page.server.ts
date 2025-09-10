import { z } from "zod";
import { fail, redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import type { Actions, PageServerLoad } from "./$types";
import { appendRSVPToSheet, initializeWorksheets } from '$lib/services/googleSheets';
import { sendRSVPConfirmationEmail, type RSVPEmailData } from '$lib/services/emailService';

export const load: PageServerLoad = async ({ cookies }) => {
  const rsvpSubmission = cookies.get('rsvp-submitted');
  
  if (rsvpSubmission) {
    try {
      const submissionData = JSON.parse(rsvpSubmission);
      return {
        hasSubmittedRSVP: true,
        submissionData: {
          primaryName: submissionData.primaryName,
          submittedAt: submissionData.submittedAt,
          attendanceCount: submissionData.attendanceCount
        }
      };
    } catch (error) {
      // If cookie is corrupted, clear it
      cookies.delete('rsvp-submitted');
    }
  }
  
  return {
    hasSubmittedRSVP: false
  };
};

const rsvpSchema = z.object({
  primaryName: z.string().min(1, "Primary name is required"),
  email: z.string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address (e.g., user@gmail.com)")
    .refine((email) => {
      // Additional email validation to catch edge cases
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }, "Please enter a valid email address (e.g., user@gmail.com)"),
  attendeeNames: z
    .array(z.string().min(1))
    .min(1, "At least one attendee name is required"),
  attendanceCount: z.number().min(1, "Must have at least 1 attendee"),
  hasChildren: z.boolean(),
  childrenNames: z.array(z.string()),
  dietaryRestrictions: z.string(),
  favoriteCoffee: z.string(),
  favoriteSong: z.string(),
  specialMessage: z.string().optional(),
});

/**
 * Enhanced async email sending with proper error handling and logging
 * Uses Promise-based approach instead of setImmediate for better compatibility
 */
async function sendEmailAsync(emailData: RSVPEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    await sendRSVPConfirmationEmail(emailData);
    console.log('✅ RSVP confirmation email sent successfully (async)');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('⚠️ Email failed (RSVP still successful):', errorMessage);
    
    // Log additional context for debugging
    console.error('📧 Email context:', {
      recipient: emailData.email,
      primaryName: emailData.primaryName,
      timestamp: new Date().toISOString()
    });
    
    return { success: false, error: errorMessage };
  }
}

/**
 * Creates a detached Promise that won't block the main response
 * More reliable than setImmediate and works in all environments
 */
function scheduleAsyncEmail(emailData: RSVPEmailData): void {
  // Use Promise.resolve().then() to schedule on next tick
  // This is more portable than setImmediate and works in all JS environments
  Promise.resolve().then(() => sendEmailAsync(emailData));
}

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();

    // Parse form data
    const rawEmail = formData.get("email") as string;
    
    const data = {
      primaryName: ((formData.get("primaryName") as string) || "").trim(),
      email: (rawEmail || "").trim(), // Trim whitespace from email
      attendeeNames: formData
        .getAll("attendeeNames")
        .filter((name) => name && typeof name === 'string' && name.trim()) as string[],
      attendanceCount: parseInt((formData.get("attendanceCount") as string) || "0") || 0,
      hasChildren: formData.get("hasChildren") === "on",
      childrenNames: formData
        .getAll("childrenNames")
        .filter((name) => name && typeof name === 'string' && name.trim()) as string[],
      dietaryRestrictions:
        ((formData.get("dietaryRestrictions") as string) || "").trim(),
      favoriteCoffee: ((formData.get("favoriteCoffee") as string) || "").trim(),
      favoriteSong: ((formData.get("favoriteSong") as string) || "").trim(),
      specialMessage: ((formData.get("specialMessage") as string) || "").trim(),
    };
    
    // Debug email validation
    console.log('📧 Email validation debug:', {
      rawEmail: JSON.stringify(rawEmail),
      trimmedEmail: JSON.stringify(data.email),
      emailLength: data.email?.length,
      emailType: typeof data.email
    });

    let validatedData;
    
    try {
      validatedData = rsvpSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("❌ Validation errors:", error.issues);
        
        // Log detailed email validation errors
        const emailErrors = error.issues.filter(issue => issue.path.includes('email'));
        if (emailErrors.length > 0) {
          console.error('📧 Email validation failed:', {
            email: data.email,
            emailErrors: emailErrors.map(e => ({ message: e.message, code: e.code })),
            rawEmailFromForm: rawEmail
          });
        }
        
        return fail(400, {
          errors: error.issues,
          data,
        });
      }
      throw error;
    }

    // Check for admin credentials
    const isAdminLogin = 
      validatedData.primaryName.toLowerCase() === 'chloe williams' &&
      validatedData.email.toLowerCase() === 'us@shumanbeans.com' &&
      validatedData.attendeeNames.length === 1 &&
      validatedData.attendeeNames[0].toLowerCase() === 'chloe williams' &&
      validatedData.attendanceCount === 100;

    if (isAdminLogin) {
      console.log('🔐 Admin login detected - setting admin token');
      
      // Set admin cookie
      const adminData = {
        name: 'Chloe Williams',
        loginTime: new Date().toISOString(),
        permissions: ['content-edit', 'file-upload']
      };
      
      cookies.set('admin-token', JSON.stringify(adminData), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: !dev,
        sameSite: 'strict'
      });

      return {
        success: true,
        adminLogin: true,
        message: 'Admin access granted! You can now edit content throughout the site.'
      };
    }

    console.log("=== NEW RSVP SUBMISSION ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Primary Contact:", validatedData.primaryName);
    console.log("Email:", validatedData.email);
    console.log("Attendees:", validatedData.attendeeNames);
    console.log("Total Count:", validatedData.attendanceCount);
    console.log("============================\n");

    // Process RSVP (this is where errors might occur)
    try {
      // Initialize worksheets (safe to call multiple times)
      await initializeWorksheets();

      // Store RSVP in Google Sheets (includes duplicate checking)
      await appendRSVPToSheet(validatedData);

      console.log("✅ RSVP processing completed successfully");
    } catch (error) {
      // Handle duplicate RSVP error specially
      if (error instanceof Error && error.message.includes('RSVP has already been submitted')) {
        console.log('🔄 Duplicate RSVP detected, showing duplicate message');
        return fail(409, {
          message: error.message,
          isDuplicate: true,
          data,
        });
      }

      console.error("❌ Error processing RSVP:", error);
      
      // Return a user-friendly error message
      return fail(500, {
        message: "We're having trouble processing your RSVP right now. Please try again, or text Skyler at 423-370-6198 if the problem persists.",
        data,
      });
    }

    // Prepare email data for confirmation
    const emailData: RSVPEmailData = {
      primaryName: validatedData.primaryName,
      email: validatedData.email,
      attending: 'yes', // All RSVPs submitted are "yes" - no decline option on this form
      dietaryRestrictions: validatedData.dietaryRestrictions,
      guestCount: validatedData.attendanceCount,
      plusOneDetails: validatedData.attendeeNames.slice(1).join(', '), // Additional attendees beyond primary
      message: validatedData.specialMessage
    };
    
    // Schedule email sending asynchronously (non-blocking)
    // This ensures RSVP completion is not dependent on email service availability
    scheduleAsyncEmail(emailData);
    
    console.log('📧 Email confirmation scheduled for async delivery');

    // Set cookie to track RSVP submission (expires in 1 year)
    const submissionData = {
      primaryName: validatedData.primaryName,
      email: validatedData.email,
      submittedAt: new Date().toISOString(),
      attendanceCount: validatedData.attendanceCount
    };
    
    cookies.set('rsvp-submitted', JSON.stringify(submissionData), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: !dev,
      sameSite: 'strict'
    });

    // Redirect to success page
    // Note: We always show email as "sent" since RSVP was successful
    // The actual email delivery happens asynchronously and is logged separately
    const params = new URLSearchParams({ emailSent: 'true' });
    
    throw redirect(303, `/rsvp/success?${params.toString()}`);
  },
} satisfies Actions;
