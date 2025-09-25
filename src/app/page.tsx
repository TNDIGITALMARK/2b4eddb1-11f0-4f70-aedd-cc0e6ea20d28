'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CardThumbnail } from '@/components/pokemon/CardThumbnail';
import { SearchBar, SearchFilters } from '@/components/pokemon/SearchBar';
import { UserProfile } from '@/components/pokemon/UserProfile';
import { Navigation } from '@/components/layout/Navigation';
import { mockCards, mockUsers, api, PokemonCard } from '@/lib/mock-data';
import { ArrowRight, Star, Shield, TrendingUp, Users, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function MarketplaceHub() {
  const [featuredCards, setFeaturedCards] = useState<PokemonCard[]>([]);
  const [searchResults, setSearchResults] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Mock current user
  const currentUser = mockUsers[0];

  useEffect(() => {
    loadFeaturedCards();
  }, []);

  const loadFeaturedCards = async () => {
    try {
      const cards = await api.getMarketplaceCards();
      setFeaturedCards(cards);
      setSearchResults(cards);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setIsSearching(true);
    setSearchQuery(query);

    try {
      let results = await api.getMarketplaceCards();

      // Apply search query
      if (query.trim()) {
        results = results.filter(card =>
          card.name.toLowerCase().includes(query.toLowerCase()) ||
          card.series.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Apply filters
      if (filters.rarity.length > 0) {
        results = results.filter(card => filters.rarity.includes(card.rarity));
      }

      if (filters.condition.length > 0) {
        results = results.filter(card => filters.condition.includes(card.condition));
      }

      if (filters.forTradeOnly) {
        results = results.filter(card => card.isForTrade);
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCardClick = (card: PokemonCard) => {
    // Navigate to card detail page
    window.location.href = `/card/${card.id}`;
  };

  const displayCards = searchQuery ? searchResults : featuredCards;

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentUser={currentUser} />

      <main>
        {/* Hero Section */}
        <section className="pokemon-hero-bg py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge className="pokemon-gradient text-white border-0">
                    The Ultimate Trading Hub
                  </Badge>
                  <h1 className="heading-xl text-foreground">
                    Discover, Trade & Collect Your
                    <span className="text-primary"> Dream Pokémon Cards</span>
                  </h1>
                  <p className="text-body text-muted-foreground max-w-lg">
                    Join thousands of collectors in the most trusted platform for Pokémon card trading.
                    Find rare cards, connect with verified traders, and grow your collection safely.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="gap-2" asChild>
                    <Link href="/browse">
                      Start Trading Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/how-it-works">
                      Learn How It Works
                    </Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground">Active Traders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">50K+</div>
                    <div className="text-sm text-muted-foreground">Cards Traded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4.9★</div>
                    <div className="text-sm text-muted-foreground">Trust Rating</div>
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative">
                <div className="relative w-full max-w-md mx-auto">
                  {/* Main featured card */}
                  <div className="relative z-10 transform rotate-3 pokemon-card-shadow">
                    <CardThumbnail
                      card={featuredCards[0] || mockCards[0]}
                      className="w-full max-w-xs mx-auto"
                    />
                  </div>

                  {/* Background cards */}
                  <div className="absolute top-4 -left-4 transform -rotate-12 opacity-70 z-0">
                    <CardThumbnail
                      card={featuredCards[1] || mockCards[1]}
                      className="w-48"
                    />
                  </div>
                  <div className="absolute -top-4 right-0 transform rotate-12 opacity-60 z-0">
                    <CardThumbnail
                      card={featuredCards[2] || mockCards[2]}
                      className="w-48"
                    />
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4">
                  <Badge className="bg-green-500 text-white border-0 gap-1">
                    <Shield className="w-3 h-3" />
                    Secure Trading
                  </Badge>
                </div>
                <div className="absolute bottom-0 right-0 transform translate-x-4 translate-y-4">
                  <Badge className="bg-blue-500 text-white border-0 gap-1">
                    <Star className="w-3 h-3" />
                    Verified Cards
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <SearchBar
              onSearch={handleSearch}
              className="max-w-4xl mx-auto"
            />
          </div>
        </section>

        {/* Featured Cards Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="heading-lg text-foreground">
                  {searchQuery ? `Search Results (${displayCards.length})` : 'Featured Cards'}
                </h2>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Cards matching your search' : 'Discover the most sought-after cards in our marketplace'}
                </p>
              </div>

              {!searchQuery && (
                <Button variant="outline" asChild>
                  <Link href="/browse">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>

            {isLoading || isSearching ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] bg-muted rounded-t-lg"></div>
                      <div className="p-3 space-y-2">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayCards.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {displayCards.map(card => (
                  <CardThumbnail
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card)}
                    showOwner
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="heading-md text-foreground mb-2">No cards found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Top Traders Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="heading-lg text-foreground mb-2">Top Traders This Month</h2>
              <p className="text-muted-foreground">
                Connect with our most trusted and active community members
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {mockUsers.map(user => (
                <UserProfile
                  key={user.id}
                  user={user}
                  showFullProfile={false}
                  className="p-4 bg-background rounded-lg border border-border hover:shadow-lg transition-shadow"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="heading-lg text-foreground mb-2">Why Choose PokéTrade?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built by collectors, for collectors. Experience the future of Pokémon card trading.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="heading-md">Secure Escrow</h3>
                  <p className="text-muted-foreground">
                    Your cards are protected with our secure escrow system until both parties confirm the trade.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="heading-md">Real-Time Pricing</h3>
                  <p className="text-muted-foreground">
                    Stay up-to-date with live market prices powered by TCGPlayer API integration.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="heading-md">Trusted Community</h3>
                  <p className="text-muted-foreground">
                    Join thousands of verified traders with our comprehensive rating and review system.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}