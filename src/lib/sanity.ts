import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { SanityImage } from '@/types/sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
  perspective: 'published',
});

const builder = imageUrlBuilder(client);

export function urlFor(
  source: SanityImage | SanityImageSource | null | undefined
): string {
  if (!source || Object.keys(source).length === 0) {
    return '/placeholder-image.jpg';
  }
  return builder.image(source).url();
}
