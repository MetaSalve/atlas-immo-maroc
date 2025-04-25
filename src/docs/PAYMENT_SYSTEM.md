
# Système de paiement AlertImmo

Ce document explique le fonctionnement du système de paiement intégré à AlertImmo.

## Architecture

Le système de paiement se compose de plusieurs éléments:

1. **Edge Functions Supabase**:
   - `create-checkout`: Crée une transaction de paiement et génère une URL de redirection
   - `verify-payment`: Vérifie et confirme un paiement, met à jour les données d'abonnement

2. **Tables de la base de données**:
   - `payment_transactions`: Stocke les transactions de paiement
   - `profiles`: Contient les informations d'abonnement (`subscription_status`, `subscription_tier`, `subscription_ends_at`)

3. **Composants frontend**:
   - `PaymentPage.tsx`: Interface de paiement
   - `PaymentSuccessPage.tsx`: Page de confirmation après paiement
   - `SubscriptionStatus.tsx`: Affiche l'état de l'abonnement
   - `SubscriptionProvider.tsx`: Gère la logique d'abonnement côté client

## Flux de paiement

1. L'utilisateur accède à la page d'abonnement et sélectionne un plan
2. L'utilisateur est redirigé vers la page de paiement (`PaymentPage`)
3. Le frontend appelle l'edge function `create-checkout` pour initialiser le paiement
4. Pour la simulation, l'utilisateur est directement redirigé vers la page de succès
5. La page de succès appelle l'edge function `verify-payment` pour confirmer le paiement
6. L'abonnement est activé et le statut de l'utilisateur mis à jour

## Mode Test vs Production

Actuellement, le système fonctionne en mode test et simule les paiements.

### Pour passer en production avec des paiements réels:

1. **Intégration Stripe**:
   - Créer un compte Stripe et obtenir les clés API
   - Ajouter les secrets Stripe dans les variables d'environnement de Supabase
   - Modifier l'edge function `create-checkout` pour créer une session Stripe
   - Configurer les webhooks Stripe pour les événements de paiement

2. **Intégration CMI (Centre Monétique Interbancaire)**:
   - Obtenir un compte marchand CMI
   - Configurer les paramètres CMI dans les variables d'environnement
   - Modifier la redirection pour pointer vers la plateforme CMI
   - Configurer l'URL de callback CMI vers notre edge function

## Maintenance et surveillance

- Les transactions sont enregistrées dans la table `payment_transactions`
- Les erreurs sont capturées et affichées à l'utilisateur
- En cas d'échec, l'utilisateur peut réessayer le paiement

Pour toute question ou assistance, contactez l'équipe de développement AlertImmo.
