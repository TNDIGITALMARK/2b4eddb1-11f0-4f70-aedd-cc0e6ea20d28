'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  className?: string;
}

export interface SearchFilters {
  rarity: string[];
  priceRange: { min: number; max: number } | null;
  condition: string[];
  forTradeOnly: boolean;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    rarity: [],
    priceRange: null,
    condition: [],
    forTradeOnly: false
  });

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(query, newFilters);
  };

  const toggleArrayFilter = (key: 'rarity' | 'condition', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    handleFilterChange(key, newArray);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      rarity: [],
      priceRange: null,
      condition: [],
      forTradeOnly: false
    };
    setFilters(clearedFilters);
    onSearch(query, clearedFilters);
  };

  const activeFiltersCount =
    filters.rarity.length +
    filters.condition.length +
    (filters.priceRange ? 1 : 0) +
    (filters.forTradeOnly ? 1 : 0);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search for Pokémon cards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} className="px-6">
          Search
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            {/* Rarity Filter */}
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              Rarity
            </div>
            {['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Secret Rare'].map((rarity) => (
              <DropdownMenuCheckboxItem
                key={rarity}
                checked={filters.rarity.includes(rarity)}
                onCheckedChange={() => toggleArrayFilter('rarity', rarity)}
              >
                {rarity}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            {/* Condition Filter */}
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              Condition
            </div>
            {['Mint', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played'].map((condition) => (
              <DropdownMenuCheckboxItem
                key={condition}
                checked={filters.condition.includes(condition)}
                onCheckedChange={() => toggleArrayFilter('condition', condition)}
              >
                {condition}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            {/* Trade Status Filter */}
            <DropdownMenuCheckboxItem
              checked={filters.forTradeOnly}
              onCheckedChange={(checked) => handleFilterChange('forTradeOnly', checked)}
            >
              Available for Trade Only
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filters Display */}
        {filters.rarity.map((rarity) => (
          <Badge key={rarity} variant="secondary" className="gap-1">
            {rarity}
            <X
              className="w-3 h-3 cursor-pointer"
              onClick={() => toggleArrayFilter('rarity', rarity)}
            />
          </Badge>
        ))}

        {filters.condition.map((condition) => (
          <Badge key={condition} variant="secondary" className="gap-1">
            {condition}
            <X
              className="w-3 h-3 cursor-pointer"
              onClick={() => toggleArrayFilter('condition', condition)}
            />
          </Badge>
        ))}

        {filters.forTradeOnly && (
          <Badge variant="secondary" className="gap-1">
            For Trade Only
            <X
              className="w-3 h-3 cursor-pointer"
              onClick={() => handleFilterChange('forTradeOnly', false)}
            />
          </Badge>
        )}

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}