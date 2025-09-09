import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
  // Clear the admin cookie
  cookies.delete('admin-token', { path: '/' });
  
  // Redirect to home page
  throw redirect(302, '/');
};
