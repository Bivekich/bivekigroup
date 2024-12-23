export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface Author {
  name: string;
  image: SanityImage;
}

export interface Category {
  title: string;
  slug: { current: string };
  icon?: string;
}

export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'blockquote';
  children: Array<{
    _type: 'span';
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: 'link';
    _key: string;
    href: string;
  }>;
}

export interface CodeBlock {
  _type: 'code';
  _key: string;
  code: string;
  filename?: string;
  language: string;
}

export type PortableTextContent = Array<PortableTextBlock | CodeBlock>;

export interface Post {
  title: string;
  slug: { current: string };
  mainImage: SanityImage;
  publishedAt: string;
  excerpt: string;
  readingTime?: number;
  author?: Author;
  categories?: Category[];
  body: PortableTextContent;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  image: SanityImage;
  tags?: string[];
  url?: string;
  publishedAt: string;
}
