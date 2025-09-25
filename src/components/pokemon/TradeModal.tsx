'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { PokemonCard, User } from '@/lib/mock-data';
import { CardThumbnail } from './CardThumbnail';
import { ArrowLeftRight, AlertCircle, Shield } from 'lucide-react';

interface TradeModalProps {
  open: boolean;
  onClose: () => void;
  targetCard: PokemonCard;
  targetUser: User;
  userCards: PokemonCard[];
  onSubmitTrade: (offeredCards: PokemonCard[], message: string) => void;
}

export function TradeModal({
  open,
  onClose,
  targetCard,
  targetUser,
  userCards,
  onSubmitTrade
}: TradeModalProps) {
  const [selectedCards, setSelectedCards] = useState<PokemonCard[]>([]);
  const [tradeMessage, setTradeMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCardSelection = (card: PokemonCard) => {
    setSelectedCards(prev =>
      prev.find(c => c.id === card.id)
        ? prev.filter(c => c.id !== card.id)
        : [...prev, card]
    );
  };

  const selectedValue = selectedCards.reduce((sum, card) => sum + card.tradeValue, 0);
  const targetValue = targetCard.tradeValue;
  const valueDifference = selectedValue - targetValue;
  const fairTrade = Math.abs(valueDifference) <= targetValue * 0.1; // Within 10% is considered fair

  const handleSubmit = async () => {
    if (selectedCards.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmitTrade(selectedCards, tradeMessage);
      onClose();
      setSelectedCards([]);
      setTradeMessage('');
    } catch (error) {
      console.error('Trade submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Propose Trade with {targetUser.username}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trade Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* What You Want */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">You Want</h3>
              <div className="p-3 border border-border rounded-lg">
                <CardThumbnail card={targetCard} className="max-w-[200px] mx-auto" />
                <div className="mt-2 text-center">
                  <Badge variant="secondary">${targetCard.tradeValue}</Badge>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowLeftRight className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* What You Offer */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">You Offer</h3>
              <div className="p-3 border border-border rounded-lg min-h-[280px]">
                {selectedCards.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Select cards to offer
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedCards.map(card => (
                      <div key={card.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <div className="w-12 h-16 relative">
                          <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{card.name}</p>
                          <p className="text-xs text-muted-foreground">${card.tradeValue}</p>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Value:</span>
                      <Badge variant={fairTrade ? 'default' : 'destructive'}>
                        ${selectedValue}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trade Fairness Indicator */}
          <div className={`p-3 rounded-lg border ${fairTrade ? 'border-green-500 bg-green-500/10' : 'border-yellow-500 bg-yellow-500/10'}`}>
            <div className="flex items-center gap-2 text-sm">
              {fairTrade ? (
                <>
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-green-700 dark:text-green-300">Fair Trade</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-700 dark:text-yellow-300">
                    Value difference: ${Math.abs(valueDifference).toFixed(2)}
                    {valueDifference > 0 ? ' (You offer more)' : ' (You offer less)'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Your Collection */}
          <div className="space-y-3">
            <h3 className="font-semibold">Select Cards from Your Collection</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 border border-border rounded-lg">
              {userCards.map(card => (
                <div
                  key={card.id}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    selectedCards.find(c => c.id === card.id)
                      ? 'ring-2 ring-primary scale-95'
                      : 'hover:scale-105'
                  }`}
                  onClick={() => toggleCardSelection(card)}
                >
                  <CardThumbnail card={card} />
                  {selectedCards.find(c => c.id === card.id) && (
                    <div className="absolute top-1 left-1 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trade Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Message (Optional)</label>
            <Textarea
              placeholder="Add a message to your trade offer..."
              value={tradeMessage}
              onChange={(e) => setTradeMessage(e.target.value)}
              className="min-h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedCards.length === 0 || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? 'Submitting...' : 'Propose Trade'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}