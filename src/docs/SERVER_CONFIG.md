
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

    # Configuration Let's Encrypt (pour le renouvellement automatique des certificats)
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
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
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # En-têtes de sécurité
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: blob: https://*.supabase.co; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co";
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header Referrer-Policy "no-referrer-when-downgrade";
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self), interest-cohort=()";
    add_header Feature-Policy "geolocation 'self'; midi 'none'; sync-xhr 'none'; microphone 'none'; camera 'none'; magnetometer 'none'; gyroscope 'none'; speaker 'none'; fullscreen 'self'; payment 'none'";
    
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
        
        # SPA routing
        if (!-e $request_filename) {
            rewrite ^(.*)$ /index.html break;
        }
    }
    
    # API proxy pour Supabase (si nécessaire)
    location /api/ {
        proxy_pass https://[PROJECT_ID].supabase.co/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Service Worker spécifique pour PWA
    location /service-worker.js {
        add_header Cache-Control "no-cache";
        expires -1;
    }
    
    # Manifest PWA
    location /manifest.json {
        add_header Cache-Control "no-cache";
        expires -1;
    }
    
    # Mise en cache des ressources statiques
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
    
    # Cache agressif pour les assets hachés
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg).*\.[a-f0-9]{8,}\..*$ {
        expires max;
        add_header Cache-Control "public, immutable";
    }
    
    # Limitations de taille et de délai
    client_max_body_size 10M;
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_timeout 15;
    send_timeout 10;
    
    # Protection contre les attaques DDoS
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;
    
    # Limiter les requêtes pour les chemins sensibles
    location /login {
        limit_req zone=login burst=5 nodelay;
        try_files $uri $uri/ /index.html =404;
    }
    
    location /api/sensitive-endpoint {
        limit_req zone=api burst=10 nodelay;
        proxy_pass https://[PROJECT_ID].supabase.co/;
        # ... autres configurations de proxy
    }
    
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
    
    # Configuration Let's Encrypt
    Alias /.well-known/acme-challenge/ /var/www/certbot/.well-known/acme-challenge/
    <Directory "/var/www/certbot/.well-known/acme-challenge/">
        Options None
        AllowOverride None
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:443>
    ServerName alertimmo.ma
    ServerAlias www.alertimmo.ma
    
    DocumentRoot /var/www/alertimmo
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/alertimmo.ma/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/alertimmo.ma/privkey.pem
    
    # Protocoles et Ciphers sécurisés
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder on
    SSLCompression off
    SSLSessionTickets off
    
    # OCSP Stapling
    SSLUseStapling on
    SSLStaplingCache "shmcb:logs/stapling-cache(150000)"
    
    # En-têtes de sécurité
    Header always set Content-Security-Policy "default-src 'self'; img-src 'self' data: blob: https://*.supabase.co; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co"
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(self), interest-cohort=()"
    Header always set Feature-Policy "geolocation 'self'; midi 'none'; sync-xhr 'none'; microphone 'none'; camera 'none'; magnetometer 'none'; gyroscope 'none'; speaker 'none'; fullscreen 'self'; payment 'none'"
    
    # Protection DDoS
    <IfModule mod_evasive20.c>
        DOSHashTableSize 3097
        DOSPageCount 5
        DOSSiteCount 50
        DOSPageInterval 1
        DOSSiteInterval 1
        DOSBlockingPeriod 60
    </IfModule>
    
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
    
    # Configuration Service Worker
    <FilesMatch "service-worker.js">
        Header set Cache-Control "no-cache"
        ExpiresActive On
        ExpiresDefault "access"
    </FilesMatch>
    
    # Configuration Manifest PWA
    <FilesMatch "manifest.json">
        Header set Cache-Control "no-cache"
        ExpiresActive On
        ExpiresDefault "access"
    </FilesMatch>
    
    # Mise en cache
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg)$">
        Header set Cache-Control "max-age=2592000, public"
    </FilesMatch>
    
    # Cache agressif pour assets hachés
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg).*[a-f0-9]{8,}\..*$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>
    
    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json
    </IfModule>
    
    # Proxy pour Supabase API (si nécessaire)
    ProxyPreserveHost On
    ProxyPass /api/ https://[PROJECT_ID].supabase.co/
    ProxyPassReverse /api/ https://[PROJECT_ID].supabase.co/
    
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

# Configuration de sécurité
JWT_SECRET=[VOTRE_SECRET_JWT]
SESSION_SECRET=[VOTRE_SECRET_SESSION]
COOKIE_SECRET=[VOTRE_SECRET_COOKIE]

# Configuration du serveur
NODE_ENV=production
PORT=3000
```

## Déploiement avec Docker (Recommandé)

Pour un déploiement simplifié et cohérent, nous recommandons l'utilisation de Docker.

### Dockerfile optimisé

```dockerfile
# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances et installer
COPY package*.json ./
RUN npm ci

# Copier le code source et construire
COPY . .
RUN npm run build

# Étape de production avec un serveur Nginx minimal
FROM nginx:alpine

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers statiques construits
COPY --from=builder /app/dist /usr/share/nginx/html

# Dossier pour Let's Encrypt
RUN mkdir -p /var/www/certbot

# Exposer les ports HTTP et HTTPS
EXPOSE 80 443

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose complet

```yaml
version: '3.8'

services:
  # Application web
  alertimmo:
    build: .
    container_name: alertimmo-app
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./logs:/var/log/nginx
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    environment:
      - NODE_ENV=production
    networks:
      - alertimmo-network
    depends_on:
      - certbot
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
  
  # Let's Encrypt Certbot pour les certificats SSL
  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ./certbot/www:/var/www/certbot
      - /etc/letsencrypt:/etc/letsencrypt
    command: certonly --webroot --webroot-path=/var/www/certbot --email contact@alertimmo.ma --agree-tos --no-eff-email -d alertimmo.ma -d www.alertimmo.ma
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

networks:
  alertimmo-network:
    driver: bridge
```

### Script de déploiement automatisé

Créez un fichier `deploy.sh` avec le contenu suivant :

```bash
#!/bin/bash
set -e

# Variables
APP_NAME="alertimmo"
REPO_URL="votre-repo-git-url"
DEPLOY_DIR="/opt/alertimmo"
BACKUP_DIR="/opt/backups/alertimmo"
DATE=$(date +%Y%m%d_%H%M%S)

# Créer le répertoire de déploiement s'il n'existe pas
mkdir -p $DEPLOY_DIR
mkdir -p $BACKUP_DIR

# Sauvegarder la configuration actuelle
if [ -d "$DEPLOY_DIR/current" ]; then
  echo "Sauvegarde de la configuration actuelle..."
  cp -r $DEPLOY_DIR/current/nginx.conf $DEPLOY_DIR/current/.env $BACKUP_DIR/
  tar -czf $BACKUP_DIR/$APP_NAME-$DATE.tar.gz -C $DEPLOY_DIR current
fi

# Créer un répertoire de déploiement temporaire
TEMP_DIR=$DEPLOY_DIR/releases/$DATE
mkdir -p $TEMP_DIR

# Cloner le dépôt
echo "Clonage du code source..."
git clone $REPO_URL $TEMP_DIR

# Charger les variables d'environnement
echo "Configuration des variables d'environnement..."
if [ -f "$BACKUP_DIR/.env" ]; then
  cp $BACKUP_DIR/.env $TEMP_DIR/
else
  echo "Aucun fichier .env trouvé. Création d'un nouveau fichier..."
  cp $TEMP_DIR/.env.example $TEMP_DIR/.env
  # Vous devrez éditer manuellement ce fichier après le déploiement
fi

# Configuration de Nginx
if [ -f "$BACKUP_DIR/nginx.conf" ]; then
  cp $BACKUP_DIR/nginx.conf $TEMP_DIR/
fi

# Construire et déployer avec Docker
echo "Construction et déploiement avec Docker..."
cd $TEMP_DIR
docker-compose down || true
docker-compose build
docker-compose up -d

# Mettre à jour le lien symbolique 'current'
echo "Finalisation du déploiement..."
rm -rf $DEPLOY_DIR/current
ln -sf $TEMP_DIR $DEPLOY_DIR/current

# Nettoyer les anciens déploiements (conserver les 3 derniers)
cd $DEPLOY_DIR/releases
ls -t | tail -n +4 | xargs -I {} rm -rf {}

echo "Déploiement terminé avec succès!"
```

## Surveillance et Monitoring

### Configuration de base de Prometheus

Créez un fichier `prometheus.yml` :

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'alertimmo'
    static_configs:
      - targets: ['localhost:3000']
    
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
    
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']
```

Ajoutez-le à votre `docker-compose.yml` :

```yaml
  prometheus:
    image: prom/prometheus
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - alertimmo-network

  grafana:
    image: grafana/grafana
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=votre_mot_de_passe_securise
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - alertimmo-network
    depends_on:
      - prometheus

  node-exporter:
    image: prom/node-exporter
    container_name: node-exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--path.rootfs=/rootfs'
    networks:
      - alertimmo-network

  nginx-exporter:
    image: nginx/nginx-prometheus-exporter
    container_name: nginx-exporter
    restart: unless-stopped
    ports:
      - "9113:9113"
    command:
      - '-nginx.scrape-uri=http://alertimmo:80/metrics'
    networks:
      - alertimmo-network

volumes:
  prometheus_data:
  grafana_data:
```

## Sauvegardes des Données

### Script de sauvegarde automatisé

Créez un script `backup.sh` :

```bash
#!/bin/bash
set -e

# Variables
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/alertimmo/database"
RETENTION_DAYS=30
SUPABASE_PROJECT_ID="votre_projet_id_supabase"
SUPABASE_API_KEY="votre_cle_api_supabase"

# Créer le répertoire de sauvegarde s'il n'existe pas
mkdir -p $BACKUP_DIR

# Sauvegarder la base de données Supabase (via API)
echo "Sauvegarde de la base de données..."
curl -X POST "https://$SUPABASE_PROJECT_ID.supabase.co/rest/v1/rpc/backup" \
  -H "apikey: $SUPABASE_API_KEY" \
  -H "Authorization: Bearer $SUPABASE_API_KEY" \
  -H "Content-Type: application/json" \
  -o "$BACKUP_DIR/db_backup_$DATE.sql"

# Compresser la sauvegarde
gzip "$BACKUP_DIR/db_backup_$DATE.sql"

# Sauvegarder les fichiers de storage
echo "Sauvegarde des fichiers de storage..."
curl -X GET "https://$SUPABASE_PROJECT_ID.supabase.co/storage/v1/object/list" \
  -H "apikey: $SUPABASE_API_KEY" \
  -H "Authorization: Bearer $SUPABASE_API_KEY" \
  -o "$BACKUP_DIR/storage_list_$DATE.json"

# Ajouter ici la logique pour télécharger les fichiers listés

# Nettoyer les anciennes sauvegardes
echo "Nettoyage des anciennes sauvegardes..."
find $BACKUP_DIR -type f -name "*.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -type f -name "*.json" -mtime +$RETENTION_DAYS -delete

echo "Sauvegarde terminée avec succès!"
```

Ajoutez-le à cron pour des exécutions programmées :

```bash
# Éditer crontab
crontab -e

# Ajouter cette ligne pour une sauvegarde quotidienne à 3h du matin
0 3 * * * /opt/alertimmo/current/backup.sh >> /var/log/alertimmo-backup.log 2>&1
```

## Liste de Vérification Avant Mise en Production

- [ ] Tester les certificats SSL (score A+ sur SSL Labs)
- [ ] Vérifier tous les en-têtes de sécurité
- [ ] Tester les performances (Google PageSpeed Insights)
- [ ] Vérifier la mise en cache correcte des ressources statiques
- [ ] Configurer les alertes et notifications
- [ ] Vérifier les redondances et points de défaillance unique
- [ ] Effectuer un test de charge
- [ ] Vérifier la conformité RGPD
- [ ] Tester le plan de reprise après sinistre
- [ ] Vérifier le renouvellement automatique des certificats
- [ ] Tester le système de journalisation
- [ ] Vérifier les sauvegardes automatiques

## Script de Vérification de Santé

Créez un fichier `health-check.sh` :

```bash
#!/bin/bash

# Variables
APP_URL="https://alertimmo.ma"
EMAIL_TO="admin@alertimmo.ma"
SLACK_WEBHOOK="votre_webhook_slack"

# Fonction pour envoyer une notification
send_notification() {
  local subject="$1"
  local message="$2"
  
  # Email
  echo "$message" | mail -s "$subject" $EMAIL_TO
  
  # Slack
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"$subject: $message\"}" \
    $SLACK_WEBHOOK
}

# Vérifier si le site est accessible
check_website() {
  local status_code=$(curl -s -o /dev/null -w "%{http_code}" $APP_URL)
  
  if [ $status_code -ne 200 ]; then
    send_notification "ALERTE: Site inaccessible" "Le site AlertImmo retourne un code $status_code"
    return 1
  fi
  
  return 0
}

# Vérifier le certificat SSL
check_ssl() {
  local days_remaining=$(echo | openssl s_client -servername alertimmo.ma -connect alertimmo.ma:443 2>/dev/null | openssl x509 -noout -enddate | sed -e 's/notAfter=//' | xargs -I{} date -d "{}" +%s | xargs -I{} expr {} - $(date +%s) | xargs -I{} expr {} / 86400)
  
  if [ $days_remaining -lt 14 ]; then
    send_notification "ALERTE: Certificat SSL" "Le certificat SSL expire dans $days_remaining jours"
  fi
}

# Vérifier l'API
check_api() {
  local status_code=$(curl -s -o /dev/null -w "%{http_code}" $APP_URL/api/health)
  
  if [ $status_code -ne 200 ]; then
    send_notification "ALERTE: API inaccessible" "L'API AlertImmo retourne un code $status_code"
    return 1
  fi
  
  return 0
}

# Exécuter les vérifications
check_website
check_ssl
check_api

exit 0
```

Ajoutez-le à cron pour des vérifications régulières :

```bash
# Éditer crontab
crontab -e

# Ajouter cette ligne pour une vérification toutes les 5 minutes
*/5 * * * * /opt/alertimmo/current/health-check.sh >> /var/log/alertimmo-health.log 2>&1
```
