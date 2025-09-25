'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceData {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: PriceData[];
  cardName: string;
  currentPrice: number;
  className?: string;
}

export function PriceChart({ data, cardName, currentPrice, className }: PriceChartProps) {
  const { trend, percentChange, minPrice, maxPrice } = useMemo(() => {
    if (!data || data.length < 2) {
      return { trend: 'stable', percentChange: 0, minPrice: 0, maxPrice: 0 };
    }

    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;

    const prices = data.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return {
      trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable',
      percentChange: change,
      minPrice: min,
      maxPrice: max
    };
  }, [data]);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#10B981'; // green
      case 'down':
        return '#EF4444'; // red
      default:
        return '#3B82F6'; // blue
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{formatDate(label)}</p>
          <p className="text-sm text-primary">
            Price: <span className="font-bold">${payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Price History - {cardName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No price data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Price History - {cardName}</CardTitle>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-500' :
              trend === 'down' ? 'text-red-500' :
              'text-gray-500'
            }`}>
              {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Price Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              ${currentPrice.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              Current
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              ${maxPrice.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              30-Day High
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              ${minPrice.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              30-Day Low
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={['dataMin - 5', 'dataMax + 5']}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={customTooltip} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={getTrendColor()}
                strokeWidth={2.5}
                dot={{
                  fill: getTrendColor(),
                  strokeWidth: 2,
                  r: 4
                }}
                activeDot={{
                  r: 6,
                  stroke: getTrendColor(),
                  strokeWidth: 2,
                  fill: 'hsl(var(--background))'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Analysis */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Market Analysis:</span>
            {trend === 'up' && (
              <span className="text-green-600">
                Strong upward trend over the past 30 days
              </span>
            )}
            {trend === 'down' && (
              <span className="text-red-600">
                Declining trend over the past 30 days
              </span>
            )}
            {trend === 'stable' && (
              <span className="text-gray-600">
                Price has remained relatively stable
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}