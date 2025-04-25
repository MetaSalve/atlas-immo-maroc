
# Guide des Métriques de Performance et Monitoring AlertImmo

## Métriques Clés à Surveiller

### 1. Disponibilité du Service
- Uptime
- Statut des composants (API, DB, Auth)

### 2. Performance
- Temps de réponse moyen
- Nombre de requêtes par minute
- Taux d'erreur global

### 3. Monitoring des Performances

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

### 4. Surveillance de Base de Données

#### Métriques Supabase à Surveiller
- Nombre de connexions
- Durée des requêtes
- Taux d'utilisation du pool de connexions
- Espace de stockage utilisé
- Requêtes lentes (> 200ms)

### 5. Exemple d'Implémentation avec Grafana

```yaml
apiVersion: 1
providers:
  - name: AlertImmo
    folder: Main
    type: file
    options:
      path: /var/lib/grafana/dashboards
```
