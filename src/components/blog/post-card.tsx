'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import { Clock, User } from 'lucide-react';
import { Post } from '@/types/sanity';
import * as Icons from 'lucide-react';

interface PostCardProps {
  post: Post;
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const imageUrl =
    post.mainImage && Object.keys(post.mainImage).length > 0
      ? urlFor(post.mainImage)
      : '/placeholder-image.jpg';
  const authorImageUrl =
    post.author?.image && Object.keys(post.author.image).length > 0
      ? urlFor(post.author.image)
      : null;

  const shortDate = new Date(post.publishedAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });

  // Функция для получения иконки по имени
  const getIconComponent = (iconName: string): JSX.Element | null => {
    const Icon = (
      Icons as unknown as Record<
        string,
        React.ComponentType<{ className?: string }>
      >
    )[iconName];
    return Icon ? <Icon className="w-3 h-3" /> : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/blog/${post.slug.current}`}>
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all dark:shadow-none dark:hover:border-primary/50 h-full flex flex-col">
          <div className="aspect-[16/9] relative">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col flex-grow p-6">
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories.map((category) => (
                  <span
                    key={category.slug.current}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full"
                  >
                    {category.icon && getIconComponent(category.icon)}
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            <div className="flex-grow">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground line-clamp-3 mb-4">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm pt-4 border-t">
              <div className="flex items-center gap-2 min-w-0">
                {post.author && (
                  <>
                    {authorImageUrl ? (
                      <Image
                        src={authorImageUrl}
                        alt={post.author.name}
                        width={24}
                        height={24}
                        className="rounded-full shrink-0"
                      />
                    ) : (
                      <User className="w-5 h-5 shrink-0" />
                    )}
                    <span className="text-muted-foreground truncate">
                      {post.author.name}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {post.readingTime && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{post.readingTime}м</span>
                  </div>
                )}
                <time className="text-muted-foreground">{shortDate}</time>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
