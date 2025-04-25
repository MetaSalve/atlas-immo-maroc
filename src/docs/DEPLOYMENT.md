
# Guide de déploiement AlertImmo

Ce document détaille les étapes nécessaires pour déployer l'application AlertImmo en production.

## Prérequis

- Compte Supabase
- Compte d'hébergement frontend (Netlify, Vercel, AWS, etc.)
- Compte Stripe pour les paiements internationaux
- Compte CMI (Centre Monétique Interbancaire) pour les paiements au Maroc
- Nom de domaine (avec SSL)

## Configuration de l'environnement de production

### 1. Configuration de Supabase

#### Base de données

1. Exécuter les migrations de base de données
   - Vérifier que toutes les tables sont créées
   - Activer le RLS (Row Level Security) pour toutes les tables
   - Vérifier les politiques de sécurité

#### Authentification

1. Configurer les paramètres d'authentification
   - Email : activer la confirmation d'email
   - Redirection : configurer les URLs de redirection
   - Personnaliser les modèles d'emails

2. Configurer les fournisseurs OAuth (optionnel)
   - Google
   - Facebook
   - Apple

#### Fonctions Edge

1. Déployer les fonctions Edge
```bash
npx supabase functions deploy --project-ref <project-id>
```

2. Configurer les variables d'environnement des fonctions
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `CMI_MERCHANT_ID`
   - `CMI_STORE_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Configuration de Stripe

1. Création des produits et plans
   - Créer le produit "Abonnement AlertImmo Premium"
   - Ajouter le prix récurrent (mensuel)
   - Noter l'ID du prix pour la configuration

2. Configuration des webhooks
   - Créer un endpoint webhook pointant vers `https://[PROJECT_ID].supabase.co/functions/v1/stripe-webhook`
   - Sélectionner les événements suivants:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Noter la clé secrète du webhook pour la configuration

3. Configuration du mode de production
   - Activer le mode live lorsque vous êtes prêt
   - Mettre à jour les clés API en production

### 3. Configuration de CMI

1. Configuration du compte marchand
   - Obtenir les identifiants de connexion
   - Configurer les URLs de retour:
     - URL de succès: `https://[VOTRE_DOMAINE]/payment-success`
     - URL d'échec: `https://[VOTRE_DOMAINE]/subscription?status=failed`

2. Configurer les paramètres de sécurité
   - Générer la clé de magasin
   - Configurer les règles de vérification

### 4. Déploiement Frontend

1. Configurer les variables d'environnement
```
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[VOTRE_CLE_ANON]
VITE_MAPBOX_TOKEN=[VOTRE_TOKEN_MAPBOX]
```

2. Construire l'application
```bash
npm run build
```

3. Déployer sur votre hébergeur

#### Netlify

1. Connecter votre dépôt Git
2. Configurer les paramètres de build:
   - Commande de build: `npm run build`
   - Répertoire de publication: `dist`
3. Configurer les variables d'environnement
4. Déployer

#### Vercel

1. Importer votre projet depuis Git
2. Configurer les paramètres de build:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
3. Configurer les variables d'environnement
4. Déployer

### 5. Configuration DNS

1. Configurer votre nom de domaine pour pointer vers votre hébergeur frontend
2. Configurer les certificats SSL

## Vérifications Post-déploiement

1. Tester le flux d'inscription/connexion
2. Vérifier que les requêtes API fonctionnent correctement
3. Tester le processus de paiement complet avec Stripe et CMI
4. Vérifier que les webhooks fonctionnent correctement
5. Tester les alertes et notifications

## Maintenance et monitoring

### Monitoring

1. Configurer les alertes Supabase pour les erreurs de fonctions Edge
2. Configurer les alertes Stripe pour les paiements échoués
3. Mettre en place un système de logging pour suivre les activités utilisateurs

### Sauvegardes

1. Configurer des sauvegardes régulières de la base de données Supabase
2. Établir un plan de reprise d'activité en cas de problème

### Mises à jour

1. Planifier des fenêtres de maintenance
2. Suivre un processus de déploiement progressif:
   - Déployer d'abord dans un environnement de staging
   - Tester complètement
   - Déployer en production

## Résolution de problèmes courants

### Problèmes d'authentification

- Vérifier les paramètres de redirection dans Supabase
- S'assurer que les URLs correspondent exactement

### Échecs de paiement

- Vérifier les logs Stripe pour des informations détaillées
- Vérifier les webhooks et leur bon fonctionnement

### Problèmes de performance

- Vérifier les requêtes les plus lentes dans Supabase
- Optimiser les index de la base de données si nécessaire
