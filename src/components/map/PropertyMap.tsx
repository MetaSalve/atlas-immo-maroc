
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/types/property';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  className?: string;
}

export const PropertyMap = ({ properties, onPropertyClick, className = '' }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);

  // Check for Mapbox token from environment variable
  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN || '';
    setMapboxToken(token);
  }, []);

  // Initialize map if token is available
  useEffect(() => {
    if (!mapContainer.current || map.current || !mapboxToken) return;

    try {
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-8, 31.7917], // Default center on Morocco
        zoom: 5
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
      map.current = null;
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers when properties change and map is available
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    const bounds = new mapboxgl.LngLatBounds();
    
    properties.forEach(property => {
      if (property.location.coordinates.lng && property.location.coordinates.lat) {
        // Create marker element
        const el = document.createElement('div');
        el.className = 'property-marker';
        el.innerHTML = `
          <div class="bg-primary text-primary-foreground rounded-full p-2 cursor-pointer shadow-lg hover:scale-110 transition-transform">
            <div class="text-xs font-bold whitespace-nowrap">
              ${new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: property.priceUnit,
                maximumFractionDigits: 0
              }).format(property.price)}
            </div>
          </div>
        `;

        // Create and add the marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([property.location.coordinates.lng, property.location.coordinates.lat])
          .addTo(map.current!);

        // Add popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <img src="${property.images[0]}" alt="${property.title}" class="w-32 h-24 object-cover mb-2 rounded"/>
            <h3 class="font-medium">${property.title}</h3>
            <p class="text-sm text-muted-foreground">${property.location.district}, ${property.location.city}</p>
          </div>
        `);

        marker.setPopup(popup);

        // Add click handler
        el.addEventListener('click', () => {
          if (onPropertyClick) {
            onPropertyClick(property);
          }
        });

        // Extend bounds
        bounds.extend([property.location.coordinates.lng, property.location.coordinates.lat]);
        markers.current.push(marker);
      }
    });

    // Fit bounds if there are markers
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [properties, onPropertyClick, mapboxToken]);

  // Handle token input
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).token.value;
    if (input) {
      setMapboxToken(input);
      setShowTokenInput(false);
    }
  };

  // Render fallback if no token is available
  if (!mapboxToken) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 border rounded-lg bg-muted ${className}`} style={{minHeight: '400px'}}>
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Clé API Mapbox requise</h3>
        <p className="text-muted-foreground text-center mb-4">
          Pour afficher la carte, une clé API Mapbox est nécessaire.
        </p>
        
        {showTokenInput ? (
          <form onSubmit={handleTokenSubmit} className="w-full max-w-md space-y-2">
            <input 
              type="text" 
              name="token"
              placeholder="Collez votre clé API Mapbox ici" 
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex justify-center gap-2">
              <Button type="submit">Appliquer</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowTokenInput(false)}
              >
                Annuler
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Obtenez une clé sur <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
            </p>
          </form>
        ) : (
          <Button onClick={() => setShowTokenInput(true)}>
            Ajouter une clé API
          </Button>
        )}
      </div>
    );
  }

  // Render map if token is available
  return <div ref={mapContainer} className={`min-h-[400px] rounded-lg ${className}`} />;
};
