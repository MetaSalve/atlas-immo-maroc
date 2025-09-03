import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExchangeRate {
  MAD: number;
  EUR: number;
  USD: number;
  GBP: number;
}

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState<number>(1000000);
  const [fromCurrency, setFromCurrency] = useState<string>('MAD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [rates, setRates] = useState<ExchangeRate>({
    MAD: 1,
    EUR: 0.094, // 1 MAD = 0.094 EUR (approximatif)
    USD: 0.10,  // 1 MAD = 0.10 USD (approximatif)
    GBP: 0.081  // 1 MAD = 0.081 GBP (approximatif)
  });

  const currencies = [
    { code: 'MAD', name: 'Dirham Marocain', symbol: 'DH' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'Dollar Américain', symbol: '$' },
    { code: 'GBP', name: 'Livre Sterling', symbol: '£' }
  ];

  const convert = (value: number, from: string, to: string): number => {
    if (from === to) return value;
    
    // Convert to MAD first, then to target currency
    const inMAD = from === 'MAD' ? value : value / rates[from as keyof ExchangeRate];
    const result = to === 'MAD' ? inMAD : inMAD * rates[to as keyof ExchangeRate];
    
    return result;
  };

  const convertedAmount = convert(amount, fromCurrency, toCurrency);

  const formatCurrency = (value: number, currency: string): string => {
    const currencyData = currencies.find(c => c.code === currency);
    if (!currencyData) return value.toLocaleString();

    return new Intl.NumberFormat('fr-MA', {
      style: 'decimal',
      minimumFractionDigits: currency === 'MAD' ? 0 : 2,
      maximumFractionDigits: currency === 'MAD' ? 0 : 2
    }).format(value) + ' ' + currencyData.symbol;
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Simulation de taux de change historiques
  const getExchangeRateTrend = (currency: string): { trend: 'up' | 'down', percentage: number } => {
    const trends = {
      EUR: { trend: 'up' as const, percentage: 2.3 },
      USD: { trend: 'down' as const, percentage: 1.1 },
      GBP: { trend: 'up' as const, percentage: 0.8 }
    };
    return trends[currency as keyof typeof trends] || { trend: 'up', percentage: 0 };
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Convertisseur de Devises
        </CardTitle>
        <CardDescription>
          Convertissez entre Dirham Marocain et devises internationales
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Montant</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">De</label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currency.code}</span>
                      <span className="text-sm text-muted-foreground">{currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vers</label>
            <div className="flex gap-2">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency.code}</span>
                        <span className="text-sm text-muted-foreground">{currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={swapCurrencies}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Résultat</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(convertedAmount, toCurrency)}
            </p>
            {fromCurrency !== 'MAD' && toCurrency !== 'MAD' && (
              <p className="text-sm text-muted-foreground">
                1 {fromCurrency} = {formatCurrency(convert(1, fromCurrency, toCurrency), toCurrency)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currencies.filter(c => c.code !== 'MAD').map(currency => {
            const rate = convert(1, 'MAD', currency.code);
            const trend = getExchangeRateTrend(currency.code);
            
            return (
              <Card key={currency.code} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{currency.code}</p>
                    <p className="text-xs text-muted-foreground">1 MAD</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(rate, currency.code)}
                    </p>
                    <div className={`flex items-center gap-1 text-xs ${
                      trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-3 w-3 ${trend.trend === 'down' ? 'rotate-180' : ''}`} />
                      {trend.percentage}%
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          * Taux indicatifs - Consultez votre banque pour les taux officiels
        </div>
      </CardContent>
    </Card>
  );
};