'use client';

import { useState } from 'react';
import { PokemonCard } from '@/lib/mock-data';
import { CardThumbnail } from './CardThumbnail';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { LayoutGrid, List, Filter, SortAsc, MoreVertical } from 'lucide-react';

interface CollectionGridProps {
  cards: PokemonCard[];
  onCardClick: (card: PokemonCard) => void;
  onCardAction?: (card: PokemonCard, action: 'trade' | 'remove' | 'edit') => void;
  editable?: boolean;
  className?: string;
}

type SortOption = 'name' | 'value' | 'rarity' | 'recent';
type ViewMode = 'grid' | 'list';

export function CollectionGrid({
  cards,
  onCardClick,
  onCardAction,
  editable = false,
  className
}: CollectionGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [draggedCard, setDraggedCard] = useState<PokemonCard | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const sortedCards = [...cards].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'value':
        return b.tradeValue - a.tradeValue;
      case 'rarity':
        const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Secret Rare'];
        return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
      case 'recent':
        // Mock recent sort - in real app this would be based on date added
        return a.id.localeCompare(b.id);
      default:
        return 0;
    }
  });

  const handleDragStart = (e: React.DragEvent, card: PokemonCard) => {
    if (!editable) return;
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!editable || !draggedCard) return;
    e.preventDefault();
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = () => {
    if (!editable) return;
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    if (!editable || !draggedCard) return;
    e.preventDefault();

    // In a real app, you would reorder the cards here
    console.log('Moving card', draggedCard.name, 'to position', targetIndex);

    setDraggedCard(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverIndex(null);
  };

  const totalValue = cards.reduce((sum, card) => sum + card.tradeValue, 0);

  if (cards.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-muted-foreground mb-4">
          <LayoutGrid className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No cards in your collection yet</p>
          <p className="text-sm mt-2">Start trading to build your collection!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {cards.length} cards • Total value: <Badge variant="outline">${totalValue}</Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SortAsc className="w-4 h-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('value')}>
                Value (High to Low)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('rarity')}>
                Rarity (Rare First)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('recent')}>
                Recently Added
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode */}
          <div className="flex border border-border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sortedCards.map((card, index) => (
            <div
              key={card.id}
              draggable={editable}
              onDragStart={(e) => handleDragStart(e, card)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group transition-all duration-200 ${
                dragOverIndex === index ? 'scale-105 z-10' : ''
              } ${
                draggedCard?.id === card.id ? 'opacity-50' : ''
              }`}
            >
              <CardThumbnail
                card={card}
                onClick={() => onCardClick(card)}
                className="h-full"
              />

              {/* Action Menu */}
              {editable && onCardAction && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onCardAction(card, 'trade')}>
                      Put up for Trade
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCardAction(card, 'edit')}>
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onCardAction(card, 'remove')}
                      className="text-red-600"
                    >
                      Remove from Collection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Drag indicator */}
              {editable && (
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                    Drag to reorder
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {sortedCards.map((card, index) => (
            <div
              key={card.id}
              draggable={editable}
              onDragStart={(e) => handleDragStart(e, card)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-4 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 ${
                dragOverIndex === index ? 'bg-primary/10 border-primary' : ''
              } ${
                draggedCard?.id === card.id ? 'opacity-50' : ''
              }`}
              onClick={() => onCardClick(card)}
            >
              <div className="w-16 h-20 relative flex-shrink-0">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{card.name}</h3>
                <p className="text-sm text-muted-foreground">{card.series}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {card.rarity}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {card.condition}
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold">${card.tradeValue}</div>
                <div className="text-xs text-muted-foreground">
                  Trade Value
                </div>
              </div>

              {editable && onCardAction && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onCardAction(card, 'trade')}>
                      Put up for Trade
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCardAction(card, 'edit')}>
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onCardAction(card, 'remove')}
                      className="text-red-600"
                    >
                      Remove from Collection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}