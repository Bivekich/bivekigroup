'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import * as Icons from 'lucide-react';

interface Category {
  title: string;
  slug: { current: string };
  icon?: string;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  const getIconComponent = (iconName: string): JSX.Element | null => {
    const IconComponent = (
      Icons as unknown as Record<
        string,
        React.ComponentType<{ className?: string }>
      >
    )[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  return (
    <div className="space-y-4 mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="search"
          placeholder="Поиск статей..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="gap-2"
        >
          <Search className="w-4 h-4" />
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
            className="gap-2"
          >
            {category.icon ? (
              getIconComponent(category.icon)
            ) : (
              <Search className="w-4 h-4" />
            )}
            {category.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
