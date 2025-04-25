
# Documentation Technique AlertImmo

## Guide d'installation pour l'environnement de développement

### Prérequis
- Node.js (v18+)
- npm (v9+)
- Compte Supabase
- Compte Stripe pour les paiements internationaux
- Compte CMI pour les paiements au Maroc

### Installation

1. Cloner le dépôt
```sh
git clone <URL_DU_REPO>
cd alertimmo
```

2. Installer les dépendances
```sh
npm install
```

3. Configurer les variables d'environnement
   - Créer un fichier `.env` à la racine du projet
   - Ajouter les variables suivantes:

```
VITE_SUPABASE_URL=https://[VOTRE_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[VOTRE_CLE_ANON]
VITE_MAPBOX_TOKEN=[VOTRE_TOKEN_MAPBOX]
```

4. Configurer les secrets pour les fonctions Edge Supabase:
   - Dans la console Supabase, aller à Settings > Functions
   - Ajouter les secrets:
     - `STRIPE_SECRET_KEY`: Clé secrète Stripe
     - `STRIPE_WEBHOOK_SECRET`: Clé secrète pour les webhooks Stripe
     - `CMI_MERCHANT_ID`: ID Marchand CMI
     - `CMI_STORE_KEY`: Clé de magasin CMI

5. Lancer l'application en mode développement
```sh
npm run dev
```

## Guide de déploiement pour la production

### Déploiement Frontend

1. Construire l'application
```sh
npm run build
```

2. Déployer les fichiers du dossier `dist` sur votre hébergeur préféré (Netlify, Vercel, etc.)

3. Configurer les variables d'environnement sur la plateforme d'hébergement

### Déploiement des fonctions Edge Supabase

1. Installer l'interface en ligne de commande Supabase
```sh
npm install -g supabase-cli
```

2. Se connecter à Supabase
```sh
supabase login
```

3. Lier le projet local au projet Supabase
```sh
supabase link --project-ref [VOTRE_PROJECT_ID]
```

4. Déployer les fonctions
```sh
supabase functions deploy
```

## Documentation des API

### API Frontend (React Query)

#### Propriétés immobilières
- `useProperties()`: Récupère la liste des propriétés avec filtres
- `usePropertyDetail(id)`: Récupère les détails d'une propriété
- `useFavorites()`: Récupère les propriétés favorites de l'utilisateur

#### Alertes
- `useAlerts()`: Récupère la liste des alertes de l'utilisateur
- `useCreateAlert(data)`: Crée une nouvelle alerte
- `useUpdateAlert(id, data)`: Met à jour une alerte existante
- `useDeleteAlert(id)`: Supprime une alerte

#### Abonnements
- `useSubscription()`: Récupère les informations d'abonnement de l'utilisateur
- `useCreateCheckout(planId, provider)`: Crée une session de paiement
- `useVerifyPayment(sessionId)`: Vérifie le statut d'un paiement

### API Backend (Fonctions Edge)

#### Paiement
- `POST /create-checkout`: Crée une session de paiement Stripe ou CMI
  - Paramètres: `planId`, `provider`, `successUrl`, `cancelUrl`
  - Retourne: `paymentUrl` ou `sessionId`

- `POST /verify-payment`: Vérifie un paiement
  - Paramètres: `sessionId`
  - Retourne: `success`, `transaction`, `subscription`

- `POST /stripe-webhook`: Endpoint pour les webhooks Stripe
  - Traite: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `checkout.session.completed`

- `POST /cmi-payment`: Crée une session de paiement CMI
  - Paramètres: `planId`, `successUrl`, `cancelUrl`
  - Retourne: `formHtml`

## Structure de la base de données

### Table `profiles`
Stocke les informations des utilisateurs et l'état de leur abonnement.

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | Identifiant de l'utilisateur (FK: auth.users) |
| email | text | Email de l'utilisateur |
| full_name | text | Nom complet |
| phone | text | Numéro de téléphone |
| avatar_url | text | URL de l'avatar |
| subscription_tier | text | Type d'abonnement ('free', 'premium') |
| subscription_status | text | Statut ('active', 'cancelled', etc.) |
| subscription_ends_at | timestamp | Date de fin d'abonnement |
| two_factor_enabled | boolean | Authentification à deux facteurs |
| created_at | timestamp | Date de création |
| updated_at | timestamp | Date de mise à jour |

### Table `subscriptions`
Enregistre les détails des abonnements.

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | Identifiant de l'abonnement |
| user_id | uuid | Identifiant de l'utilisateur (FK: auth.users) |
| plan_id | text | Identifiant du plan ('premium') |
| status | text | Statut ('active', 'cancelled', etc.) |
| start_date | timestamp | Date de début |
| end_date | timestamp | Date de fin |
| payment_provider | text | Fournisseur ('stripe', 'cmi') |
| payment_id | text | Identifiant du paiement |
| created_at | timestamp | Date de création |
| updated_at | timestamp | Date de mise à jour |

### Table `payment_transactions`
Enregistre toutes les transactions de paiement.

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | Identifiant de la transaction |
| user_id | uuid | Identifiant de l'utilisateur |
| payment_id | text | Identifiant du paiement |
| amount | numeric | Montant |
| currency | text | Devise |
| status | text | Statut ('completed', 'failed', etc.) |
| created_at | timestamp | Date de création |
| updated_at | timestamp | Date de mise à jour |
