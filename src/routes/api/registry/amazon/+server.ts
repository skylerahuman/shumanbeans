import { json, error } from '@sveltejs/kit';
import * as cheerio from 'cheerio';
import type { RequestHandler } from './$types';

// Simple in-memory cache
let cachedData: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

interface Product {
  title: string;
  price: string;
  image: string;
  url: string;
  source: string;
}

async function fetchAmazonRegistry(): Promise<Product[]> {
  try {
    const registryUrl = 'https://www.amazon.com/wedding/share/shumanbeans';
    
    // Simulate Amazon registry items since actual scraping may be blocked
    // TODO: Replace with actual scraping when Amazon allows it or use official API
    const mockProducts: Product[] = [
      {
        title: 'KitchenAid Stand Mixer - Artisan Series 5-Qt',
        price: '$349.95',
        image: 'https://images.unsplash.com/photo-1588515724664-bdf7f88e49b3?w=400&h=400&fit=crop',
        url: 'https://a.co/d/dvH0YtG',
        source: 'Amazon'
      },
      {
        title: 'Chemex Classic Series Pour-Over Glass Coffee Maker - 6 Cup',
        price: '$47.20',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
        url: 'https://amazon.com/dp/B0047BIWSK',
        source: 'Amazon'
      },
      {
        title: 'Ninja Foodi Personal Blender',
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400&h=400&fit=crop',
        url: 'https://amazon.com/dp/B07GNTQXSH',
        source: 'Amazon'
      },
      {
        title: 'All-Clad D3 Stainless Steel Cookware Set, 10-Piece',
        price: '$499.95',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        url: 'https://amazon.com/dp/B00005AL5R',
        source: 'Amazon'
      },
      {
        title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
        price: '$99.95',
        image: 'https://images.unsplash.com/photo-1588515723496-6c4a37b15b89?w=400&h=400&fit=crop',
        url: 'https://amazon.com/dp/B00FLYWNYQ',
        source: 'Amazon'
      },
      {
        title: 'Vitamix 5200 Blender Professional-Grade',
        price: '$349.95',
        image: 'https://images.unsplash.com/photo-1610450949065-1f2841536c88?w=400&h=400&fit=crop',
        url: 'https://amazon.com/dp/B008H4SLV6',
        source: 'Amazon'
      },
      {
        title: 'Le Creuset Enameled Cast Iron Dutch Oven, 5.5 qt',
        price: '$349.95',
        image: 'https://images.unsplash.com/photo-1584990892821-38b9d3bb4a8d?w=400&h=400&fit=crop',
        url: 'https://amazon.com/dp/B00UQTN5OG',
        source: 'Amazon'
      },
      {
        title: 'Bamboo Cutting Board Set with Juice Groove',
        price: '$39.99',
        image: 'https://images.unsplash.com/photo-1594736797933-d0c6bf88fed9?w=400&h=400&fit=crop',
        url: 'https://amazon.com/dp/B07V8XM17Q',
        source: 'Amazon'
      }
    ];

    return mockProducts;

    // The following code would be used for actual scraping if permitted:
    // const response = await fetch(registryUrl, {
    //   headers: {
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    //     'Accept-Language': 'en-US,en;q=0.5',
    //     'Accept-Encoding': 'gzip, deflate, br',
    //     'DNT': '1',
    //     'Connection': 'keep-alive',
    //     'Upgrade-Insecure-Requests': '1'
    //   }
    // });
    // 
    // if (!response.ok) {
    //   console.error('Failed to fetch Amazon registry:', response.status, response.statusText);
    //   return [];
    // }
    // 
    // const html = await response.text();
    // const $ = cheerio.load(html);
    // 
    // const products: Product[] = [];
    // 
    // // Amazon wedding registry selectors (these may change frequently)
    // $('.g-item-sortable, [data-item-prime-info]').each((index, element) => {
    //   const $el = $(element);
    //   
    //   const title = $el.find('.a-size-base-plus, .a-truncate-cut, [data-cy="item-title"]').first().text().trim();
    //   const priceEl = $el.find('.a-price-whole, .a-offscreen, .a-price .a-offscreen').first();
    //   const price = priceEl.length > 0 ? priceEl.text().trim() : '';
    //   const imageEl = $el.find('img').first();
    //   const image = imageEl.length > 0 ? imageEl.attr('src') || imageEl.attr('data-src') || '' : '';
    //   const linkEl = $el.find('a[href*="/dp/"], a[href*="/gp/product/"]').first();
    //   const relativeUrl = linkEl.length > 0 ? linkEl.attr('href') || '' : '';
    //   const url = relativeUrl.startsWith('http') ? relativeUrl : `https://amazon.com${relativeUrl}`;
    //   
    //   if (title && title.length > 0) {
    //     products.push({
    //       title,
    //       price: price ? `$${price}` : '',
    //       image: image.startsWith('//') ? `https:${image}` : image,
    //       url,
    //       source: 'Amazon'
    //     });
    //   }
    // });
    // 
    // return products.slice(0, 20); // Limit to first 20 items
    
  } catch (err) {
    console.error('Error fetching Amazon registry:', err);
    return []; // Return empty array on error
  }
}

export const GET: RequestHandler = async () => {
  try {
    const now = Date.now();
    
    // Check if we have cached data that's still valid
    if (cachedData && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      return json({
        products: cachedData,
        cached: true,
        timestamp: cacheTimestamp
      });
    }
    
    // Fetch fresh data
    const products = await fetchAmazonRegistry();
    
    // Update cache
    cachedData = products;
    cacheTimestamp = now;
    
    return json({
      products,
      cached: false,
      timestamp: cacheTimestamp
    });
    
  } catch (err) {
    console.error('Registry API error:', err);
    throw error(500, 'Failed to fetch registry data');
  }
};
