# Deployment Guide

## Overview

This guide covers the deployment process for Algo360FX in different environments.

## Prerequisites

- Docker and Docker Compose
- Node.js (v18 or later)
- PostgreSQL (v15 or later)
- Redis (v7 or later)
- SSL certificate
- Domain name

## Environment Setup

### Environment Variables

Create a `.env.production` file:

```env
# App
NODE_ENV=production
PORT=3000
API_URL=https://api.algo360fx.com
WS_URL=wss://api.algo360fx.com/ws

# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=algo360fx
POSTGRES_USER=algo360fx
POSTGRES_PASSWORD=your-secure-password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# External APIs
METAAPI_TOKEN=your-metaapi-token
TRADINGVIEW_CLIENT_ID=your-tradingview-client-id

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

## Docker Deployment

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - api

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name algo360fx.com www.algo360fx.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name algo360fx.com www.algo360fx.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS (uncomment if you're sure)
    # add_header Strict-Transport-Security "max-age=63072000" always;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";
        add_header Referrer-Policy "no-referrer-when-downgrade";
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.algo360fx.com wss://api.algo360fx.com;";

        # Cache control
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 30d;
            add_header Cache-Control "public, no-transform";
        }
    }

    location /api {
        proxy_pass http://api:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://api:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

## Deployment Steps

1. Build and push Docker images:
```bash
# Build images
docker compose build

# Push to registry (if using)
docker compose push
```

2. Deploy to production:
```bash
# Pull latest images (if using registry)
docker compose pull

# Start services
docker compose up -d

# Check logs
docker compose logs -f
```

3. Database migration:
```bash
# Run migrations
docker compose exec api npm run migrate

# Seed initial data (if needed)
docker compose exec api npm run seed
```

## Monitoring Setup

### Prometheus Configuration

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'algo360fx'
    static_configs:
      - targets: ['api:3000']
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "id": null,
    "title": "Algo360FX Metrics",
    "panels": [
      {
        "title": "Order Count",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "trading_orders_total",
            "legendFormat": "Orders"
          }
        ]
      },
      {
        "title": "Order Latency",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(trading_order_latency_seconds_bucket[5m]))",
            "legendFormat": "P95 Latency"
          }
        ]
      }
    ]
  }
}
```

## Backup Strategy

### Database Backup

```bash
#!/bin/bash
# backup.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup PostgreSQL
docker compose exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > \
    "$BACKUP_DIR/postgres_$TIMESTAMP.sql"

# Backup Redis
docker compose exec redis redis-cli -a $REDIS_PASSWORD SAVE

# Compress backups
tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" \
    "$BACKUP_DIR/postgres_$TIMESTAMP.sql" \
    /path/to/redis/dump.rdb

# Upload to remote storage (example with AWS S3)
aws s3 cp "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" \
    "s3://algo360fx-backups/backup_$TIMESTAMP.tar.gz"

# Cleanup old backups
find "$BACKUP_DIR" -type f -mtime +7 -delete
```

## SSL Certificate Renewal

```bash
#!/bin/bash
# renew-cert.sh

# Stop nginx
docker compose stop frontend

# Renew certificate
certbot renew

# Copy new certificates
cp /etc/letsencrypt/live/algo360fx.com/fullchain.pem /path/to/ssl/
cp /etc/letsencrypt/live/algo360fx.com/privkey.pem /path/to/ssl/

# Start nginx
docker compose start frontend
```

## Troubleshooting

### Common Issues

1. Database Connection Issues
```bash
# Check database logs
docker compose logs postgres

# Check database connection
docker compose exec api npm run check-db
```

2. WebSocket Connection Issues
```bash
# Check WebSocket logs
docker compose logs api | grep "WebSocket"

# Test WebSocket connection
wscat -c wss://api.algo360fx.com/ws
```

3. Performance Issues
```bash
# Check resource usage
docker stats

# Check application metrics
curl http://localhost:3000/metrics
```

### Recovery Procedures

1. Database Recovery
```bash
# Restore from backup
docker compose exec postgres psql -U $POSTGRES_USER $POSTGRES_DB < backup.sql
```

2. Service Recovery
```bash
# Restart specific service
docker compose restart api

# Rebuild and restart service
docker compose up -d --build api
```

## Security Checklist

- [ ] SSL certificates installed and configured
- [ ] Environment variables secured
- [ ] Database passwords changed from defaults
- [ ] Firewall rules configured
- [ ] Security headers implemented
- [ ] Rate limiting enabled
- [ ] Regular security updates scheduled
- [ ] Backup system tested
- [ ] Monitoring alerts configured
- [ ] Access logs enabled and monitored
