// Content Security Policy Headers
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Pour Vite en dev
    "'unsafe-eval'", // Pour Vite en dev
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://connect.facebook.net",
    "https://js.stripe.com",
    "https://checkout.stripe.com"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://api.mapbox.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com",
    "data:"
  ],
  'img-src': [
    "'self'",
    "data:",
    "blob:",
    "https:",
    "*.supabase.co",
    "*.mapbox.com",
    "*.openstreetmap.org"
  ],
  'connect-src': [
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://www.google-analytics.com",
    "https://api.ipify.org",
    "https://checkout.stripe.com",
    "https://api.stripe.com"
  ],
  'frame-src': [
    "'self'",
    "https://js.stripe.com",
    "https://checkout.stripe.com",
    "https://www.google.com"
  ],
  'worker-src': ["'self'", "blob:"],
  'child-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

export const generateCSP = (): string => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => 
      sources.length > 0 
        ? `${directive} ${sources.join(' ')}` 
        : directive
    )
    .join('; ');
};

export const SECURITY_HEADERS = {
  'Content-Security-Policy': generateCSP(),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=(self)',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block'
};