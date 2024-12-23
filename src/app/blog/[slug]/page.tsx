import { client } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/portable-text-components';
import { Post } from '@/types/sanity';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 0;

async function getPost(slug: string): Promise<Post | null> {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      title,
      mainImage,
      publishedAt,
      body,
      excerpt
    }`,
    { slug },
    { next: { revalidate: 0 } }
  );
  return post;
}

export async function generateStaticParams() {
  const posts = await client.fetch(`
    *[_type == "post"] {
      slug
    }
  `);

  return posts.map((post: { slug: { current: string } }) => ({
    slug: post.slug.current,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Статья не найдена',
    };
  }

  return {
    title: `${post.title} | Biveki Group`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <time className="text-muted-foreground">
            {formatDate(post.publishedAt)}
          </time>
        </header>

        {post.mainImage && (
          <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-12">
            <Image
              src={urlFor(post.mainImage)}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>
      </div>
    </article>
  );
}
