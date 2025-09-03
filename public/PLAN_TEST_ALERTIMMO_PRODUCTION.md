# PLAN DE TEST COMPLET - ALERTIMMO
## Cas d'usage avant mise en production

---

## 📋 INFORMATIONS GÉNÉRALES

**Version:** 1.0 Production Ready  
**Date:** Janvier 2025  
**Responsable QA:** Équipe AlertImmo  
**Environnement:** Production Preview  

---

## 🎯 MODULES À TESTER

### 1. AUTHENTIFICATION & SÉCURITÉ
#### 1.1 Inscription Utilisateur
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| AUTH-001 | Inscription valide | Email: user@test.ma, Password: Test123! | Compte créé, email confirmation | Critique |
| AUTH-002 | Email déjà utilisé | Email existant | Message d'erreur approprié | Critique |
| AUTH-003 | Mot de passe trop faible | Password: 123 | Validation échoue, message guidant | Critique |
| AUTH-004 | Format email invalide | Email: invalid-email | Validation échoue | Importante |
| AUTH-005 | Champs obligatoires vides | Champs vides | Messages d'erreur spécifiques | Importante |

#### 1.2 Connexion Utilisateur
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| AUTH-006 | Connexion valide | Credentials corrects | Connexion réussie, redirection | Critique |
| AUTH-007 | Mot de passe incorrect | Password erroné | Message d'erreur sécurisé | Critique |
| AUTH-008 | Email inexistant | Email non enregistré | Message d'erreur générique | Critique |
| AUTH-009 | Limitation tentatives | 5 tentatives échouées | Compte temporairement bloqué | Critique |
| AUTH-010 | Session persistence | Rechargement page | Utilisateur reste connecté | Importante |

#### 1.3 Récupération Mot de Passe
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| AUTH-011 | Reset password valide | Email enregistré | Email de reset envoyé | Critique |
| AUTH-012 | Email inexistant | Email non enregistré | Pas d'indication (sécurité) | Critique |
| AUTH-013 | Token expiration | Token > 24h | Lien expiré, nouveau demandé | Importante |

#### 1.4 Authentification 2FA
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| AUTH-014 | Activation 2FA | Code QR généré | 2FA activé, codes de récup | Importante |
| AUTH-015 | Login avec 2FA | Code TOTP valide | Connexion réussie | Importante |
| AUTH-016 | Code 2FA invalide | Code erroné | Accès refusé | Importante |

---

### 2. RECHERCHE & NAVIGATION
#### 2.1 Recherche Propriétés
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| SEARCH-001 | Recherche par ville | "Casablanca" | Propriétés de Casablanca affichées | Critique |
| SEARCH-002 | Recherche par type | "Appartement" | Uniquement appartements | Critique |
| SEARCH-003 | Filtre prix | 500k-1M MAD | Propriétés dans cette gamme | Critique |
| SEARCH-004 | Filtre surface | 80-150 m² | Propriétés correspondantes | Importante |
| SEARCH-005 | Filtres combinés | Ville + Type + Prix | Intersection des critères | Critique |
| SEARCH-006 | Recherche vide | Aucun critère | Toutes les propriétés | Importante |
| SEARCH-007 | Aucun résultat | Critères impossibles | Message "Aucun résultat" | Importante |
| SEARCH-008 | Performance recherche | 1000+ propriétés | Résultats < 3 secondes | Critique |

#### 2.2 Pagination & Tri
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| SEARCH-009 | Pagination | Page 2, 3, etc. | Navigation fluide | Importante |
| SEARCH-010 | Tri par prix | Croissant/Décroissant | Ordre correct | Importante |
| SEARCH-011 | Tri par date | Plus récent d'abord | Ordre chronologique | Moyenne |

---

### 3. PROPRIÉTÉS & DÉTAILS
#### 3.1 Affichage Propriétés
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| PROP-001 | Liste des propriétés | Page d'accueil | Propriétés formatées correctement | Critique |
| PROP-002 | Détails propriété | Clic sur propriété | Page détail complète | Critique |
| PROP-003 | Images propriété | Carousel images | Toutes images chargées | Critique |
| PROP-004 | Informations contact | Utilisateur premium | Coordonnées visibles | Critique |
| PROP-005 | Infos contact cachées | Utilisateur gratuit | "Contactez pour infos" | Critique |
| PROP-006 | Géolocalisation | Pin sur carte | Position correcte | Importante |
| PROP-007 | Partage propriété | Bouton partage | URL copiée/partagée | Moyenne |

#### 3.2 Favoris
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| FAV-001 | Ajouter favori | Clic cœur | Propriété ajoutée | Critique |
| FAV-002 | Retirer favori | Re-clic cœur | Propriété retirée | Critique |
| FAV-003 | Liste favoris | Page favoris | Toutes propriétés favorites | Critique |
| FAV-004 | Favoris vides | Aucun favori | Message approprié | Moyenne |
| FAV-005 | Persistance favoris | Déconnexion/reconnexion | Favoris conservés | Importante |

---

### 4. ALERTES IMMOBILIÈRES
#### 4.1 Création Alertes
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| ALERT-001 | Créer alerte basique | Ville + Type | Alerte créée | Critique |
| ALERT-002 | Alerte avec tous filtres | Critères complets | Alerte détaillée créée | Critique |
| ALERT-003 | Limite alertes free | 4ème alerte (user free) | Erreur limite atteinte | Critique |
| ALERT-004 | Alertes illimitées | User premium | Toutes alertes créées | Importante |
| ALERT-005 | Nom alerte personnalisé | "Appart Casa Centre" | Nom sauvegardé | Moyenne |

#### 4.2 Gestion Alertes
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| ALERT-006 | Modifier alerte | Changement critères | Alerte mise à jour | Critique |
| ALERT-007 | Désactiver alerte | Toggle OFF | Alerte inactive | Importante |
| ALERT-008 | Supprimer alerte | Bouton supprimer | Alerte supprimée | Importante |
| ALERT-009 | Liste alertes | Page alertes | Toutes alertes listées | Critique |

---

### 5. ABONNEMENTS & PAIEMENTS
#### 5.1 Plans d'Abonnement
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| SUB-001 | Affichage plans | Page abonnement | 3 plans visibles | Critique |
| SUB-002 | Fonctionnalités free | Plan gratuit | Limitations claires | Critique |
| SUB-003 | Avantages premium | Plan premium | Bénéfices mis en avant | Critique |
| SUB-004 | Essai gratuit | 7 jours gratuits | Accès premium temporaire | Importante |

#### 5.2 Processus Paiement
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| PAY-001 | Paiement Stripe | Carte test Stripe | Paiement réussi | Critique |
| PAY-002 | Paiement CMI | Carte test CMI | Paiement réussi | Critique |
| PAY-003 | Carte refusée | Carte invalide | Message d'erreur | Critique |
| PAY-004 | Confirmation paiement | Paiement réussi | Email + accès immédiat | Critique |
| PAY-005 | Facturation | Après paiement | Facture générée | Importante |

---

### 6. CALCULATEURS & OUTILS
#### 6.1 Calculateur Crédit
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| CALC-001 | Calcul mensualité | 1M MAD, 20 ans, 4.5% | Mensualité correcte | Critique |
| CALC-002 | Différents taux | 3.5%, 4%, 5.5% | Calculs variables | Importante |
| CALC-003 | Apport minimum | 10% prix bien | Validation apport | Importante |
| CALC-004 | Durée maximum | 25 ans max | Limitation respectée | Moyenne |
| CALC-005 | Simulation complète | Tous paramètres | Tableau amortissement | Moyenne |

#### 6.2 Convertisseur Devises
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| CONV-001 | MAD vers EUR | 1,000,000 MAD | ~94,000 EUR | Importante |
| CONV-002 | EUR vers MAD | 100,000 EUR | ~1,060,000 MAD | Importante |
| CONV-003 | Swap devises | Bouton échange | Devises inversées | Moyenne |
| CONV-004 | Toutes devises | MAD/EUR/USD/GBP | Conversions correctes | Importante |

---

### 7. GUIDE DES QUARTIERS
#### 7.1 Navigation Guide
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| GUIDE-001 | Sélection ville | Casablanca tab | Quartiers Casablanca | Importante |
| GUIDE-002 | Informations quartier | Clic quartier | Détails complets | Importante |
| GUIDE-003 | Prix au m² | Quartier premium | Fourchette prix | Importante |
| GUIDE-004 | Transport & commodités | Infos pratiques | Données complètes | Moyenne |

---

### 8. SUPPORT & CHAT
#### 8.1 Chat en Direct
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| CHAT-001 | Ouvrir chat | Clic icône chat | Fenêtre chat ouverte | Importante |
| CHAT-002 | Message bot | Question basique | Réponse automatique | Importante |
| CHAT-003 | Agent humain | Demande agent | Transfert vers agent | Moyenne |
| CHAT-004 | Historique chat | Messages précédents | Conversation sauvée | Moyenne |

---

### 9. NOTIFICATIONS
#### 9.1 Notifications Alertes
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| NOTIF-001 | Nouvelle propriété | Correspond à alerte | Notification générée | Critique |
| NOTIF-002 | Changement prix | Baisse prix favori | Notification prix | Importante |
| NOTIF-003 | Marquer lu | Clic notification | Status "lu" | Moyenne |
| NOTIF-004 | Supprimer notif | Action supprimer | Notification supprimée | Moyenne |

---

### 10. ADMINISTRATION
#### 10.1 Dashboard Admin
| ID | Cas de test | Données | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| ADMIN-001 | Accès admin | User admin | Dashboard accessible | Critique |
| ADMIN-002 | Statistiques | Métriques système | Données correctes | Importante |
| ADMIN-003 | Gestion utilisateurs | Liste users | Actions admin | Importante |
| ADMIN-004 | Logs sécurité | Événements sécurité | Journaux complets | Critique |

---

### 11. RESPONSIVE & PWA
#### 11.1 Responsive Design
| ID | Cas de test | Appareil | Résultat attendu | Priorité |
|----|-------------|----------|------------------|----------|
| RESP-001 | Mobile portrait | iPhone 12/13 | Interface adaptée | Critique |
| RESP-002 | Mobile paysage | Rotation téléphone | Layout ajusté | Importante |
| RESP-003 | Tablette | iPad | Navigation optimisée | Importante |
| RESP-004 | Desktop HD | 1920x1080 | Pleine utilisation | Importante |
| RESP-005 | Navigation mobile | Bottom nav | Accès facilité | Critique |

#### 11.2 Progressive Web App
| ID | Cas de test | Action | Résultat attendu | Priorité |
|----|-------------|--------|------------------|----------|
| PWA-001 | Installation PWA | "Ajouter à l'écran" | App installée | Importante |
| PWA-002 | Mode hors ligne | Perte connexion | Fonctionnalités de base | Importante |
| PWA-003 | Notifications push | Autorisation | Notifications reçues | Moyenne |
| PWA-004 | Mise à jour PWA | Nouvelle version | Update automatique | Moyenne |

---

### 12. PERFORMANCE & SEO
#### 12.1 Performance
| ID | Cas de test | Métrique | Objectif | Priorité |
|----|-------------|----------|----------|----------|
| PERF-001 | Temps chargement | Page d'accueil | < 3 secondes | Critique |
| PERF-002 | First Paint | Premier rendu | < 1.5 secondes | Critique |
| PERF-003 | Time to Interactive | Interactivité | < 3.5 secondes | Critique |
| PERF-004 | Lighthouse Score | Toutes métriques | > 90/100 | Importante |
| PERF-005 | Images optimisées | Lazy loading | Chargement progressif | Importante |

#### 12.2 SEO
| ID | Cas de test | Vérification | Résultat attendu | Priorité |
|----|-------------|--------------|------------------|----------|
| SEO-001 | Balises title | Toutes pages | Titles uniques | Critique |
| SEO-002 | Meta descriptions | Pages principales | Descriptions SEO | Critique |
| SEO-003 | Structure H1-H6 | Hiérarchie | Balises correctes | Importante |
| SEO-004 | Alt images | Toutes images | Textes alternatifs | Importante |
| SEO-005 | Sitemap XML | /sitemap.xml | Sitemap valide | Critique |
| SEO-006 | Robots.txt | /robots.txt | Directives correctes | Importante |

---

### 13. SÉCURITÉ
#### 13.1 Tests Sécurité
| ID | Cas de test | Test | Résultat attendu | Priorité |
|----|-------------|------|------------------|----------|
| SEC-001 | Injection SQL | Tentatives injection | Protections actives | Critique |
| SEC-002 | XSS | Scripts malveillants | Sanitisation | Critique |
| SEC-003 | CSRF | Attaques cross-site | Tokens CSRF | Critique |
| SEC-004 | Headers sécurité | CSP, HSTS, etc. | Headers présents | Critique |
| SEC-005 | Données sensibles | Infos personnelles | Chiffrement | Critique |
| SEC-006 | Logs sécurité | Tentatives intrusion | Événements loggés | Importante |

---

### 14. INTÉGRATIONS
#### 14.1 Supabase
| ID | Cas de test | Fonctionnalité | Résultat attendu | Priorité |
|----|-------------|----------------|------------------|----------|
| INT-001 | Authentification | Login/Register | Supabase Auth OK | Critique |
| INT-002 | Base de données | CRUD operations | Toutes opérations | Critique |
| INT-003 | RLS Policies | Sécurité données | Accès contrôlé | Critique |
| INT-004 | Real-time | Notifications live | Updates temps réel | Importante |

#### 14.2 APIs Externes
| ID | Cas de test | Service | Résultat attendu | Priorité |
|----|-------------|---------|------------------|----------|
| INT-005 | Scraping sources | Sites immobiliers | Données récupérées | Critique |
| INT-006 | Géolocalisation | Cartes/coordonnées | Positions correctes | Importante |
| INT-007 | Emails | Notifications/Reset | Emails envoyés | Critique |

---

## 🎯 CRITÈRES D'ACCEPTATION GLOBAUX

### Performance Minimale Requise:
- ✅ **Lighthouse Score:** > 85/100 (toutes métriques)
- ✅ **Temps chargement:** < 3 secondes (3G)
- ✅ **First Paint:** < 1.5 secondes
- ✅ **Disponibilité:** 99.9% uptime

### Sécurité Minimale Requise:
- ✅ **Authentification:** 2FA disponible
- ✅ **Chiffrement:** HTTPS obligatoire
- ✅ **Headers:** CSP, HSTS configurés
- ✅ **Données:** PII chiffrées

### Fonctionnel Minimal Requis:
- ✅ **Search:** Recherche fonctionnelle
- ✅ **Auth:** Login/Register/Reset
- ✅ **Alertes:** Création/gestion alertes
- ✅ **Paiements:** Stripe + CMI opérationnels
- ✅ **Mobile:** Interface responsive complète

---

## 📊 NIVEAUX DE PRIORITÉ

- **🔴 CRITIQUE:** Bloquant pour la production
- **🟡 IMPORTANTE:** Fonctionnalité majeure
- **🟢 MOYENNE:** Amélioration UX

---

## 📋 CHECKLIST FINALE PRE-PRODUCTION

### Configuration Production:
- [ ] Variables d'environnement sécurisées
- [ ] Base de données production configurée
- [ ] CDN et cache configurés
- [ ] Monitoring et alertes actifs
- [ ] Sauvegardes automatiques
- [ ] SSL/TLS configuré

### Documentation:
- [ ] Guide utilisateur finalisé
- [ ] Documentation API complète
- [ ] Procédures de déploiement
- [ ] Plan de reprise d'activité

### Équipe:
- [ ] Formation équipe support
- [ ] Procédures d'escalade
- [ ] Contacts techniques disponibles

---

**📞 CONTACT TECHNIQUE**
En cas de problème critique: support@alertimmo.ma

**🗓️ PLANNING**
- Phase 1 (Tests Critiques): 3 jours
- Phase 2 (Tests Complémentaires): 2 jours  
- Phase 3 (Tests Performance/Sécurité): 2 jours
- **TOTAL:** 7 jours de tests avant production

---

*Document généré automatiquement - AlertImmo v1.0*