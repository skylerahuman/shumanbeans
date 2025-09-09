import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const rsvpSubmission = cookies.get('rsvp-submitted');
  
  if (rsvpSubmission) {
    try {
      const submissionData = JSON.parse(rsvpSubmission);
      return {
        hasSubmittedRSVP: true,
        rsvpSubmissionData: {
          primaryName: submissionData.primaryName,
          submittedAt: submissionData.submittedAt
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
