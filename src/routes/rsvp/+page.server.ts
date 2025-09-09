import { z } from "zod";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { appendRSVPToSheet, initializeWorksheets } from "$lib/services/googleSheets.js";
import { sendRSVPConfirmation } from "$lib/services/email.js";

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
  email: z.string().email("Please enter a valid email address"),
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

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();

    // Parse form data
    const data = {
      primaryName: formData.get("primaryName") as string,
      email: formData.get("email") as string,
      attendeeNames: formData
        .getAll("attendeeNames")
        .filter((name) => name) as string[],
      attendanceCount: parseInt(formData.get("attendanceCount") as string) || 0,
      hasChildren: formData.get("hasChildren") === "on",
      childrenNames: formData
        .getAll("childrenNames")
        .filter((name) => name) as string[],
      dietaryRestrictions:
        (formData.get("dietaryRestrictions") as string) || "",
      favoriteCoffee: (formData.get("favoriteCoffee") as string) || "",
      favoriteSong: (formData.get("favoriteSong") as string) || "",
      specialMessage: (formData.get("specialMessage") as string) || "",
    };

    try {
      const validatedData = rsvpSchema.parse(data);

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
          secure: process.env.NODE_ENV === 'production',
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

      // Initialize worksheets (safe to call multiple times)
      await initializeWorksheets();

      // Store RSVP in Google Sheets
      await appendRSVPToSheet(validatedData);

      // Send confirmation email
      await sendRSVPConfirmation(validatedData);

      console.log("✅ RSVP processing completed successfully");

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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return {
        success: true,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("❌ Validation errors:", error.issues);
        return fail(400, {
          errors: error.issues,
          data,
        });
      }

      console.error("❌ Unexpected error during RSVP processing:", error);
      
      // Return a user-friendly error message
      return fail(500, {
        message: "We're having trouble processing your RSVP right now. Please try again, or text Skyler at 423-370-6198 if the problem persists.",
        data,
      });
    }
  },
} satisfies Actions;
