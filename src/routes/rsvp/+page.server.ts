import { z } from "zod";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

const rsvpSchema = z.object({
  primaryName: z.string().min(1, "Primary name is required"),
  email: z.string().email("Please enter a valid email address"),
  attendeeNames: z
    .array(z.string().min(1))
    .min(1, "At least one attendee name is required"),
  attendanceCount: z.number().min(1, "Must have at least 1 attendee"),
  hasChildren: z.boolean(),
  childrenNames: z.array(z.string()),
  needsParking: z.enum(["yes", "no", "unsure"]),
  dietaryRestrictions: z.string(),
  favoriteCoffee: z.string(),
  favoriteSong: z.string(),
  specialMessage: z.string().optional(),
});

export const actions = {
  default: async ({ request }) => {
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
      needsParking: formData.get("needsParking") as "yes" | "no" | "unsure",
      dietaryRestrictions:
        (formData.get("dietaryRestrictions") as string) || "",
      favoriteCoffee: (formData.get("favoriteCoffee") as string) || "",
      favoriteSong: (formData.get("favoriteSong") as string) || "",
      specialMessage: (formData.get("specialMessage") as string) || "",
    };

    try {
      const validatedData = rsvpSchema.parse(data);

      // TODO: Store in database instead of just logging
      console.log("=== NEW RSVP SUBMISSION ===");
      console.log("Timestamp:", new Date().toISOString());
      console.log("Primary Contact:", validatedData.primaryName);
      console.log("Email:", validatedData.email);
      console.log("Attendees:", validatedData.attendeeNames);
      console.log("Total Count:", validatedData.attendanceCount);
      console.log("Has Children:", validatedData.hasChildren);
      if (validatedData.hasChildren && validatedData.childrenNames.length > 0) {
        console.log("Children:", validatedData.childrenNames);
      }
      console.log("Parking Needed:", validatedData.needsParking);
      console.log(
        "Dietary Restrictions:",
        validatedData.dietaryRestrictions || "None specified"
      );
      console.log(
        "Favorite Coffee:",
        validatedData.favoriteCoffee || "Not specified"
      );
      console.log(
        "Favorite Song:",
        validatedData.favoriteSong || "Not specified"
      );
      console.log("Special Message:", validatedData.specialMessage || "None");
      console.log("============================\n");

      return {
        success: true,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.issues);
        return fail(400, {
          errors: error.issues,
          data,
        });
      }

      console.error("Unexpected error:", error);
      return fail(500, {
        message: "An unexpected error occurred. Please try again.",
        data,
      });
    }
  },
} satisfies Actions;
