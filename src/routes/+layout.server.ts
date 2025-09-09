import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const rsvpSubmission = cookies.get('rsvp-submitted');
  const adminToken = cookies.get('admin-token');
  
  let hasSubmittedRSVP = false;
  let rsvpSubmissionData = null;
  let isAdmin = false;
  let adminData = null;
  
  // Check RSVP status
  if (rsvpSubmission) {
    try {
      const submissionData = JSON.parse(rsvpSubmission);
      hasSubmittedRSVP = true;
      rsvpSubmissionData = {
        primaryName: submissionData.primaryName,
        submittedAt: submissionData.submittedAt
      };
    } catch (error) {
      // If cookie is corrupted, clear it
      cookies.delete('rsvp-submitted');
    }
  }
  
  // Check admin status
  if (adminToken) {
    try {
      const parsedAdminData = JSON.parse(adminToken);
      isAdmin = true;
      adminData = {
        name: parsedAdminData.name,
        loginTime: parsedAdminData.loginTime,
        permissions: parsedAdminData.permissions
      };
    } catch (error) {
      // If cookie is corrupted, clear it
      cookies.delete('admin-token');
    }
  }
  
  return {
    hasSubmittedRSVP,
    rsvpSubmissionData,
    isAdmin,
    adminData
  };
};
