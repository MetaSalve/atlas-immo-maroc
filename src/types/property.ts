
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: 'MAD' | 'EUR' | 'USD';
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: {
    address: string;
    city: string;
    district: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  type: 'apartment' | 'house' | 'villa' | 'riad' | 'land' | 'commercial' | 'other';
  status: 'for-sale' | 'for-rent';
  features: string[];
  source: {
    name: string;
    logo?: string;
    url: string;
  };
  contactInfo: {
    name: string;
    phone?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}
