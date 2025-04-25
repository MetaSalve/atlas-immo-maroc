
# Configuration du Serveur AlertImmo

Ce document fournit les directives pour configurer le serveur de production d'AlertImmo.

## Configuration Nginx Recommandée

```nginx
server {
    listen 80;
    server_name alertimmo.ma www.alertimmo.ma;
    
    # Redirection HTTP vers HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name alertimmo.ma www.alertimmo.ma;
    
    # Certificats SSL
    ssl_certificate     /etc/letsencrypt/live/alertimmo.ma/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/alertimmo.ma/privkey.pem;
    
    # Configuration SSL optimisée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # En-têtes de sécurité
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: blob: https://*.supabase.co; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co";
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
    add_header Referrer-Policy "no-referrer-when-downgrade";
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self), interest-cohort=()";
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/x-javascript application/xml application/json;
    gzip_disable "MSIE [1-6]\.";
    
    # Configuration du dossier racine et des fichiers statiques
    root /var/www/alertimmo;
    
    location / {
        try_files $uri $uri/ /index.html =404;
    }
    
    # Mise en cache des ressources statiques
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
    
    # Limitations de taille et de délai
    client_max_body_size 10M;
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_timeout 15;
    send_timeout 10;
    
    # Logs
    access_log /var/log/nginx/alertimmo.access.log;
    error_log /var/log/nginx/alertimmo.error.log;
}
```

## Configuration Apache (Alternative)

Si vous utilisez Apache au lieu de Nginx, voici la configuration équivalente :

```apache
<VirtualHost *:80>
    ServerName alertimmo.ma
    ServerAlias www.alertimmo.ma
    
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName alertimmo.ma
    ServerAlias www.alertimmo.ma
    
    DocumentRoot /var/www/alertimmo
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/alertimmo.ma/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/alertimmo.ma/privkey.pem
    
    # En-têtes de sécurité
    Header always set Content-Security-Policy "default-src 'self'; img-src 'self' data: blob: https://*.supabase.co; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co"
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(self), interest-cohort=()"
    
    # Configuration du répertoire
    <Directory /var/www/alertimmo>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Pour les applications SPA
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Mise en cache
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg)$">
        Header set Cache-Control "max-age=2592000, public"
    </FilesMatch>
    
    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json
    </IfModule>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/alertimmo.error.log
    CustomLog ${APACHE_LOG_DIR}/alertimmo.access.log combined
</VirtualHost>
```

## Configuration des Variables d'Environnement

Les variables d'environnement doivent être configurées sur le serveur et non dans les fichiers de code source. Voici les variables nécessaires :

```bash
# Supabase
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[VOTRE_CLE_ANON]
SUPABASE_SERVICE_ROLE_KEY=[VOTRE_CLE_SERVICE]

# Paiements
STRIPE_SECRET_KEY=[VOTRE_CLE_STRIPE]
STRIPE_WEBHOOK_SECRET=[VOTRE_CLE_WEBHOOK]
CMI_MERCHANT_ID=[VOTRE_ID_MARCHAND]
CMI_STORE_KEY=[VOTRE_CLE_MAGASIN]

# Services tiers
MAPBOX_TOKEN=[VOTRE_TOKEN_MAPBOX]
```

## Déploiement avec Docker (Recommandé)

Pour un déploiement simplifié et cohérent, nous recommandons l'utilisation de Docker.

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Avec un fichier `docker-compose.yml` :

```yaml
version: '3.8'

services:
  alertimmo:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## Surveillance et Monitoring

Pour la surveillance de l'application, nous recommandons :

1. **Sentry** pour le suivi des erreurs front-end
2. **Datadog** ou **New Relic** pour le monitoring des performances
3. **Prometheus + Grafana** pour les métriques du serveur
4. **Uptime Robot** pour la surveillance de la disponibilité

## Sauvegarde des Données

Configurez des sauvegardes régulières :

1. Sauvegarde quotidienne automatique de Supabase
2. Sauvegarde hebdomadaire complète
3. Conservation des sauvegardes pendant au moins 30 jours
4. Test de restauration mensuel

## Liste de Vérification Avant Mise en Production

- [ ] Tester les certificats SSL (score A+ sur SSL Labs)
- [ ] Vérifier tous les en-têtes de sécurité
- [ ] Tester les performances (Google PageSpeed Insights)
- [ ] Vérifier la mise en cache correcte des ressources statiques
- [ ] Configurer les alertes et notifications
- [ ] Vérifier les redondances et points de défaillance unique
- [ ] Effectuer un test de charge
- [ ] Vérifier la conformité RGPD
