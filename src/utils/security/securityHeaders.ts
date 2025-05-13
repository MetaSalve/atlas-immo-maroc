
/**
 * Configuration des en-têtes de sécurité pour l'application.
 * Ces en-têtes devraient idéalement être configurés au niveau du serveur dans un contexte de production.
 */

/**
 * Définit les en-têtes de sécurité importants pour l'application.
 * Ces en-têtes devraient être configurés au niveau du serveur dans un contexte de production,
 * mais pour cette démo, nous les simulons côté client.
 */
export const configureSecurityHeaders = () => {
  if (typeof document === 'undefined') return;

  // En production, ces en-têtes devraient être configurés sur le serveur
  
  // Simule la configuration des en-têtes de sécurité
  const securityHeaders = {
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob: https://*.supabase.co; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'no-referrer-when-downgrade',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  };
  
  console.info('Configuration des en-têtes de sécurité (simulation):', securityHeaders);
  
  // Dans une application réelle, on utiliserait ces en-têtes sur le serveur
  // Pour cette démo, on ajoute les en-têtes meta équivalents quand c'est possible
  
  // Ajout de la balise meta pour CSP
  let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!cspMeta) {
    cspMeta = document.createElement('meta');
    cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    cspMeta.setAttribute('content', securityHeaders['Content-Security-Policy']);
    document.head.appendChild(cspMeta);
  }
  
  // Ajout de la balise meta pour X-XSS-Protection
  let xssMeta = document.querySelector('meta[http-equiv="X-XSS-Protection"]');
  if (!xssMeta) {
    xssMeta = document.createElement('meta');
    xssMeta.setAttribute('http-equiv', 'X-XSS-Protection');
    xssMeta.setAttribute('content', securityHeaders['X-XSS-Protection']);
    document.head.appendChild(xssMeta);
  }
  
  // En production, nous utiliserions les configurations de serveur appropriées
  // Exemple pour NGINX:
  /*
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: blob: https://*.supabase.co";
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    add_header Referrer-Policy "no-referrer-when-downgrade";
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self), interest-cohort=()";
  */
};
