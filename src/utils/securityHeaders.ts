
/**
 * Définit les en-têtes de sécurité importants pour l'application.
 * Ces en-têtes devraient être configurés au niveau du serveur dans un contexte de production,
 * mais pour cette démo, nous les simulons côté client.
 */
export const configureSecurityHeaders = () => {
  if (typeof document === 'undefined') return;

  // En production, ces en-têtes devraient être configurés sur le serveur
  
  // Simule la configuration des en-têtes de sécurité
  console.info('Configuration des en-têtes de sécurité (simulation):', {
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob: https://*.supabase.co; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'no-referrer-when-downgrade'
  });
  
  // En production, nous utiliserions les configurations de serveur appropriées
  // Exemple pour NGINX:
  /*
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: blob: https://*.supabase.co";
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    add_header Referrer-Policy "no-referrer-when-downgrade";
  */
};

/**
 * Vérifie si la configuration HTTPS est correctement mise en place
 */
export const checkHttpsConfiguration = () => {
  if (typeof window === 'undefined') return true;
  
  // Vérifier si le site est en HTTPS
  const isSecure = window.location.protocol === 'https:';
  
  // En développement local, nous permettons HTTP
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return true;
  }
  
  if (!isSecure) {
    console.warn('AVERTISSEMENT: Le site n\'est pas chargé en HTTPS. La sécurité peut être compromise.');
    return false;
  }
  
  return true;
};

/**
 * Vérifie si le site est vulnérable au clickjacking
 */
export const checkFrameProtection = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Essayer d'accéder au top window
    const canBeFramed = window.top !== window;
    
    if (canBeFramed) {
      console.warn('AVERTISSEMENT: Le site pourrait être vulnérable au clickjacking.');
    }
  } catch (e) {
    // Une erreur se produit si la page est dans un iframe avec une origine différente
    // Ce qui est bon signe - cela signifie que la protection contre le framing fonctionne
    console.info('Protection contre le clickjacking active.');
  }
};
