
# Capacité et Planification de la Croissance AlertImmo

## 1. Métriques de Capacité à Suivre

- Nombre d'utilisateurs actifs simultanés
- Nombre de recherches par minute
- Utilisation de la base de données
- Consommation de bande passante
- Demandes d'API par seconde

## 2. Seuils d'Alerte de Capacité

| Ressource | Seuil d'Avertissement | Seuil d'Action |
|-----------|---------------------|----------------|
| CPU | 70% en moyenne sur 24h | 85% en moyenne sur 12h |
| Mémoire | 75% en moyenne sur 24h | 90% en pic |
| Stockage | 70% d'utilisation | 85% d'utilisation |
| Base de données | 2000 connexions | 2500 connexions |
| Requêtes API | 100 req/sec | 150 req/sec |

## 3. Plan de Mise à l'Échelle

- Seuils de déclenchement pour la mise à l'échelle automatique
- Procédure d'ajout de capacité (serveurs, bases de données)
- Calendrier de revue de capacité (mensuel)
