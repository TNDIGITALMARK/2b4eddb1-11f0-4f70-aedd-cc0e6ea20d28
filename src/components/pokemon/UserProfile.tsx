'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User } from '@/lib/mock-data';
import { Star, Shield, Calendar, TrendingUp } from 'lucide-react';

interface UserProfileProps {
  user: User;
  showFullProfile?: boolean;
  className?: string;
}

export function UserProfile({ user, showFullProfile = false, className }: UserProfileProps) {
  const getRatingStars = () => {
    const fullStars = Math.floor(user.rating);
    const hasHalfStar = user.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i + fullStars} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="text-sm font-medium ml-1">{user.rating}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  if (!showFullProfile) {
    // Compact version for display in cards/modals
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">
              {user.username}
            </h3>
            {user.verified && (
              <Shield className="w-4 h-4 text-blue-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {getRatingStars()}
            <span className="text-xs text-muted-foreground">
              ({user.totalTrades} trades)
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Full profile card
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="text-lg">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">
                {user.username}
              </h2>
              {user.verified && (
                <Badge variant="secondary" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Verified
                </Badge>
              )}
            </div>

            {getRatingStars()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total Trades:</span>
            <span className="font-semibold">{user.totalTrades}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Joined:</span>
            <span className="font-semibold">{formatDate(user.joinDate)}</span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Trust Indicators</h4>
          <div className="flex flex-wrap gap-2">
            {user.verified && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                ID Verified
              </Badge>
            )}

            {user.rating >= 4.5 && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Top Rated Trader
              </Badge>
            )}

            {user.totalTrades >= 100 && (
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                Experienced Trader
              </Badge>
            )}

            {user.totalTrades >= 50 && user.rating >= 4.0 && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Reliable Partner
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {user.rating.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">
              Rating
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {user.totalTrades}
            </div>
            <div className="text-xs text-muted-foreground">
              Trades
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {Math.round(user.totalTrades / ((new Date().getTime() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30)))}
            </div>
            <div className="text-xs text-muted-foreground">
              Per Month
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}