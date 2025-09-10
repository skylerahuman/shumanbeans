import type { PageLoad } from './$types';
import { dev } from '$app/environment';

// Only prerender in production, allow dynamic loading in dev for admin uploads
export const prerender = !dev;

// Helper function to convert CamelCase to Title Case
function camelToTitle(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .trim();
}

// Extract item data from filename
function parseItemFromFilename(filename: string) {
  // Remove .jpg extension
  const nameAndPrice = filename.replace('.jpg', '');
  
  // Split on the last dash to separate name from price
  const lastDashIndex = nameAndPrice.lastIndexOf('-');
  const rawName = nameAndPrice.substring(0, lastDashIndex);
  const rawPrice = nameAndPrice.substring(lastDashIndex + 1);
  
  // Special handling for NiceTowels(2)
  let title;
  if (rawName.includes('NiceTowels(2)')) {
    title = 'Nice Towels (Set of 2)';
  } else {
    // Convert dashes to spaces and clean up the name
    title = rawName.replace(/-/g, ' ');
    // If it's a camelCase name, convert it
    if (!title.includes(' ') || title === camelToTitle(rawName)) {
      title = camelToTitle(rawName);
    }
  }
  
  // Format price
  const price = `$${parseFloat(rawPrice).toFixed(2)}`;
  
  // All items are now in the same directory
  const imagePath = `/images/AmazonRegistry/${filename}`;
  
  return {
    title,
    price,
    image: imagePath,
    url: 'https://www.amazon.com/wedding/share/shumanbeans',
    source: 'Registry'
  };
}

export const load: PageLoad = async ({ fetch }) => {
  try {
    // Try to fetch dynamic registry items from API (includes uploaded items)
    const response = await fetch('/api/registry/items');
    if (response.ok) {
      const { items } = await response.json();
      const amazonProducts = items.map(parseItemFromFilename);
      return {
        amazonProducts,
        cached: false,
        timestamp: Date.now()
      };
    }
  } catch (error) {
    console.warn('Failed to fetch dynamic registry items, falling back to static list');
  }
  
  // Fallback to static list of original registry item filenames
  const registryItems = [
    'BathroomRug-15.98.jpg',
    'BedSheets-69.99.jpg',
    'BedroomThrowPillows-19.99.jpg',
    'Dishcloths-9.99.jpg',
    'Duvet-64.31.jpg',
    'DuvetCover-68.68.jpg',
    'EspressoGrinder-143.99.jpg',
    'GuestBedQuilt-36.99.jpg',
    'KitchenOrganizes-32.98.jpg',
    'MixingBowls-32.99.jpg',
    'NiceTowels(2)-57.98.jpg',
    'Pillows-45.00.jpg',
    'Pouf-36.99.jpg',
    'SaltPig-20.89.jpg',
    'Silverware-52.99.jpg',
    'StoneCoasters-16.99.jpg',
    'ThrowBlanket-47.49.jpg',
    'ThrowPillows-22.99.jpg',
    'ToiletBrushSet-23.99.jpg',
    'TowelRack-34.99.jpg',
    'TowelSet-38.99.jpg',
    'TrashBin-27.99.jpg',
    'Trivets-8.99.jpg',
    'WoodenSpoons-29.99.jpg'
  ];
  
  const amazonProducts = registryItems.map(parseItemFromFilename);
  
  return {
    amazonProducts,
    cached: false,
    timestamp: Date.now()
  };
};
