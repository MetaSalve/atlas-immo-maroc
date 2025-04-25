
# Système de paiement AlertImmo

Ce document explique le fonctionnement du système de paiement intégré à AlertImmo.

## Architecture

Le système de paiement se compose de plusieurs éléments:

1. **Edge Functions Supabase**:
   - `create-checkout`: Crée une session de paiement Stripe et redirige l'utilisateur vers la page de paiement Stripe
   - `verify-payment`: Vérifie et confirme un paiement, met à jour les données d'abonnement
   - `stripe-webhook`: Gère les webhooks Stripe pour mettre à jour automatiquement les statuts d'abonnement
   - `cmi-payment`: Crée une session de paiement CMI pour le marché marocain

2. **Tables de la base de données**:
   - `payment_transactions`: Stocke les transactions de paiement
   - `profiles`: Contient les informations d'abonnement (`subscription_status`, `subscription_tier`, `subscription_ends_at`)

3. **Composants frontend**:
   - `PaymentPage.tsx`: Interface de paiement avec choix entre Stripe et CMI
   - `PaymentSuccessPage.tsx`: Page de confirmation après paiement
   - `SubscriptionStatus.tsx`: Affiche l'état de l'abonnement
   - `SubscriptionProvider.tsx`: Gère la logique d'abonnement côté client

## Flux de paiement

### Paiement par carte (Stripe)

1. L'utilisateur accède à la page d'abonnement et sélectionne un plan
2. L'utilisateur est redirigé vers la page de paiement et choisit "Carte bancaire"
3. Le frontend appelle l'edge function `create-checkout`
4. Stripe vérifie si l'utilisateur existe déjà comme client, sinon le crée
5. L'utilisateur est redirigé vers la page de paiement sécurisée Stripe
6. Après le paiement, Stripe redirige l'utilisateur vers la page de succès avec un ID de session
7. La page de succès appelle l'edge function `verify-payment` pour confirmer le paiement
8. L'abonnement est activé et le statut de l'utilisateur mis à jour

### Paiement par CMI (Centre Monétique Interbancaire)

1. L'utilisateur accède à la page d'abonnement et sélectionne un plan
2. L'utilisateur est redirigé vers la page de paiement et choisit "CMI"
3. Le frontend appelle l'edge function `cmi-payment`
4. Un formulaire est généré et soumis automatiquement pour rediriger l'utilisateur vers la plateforme CMI
5. L'utilisateur complète le paiement sur la plateforme CMI
6. CMI redirige l'utilisateur vers la page de succès avec un ID de commande
7. La page de succès appelle l'edge function `verify-payment` pour confirmer le paiement
8. L'abonnement est activé et le statut de l'utilisateur mis à jour

## Webhooks et automatisation

Les webhooks Stripe permettent de mettre à jour automatiquement le statut des abonnements lorsque:
- Un abonnement est créé
- Un abonnement est renouvelé
- Le paiement d'un abonnement échoue
- Un abonnement est annulé

## Configuration requise pour la production

### Stripe
1. Clé API secrète Stripe (`STRIPE_SECRET_KEY`)
2. Clé secrète pour les webhooks (`STRIPE_WEBHOOK_SECRET`)
3. Configuration des webhooks dans le dashboard Stripe:
   - URL à configurer: `https://lomogmjwjnhvmcqkpjmg.supabase.co/functions/v1/stripe-webhook`
   - Événements à écouter:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

### CMI
1. Identifiant marchand CMI (`CMI_MERCHANT_ID`)
2. Clé de magasin CMI (`CMI_STORE_KEY`)
3. Paramétrage du compte marchand CMI avec l'URL de callback:
   - URL de succès: `https://votre-domaine.com/payment-success`
   - URL d'échec: `https://votre-domaine.com/subscription?status=failed`

## Maintenance et surveillance

- Les transactions sont enregistrées dans la table `payment_transactions`
- Les erreurs sont capturées et affichées à l'utilisateur
- Les logs Supabase des edge functions fournissent des informations détaillées pour déboguer
- En cas d'échec, l'utilisateur peut réessayer le paiement

Pour toute question ou assistance, contactez l'équipe de développement AlertImmo.
