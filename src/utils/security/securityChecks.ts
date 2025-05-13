
/**
 * Vérifications de sécurité de l'application
 * Fonctions pour analyser la configuration de sécurité
 */

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
 * Vérifie si l'application présente des vulnérabilités de sécurité courantes
 * basées sur les recommandations des frameworks de sécurité standard
 */
export const checkSecurityVulnerabilities = () => {
  if (typeof document === 'undefined') return;
  
  // Vérifie les en-têtes de sécurité
  const securityHeaders = {
    'Content-Security-Policy': document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content'),
    'X-XSS-Protection': document.querySelector('meta[http-equiv="X-XSS-Protection"]')?.getAttribute('content')
  };
  
  const missingHeaders = Object.entries(securityHeaders)
    .filter(([_, value]) => !value)
    .map(([header]) => header);
  
  if (missingHeaders.length > 0) {
    console.warn('En-têtes de sécurité manquants:', missingHeaders.join(', '));
  }

  // Vérifie les vulnérabilités de configuration
  if (window.location.protocol !== 'https:' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    console.warn('L\'application ne fonctionne pas en HTTPS. La sécurité peut être compromise.');
  }

  // Analyse du code pour des pratiques dangereuses (simulation)
  console.info('Effectuer une analyse de sécurité complète à partir du client n\'est pas possible. Utilisez des outils spécialisés pour une vérification approfondie.');
  
  return {
    missingHeaders,
    isSecureConnection: window.location.protocol === 'https:' || 
                         window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1'
  };
};
