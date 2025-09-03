import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // À remplacer par votre ID

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Track page views
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
};

// Analytics helper functions
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPropertyView = (propertyId: string, propertyType: string, city: string) => {
  trackEvent('property_view', 'engagement', `${propertyType}_${city}`, undefined);
  
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'MAD',
      item_id: propertyId,
      item_name: `Property ${propertyId}`,
      item_category: propertyType,
      item_location: city,
    });
  }
};

export const trackSearch = (query: string, filters: any) => {
  trackEvent('search', 'engagement', query);
  
  if (window.gtag) {
    window.gtag('event', 'search', {
      search_term: query,
      property_type: filters.type,
      location: filters.location,
      price_range: `${filters.priceMin}-${filters.priceMax}`,
    });
  }
};

export const trackConversion = (type: 'contact' | 'favorite' | 'alert', propertyId?: string) => {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: GA_MEASUREMENT_ID,
      event_category: 'conversion',
      event_label: type,
      property_id: propertyId,
    });
  }
};

export const trackUserEngagement = (action: string, engagement_time?: number) => {
  if (window.gtag) {
    window.gtag('event', 'user_engagement', {
      engagement_time_msec: engagement_time || 0,
      action: action,
    });
  }
};