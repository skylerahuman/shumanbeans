import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const GET: RequestHandler = async () => {
  try {
    const registryItems: string[] = [];
    
    // All registry items directory (original + uploaded)
    const registryDir = path.join(process.cwd(), 'static', 'images', 'AmazonRegistry');
    if (existsSync(registryDir)) {
      try {
        const allFiles = await readdir(registryDir);
        const jpgFiles = allFiles.filter(file => file.toLowerCase().endsWith('.jpg'));
        registryItems.push(...jpgFiles);
        console.log(`📋 Found ${jpgFiles.length} registry items`);
      } catch (error) {
        console.warn('Could not read registry directory:', error);
      }
    } else {
      console.warn('Registry directory does not exist:', registryDir);
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
