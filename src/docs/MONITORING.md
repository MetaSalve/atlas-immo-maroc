
# Guide de Surveillance et Monitoring AlertImmo

Ce document détaille la stratégie de surveillance et de monitoring pour l'application AlertImmo en production.

## Plan de Surveillance

### 1. Monitoring des Performances

#### Outils Recommandés

- **New Relic** ou **Datadog** pour une surveillance complète
  - Temps de réponse des requêtes API
  - Taux d'erreur
  - Taux d'utilisation des ressources

#### Métriques à Surveiller

| Métrique | Seuil d'Alerte | Seuil Critique | Période |
|----------|----------------|----------------|---------|
| Temps de réponse API | > 500ms | > 1000ms | 5 min |
| Taux d'erreur | > 1% | > 5% | 5 min |
| Utilisation CPU | > 70% | > 90% | 5 min |
| Utilisation mémoire | > 80% | > 95% | 5 min |
| Latence base de données | > 100ms | > 300ms | 5 min |

### 2. Surveillance des Erreurs

#### Configuration de Sentry

```javascript
// Installation
npm install @sentry/react @sentry/tracing

// Configuration dans main.tsx
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://your-sentry-dsn.ingest.sentry.io/project",
  integrations: [new BrowserTracing()],
  
  // Performance monitoring
  tracesSampleRate: 0.5,
  
  // Filtre des erreurs connues
  ignoreErrors: [
    "Network request failed",
    "ResizeObserver loop limit exceeded"
  ],
  
  // Capture des informations utilisateur (avec consentement RGPD)
  beforeSend(event, hint) {
    // Vérifier le consentement utilisateur
    if (!hasUserConsent()) {
      delete event.user;
    }
    return event;
  }
});
```

#### Catégories d'Erreurs à Surveiller

- **Erreurs d'API** : échecs de requêtes, timeouts
- **Erreurs JavaScript** : exceptions non gérées
- **Erreurs d'authentification** : tentatives échouées multiples
- **Erreurs de paiement** : transactions échouées
- **Problèmes de performance** : chargements lents, timeouts

### 3. Surveillance de Base de Données

#### Métriques Supabase à Surveiller

- Nombre de connexions
- Durée des requêtes
- Taux d'utilisation du pool de connexions
- Espace de stockage utilisé
- Requêtes lentes (> 200ms)

#### Requêtes SQL pour le Monitoring

```sql
-- Pour identifier les requêtes lentes
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Pour surveiller les tables qui grossissent rapidement
SELECT schemaname, relname, n_tup_ins, n_tup_upd, n_tup_del
FROM pg_stat_user_tables
ORDER BY n_tup_ins DESC;
```

### 4. Monitoring des Fonctions Edge

- Taux d'erreur
- Temps d'exécution
- Invocations par minute
- Consommation de mémoire

### 5. Surveillance de l'Expérience Utilisateur

#### Métriques Front-end

- **Web Vitals** : LCP, FID, CLS
- **Taux de conversion** : inscription, abonnement
- **Taux de rebond**
- **Durée moyenne de session**

#### Configuration du Real User Monitoring (RUM)

```javascript
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({ 
    name: metric.name, 
    value: metric.value, 
    id: metric.id 
  });
  
  navigator.sendBeacon('/analytics', body);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

## Plan d'Alerte

### 1. Canaux de Notification

- **Alertes Critiques**
  - SMS/appels aux responsables d'astreinte
  - Notifications push dans l'application Slack dédiée
  - Emails aux responsables techniques

- **Alertes Moyennes**
  - Notifications Slack
  - Emails

- **Alertes Informatives**
  - Notifications Slack uniquement
  - Tableau de bord de monitoring

### 2. Configuration des Alertes

#### Exemple de Configuration Datadog

```yaml
# Alerte sur les erreurs HTTP 5xx
type: metric alert
name: Taux élevé d'erreurs HTTP 5xx
query: sum(last_5m):sum:trace.http.request.errors{http.status_code:5*} / sum:trace.http.request.hits{} * 100 > 5
message: |
  Le taux d'erreurs HTTP 5xx dépasse 5% sur les 5 dernières minutes.
  @devops-team
tags:
  - env:production
  - service:api
options:
  thresholds:
    critical: 5
    warning: 2
  notify_no_data: true
  notify_audit: true
```

### 3. Rotation des Astreintes

- Système de rotation hebdomadaire
- Minimum de 2 personnes d'astreinte à tout moment
- Temps de réponse maximum de 15 minutes
- Procédure d'escalade automatique après 30 minutes sans réponse

### 4. Niveaux de Criticité

| Niveau | Description | Exemples | Temps de Réponse |
|--------|-------------|----------|------------------|
| P0 | Critique - Application inutilisable | Panne complète, fuite de données | Immédiat (24/7) |
| P1 | Majeur - Fonctionnalité principale inutilisable | Paiements indisponibles | < 30 min (24/7) |
| P2 | Significatif - Fonctionnement dégradé | Lenteurs généralisées | < 2h (heures ouvrées) |
| P3 | Mineur - Impact limité | Anomalies visuelles | < 1 jour ouvré |

## Tableau de Bord de Monitoring

### Métriques Clés à Afficher

1. **Disponibilité du Service**
   - Uptime
   - Statut des composants (API, DB, Auth)

2. **Performance**
   - Temps de réponse moyen
   - Nombre de requêtes par minute
   - Taux d'erreur global

3. **Utilisateurs**
   - Utilisateurs actifs
   - Nouvelles inscriptions
   - Conversion vers Premium

4. **Business**
   - Transactions de paiement
   - Revenus journaliers/mensuels
   - Taux de rétention des abonnements

### Exemple d'Implémentation avec Grafana

```yaml
# dashboard.yaml
apiVersion: 1
providers:
  - name: AlertImmo
    folder: Main
    type: file
    options:
      path: /var/lib/grafana/dashboards
```

## Procédures d'Incident

### 1. Détection et Triage

1. Détection de l'incident via le système d'alertes
2. Classification de la criticité
3. Notification de l'équipe appropriée
4. Création d'un incident dans le système de suivi

### 2. Réponse Initiale

1. Confirmation de l'incident
2. Communication initiale aux parties prenantes
3. Analyse des symptômes et isolation du problème
4. Mesures d'atténuation immédiates si possible

### 3. Résolution

1. Identification de la cause racine
2. Développement et test de la solution
3. Déploiement de la correction
4. Vérification de la résolution

### 4. Post-Mortem

1. Documentation détaillée de l'incident
2. Analyse des causes profondes
3. Actions correctives et préventives
4. Amélioration des systèmes de détection

### 5. Template de Rapport d'Incident

```
# Rapport d'Incident #[NUMÉRO]

## Résumé
- **Date/Heure de début:** [DATE] à [HEURE]
- **Date/Heure de résolution:** [DATE] à [HEURE]
- **Durée:** [DURÉE]
- **Impact:** [DESCRIPTION DE L'IMPACT]
- **Systèmes affectés:** [LISTE DES SYSTÈMES]

## Chronologie
- [HEURE]: Détection initiale
- [HEURE]: Actions prises
- [HEURE]: Résolution

## Cause racine
[DESCRIPTION DÉTAILLÉE]

## Actions correctives
- [ACTION 1]: [RESPONSABLE], [DATE LIMITE]
- [ACTION 2]: [RESPONSABLE], [DATE LIMITE]

## Leçons apprises
[DESCRIPTION DES ENSEIGNEMENTS TIRÉS]
```

## Capacité et Planification de la Croissance

### 1. Métriques de Capacité à Suivre

- Nombre d'utilisateurs actifs simultanés
- Nombre de recherches par minute
- Utilisation de la base de données
- Consommation de bande passante
- Demandes d'API par seconde

### 2. Seuils d'Alerte de Capacité

| Ressource | Seuil d'Avertissement | Seuil d'Action |
|-----------|---------------------|----------------|
| CPU | 70% en moyenne sur 24h | 85% en moyenne sur 12h |
| Mémoire | 75% en moyenne sur 24h | 90% en pic |
| Stockage | 70% d'utilisation | 85% d'utilisation |
| Base de données | 2000 connexions | 2500 connexions |
| Requêtes API | 100 req/sec | 150 req/sec |

### 3. Plan de Mise à l'Échelle

- Seuils de déclenchement pour la mise à l'échelle automatique
- Procédure d'ajout de capacité (serveurs, bases de données)
- Calendrier de revue de capacité (mensuel)
