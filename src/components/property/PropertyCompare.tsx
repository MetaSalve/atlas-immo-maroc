
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Property } from '@/types/property';
import { X, ArrowLeftRight } from 'lucide-react';
import { FeatureGate } from '@/components/access/FeatureGate';
import { Badge } from '@/components/ui/badge';

interface PropertyCompareProps {
  properties: Property[];
  onClose: () => void;
}

export const PropertyCompare = ({ properties, onClose }: PropertyCompareProps) => {
  return (
    <FeatureGate feature="property_comparisons">
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Comparaison de biens
            <Badge variant="outline" className="ml-2">
              {properties.length} bien{properties.length > 1 ? 's' : ''} sélectionné{properties.length > 1 ? 's' : ''}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {properties.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Caractéristique</TableHead>
                    {properties.map((property) => (
                      <TableHead key={property.id}>{property.title}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Prix</TableCell>
                    {properties.map((property) => (
                      <TableCell key={`${property.id}-price`}>
                        {property.price != null ? property.price.toLocaleString('fr-FR') : '0'} {property.priceUnit}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Type</TableCell>
                    {properties.map((property) => (
                      <TableCell key={`${property.id}-type`}>{property.type}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Surface</TableCell>
                    {properties.map((property) => (
                      <TableCell key={`${property.id}-area`}>{property.area} m²</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Localisation</TableCell>
                    {properties.map((property) => (
                      <TableCell key={`${property.id}-location`}>
                        {property.location.district}, {property.location.city}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Chambres</TableCell>
                    {properties.map((property) => (
                      <TableCell key={`${property.id}-bedrooms`}>
                        {property.bedrooms || 'N/A'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Salles de bain</TableCell>
                    {properties.map((property) => (
                      <TableCell key={`${property.id}-bathrooms`}>
                        {property.bathrooms || 'N/A'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Contact</TableCell>
                    {properties.map((property) => (
                      <TableCell key={`${property.id}-contact`}>
                        {property.contactInfo.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p>Sélectionnez au moins deux biens pour les comparer</p>
            </div>
          )}
        </CardContent>
      </Card>
    </FeatureGate>
  );
};
