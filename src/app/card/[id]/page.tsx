'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PriceChart } from '@/components/pokemon/PriceChart';
import { UserProfile } from '@/components/pokemon/UserProfile';
import { TradeModal } from '@/components/pokemon/TradeModal';
import { Navigation } from '@/components/layout/Navigation';
import { mockCards, mockUsers, api, myCollection, PokemonCard, User } from '@/lib/mock-data';
import {
  ArrowLeft,
  Heart,
  Share2,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Shield,
  Package,
  AlertCircle
} from 'lucide-react';

export default function CardDetailPage() {
  const params = useParams();
  const cardId = params.id as string;

  const [card, setCard] = useState<PokemonCard | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [priceHistory, setPriceHistory] = useState<{date: string, price: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock current user
  const currentUser = mockUsers[0];

  useEffect(() => {
    if (cardId) {
      loadCardDetails();
    }
  }, [cardId]);

  const loadCardDetails = async () => {
    try {
      setIsLoading(true);

      // Load card details
      const cardData = await api.getCardById(cardId);
      setCard(cardData);

      if (cardData?.owner) {
        // Load owner details
        const ownerData = await api.getUserById(cardData.owner);
        setOwner(ownerData);
      }

      // Load price history
      const priceData = await api.getPriceHistory(cardId);
      setPriceHistory(priceData);

      // Mock wishlist status
      setIsWishlisted(Math.random() > 0.5);
    } catch (error) {
      console.error('Error loading card details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTradeSubmit = async (offeredCards: PokemonCard[], message: string) => {
    if (!card || !owner) return;

    try {
      const trade = await api.createTrade({
        fromUser: currentUser.id,
        toUser: owner.id,
        fromCards: offeredCards.map(c => c.id),
        toCards: [card.id],
        status: 'pending'
      });

      console.log('Trade created:', trade);
      // Show success message
      alert('Trade offer sent successfully!');
    } catch (error) {
      console.error('Failed to create trade:', error);
      alert('Failed to send trade offer. Please try again.');
    }
  };

  const getTrendIcon = () => {
    if (!card) return null;

    switch (card.price.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRarityColor = () => {
    if (!card) return 'bg-gray-500';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentUser={currentUser} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-[3/4] bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentUser={currentUser} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h1 className="heading-lg mb-2">Card Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The card you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/">Return to Marketplace</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canTrade = card.isForTrade && owner && owner.id !== currentUser.id;

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentUser={currentUser} />

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Link>
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Panel - Card Image */}
          <div className="space-y-6">
            <Card className="pokemon-card-shadow">
              <CardContent className="p-6">
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Rarity Badge */}
                  <Badge className={`absolute top-4 right-4 text-white font-bold ${getRarityColor()} border-0`}>
                    {card.rarity}
                  </Badge>

                  {/* Trade Status */}
                  {card.isForTrade ? (
                    <Badge className="absolute top-4 left-4 bg-green-500 text-white border-0">
                      Available for Trade
                    </Badge>
                  ) : (
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0">
                      Not for Trade
                    </Badge>
                  )}

                  {/* Condition */}
                  <Badge className="absolute bottom-4 left-4 bg-black/70 text-white border-0">
                    {card.condition}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex-1 gap-2 ${isWishlisted ? 'text-red-500 border-red-500' : ''}`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </Button>

                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Owner Profile */}
            {owner && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Card Owner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserProfile user={owner} showFullProfile={false} />

                  {owner.id !== currentUser.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Message
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Card Details & Trading */}
          <div className="space-y-6">
            {/* Card Information */}
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <h1 className="heading-lg">{card.name}</h1>
                  <p className="text-muted-foreground">{card.series}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price Information */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Market Price</h3>
                    {getTrendIcon()}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        ${card.price.market}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current Market
                      </div>
                    </div>

                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-muted-foreground">
                        ${card.price.tcgPlayer}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        TCGPlayer
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-xl font-bold text-primary">
                      ${card.tradeValue}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Trade Value
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Card Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Card Details</h3>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Rarity:</span>
                      <Badge className={`ml-2 text-white ${getRarityColor()} border-0`}>
                        {card.rarity}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Condition:</span>
                      <Badge variant="outline" className="ml-2">
                        {card.condition}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Series:</span>
                      <span className="ml-2 font-medium">{card.series}</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Trade Status:</span>
                      <Badge
                        variant={card.isForTrade ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {card.isForTrade ? 'Available' : 'Not Available'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Trading Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Secure Trading
                  </h3>

                  {canTrade ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                          <Shield className="w-4 h-4" />
                          <span className="font-medium">Ready to Trade</span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          This card is available for trading with escrow protection.
                        </p>
                      </div>

                      <Button
                        className="w-full gap-2"
                        size="lg"
                        onClick={() => setIsTradeModalOpen(true)}
                      >
                        <Package className="w-4 h-4" />
                        Propose Trade
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        All trades are protected by our secure escrow system
                      </p>
                    </div>
                  ) : card.owner === currentUser.username ? (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Star className="w-4 h-4" />
                        <span className="font-medium">You Own This Card</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        This card is in your collection.
                      </p>
                    </div>
                  ) : !card.isForTrade ? (
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Not Available for Trade</span>
                      </div>
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                        The owner has not made this card available for trading.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Cannot Trade</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Trading is not available for this card.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Price Chart */}
        {priceHistory.length > 0 && (
          <PriceChart
            data={priceHistory}
            cardName={card.name}
            currentPrice={card.price.market}
            className="mb-8"
          />
        )}
      </main>

      {/* Trade Modal */}
      {canTrade && (
        <TradeModal
          open={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
          targetCard={card}
          targetUser={owner!}
          userCards={myCollection.cards}
          onSubmitTrade={handleTradeSubmit}
        />
      )}
    </div>
  );
}