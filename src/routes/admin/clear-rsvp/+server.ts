import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
  // Clear the RSVP cookie
  cookies.delete('rsvp-submitted', { path: '/' });
  
  // Redirect back to RSVP page
  throw redirect(302, '/rsvp');
};
