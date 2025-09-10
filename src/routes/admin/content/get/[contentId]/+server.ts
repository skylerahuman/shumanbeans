import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { getContent } from '$lib/stores/content.js';

export const GET: RequestHandler = async ({ params, cookies }) => {
  // Check admin authentication
  const adminToken = cookies.get('admin-token');
  if (!adminToken) {
    throw error(401, 'Unauthorized');
  }
  
  let adminData;
  try {
    adminData = JSON.parse(adminToken);
  } catch {
    throw error(401, 'Invalid admin token');
  }
  
  const { contentId } = params;
  
  if (!contentId) {
    throw error(400, 'Missing contentId');
  }
  
  // Get content
  const contentItem = getContent(contentId);
  
  return json({
    success: true,
    content: contentItem
  });
};
