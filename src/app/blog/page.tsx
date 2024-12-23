import { client } from '@/lib/sanity';
import { Metadata } from 'next';
import { pagesMetadata } from '../metadata';
import { BlogContent } from '@/components/blog/blog-content';

export const metadata: Metadata = {
  title: pagesMetadata['/blog'].title,
  description: pagesMetadata['/blog'].description,
};

export const revalidate = 0;

async function getPosts() {
  const posts = await client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      title,
      slug,
      mainImage,
      publishedAt,
      excerpt,
      readingTime,
      author->{
        name,
        image
      },
      categories[]->{
        title,
        slug,
        icon
      }
    }`,
    {},
    { next: { revalidate: 0 } }
  );
  return posts;
}

async function getCategories() {
  const categories = await client.fetch(
    `*[_type == "category"] {
      title,
      slug,
      icon
    }`
  );
  return categories;
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  return (
    <div className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Блог</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Статьи о веб-разработке, интернет-маркетинге и развитии бизнеса в
            digital-среде
          </p>
        </div>

        <BlogContent initialPosts={posts} categories={categories} />
      </div>
    </div>
  );
}
