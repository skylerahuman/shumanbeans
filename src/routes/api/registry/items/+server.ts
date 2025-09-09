import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const GET: RequestHandler = async () => {
  try {
    const registryItems: string[] = [];
    
    // Static registry items directory (original items)
    const staticDir = path.join(process.cwd(), 'static', 'images', 'AmazonRegistry');
    if (existsSync(staticDir)) {
      try {
        const staticFiles = await readdir(staticDir);
        const jpgFiles = staticFiles.filter(file => file.toLowerCase().endsWith('.jpg'));
        registryItems.push(...jpgFiles);
      } catch (error) {
        console.warn('Could not read static registry directory:', error);
      }
    }
    
    // Uploaded registry items directory (admin uploads)
    const uploadDir = path.join(process.cwd(), 'static', 'images', 'registry');
    if (existsSync(uploadDir)) {
      try {
        const uploadedFiles = await readdir(uploadDir);
        const jpgFiles = uploadedFiles.filter(file => file.toLowerCase().endsWith('.jpg'));
        // Add uploaded files with different path prefix
        const uploadedItems = jpgFiles.map(file => `uploaded/${file}`);
        registryItems.push(...uploadedItems);
      } catch (error) {
        console.warn('Could not read uploaded registry directory:', error);
      }
    }
    
    // Remove duplicates and sort
    const uniqueItems = Array.from(new Set(registryItems)).sort();
    
    return json({
      success: true,
      items: uniqueItems,
      count: uniqueItems.length
    });
    
  } catch (error) {
    console.error('Error loading registry items:', error);
    return json({
      success: false,
      items: [],
      count: 0,
      error: 'Failed to load registry items'
    }, { status: 500 });
  }
};
