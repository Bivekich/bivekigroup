'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface Category {
  title: string;
  slug: { current: string };
}

interface BlogFiltersProps {
  categories: Category[];
  onSearch: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
  selectedCategory: string | null;
}

export function BlogFilters({
  categories,
  onSearch,
  onCategoryChange,
  selectedCategory,
}: BlogFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="mb-12">
      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Поиск по статьям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button type="submit">
          <Search className="w-4 h-4 mr-2" />
          Найти
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(null)}
        >
          Все статьи
        </Button>
        {categories.map((category) => (
          <Button
            key={category.slug.current}
            variant={
              selectedCategory === category.slug.current ? 'default' : 'outline'
            }
            size="sm"
            onClick={() => onCategoryChange(category.slug.current)}
          >
            {category.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
