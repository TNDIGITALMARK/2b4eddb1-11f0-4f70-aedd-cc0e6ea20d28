'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PokemonCard } from '@/lib/mock-data';
import { TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';

interface CardThumbnailProps {
  card: PokemonCard;
  onClick?: () => void;
  showOwner?: boolean;
  className?: string;
}

export function CardThumbnail({ card, onClick, showOwner = false, className }: CardThumbnailProps) {
  const getTrendIcon = () => {
    switch (card.price.trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getRarityColor = () => {
    switch (card.rarity) {
      case 'Secret Rare':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Ultra Rare':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'Rare':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Uncommon':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  return (
    <Card
      className={`group transition-all duration-300 hover:scale-105 hover:shadow-xl pokemon-card-shadow cursor-pointer ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Card Image */}
          <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
            <Image
              src={card.image}
              alt={card.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Rarity Badge */}
            <Badge className={`absolute top-2 right-2 text-white text-xs font-bold ${getRarityColor()} border-0`}>
              {card.rarity}
            </Badge>

            {/* Trade Status */}
            {card.isForTrade && (
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                For Trade
              </div>
            )}

            {/* Condition Badge */}
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
              {card.condition}
            </div>
          </div>

          {/* Card Info */}
          <div className="p-3 space-y-2">
            <div>
              <h3 className="font-bold text-sm truncate text-foreground">
                {card.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {card.series}
              </p>
            </div>

            {/* Price Info */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">
                  ${card.price.market}
                </span>
                <span className="text-xs text-muted-foreground">
                  TCG: ${card.price.tcgPlayer}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                {card.price.trend === 'up' && (
                  <span className="text-xs text-green-500 font-medium">
                    +{((card.price.market - card.price.tcgPlayer) / card.price.tcgPlayer * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>

            {/* Owner Info */}
            {showOwner && card.owner && (
              <div className="flex items-center space-x-2 pt-1 border-t border-border">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Star className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  {card.owner}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}