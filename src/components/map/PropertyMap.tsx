
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/types/property';

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  className?: string;
}

export const PropertyMap = ({ properties, onPropertyClick, className = '' }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-8, 31.7917], // Default center on Morocco
      zoom: 5
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when properties change
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
  }, [properties, onPropertyClick]);

  return <div ref={mapContainer} className={`min-h-[400px] rounded-lg ${className}`} />;
};
