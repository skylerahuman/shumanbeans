import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { updateContent } from '$lib/stores/content.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
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
  
  // Get request data
  const { contentId, content } = await request.json();
  
  if (!contentId || typeof content !== 'string') {
    throw error(400, 'Missing contentId or content');
  }
  
  // Validate content (basic security - no script tags)
  if (content.includes('<script>') || content.includes('javascript:')) {
    throw error(400, 'Script content not allowed');
  }
  
  // Update content
  const updatedItem = updateContent(contentId, content, adminData.name);
  
  return json({
    success: true,
    content: updatedItem
  });
};
