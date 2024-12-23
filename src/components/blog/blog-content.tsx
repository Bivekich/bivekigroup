'use client';

import { useState } from 'react';
import { PostCard } from '@/components/blog/post-card';
import { BlogFilters } from '@/components/blog/blog-filters';
import { Post, Category } from '@/types/sanity';

interface BlogContentProps {
  initialPosts: Post[];
  categories: Category[];
}

export function BlogContent({ initialPosts, categories }: BlogContentProps) {
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filterPosts = (category: string | null, query: string) => {
    let filtered = [...initialPosts];

    if (category) {
      filtered = filtered.filter((post) =>
        post.categories?.some((cat) => cat.slug.current === category)
      );
    }

    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower)
      );
    }

    setFilteredPosts(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPosts(selectedCategory, query);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    filterPosts(category, searchQuery);
  };

  return (
    <>
      <BlogFilters
        categories={categories}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, index) => (
          <PostCard key={post.slug.current} post={post} index={index} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory
              ? 'Статьи не найдены'
              : 'Статьи пока не опубликованы'}
          </p>
        </div>
      )}
    </>
  );
}
