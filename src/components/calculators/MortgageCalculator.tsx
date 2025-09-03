import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calculator, Home, TrendingUp, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n';

interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  paymentBreakdown: Array<{
    year: number;
    payment: number;
    interest: number;
    principal: number;
    remainingBalance: number;
  }>;
}

export const MortgageCalculator = () => {
  const { t } = useTranslation();
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [downPayment, setDownPayment] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [result, setResult] = useState<MortgageResult | null>(null);

  const calculateMortgage = () => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      const monthlyPayment = principal / numberOfPayments;
      setResult({
        monthlyPayment,
        totalPayment: principal,
        totalInterest: 0,
        paymentBreakdown: []
      });
      return;
    }

    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Calculate year-by-year breakdown
    const paymentBreakdown = [];
    let remainingBalance = principal;

    for (let year = 1; year <= loanTerm; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let month = 1; month <= 12 && remainingBalance > 0; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        remainingBalance -= principalPayment;
      }

      paymentBreakdown.push({
        year,
        payment: monthlyPayment * 12,
        interest: yearlyInterest,
        principal: yearlyPrincipal,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      paymentBreakdown
    });
  };

  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, downPayment, interestRate, loanTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Calculateur de Crédit Immobilier
          </CardTitle>
          <CardDescription>
            Calculez votre mensualité et simulez votre crédit immobilier au Maroc
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="loanAmount">Prix du bien (MAD)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="downPayment">Apport personnel (MAD)</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Minimum requis: {formatCurrency(loanAmount * 0.1)} (10%)
                </p>
              </div>

              <div>
                <Label htmlFor="interestRate">Taux d'intérêt (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Taux moyen au Maroc: 4.5% - 6.5%
                </p>
              </div>

              <div>
                <Label htmlFor="loanTerm">Durée du crédit (années)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card className="bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Mensualité</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(result.monthlyPayment)}
                          </p>
                        </div>
                        <Home className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-2">
                    <Card>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground">Montant emprunté</p>
                        <p className="text-sm font-semibold">
                          {formatCurrency(loanAmount - downPayment)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground">Coût total</p>
                        <p className="text-sm font-semibold">
                          {formatCurrency(result.totalPayment)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground">Intérêts totaux</p>
                        <p className="text-sm font-semibold text-destructive">
                          {formatCurrency(result.totalInterest)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground">Taux d'endettement</p>
                        <p className="text-sm font-semibold">
                          <Badge variant="outline">
                            {((result.monthlyPayment / (loanAmount * 0.25)) * 100).toFixed(1)}%
                          </Badge>
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Conditions générales au Maroc:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Apport minimum: 10% du prix du bien</li>
                  <li>• Durée maximum: 25 ans (30 ans pour certaines banques)</li>
                  <li>• Taux d'endettement maximum: 40% des revenus nets</li>
                  <li>• Assurance décès-invalidité obligatoire</li>
                  <li>• Frais de dossier: 1% à 1.5% du montant emprunté</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};