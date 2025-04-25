
# Plan de Test UAT AlertImmo

## 1. Gestion des Abonnements

### 1.1 Compte Gratuit
| Test ID | Description | Étapes | Résultat Attendu | Statut |
|---------|-------------|---------|------------------|---------|
| FREE-01 | Vérifier les limitations du compte gratuit | 1. Se connecter avec un compte gratuit<br>2. Vérifier le nombre max de favoris<br>3. Vérifier le nombre max d'alertes | • Max 5 favoris<br>• Max 3 alertes<br>• Pas d'accès aux filtres avancés | ⬜ |
| FREE-02 | Vérifier la période d'essai | 1. Créer un nouveau compte<br>2. Vérifier la durée d'essai<br>3. Vérifier la barre de progression | • 15 jours d'essai<br>• Barre de progression correcte<br>• Date de fin correcte | ⬜ |

### 1.2 Upgrade vers Premium
| Test ID | Description | Étapes | Résultat Attendu | Statut |
|---------|-------------|---------|------------------|---------|
| UPG-01 | Passage à l'abonnement Premium par Stripe | 1. Cliquer sur "Passer à l'offre Premium"<br>2. Choisir Stripe<br>3. Compléter le paiement | • Redirection vers Stripe<br>• Paiement accepté<br>• Retour sur la page de succès | ⬜ |
| UPG-02 | Passage à l'abonnement Premium par CMI | 1. Cliquer sur "Passer à l'offre Premium"<br>2. Choisir CMI<br>3. Compléter le paiement | • Redirection vers CMI<br>• Paiement accepté<br>• Retour sur la page de succès | ⬜ |

### 1.3 Gestion du Compte Premium
| Test ID | Description | Étapes | Résultat Attendu | Statut |
|---------|-------------|---------|------------------|---------|
| PREM-01 | Vérifier les fonctionnalités Premium | 1. Se connecter avec un compte premium<br>2. Tester toutes les fonctionnalités | • Favoris illimités<br>• Alertes illimitées<br>• Accès aux filtres avancés | ⬜ |
| PREM-02 | Gérer le paiement | 1. Aller dans Profil > Abonnement<br>2. Cliquer sur "Gérer le paiement"<br>3. Accéder au portail Stripe | • Redirection vers le portail client Stripe<br>• Options de gestion visibles | ⬜ |

### 1.4 Annulation d'Abonnement
| Test ID | Description | Étapes | Résultat Attendu | Statut |
|---------|-------------|---------|------------------|---------|
| CAN-01 | Annuler l'abonnement | 1. Cliquer sur "Annuler l'abonnement"<br>2. Confirmer l'annulation<br>3. Vérifier le statut | • Dialog de confirmation<br>• Redirection vers le portail<br>• Statut mis à jour | ⬜ |
| CAN-02 | Vérifier la fin d'abonnement | 1. Annuler l'abonnement<br>2. Attendre la fin de période<br>3. Vérifier le retour au plan gratuit | • Accès premium jusqu'à la fin<br>• Retour automatique au plan gratuit | ⬜ |

## 2. Paiements et Transactions

### 2.1 Processus de Paiement
| Test ID | Description | Étapes | Résultat Attendu | Statut |
|---------|-------------|---------|------------------|---------|
| PAY-01 | Paiement réussi Stripe | 1. Initier un paiement Stripe<br>2. Utiliser carte de test valide<br>3. Vérifier la confirmation | • Transaction complétée<br>• Reçu par email<br>• Statut premium activé | ⬜ |
| PAY-02 | Paiement réussi CMI | 1. Initier un paiement CMI<br>2. Utiliser carte de test valide<br>3. Vérifier la confirmation | • Transaction complétée<br>• Reçu par email<br>• Statut premium activé | ⬜ |

### 2.2 Scénarios d'Erreur
| Test ID | Description | Étapes | Résultat Attendu | Statut |
|---------|-------------|---------|------------------|---------|
| ERR-01 | Paiement refusé | 1. Utiliser une carte invalide<br>2. Tenter le paiement<br>3. Vérifier la gestion d'erreur | • Message d'erreur clair<br>• Pas de changement de statut<br>• Option de réessayer | ⬜ |
| ERR-02 | Timeout de session | 1. Laisser la session expirer<br>2. Tenter une action<br>3. Vérifier la redirection | • Message de session expirée<br>• Redirection vers login<br>• État préservé | ⬜ |

## 3. Interface Utilisateur

### 3.1 Compatibilité
| Test ID | Description | Étapes | Résultat Attendu | Statut |
|---------|-------------|---------|------------------|---------|
| UI-01 | Responsive Design | 1. Tester sur mobile<br>2. Tester sur tablet<br>3. Tester sur desktop | • Adaptation correcte<br>• Tous les éléments visibles<br>• Fonctionnalités accessibles | ⬜ |
| UI-02 | Compatibilité Navigateurs | 1. Tester sur Chrome<br>2. Tester sur Firefox<br>3. Tester sur Safari | • Affichage cohérent<br>• Fonctionnalités identiques<br>• Pas d'erreurs JS | ⬜ |

### 3.2 Accessibilité
| Test ID | Description | Étapes | Résultat Attendu | Statut |
|---------|-------------|---------|------------------|---------|
| ACC-01 | Navigation clavier | 1. Naviguer avec Tab<br>2. Utiliser les raccourcis<br>3. Tester les formulaires | • Focus visible<br>• Ordre logique<br>• Tous les éléments accessibles | ⬜ |
| ACC-02 | Lecteur d'écran | 1. Tester avec VoiceOver<br>2. Vérifier les aria-labels<br>3. Tester les alertes | • Textes alternatifs présents<br>• Structure sémantique<br>• Messages clairs | ⬜ |

## 4. Performance

### 4.1 Temps de Réponse
| Test ID | Description | Étapes | Résultat Attendu | Statut |
|---------|-------------|---------|------------------|---------|
| PERF-01 | Chargement initial | 1. Mesurer le temps de chargement<br>2. Vérifier les ressources<br>3. Tester la mise en cache | • < 3s de chargement<br>• Assets optimisés<br>• Cache effectif | ⬜ |
| PERF-02 | Actions utilisateur | 1. Mesurer les interactions<br>2. Tester les animations<br>3. Vérifier les feedbacks | • Réponse < 100ms<br>• Animations fluides<br>• Feedback immédiat | ⬜ |

## Instructions pour les Testeurs

1. **Préparation**
   - Créer des comptes de test
   - Préparer les cartes de test (Stripe et CMI)
   - Vérifier l'environnement de test

2. **Exécution**
   - Suivre les étapes dans l'ordre
   - Noter les résultats pour chaque test
   - Documenter les bugs trouvés

3. **Documentation**
   - Remplir le statut (✅ Succès, ❌ Échec, ⚠️ Partiel)
   - Capturer des screenshots des erreurs
   - Noter les suggestions d'amélioration

## Cartes de Test

### Stripe
- Succès: 4242 4242 4242 4242
- Refus: 4000 0000 0000 0002
- Date future & CVC valides requis

### CMI
- Utiliser les cartes de test fournies par CMI
- Suivre le protocole de test CMI

## Validation Finale

- [ ] Tous les tests critiques passés
- [ ] Bugs majeurs documentés et corrigés
- [ ] Performance acceptable
- [ ] Validation sécurité effectuée
- [ ] Documentation mise à jour

