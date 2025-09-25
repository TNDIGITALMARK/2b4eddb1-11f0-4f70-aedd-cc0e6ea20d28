'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trade, PokemonCard, User } from '@/lib/mock-data';
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeftRight,
  Package,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface TradeStatusProps {
  trade: Trade;
  userCards: PokemonCard[];
  users: User[];
  onTradeAction?: (tradeId: string, action: 'accept' | 'decline' | 'cancel') => void;
  currentUserId?: string;
  className?: string;
}

export function TradeStatus({
  trade,
  userCards,
  users,
  onTradeAction,
  currentUserId,
  className
}: TradeStatusProps) {
  const fromUser = users.find(u => u.id === trade.fromUser);
  const toUser = users.find(u => u.id === trade.toUser);
  const fromCards = userCards.filter(c => trade.fromCards.includes(c.id));
  const toCards = userCards.filter(c => trade.toCards.includes(c.id));

  const isCurrentUserInvolved = currentUserId === trade.fromUser || currentUserId === trade.toUser;
  const isInitiator = currentUserId === trade.fromUser;

  const getStatusIcon = () => {
    switch (trade.status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'declined':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (trade.status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'accepted':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'declined':
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEscrowProgress = () => {
    if (!trade.escrowStatus) return 0;

    switch (trade.escrowStatus) {
      case 'pending':
        return 0;
      case 'received_from':
        return 50;
      case 'received_to':
        return 75;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const getEscrowText = () => {
    if (!trade.escrowStatus) return 'Not started';

    switch (trade.escrowStatus) {
      case 'pending':
        return 'Waiting for cards to be sent';
      case 'received_from':
        return `Received cards from ${isInitiator ? 'you' : fromUser?.username}`;
      case 'received_to':
        return 'Both sets of cards received';
      case 'completed':
        return 'Trade completed successfully';
      default:
        return 'Unknown status';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Trade #{trade.id.slice(-6)}
          </CardTitle>

          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge className={`${getStatusColor()} text-white`}>
              {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Created {formatDate(trade.createdAt)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Trade Participants */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">From</div>
            {fromUser && (
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={fromUser.avatar} alt={fromUser.username} />
                  <AvatarFallback>
                    {fromUser.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {isInitiator ? 'You' : fromUser.username}
                </span>
                {fromUser.verified && (
                  <Shield className="w-3 h-3 text-blue-500" />
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">To</div>
            {toUser && (
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={toUser.avatar} alt={toUser.username} />
                  <AvatarFallback>
                    {toUser.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {!isInitiator && currentUserId === trade.toUser ? 'You' : toUser.username}
                </span>
                {toUser.verified && (
                  <Shield className="w-3 h-3 text-blue-500" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cards Being Traded */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Offering ({fromCards.length} cards)
            </div>
            <div className="space-y-1">
              {fromCards.map(card => (
                <div key={card.id} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-8 relative">
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-sm" />
                  </div>
                  <span className="truncate">{card.name}</span>
                  <Badge variant="outline" className="text-xs">
                    ${card.tradeValue}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Requesting ({toCards.length} cards)
            </div>
            <div className="space-y-1">
              {toCards.map(card => (
                <div key={card.id} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-8 relative">
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-sm" />
                  </div>
                  <span className="truncate">{card.name}</span>
                  <Badge variant="outline" className="text-xs">
                    ${card.tradeValue}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Escrow Status for Active Trades */}
        {trade.status === 'accepted' && trade.escrowStatus && (
          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-sm">Escrow Status</span>
            </div>

            <div className="space-y-2">
              <Progress value={getEscrowProgress()} className="h-2" />
              <div className="text-sm text-muted-foreground">
                {getEscrowText()}
              </div>
            </div>

            {trade.escrowStatus === 'pending' && (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Please send your cards to complete the trade</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {isCurrentUserInvolved && onTradeAction && (
          <div className="flex gap-2 pt-2 border-t">
            {trade.status === 'pending' && !isInitiator && (
              <>
                <Button
                  size="sm"
                  onClick={() => onTradeAction(trade.id, 'accept')}
                  className="flex-1"
                >
                  Accept Trade
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTradeAction(trade.id, 'decline')}
                  className="flex-1"
                >
                  Decline
                </Button>
              </>
            )}

            {trade.status === 'pending' && isInitiator && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTradeAction(trade.id, 'cancel')}
                className="w-full"
              >
                Cancel Trade
              </Button>
            )}

            {trade.status === 'accepted' && (
              <div className="w-full text-center text-sm text-muted-foreground">
                Trade in progress - Check escrow status above
              </div>
            )}
          </div>
        )}

        {/* Trade Value Summary */}
        <div className="flex justify-between items-center text-sm pt-2 border-t">
          <span className="text-muted-foreground">Trade Value:</span>
          <div className="flex items-center gap-2">
            <span>${fromCards.reduce((sum, card) => sum + card.tradeValue, 0)}</span>
            <ArrowLeftRight className="w-3 h-3 text-muted-foreground" />
            <span>${toCards.reduce((sum, card) => sum + card.tradeValue, 0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}