
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

/**
 * Vérifie la présence de vulnérabilités XSS courantes
 */
export const detectXSSVulnerabilities = () => {
  if (typeof document === 'undefined') return;
  
  // Vérifier si des scripts inline sans nonce sont utilisés
  const inlineScripts = document.querySelectorAll('script:not([src]):not([nonce])');
  if (inlineScripts.length > 0) {
    console.warn('AVERTISSEMENT: Des scripts inline sans nonce ont été détectés. Cela peut représenter un risque XSS.');
  }
  
  // Vérifier l'utilisation de pratiques dangereuses comme innerHTML
  // Ceci est pour l'éducation uniquement, une vraie détection nécessiterait plus de sophistication
  const dangerousMethods = ['innerHTML', 'outerHTML', 'document.write', 'eval'];
  const scriptContents = Array.from(document.querySelectorAll('script:not([src])')).map(s => s.textContent);
  
  dangerousMethods.forEach(method => {
    scriptContents.forEach(content => {
      if (content && content.includes(method)) {
        console.warn(`AVERTISSEMENT: Utilisation potentiellement dangereuse de ${method} détectée. Risque XSS possible.`);
      }
    });
  });
};

/**
 * Détecte les attaques potentielles de type CSRF
 */
export const detectCSRFAttempts = () => {
  if (typeof window === 'undefined') return;
  
  // Vérifier que les formulaires sensibles ont un token CSRF
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const hasCsrfToken = Array.from(form.elements).some(el => 
      el.getAttribute('name') === 'csrf_token'
    );
    
    if (!hasCsrfToken && form.method && form.method.toLowerCase() !== 'get') {
      console.warn('AVERTISSEMENT: Un formulaire sans protection CSRF a été détecté.');
    }
  });
  
  // Vérifier l'origine des requêtes
  const referrer = document.referrer;
  if (referrer && !referrer.startsWith(window.location.origin)) {
    console.info('Navigation provenant d\'une origine externe détectée:', referrer);
  }
};

/**
 * Effectue un ensemble complet de vérifications de sécurité
 */
export const runSecurityChecks = () => {
  try {
    configureSecurityHeaders();
    checkHttpsConfiguration();
    checkFrameProtection();
    detectXSSVulnerabilities();
    detectCSRFAttempts();
    
    console.info('Vérifications de sécurité terminées.');
  } catch (error) {
    console.error('Erreur lors des vérifications de sécurité:', error);
  }
};

