// src/lib/contentful.js
import { createClient } from 'contentful';

// Ensure we only run this in a Node (server-side) environment
const isServer = typeof window === 'undefined';

let client;

if (isServer) {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!space || !accessToken) {
    throw new Error(
      'Missing Contentful environment variables. Please set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN in your .env.local file.'
    );
  }

  // Create the Contentful client only on the server
  client = createClient({
    space,
    accessToken,
  });
} else {
  // Optional: warn if you accidentally import this in client-side code
  console.warn('Warning: contentful.js was imported in a browser context.');
}

// --- Content fetch helpers --- //

export async function getHomepageSlideshow() {
  if (!client) return null;
  const entries = await client.getEntries({
    content_type: 'homepageSlideshow',
    limit: 1,
  });
  return entries.items[0] || null;
}

export async function getAboutPage() {
  if (!client) return null;
  const entries = await client.getEntries({
    content_type: 'aboutPage',
    limit: 1,
  });
  return entries.items[0] || null;
}

export async function getAllGalleryFolders() {
  if (!client) return [];
  const entries = await client.getEntries({
    content_type: 'galleryFolder',
  });
  return entries.items;
}

export async function getGalleryFolderBySlug(slug) {
  if (!client) return null;
  const entries = await client.getEntries({
    content_type: 'galleryFolder',
    'fields.slug': slug,
    limit: 1,
  });
  return entries.items[0] || null;
}

export async function getSocialLinks() {
  if (!client) return [];
  const entries = await client.getEntries({
    content_type: 'socialLink',
  });
  return entries.items;
}
