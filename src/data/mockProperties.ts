
import { Property } from "../types/property";

export const mockProperties: Property[] = [
  {
    id: "p1",
    title: "Appartement moderne au cœur de Casablanca",
    description: "Magnifique appartement dans une résidence sécurisée, proche des commerces et des transports. Bénéficiant d'une belle luminosité et d'une vue dégagée, cet appartement est idéal pour une famille ou un investissement locatif.",
    price: 1500000,
    priceUnit: "MAD",
    area: 85,
    bedrooms: 2,
    bathrooms: 1,
    location: {
      address: "Avenue Hassan II",
      city: "Casablanca",
      district: "Maarif",
      coordinates: {
        lat: 33.5731,
        lng: -7.5898
      }
    },
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705"
    ],
    type: "apartment",
    status: "for-sale",
    features: ["Ascenseur", "Sécurité 24/7", "Balcon", "Parking", "Climatisation"],
    source: {
      name: "Avito",
      logo: "https://static.avito.ma/static/3/avito-logo-16c4eecd8a.svg",
      url: "https://www.avito.ma"
    },
    contactInfo: {
      name: "Agence Immobilière Casablanca",
      phone: "+212522123456",
      email: "contact@agence-casa.com"
    },
    createdAt: "2025-04-10T10:30:00.000Z",
    updatedAt: "2025-04-10T10:30:00.000Z"
  },
  {
    id: "p2",
    title: "Villa de luxe avec piscine à Marrakech",
    description: "Splendide villa avec jardin et piscine privée dans un quartier prisé de Marrakech. Architecture traditionnelle marocaine avec des finitions modernes de haute qualité.",
    price: 5800000,
    priceUnit: "MAD",
    area: 320,
    bedrooms: 4,
    bathrooms: 3,
    location: {
      address: "Route de Ouarzazate",
      city: "Marrakech",
      district: "Palmeraie",
      coordinates: {
        lat: 31.6295,
        lng: -7.9811
      }
    },
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
      "https://images.unsplash.com/photo-1584622650111-993a426ibf0a"
    ],
    type: "villa",
    status: "for-sale",
    features: ["Piscine", "Jardin", "Terrasse", "Garage", "Climatisation", "Sécurité"],
    source: {
      name: "Mubawab",
      logo: "https://mubawab.ma/assets/images/logo.png",
      url: "https://www.mubawab.ma"
    },
    contactInfo: {
      name: "Luxury Morocco Real Estate",
      phone: "+212524123456",
      email: "info@luxurymorocco.com"
    },
    createdAt: "2025-04-05T15:20:00.000Z",
    updatedAt: "2025-04-12T09:15:00.000Z"
  },
  {
    id: "p3",
    title: "Appartement à louer à Rabat",
    description: "Bel appartement meublé dans le quartier de l'Agdal. Entièrement rénové, proche des commerces, restaurants et transports.",
    price: 8500,
    priceUnit: "MAD",
    area: 75,
    bedrooms: 2,
    bathrooms: 1,
    location: {
      address: "Avenue Fal Ould Oumeir",
      city: "Rabat",
      district: "Agdal",
      coordinates: {
        lat: 33.9916,
        lng: -6.8498
      }
    },
    images: [
      "https://images.unsplash.com/photo-1598928636135-d146006ff4be",
      "https://images.unsplash.com/photo-1598928507759-3a9b9e8ab0b5",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab"
    ],
    type: "apartment",
    status: "for-rent",
    features: ["Meublé", "Wifi", "Ascenseur", "Balcon"],
    source: {
      name: "Sarouty",
      logo: "https://sarouty.ma/assets/images/logo.png",
      url: "https://www.sarouty.ma"
    },
    contactInfo: {
      name: "Mohammed Alami",
      phone: "+212661123456",
      email: "m.alami@gmail.com"
    },
    createdAt: "2025-04-14T08:45:00.000Z",
    updatedAt: "2025-04-14T08:45:00.000Z"
  },
  {
    id: "p4",
    title: "Riad authentique dans la médina de Fès",
    description: "Magnifique riad traditionnel au cœur de la médina de Fès. Architecture authentique avec patio central, fontaine et terrasse panoramique.",
    price: 2800000,
    priceUnit: "MAD",
    area: 250,
    bedrooms: 5,
    bathrooms: 4,
    location: {
      address: "Médina",
      city: "Fès",
      district: "Batha",
      coordinates: {
        lat: 34.0372,
        lng: -5.0028
      }
    },
    images: [
      "https://images.unsplash.com/photo-1579518906791-a1e24ec47a34",
      "https://images.unsplash.com/photo-1579518906438-68e45d20bd02",
      "https://images.unsplash.com/photo-1579518906500-d8cb8f33593e"
    ],
    type: "riad",
    status: "for-sale",
    features: ["Patio", "Fontaine", "Terrasse", "Hammam"],
    source: {
      name: "MarocAnnonces",
      logo: "https://www.marocannonces.com/images/logo.png",
      url: "https://www.marocannonces.com"
    },
    contactInfo: {
      name: "Agence des Riads",
      phone: "+212535123456",
      email: "contact@agence-riads.com"
    },
    createdAt: "2025-03-29T11:20:00.000Z",
    updatedAt: "2025-04-13T14:30:00.000Z"
  },
  {
    id: "p5",
    title: "Bureau moderne à Tanger",
    description: "Espace de bureau moderne dans un immeuble de standing au centre-ville de Tanger, parfait pour les entreprises cherchant un emplacement stratégique.",
    price: 16000,
    priceUnit: "MAD",
    area: 120,
    bedrooms: 0,
    bathrooms: 1,
    location: {
      address: "Boulevard Mohammed V",
      city: "Tanger",
      district: "Centre-ville",
      coordinates: {
        lat: 35.7673,
        lng: -5.8039
      }
    },
    images: [
      "https://images.unsplash.com/photo-1568992688065-536aad8a12f6",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a",
      "https://images.unsplash.com/photo-1564069114553-7215e1ff1890"
    ],
    type: "commercial",
    status: "for-rent",
    features: ["Parking", "Salle de conférence", "Internet haut débit", "Sécurité 24/7"],
    source: {
      name: "Jumia House",
      logo: "https://house.jumia.ma/images/logo.png",
      url: "https://house.jumia.ma"
    },
    contactInfo: {
      name: "Tanger Business Centers",
      phone: "+212539123456",
      email: "location@tangerbusiness.com"
    },
    createdAt: "2025-04-08T16:10:00.000Z",
    updatedAt: "2025-04-08T16:10:00.000Z"
  },
  {
    id: "p6",
    title: "Terrain constructible à Agadir",
    description: "Terrain viabilisé avec vue sur mer, parfait pour la construction d'une villa ou d'un petit projet immobilier.",
    price: 950000,
    priceUnit: "MAD",
    area: 500,
    bedrooms: 0,
    bathrooms: 0,
    location: {
      address: "Route d'Essaouira",
      city: "Agadir",
      district: "Founty",
      coordinates: {
        lat: 30.4278,
        lng: -9.6151
      }
    },
    images: [
      "https://images.unsplash.com/photo-1628786176969-d8bcf840b23e",
      "https://images.unsplash.com/photo-1628786177135-dd23a937a391",
      "https://images.unsplash.com/photo-1628786178025-d7bc12681d8d"
    ],
    type: "land",
    status: "for-sale",
    features: ["Vue mer", "Viabilisé", "Titre foncier", "R+3 autorisé"],
    source: {
      name: "Avito",
      logo: "https://static.avito.ma/static/3/avito-logo-16c4eecd8a.svg",
      url: "https://www.avito.ma"
    },
    contactInfo: {
      name: "Immobilier du Sud",
      phone: "+212528123456",
      email: "contact@immobilierdusud.com"
    },
    createdAt: "2025-04-01T09:30:00.000Z",
    updatedAt: "2025-04-15T11:45:00.000Z"
  }
];
