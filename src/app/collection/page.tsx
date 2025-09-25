'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CollectionGrid } from '@/components/pokemon/CollectionGrid';
import { TradeStatus } from '@/components/pokemon/TradeStatus';
import { UserProfile } from '@/components/pokemon/UserProfile';
import { Navigation } from '@/components/layout/Navigation';
import { mockCards, mockUsers, mockTrades, myCollection, PokemonCard } from '@/lib/mock-data';
import {
  TrendingUp,
  Package,
  ArrowUpDown,
  Plus,
  Star,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function MyCollectionPage() {
  const [activeTab, setActiveTab] = useState('collection');

  // Mock current user
  const currentUser = mockUsers[0];

  // Collection stats
  const totalCards = myCollection.cards.length;
  const totalValue = myCollection.totalValue;
  const activeTrades = myCollection.activeTrades.length;
  const completedTrades = 47; // Mock completed trades

  // Calculate rarity distribution
  const rarityDistribution = myCollection.cards.reduce((acc, card) => {
    acc[card.rarity] = (acc[card.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleCardClick = (card: PokemonCard) => {
    window.location.href = `/card/${card.id}`;
  };

  const handleCardAction = (card: PokemonCard, action: 'trade' | 'remove' | 'edit') => {
    console.log(`Action: ${action} on card:`, card.name);

    switch (action) {
      case 'trade':
        // Toggle trade availability
        alert(`${card.name} trade status toggled!`);
        break;
      case 'edit':
        // Open edit modal
        alert(`Edit ${card.name} details`);
        break;
      case 'remove':
        // Remove from collection
        if (confirm(`Remove ${card.name} from your collection?`)) {
          alert(`${card.name} removed from collection!`);
        }
        break;
    }
  };

  const handleTradeAction = (tradeId: string, action: 'accept' | 'decline' | 'cancel') => {
    console.log(`Trade ${tradeId}: ${action}`);
    alert(`Trade ${action}ed successfully!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentUser={currentUser} />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-xl text-foreground">My Collection</h1>
            <p className="text-muted-foreground">
              Manage your Pokémon cards and track your trading activity
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Cards
            </Button>
            <Button className="gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Find Trades
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalCards}</div>
                  <div className="text-sm text-muted-foreground">Total Cards</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">${totalValue}</div>
                  <div className="text-sm text-muted-foreground">Collection Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <ArrowUpDown className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeTrades}</div>
                  <div className="text-sm text-muted-foreground">Active Trades</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{completedTrades}</div>
                  <div className="text-sm text-muted-foreground">Completed Trades</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:grid-cols-4">
            <TabsTrigger value="collection" className="gap-2">
              <Package className="w-4 h-4" />
              My Cards
            </TabsTrigger>
            <TabsTrigger value="trades" className="gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Active Trades
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Star className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Collection Tab */}
          <TabsContent value="collection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Collection Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Rarity Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Rarity Distribution</h4>
                    {Object.entries(rarityDistribution).map(([rarity, count]) => (
                      <div key={rarity} className="flex items-center justify-between">
                        <span className="text-sm">{rarity}</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(count / totalCards) * 100}
                            className="w-20 h-2"
                          />
                          <Badge variant="outline" className="text-xs">
                            {count}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Cards
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                        <Target className="w-4 h-4" />
                        Create Wishlist
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                        <Link href="/">
                          <ArrowUpDown className="w-4 h-4" />
                          Browse Marketplace
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collection Grid */}
            <Card>
              <CardHeader>
                <CardTitle>My Cards ({totalCards})</CardTitle>
              </CardHeader>
              <CardContent>
                <CollectionGrid
                  cards={myCollection.cards}
                  onCardClick={handleCardClick}
                  onCardAction={handleCardAction}
                  editable={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Trades Tab */}
          <TabsContent value="trades" className="space-y-6">
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="heading-md">Active Trades</h3>
                  <p className="text-muted-foreground">
                    Track your ongoing trade negotiations and escrow status
                  </p>
                </div>
                <Button className="gap-2" asChild>
                  <Link href="/">
                    <Plus className="w-4 h-4" />
                    Create New Trade
                  </Link>
                </Button>
              </div>

              {myCollection.activeTrades.length > 0 ? (
                <div className="space-y-4">
                  {myCollection.activeTrades.map(trade => (
                    <TradeStatus
                      key={trade.id}
                      trade={trade}
                      userCards={mockCards}
                      users={mockUsers}
                      onTradeAction={handleTradeAction}
                      currentUserId={currentUser.id}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ArrowUpDown className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="heading-md mb-2">No Active Trades</h3>
                    <p className="text-muted-foreground mb-6">
                      Start trading to see your active negotiations here.
                    </p>
                    <Button asChild>
                      <Link href="/">Browse Marketplace</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Collection Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">+23%</div>
                      <div className="text-sm text-muted-foreground">Value increase this month</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>This Month</span>
                        <span className="font-medium">+$45.50</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center text-sm">
                      <div>
                        <div className="font-bold text-green-600">+8</div>
                        <div className="text-muted-foreground">Cards Added</div>
                      </div>
                      <div>
                        <div className="font-bold text-blue-600">12</div>
                        <div className="text-muted-foreground">Trades Made</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Trading Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{completedTrades}</div>
                      <div className="text-sm text-muted-foreground">Total completed trades</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center text-sm">
                      <div>
                        <div className="font-bold text-yellow-600">4.8★</div>
                        <div className="text-muted-foreground">Avg Rating</div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-600">3.2d</div>
                        <div className="text-muted-foreground">Avg Time</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myCollection.cards.slice(0, 3).map((card, index) => (
                    <div key={card.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                      <Badge className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                        #{index + 1}
                      </Badge>
                      <div className="w-12 h-16 relative">
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-sm" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{card.name}</h4>
                        <p className="text-sm text-muted-foreground">{card.series}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">+{(Math.random() * 20).toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">${card.tradeValue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <UserProfile user={currentUser} showFullProfile={true} />

            {/* Trading Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Trading Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Trade Value Range</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">$0-$25</Button>
                      <Button size="sm">$25-$100</Button>
                      <Button variant="outline" size="sm">$100+</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Interested Card Types</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">VMAX</Badge>
                      <Badge variant="secondary">Alternate Art</Badge>
                      <Badge variant="secondary">Secret Rare</Badge>
                      <Badge variant="outline">+ Add More</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="gap-2">
                    <Star className="w-4 h-4" />
                    Update Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}