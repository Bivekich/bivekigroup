'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import { formatDate } from '@/lib/utils';
import { Clock, User } from 'lucide-react';
import { Post } from '@/types/sanity';

interface PostCardProps {
  post: Post;
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage)
    : '/placeholder-image.jpg';
  const authorImageUrl = post.author?.image ? urlFor(post.author.image) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.slug.current}`}>
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all dark:shadow-none dark:hover:border-primary/50">
          <div className="aspect-[16/9] relative">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories.map((category) => (
                  <span
                    key={category.slug.current}
                    className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                {post.author && (
                  <>
                    {authorImageUrl ? (
                      <Image
                        src={authorImageUrl}
                        alt={post.author.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span>{post.author.name}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                {post.readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime} мин</span>
                  </div>
                )}
                <time>{formatDate(post.publishedAt)}</time>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
