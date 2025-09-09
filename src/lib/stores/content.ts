// Simple in-memory content store for admin editable content
// In production, you might want to use a database or file storage

interface ContentItem {
  id: string;
  content: string;
  lastModified: string;
  modifiedBy: string;
}

// Default content for the website
const defaultContent: Record<string, ContentItem> = {
  'hero-title': {
    id: 'hero-title',
    content: 'The Shumanbeans',
    lastModified: new Date().toISOString(),
    modifiedBy: 'system'
  },
  'hero-subtitle': {
    id: 'hero-subtitle',
    content: 'Two hearts, one journey, endless coffee',
    lastModified: new Date().toISOString(),
    modifiedBy: 'system'
  },
  'hero-date': {
    id: 'hero-date',
    content: 'November 22, 2025',
    lastModified: new Date().toISOString(),
    modifiedBy: 'system'
  },
  'story-intro': {
    id: 'story-intro',
    content: 'Our love story began with a shared love of coffee and late-night conversations...',
    lastModified: new Date().toISOString(),
    modifiedBy: 'system'
  }
};

// In-memory store (resets on server restart)
let contentStore: Record<string, ContentItem> = { ...defaultContent };

export function getContent(contentId: string): ContentItem | null {
  return contentStore[contentId] || null;
}

export function updateContent(contentId: string, content: string, modifiedBy: string): ContentItem {
  const item: ContentItem = {
    id: contentId,
    content,
    lastModified: new Date().toISOString(),
    modifiedBy
  };
  
  contentStore[contentId] = item;
  return item;
}

export function getAllContent(): Record<string, ContentItem> {
  return { ...contentStore };
}

export function initializeDefaultContent(): void {
  // Merge default content with existing content, preferring existing
  contentStore = { ...defaultContent, ...contentStore };
}
