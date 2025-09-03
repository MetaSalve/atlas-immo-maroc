import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, TrendingUp, Users, Car, ShoppingBag, GraduationCap, Building } from 'lucide-react';

interface District {
  id: string;
  name: string;
  city: string;
  description: string;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  rating: number;
  trending: boolean;
  population: string;
  amenities: string[];
  transport: string[];
  education: string[];
  shopping: string[];
  pros: string[];
  cons: string[];
  bestFor: string[];
  images: string[];
}

const districtsData: District[] = [
  {
    id: 'casablanca-maarif',
    name: 'Maârif',
    city: 'Casablanca',
    description: 'Quartier moderne et dynamique, centre économique avec de nombreux bureaux et commerces.',
    priceRange: { min: 15000, max: 25000, currency: 'MAD/m²' },
    rating: 4.5,
    trending: true,
    population: '250,000',
    amenities: ['Restaurants', 'Cafés', 'Centres commerciaux', 'Banques', 'Pharmacies'],
    transport: ['Tramway', 'Bus', 'Taxis', 'Parking facilité'],
    education: ['Écoles privées', 'Universités', 'Centres de formation'],
    shopping: ['Morocco Mall', 'Twin Center', 'Marchés locaux'],
    pros: ['Très bien connecté', 'Vie nocturne animée', 'Opportunités d\'emploi'],
    cons: ['Circulation dense', 'Prix élevés', 'Bruit urbain'],
    bestFor: ['Jeunes professionnels', 'Familles aisées', 'Investissement'],
    images: ['/placeholder.svg']
  },
  {
    id: 'rabat-agdal',
    name: 'Agdal',
    city: 'Rabat',
    description: 'Quartier résidentiel huppé, proche des institutions gouvernementales et universités.',
    priceRange: { min: 18000, max: 30000, currency: 'MAD/m²' },
    rating: 4.7,
    trending: true,
    population: '180,000',
    amenities: ['Espaces verts', 'Restaurants haut de gamme', 'Centres médicaux'],
    transport: ['Tramway', 'Bus', 'Accès autoroute'],
    education: ['Université Mohammed V', 'Écoles internationales'],
    shopping: ['Mega Mall', 'Souissi Shopping Center'],
    pros: ['Quartier calme', 'Proche ambassades', 'Bon standing'],
    cons: ['Prix très élevés', 'Circulation aux heures de pointe'],
    bestFor: ['Diplomates', 'Cadres supérieurs', 'Familles avec enfants'],
    images: ['/placeholder.svg']
  },
  {
    id: 'marrakech-gueliz',
    name: 'Guéliz',
    city: 'Marrakech',
    description: 'Ville nouvelle de Marrakech, quartier européen avec architecture moderne.',
    priceRange: { min: 12000, max: 22000, currency: 'MAD/m²' },
    rating: 4.3,
    trending: false,
    population: '120,000',
    amenities: ['Restaurants internationaux', 'Galeries d\'art', 'Spas'],
    transport: ['Bus', 'Taxis', 'Location de vélos'],
    education: ['Écoles françaises', 'Centres culturels'],
    shopping: ['Carré Eden Shopping', 'Avenue Mohammed V'],
    pros: ['Architecture unique', 'Tourisme développé', 'Climat agréable'],
    cons: ['Tourisme de masse', 'Saisonnalité', 'Chaleur estivale'],
    bestFor: ['Retraités européens', 'Investissement locatif', 'Résidence secondaire'],
    images: ['/placeholder.svg']
  }
];

export const DistrictGuide = () => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  
  const cities = ['all', 'Casablanca', 'Rabat', 'Marrakech'];
  const filteredDistricts = selectedCity === 'all' 
    ? districtsData 
    : districtsData.filter(d => d.city === selectedCity);

  const formatPrice = (min: number, max: number, currency: string) => {
    return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Guide des Quartiers</h1>
        <p className="text-muted-foreground">
          Découvrez les meilleurs quartiers du Maroc pour votre investissement immobilier
        </p>
      </div>

      <Tabs value={selectedCity} onValueChange={setSelectedCity} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          {cities.map(city => (
            <TabsTrigger key={city} value={city}>
              {city === 'all' ? 'Tous' : city}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {cities.map(city => (
          <TabsContent key={city} value={city} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {(city === 'all' ? districtsData : districtsData.filter(d => d.city === city))
                .map(district => (
                <Card key={district.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={district.images[0]} 
                      alt={district.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {district.trending && (
                        <Badge className="bg-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Tendance
                        </Badge>
                      )}
                      <Badge variant="secondary">
                        {district.city}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {district.name}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{district.rating}</span>
                      </div>
                    </div>
                    <CardDescription>{district.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {formatPrice(district.priceRange.min, district.priceRange.max, district.priceRange.currency)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{district.population} hab.</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-green-600 mb-1">Points forts</p>
                        <div className="flex flex-wrap gap-1">
                          {district.pros.slice(0, 2).map((pro, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {pro}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Idéal pour</p>
                        <div className="flex flex-wrap gap-1">
                          {district.bestFor.slice(0, 2).map((best, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {best}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          Transport
                        </p>
                        <p className="text-muted-foreground">
                          {district.transport.slice(0, 2).join(', ')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" />
                          Shopping
                        </p>
                        <p className="text-muted-foreground">
                          {district.shopping.slice(0, 1).join(', ')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};