
# Documentation API AlertImmo

Cette documentation détaille les endpoints API disponibles pour le projet AlertImmo, incluant les fonctions Edge Supabase et les intégrations avec les systèmes de paiement.

## Fonctions Edge Supabase

### 1. Création de session de paiement
**Endpoint**: `create-checkout`

**Description**: Crée une session de paiement via Stripe ou CMI.

**Méthode**: POST

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Paramètres**:
```json
{
  "planId": "premium", // ID du plan d'abonnement
  "provider": "stripe", // "stripe" ou "cmi"
  "successUrl": "https://alertimmo.com/payment-success",
  "cancelUrl": "https://alertimmo.com/subscription?status=cancelled"
}
```

**Réponse** (Stripe):
```json
{
  "success": true,
  "sessionId": "cs_test_a1b2c3...",
  "sessionUrl": "https://checkout.stripe.com/pay/cs_test_a1b2c3..."
}
```

**Réponse** (CMI):
```json
{
  "success": true,
  "formHtml": "<form id='cmi-payment-form' action='https://payment.cmi.co.ma/fim/est3Dgate' method='post'>...</form>",
  "orderId": "ord_123456"
}
```

### 2. Vérification de paiement
**Endpoint**: `verify-payment`

**Description**: Vérifie le statut d'un paiement et active l'abonnement.

**Méthode**: POST

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Paramètres**:
```json
{
  "sessionId": "cs_test_a1b2c3..." // ID de session Stripe ou ID de commande CMI
}
```

**Réponse**:
```json
{
  "success": true,
  "transaction": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "amount": 199,
    "currency": "MAD",
    "created_at": "2025-04-25T12:34:56Z",
    "subscription_ends_at": "2025-05-25T12:34:56Z"
  }
}
```

### 3. Webhook Stripe
**Endpoint**: `stripe-webhook`

**Description**: Reçoit et traite les événements webhook de Stripe.

**Méthode**: POST

**Headers**:
```
Content-Type: application/json
Stripe-Signature: <signature>
```

**Corps**: Événement Stripe (varie selon le type d'événement)

**Types d'événements gérés**:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### 4. Paiement CMI
**Endpoint**: `cmi-payment`

**Description**: Gère les paiements via CMI (Centre Monétique Interbancaire).

**Méthode**: POST

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Paramètres**:
```json
{
  "planId": "premium",
  "amount": 199,
  "currency": "MAD",
  "successUrl": "https://alertimmo.com/payment-success",
  "cancelUrl": "https://alertimmo.com/subscription?status=cancelled"
}
```

**Réponse**:
```json
{
  "success": true,
  "formHtml": "<form id='cmi-payment-form' action='https://payment.cmi.co.ma/fim/est3Dgate' method='post'>...</form>",
  "orderId": "ord_123456"
}
```

## Supabase API

### Authentification

**Inscription**:
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123'
})
```

**Connexion**:
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123'
})
```

**Déconnexion**:
```typescript
const { error } = await supabase.auth.signOut()
```

### Propriétés immobilières

**Récupérer les propriétés avec filtres**:
```typescript
const { data, error } = await supabase
  .from('properties')
  .select('*')
  .eq('type', 'Appartement')
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .gte('bedrooms', minBedrooms)
```

**Récupérer une propriété par ID**:
```typescript
const { data, error } = await supabase
  .from('properties')
  .select('*')
  .eq('id', propertyId)
  .single()
```

### Favoris

**Ajouter aux favoris**:
```typescript
const { data, error } = await supabase
  .from('favorites')
  .insert({
    property_id: propertyId,
    user_id: userId
  })
```

**Supprimer des favoris**:
```typescript
const { error } = await supabase
  .from('favorites')
  .delete()
  .eq('property_id', propertyId)
  .eq('user_id', userId)
```

**Récupérer les favoris**:
```typescript
const { data, error } = await supabase
  .from('favorites')
  .select('property_id, properties(*)')
  .eq('user_id', userId)
```

### Alertes

**Créer une alerte**:
```typescript
const { data, error } = await supabase
  .from('user_alerts')
  .insert({
    user_id: userId,
    name: 'Ma recherche',
    filters: {
      type: 'Appartement',
      location: 'Casablanca',
      priceMin: 500000,
      priceMax: 1500000,
      bedroomsMin: 2
    },
    is_active: true
  })
```

**Mettre à jour une alerte**:
```typescript
const { data, error } = await supabase
  .from('user_alerts')
  .update({
    name: 'Nouvelle recherche',
    filters: { /* nouveaux filtres */ },
    is_active: false
  })
  .eq('id', alertId)
  .eq('user_id', userId)
```

**Supprimer une alerte**:
```typescript
const { error } = await supabase
  .from('user_alerts')
  .delete()
  .eq('id', alertId)
  .eq('user_id', userId)
```

## Intégration dans l'interface utilisateur

### Hooks React Query

**Exemple de hook pour les propriétés**:
```typescript
export function useProperties(filters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase.from('properties').select('*')
      
      // Appliquer les filtres
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (key.includes('Min')) {
            query = query.gte(key.replace('Min', ''), value)
          } else if (key.includes('Max')) {
            query = query.lte(key.replace('Max', ''), value)
          } else {
            query = query.eq(key, value)
          }
        }
      })
      
      const { data, error } = await query
      
      if (error) throw new Error(error.message)
      return data
    }
  })
}
```

**Exemple de hook pour les paiements**:
```typescript
export function useCreateCheckout() {
  return useMutation({
    mutationFn: async ({ planId, provider, successUrl, cancelUrl }) => {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId, provider, successUrl, cancelUrl }
      })
      
      if (error) throw new Error(error.message)
      return data
    }
  })
}
```
