// Mock data for Pokemon Card Trading Platform

export interface PokemonCard {
  id: string;
  name: string;
  series: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare' | 'Secret Rare';
  price: {
    tcgPlayer: number;
    market: number;
    trend: 'up' | 'down' | 'stable';
  };
  image: string;
  condition: 'Mint' | 'Near Mint' | 'Lightly Played' | 'Moderately Played' | 'Heavily Played';
  owner?: string;
  isForTrade: boolean;
  tradeValue: number;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  rating: number;
  totalTrades: number;
  verified: boolean;
  joinDate: string;
}

export interface Trade {
  id: string;
  fromUser: string;
  toUser: string;
  fromCards: string[];
  toCards: string[];
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  createdAt: string;
  escrowStatus?: 'pending' | 'received_from' | 'received_to' | 'completed';
}

// Mock Pokemon Cards
export const mockCards: PokemonCard[] = [
  {
    id: '1',
    name: 'Charizard VMAX',
    series: 'Darkness Ablaze',
    rarity: 'Ultra Rare',
    price: {
      tcgPlayer: 89.99,
      market: 85.50,
      trend: 'up'
    },
    image: '/api/placeholder/300/420',
    condition: 'Near Mint',
    owner: 'TrainerAsh92',
    isForTrade: true,
    tradeValue: 85
  },
  {
    id: '2',
    name: 'Pikachu VMAX',
    series: 'Vivid Voltage',
    rarity: 'Ultra Rare',
    price: {
      tcgPlayer: 45.99,
      market: 42.00,
      trend: 'stable'
    },
    image: '/api/placeholder/300/420',
    condition: 'Mint',
    owner: 'CardMasterMisty',
    isForTrade: true,
    tradeValue: 42
  },
  {
    id: '3',
    name: 'Umbreon VMAX',
    series: 'Evolving Skies',
    rarity: 'Ultra Rare',
    price: {
      tcgPlayer: 67.99,
      market: 65.25,
      trend: 'down'
    },
    image: '/api/placeholder/300/420',
    condition: 'Near Mint',
    owner: 'EliteFourBrock',
    isForTrade: false,
    tradeValue: 65
  },
  {
    id: '4',
    name: 'Rayquaza V',
    series: 'Evolving Skies',
    rarity: 'Rare',
    price: {
      tcgPlayer: 28.99,
      market: 30.50,
      trend: 'up'
    },
    image: '/api/placeholder/300/420',
    condition: 'Mint',
    isForTrade: true,
    tradeValue: 30
  },
  {
    id: '5',
    name: 'Leafeon V',
    series: 'Evolving Skies',
    rarity: 'Rare',
    price: {
      tcgPlayer: 12.99,
      market: 14.75,
      trend: 'stable'
    },
    image: '/api/placeholder/300/420',
    condition: 'Near Mint',
    isForTrade: true,
    tradeValue: 14
  },
  {
    id: '6',
    name: 'Glaceon V',
    series: 'Evolving Skies',
    rarity: 'Rare',
    price: {
      tcgPlayer: 15.99,
      market: 16.25,
      trend: 'up'
    },
    image: '/api/placeholder/300/420',
    condition: 'Mint',
    isForTrade: true,
    tradeValue: 16
  }
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'TrainerAsh92',
    avatar: '/api/placeholder/40/40',
    rating: 4.8,
    totalTrades: 127,
    verified: true,
    joinDate: '2022-03-15'
  },
  {
    id: 'user2',
    username: 'CardMasterMisty',
    avatar: '/api/placeholder/40/40',
    rating: 4.9,
    totalTrades: 89,
    verified: true,
    joinDate: '2021-11-08'
  },
  {
    id: 'user3',
    username: 'EliteFourBrock',
    avatar: '/api/placeholder/40/40',
    rating: 4.7,
    totalTrades: 203,
    verified: true,
    joinDate: '2020-07-22'
  }
];

// Mock Trades
export const mockTrades: Trade[] = [
  {
    id: 'trade1',
    fromUser: 'user1',
    toUser: 'user2',
    fromCards: ['1'],
    toCards: ['2'],
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    escrowStatus: 'pending'
  }
];

// Simulated API functions
export const api = {
  // Get all cards available for trading
  getMarketplaceCards: async (): Promise<PokemonCard[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCards.filter(card => card.isForTrade));
      }, 500);
    });
  },

  // Get specific card details
  getCardById: async (id: string): Promise<PokemonCard | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCards.find(card => card.id === id) || null);
      }, 300);
    });
  },

  // Get user profile
  getUserById: async (id: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers.find(user => user.id === id) || null);
      }, 300);
    });
  },

  // Create trade offer
  createTrade: async (trade: Omit<Trade, 'id' | 'createdAt'>): Promise<Trade> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTrade: Trade = {
          ...trade,
          id: `trade_${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        resolve(newTrade);
      }, 800);
    });
  },

  // Get price history for a card (simulated)
  getPriceHistory: async (cardId: string): Promise<{date: string, price: number}[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock price history for the last 30 days
        const history = [];
        const baseCard = mockCards.find(c => c.id === cardId);
        const basePrice = baseCard?.price.market || 50;

        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const variation = (Math.random() - 0.5) * 0.2; // +/- 10% variation
          const price = basePrice * (1 + variation);

          history.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(price * 100) / 100
          });
        }

        resolve(history);
      }, 600);
    });
  },

  // Search cards
  searchCards: async (query: string): Promise<PokemonCard[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockCards.filter(card =>
          card.name.toLowerCase().includes(query.toLowerCase()) ||
          card.series.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 400);
    });
  }
};

// Collection management for current user
export const myCollection = {
  cards: mockCards.slice(0, 3), // User owns first 3 cards
  activeTrades: mockTrades.filter(trade => trade.status === 'pending'),
  totalValue: mockCards.slice(0, 3).reduce((sum, card) => sum + card.tradeValue, 0)
};