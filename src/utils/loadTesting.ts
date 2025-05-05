
/**
 * Utilitaire pour les tests de charge et performance
 * Permet de mesurer les performances de l'application et d'identifier les goulots d'étranglement
 */

// Constantes pour les seuils de performance
export const PERFORMANCE_THRESHOLDS = {
  TIME_TO_FIRST_BYTE: 200, // ms
  TIME_TO_INTERACTIVE: 3000, // ms
  FIRST_CONTENTFUL_PAINT: 1000, // ms
  LARGEST_CONTENTFUL_PAINT: 2500, // ms
  CUMULATIVE_LAYOUT_SHIFT: 0.1, // score
  FIRST_INPUT_DELAY: 100, // ms
  DATABASE_QUERY_LIMIT: 1000, // ms
  API_RESPONSE_LIMIT: 500, // ms
};

interface PerformanceResult {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  status: 'success' | 'warning' | 'error';
}

interface PerformanceReport {
  results: PerformanceResult[];
  summary: {
    totalTests: number;
    passed: number;
    warnings: number;
    errors: number;
  };
  timestamp: number;
}

/**
 * Mesure les métriques Web Vitals
 * @returns Objet contenant les métriques Web Vitals
 */
export const measureWebVitals = (): Promise<PerformanceResult[]> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.performance) {
      resolve([]);
      return;
    }

    // Utiliser requestIdleCallback pour mesurer après le chargement initial
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

    idleCallback(() => {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const results: PerformanceResult[] = [];
      const now = Date.now();

      if (navEntry) {
        // Time to First Byte (TTFB)
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        results.push({
          name: 'Time to First Byte',
          value: ttfb,
          unit: 'ms',
          timestamp: now,
          status: ttfb <= PERFORMANCE_THRESHOLDS.TIME_TO_FIRST_BYTE ? 'success' : 
                  ttfb <= PERFORMANCE_THRESHOLDS.TIME_TO_FIRST_BYTE * 1.5 ? 'warning' : 'error'
        });
        
        // DOM Interactive
        const interactive = navEntry.domInteractive - navEntry.startTime;
        results.push({
          name: 'Time to Interactive',
          value: interactive,
          unit: 'ms',
          timestamp: now,
          status: interactive <= PERFORMANCE_THRESHOLDS.TIME_TO_INTERACTIVE ? 'success' : 
                  interactive <= PERFORMANCE_THRESHOLDS.TIME_TO_INTERACTIVE * 1.5 ? 'warning' : 'error'
        });
      }
      
      // First Paint and First Contentful Paint
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          results.push({
            name: 'First Paint',
            value: entry.startTime,
            unit: 'ms',
            timestamp: now,
            status: entry.startTime <= PERFORMANCE_THRESHOLDS.FIRST_CONTENTFUL_PAINT ? 'success' : 
                    entry.startTime <= PERFORMANCE_THRESHOLDS.FIRST_CONTENTFUL_PAINT * 1.5 ? 'warning' : 'error'
          });
        } else if (entry.name === 'first-contentful-paint') {
          results.push({
            name: 'First Contentful Paint',
            value: entry.startTime,
            unit: 'ms',
            timestamp: now,
            status: entry.startTime <= PERFORMANCE_THRESHOLDS.FIRST_CONTENTFUL_PAINT ? 'success' : 
                    entry.startTime <= PERFORMANCE_THRESHOLDS.FIRST_CONTENTFUL_PAINT * 1.5 ? 'warning' : 'error'
          });
        }
      });
      
      resolve(results);
    });
  });
};

/**
 * Capture et analyse les métriques de performance API
 * @param url URL de la requête API
 * @param method Méthode HTTP
 * @param startTime Horodatage du début de la requête
 * @param endTime Horodatage de la fin de la requête
 * @returns Résultat de performance
 */
export const measureApiPerformance = (
  url: string, 
  method: string,
  startTime: number,
  endTime: number
): PerformanceResult => {
  const duration = endTime - startTime;
  
  return {
    name: `API ${method} ${url}`,
    value: duration,
    unit: 'ms',
    timestamp: Date.now(),
    status: duration <= PERFORMANCE_THRESHOLDS.API_RESPONSE_LIMIT ? 'success' : 
            duration <= PERFORMANCE_THRESHOLDS.API_RESPONSE_LIMIT * 1.5 ? 'warning' : 'error'
  };
};

/**
 * Génère un rapport de performance
 * @param results Résultats de tests de performance
 * @returns Rapport de performance
 */
export const generatePerformanceReport = (results: PerformanceResult[]): PerformanceReport => {
  const passed = results.filter(r => r.status === 'success').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  return {
    results,
    summary: {
      totalTests: results.length,
      passed,
      warnings,
      errors,
    },
    timestamp: Date.now()
  };
};

/**
 * Simule une charge utilisateur sur l'application
 * @param baseUrl URL de base de l'application
 * @param concurrentUsers Nombre d'utilisateurs simultanés à simuler
 * @param durationSeconds Durée du test en secondes
 * @returns Promise résolvant à un objet de résultats
 */
export const simulateLoad = async (
  baseUrl: string, 
  concurrentUsers: number = 10,
  durationSeconds: number = 60
): Promise<{success: boolean, message: string}> => {
  // En pratique, cette fonction utiliserait un outil comme Artillery ou k6
  // Cette implémentation est pour l'exemple
  console.log(`[Load Test] Simulating ${concurrentUsers} users for ${durationSeconds}s on ${baseUrl}`);
  
  // Simuler un test de charge réussi
  await new Promise(r => setTimeout(r, 1000));
  
  return { 
    success: true,
    message: `Test de charge complété avec succès. ${concurrentUsers} utilisateurs simulés pendant ${durationSeconds} secondes.`
  };
};

/**
 * Envoie un rapport de performance au serveur
 * @param report Rapport de performance à envoyer
 * @returns Promise résolvant à un objet de résultats
 */
export const sendPerformanceReport = async (report: PerformanceReport): Promise<void> => {
  try {
    // En production, ceci enverrait les données à un système de monitoring
    console.log('[Performance] Envoi du rapport de performance:', report);
    
    // Stockage local pour la démonstration
    localStorage.setItem('lastPerformanceReport', JSON.stringify(report));
  } catch (error) {
    console.error('[Performance] Erreur lors de l\'envoi du rapport:', error);
  }
};

/**
 * Lance une série complète de tests de performance
 * @returns Rapport de performance généré
 */
export const runPerformanceTests = async (): Promise<PerformanceReport> => {
  const results: PerformanceResult[] = [];
  
  // Mesurer les métriques Web Vitals
  const webVitalsResults = await measureWebVitals();
  results.push(...webVitalsResults);
  
  // Générer le rapport
  const report = generatePerformanceReport(results);
  
  // Envoyer le rapport (en production)
  await sendPerformanceReport(report);
  
  return report;
};

/**
 * Attache un écouteur d'événements pour mesurer automatiquement
 * les performances pendant la navigation
 */
export const initializePerformanceMonitoring = (): void => {
  if (typeof window === 'undefined') return;
  
  // Mesurer les performances après le chargement initial de la page
  window.addEventListener('load', async () => {
    // Attendre que tout soit stable
    setTimeout(async () => {
      await runPerformanceTests();
    }, 3000);
  });
};
