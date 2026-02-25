# Deploy - Sistema Auditoria-loja

## Requisitos do Servidor (VPS Linux)

- **Node.js** >= 18.x
- **MongoDB** (local ou Atlas)
- **Nginx** (proxy reverso)
- **PM2** (gerenciador de processos)
- **Git**

---

## 1. Instalar dependências do sistema

```bash
# Node.js (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# PM2
npm install -g pm2

# Nginx
sudo apt update && sudo apt install -y nginx
```

---

## 2. Clonar o projeto

```bash
cd /var/www
git clone <URL_DO_REPOSITORIO> auditoria
cd auditoria
```

---

## 3. Backend

```bash
cd Backend-auditoria-loja

# Criar arquivo .env
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/auditoria
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://auditorias.site
EOF

# Instalar dependências
npm install --production

# Iniciar com PM2
pm2 start server.js --name "auditoria-backend"
pm2 save
pm2 startup
```

### Testar backend:
```bash
curl http://localhost:3000/test
# Resposta: {"message":"Servidor funcionando","loja":"não especificada"}

curl http://localhost:3000/api/test
# Resposta: {"message":"API OK",...}
```

---

## 4. Frontend

```bash
cd ../Auditoria-loja

# Instalar dependências
npm install

# Build de produção (usa .env.production automaticamente)
npm run build:clean

# Verificar build
npm run verify-build

# Copiar dist para Nginx
sudo cp -r dist/* /var/www/html/auditoria/
```

---

## 5. Configuração Nginx

```nginx
server {
    listen 80;
    server_name auditorias.site www.auditorias.site;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name auditorias.site www.auditorias.site;

    # SSL (use Certbot para gerar)
    ssl_certificate /etc/letsencrypt/live/auditorias.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/auditorias.site/privkey.pem;

    # Frontend (SPA)
    root /var/www/html/auditoria;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy para Backend API
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 100M;
    }

    # Proxy para rotas sem /api/ prefix (upload, test, etc)
    location /test {
        proxy_pass http://localhost:3000/test;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Arquivos estáticos com cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/auditorias.site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. SSL com Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d auditorias.site -d www.auditorias.site
```

---

## 7. Verificação final

```bash
# Backend
curl https://auditorias.site/api/test
curl https://auditorias.site/api/health

# Frontend
curl -I https://auditorias.site

# PM2 status
pm2 status
pm2 logs auditoria-backend
```

---

## 8. Atualização

```bash
cd /var/www/auditoria

# Backend
cd Backend-auditoria-loja
git pull
npm install --production
pm2 restart auditoria-backend

# Frontend
cd ../Auditoria-loja
git pull
npm install
npm run build:clean
npm run verify-build
sudo cp -r dist/* /var/www/html/auditoria/
```

---

## Variáveis de Ambiente

### Frontend (.env.production)
```
VITE_API_URL=https://auditorias.site
```

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/auditoria
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://auditorias.site
```

---

## Portas

| Serviço  | Porta | Acesso              |
|----------|-------|---------------------|
| Backend  | 3000  | Interno (via Nginx) |
| Nginx    | 80    | Redireciona → 443   |
| Nginx    | 443   | https://auditorias.site |
| MongoDB  | 27017 | Interno             |
