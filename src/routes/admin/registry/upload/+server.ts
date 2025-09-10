import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

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
  
  // Check if user has file-upload permission
  if (!adminData.permissions?.includes('file-upload')) {
    throw error(403, 'Insufficient permissions');
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productName = formData.get('productName') as string;
    const price = formData.get('price') as string;
    
    if (!file || !productName || !price) {
      throw error(400, 'Missing file, product name, or price');
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw error(400, 'File too large. Maximum size is 5MB');
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw error(400, 'Invalid file type. Only JPEG, PNG, and WebP are allowed');
    }
    
    // Clean up product name and generate filename
    const cleanProductName = productName.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');
    const fileName = `${cleanProductName}-${price}.jpg`;
    
    // Ensure static/images directory exists
    const staticDir = path.join(process.cwd(), 'static', 'images', 'AmazonRegistry');
    if (!existsSync(staticDir)) {
      await mkdir(staticDir, { recursive: true });
    }
    
    // Save file
    const filePath = path.join(staticDir, fileName);
    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));
    
    console.log(`📁 Registry item uploaded: ${fileName} by ${adminData.name}`);
    
    return json({
      success: true,
      productName: productName.replace(/-/g, ' '),
      price: parseFloat(price).toFixed(2),
      fileName,
      uploadedBy: adminData.name
    });
    
  } catch (err) {
    console.error('Registry upload error:', err);
    if (err instanceof Response) {
      throw err; // Re-throw SvelteKit errors
    }
    throw error(500, 'Upload failed');
  }
};
