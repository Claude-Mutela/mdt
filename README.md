# Phila Maison de Témoignages — Site Officiel

Application web officielle de la **Phila Maison de Témoignages (MDT)**.

Stack technique : **AdonisJS 7 · InertiaJS · React 19 · TypeScript · MySQL · Vite · PM2 · Nginx · SSL**

---

## 📋 Prérequis

| Outil | Version minimale |
|-------|-----------------|
| Node.js | ≥ 20 LTS |
| npm | ≥ 10 |
| MySQL | ≥ 8.0 |
| Git | ≥ 2.40 |

---

## ⚡ Installation locale

```bash
# 1. Cloner le dépôt
git clone https://github.com/<org>/mdt.git
cd mdt

# 2. Installer les dépendances
npm install

# 3. Copier et configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos vraies valeurs

# 4. Générer la clé de l'application
node ace generate:key

# 5. Exécuter les migrations
node ace migration:run

# 6. Lancer le serveur de développement
npm run dev
```

---

## 🔧 Variables d'environnement

Copier `.env.example` vers `.env` et compléter toutes les valeurs :

```env
# ── Node ──────────────────────────────────────
TZ=UTC
PORT=3333
HOST=0.0.0.0
NODE_ENV=development

# ── App ───────────────────────────────────────
LOG_LEVEL=info
APP_KEY=<généré par node ace generate:key>
APP_URL=http://localhost:3333

# ── Session ───────────────────────────────────
SESSION_DRIVER=cookie

# ── Base de données MySQL ──────────────────────
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=mdt

# ── Cloudinary (médias & galeries) ────────────
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# ── Brevo (Rendez-vous Pastoral) ──────────────
BREVO_API_KEY=...
BREVO_SENDER_EMAIL=secretariat@philamdt.church
BREVO_SENDER_NAME=Phila MDT CHURCH
PASTOR_EMAIL=pasteur@philamdt.church

# ── Brevo (Contact & Newsletter) ──────────────
CONTACT_BREVO_API_KEY=...
CONTACT_SENDER_EMAIL=contact@philamdt.church
CONTACT_SENDER_NAME=Phila MDT CHURCH
SECRETARIAT_EMAIL=contact@philamdt.church

# ── reCAPTCHA v2 ──────────────────────────────
RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...
```

---

## 🗄️ Base de données

```bash
# Exécuter toutes les migrations
node ace migration:run

# Vérifier l'état des migrations
node ace migration:status

# Rollback de la dernière migration
node ace migration:rollback

# Exécuter les seeders (données de base)
node ace db:seed
```

---

## 🧪 Tests

```bash
# Lancer tous les tests
npm run test

# Tests unitaires uniquement
node ace test unit

# Tests fonctionnels uniquement
node ace test functional
```

---

## 🔍 TypeScript & Lint

```bash
# Vérification TypeScript (backend + frontend)
npm run typecheck

# Linting ESLint
npm run lint

# Formatage Prettier
npm run format
```

---

## 🏗️ Build de production

```bash
# Build complet (AdonisJS + Vite)
npm run build

# Le build se trouve dans le dossier build/
# Pour démarrer en production :
cd build
npm ci --omit=dev
node bin/server.js
```

---

## 🖥️ Architecture du projet

```
mdt/
├── app/
│   ├── controllers/      # Contrôleurs HTTP (AdonisJS)
│   ├── middleware/        # Middlewares (Auth, CSRF, Inertia...)
│   ├── models/            # Modèles Lucid ORM
│   ├── services/          # Services métier (Brevo, Cloudinary...)
│   ├── validators/        # Validateurs VineJS
│   └── transformers/      # Transformateurs de données
├── config/                # Configuration de l'application
├── database/
│   ├── migrations/        # Migrations SQL
│   └── seeders/           # Seeders de données
├── deploy/                # Fichiers de déploiement (Nginx, PM2)
├── inertia/
│   ├── app.tsx            # Point d'entrée React
│   ├── components/        # Composants React partagés
│   ├── layouts/           # Layouts (public, admin)
│   └── pages/             # Pages Inertia (React)
│       └── admin/         # Pages d'administration
├── public/                # Fichiers statiques
├── start/
│   ├── env.ts             # Schéma de validation des variables d'environnement
│   ├── kernel.ts          # Middlewares globaux
│   ├── routes.ts          # Définition des routes
│   └── validator.ts       # Règles de validation globales
└── tests/                 # Tests automatisés (Japa)
```

---

## 🚀 Déploiement sur VPS Hostinger (Ubuntu)

### 1. Préparation du serveur

```bash
# Connexion SSH au VPS
ssh user@<IP_VPS>

# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de PM2
sudo npm install -g pm2

# Installation de Nginx
sudo apt install -y nginx

# Installation de Certbot (SSL Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Configuration MySQL

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
sudo mysql -u root -p

-- Dans MySQL :
CREATE DATABASE mdt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mdt_user'@'localhost' IDENTIFIED BY '<PASSWORD>';
GRANT ALL PRIVILEGES ON mdt.* TO 'mdt_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Configuration de l'application

```bash
# Créer le répertoire de déploiement
sudo mkdir -p /var/www/philamdt /var/log/philamdt
sudo chown -R $USER:www-data /var/www/philamdt /var/log/philamdt

# Copier le fichier .env de production
cp .env.example /var/www/philamdt/.env
# Éditer et remplir toutes les variables avec les vraies valeurs production
nano /var/www/philamdt/.env
```

### 4. Configuration Nginx

```bash
# Copier la configuration Nginx
sudo cp deploy/nginx.conf /etc/nginx/sites-available/philamdt
sudo ln -s /etc/nginx/sites-available/philamdt /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 5. SSL Let's Encrypt

```bash
sudo certbot --nginx -d philamdt.church -d www.philamdt.church
# Suivre les instructions interactives
```

### 6. PM2 — Démarrage de l'application

```bash
cd /var/www/philamdt/build
npm ci --omit=dev
node ace migration:run --force
pm2 start /var/www/philamdt/deploy/ecosystem.config.json
pm2 save
pm2 startup   # Suivre les instructions pour démarrer PM2 au boot
```

### 7. Health Check

```bash
# Vérifier que l'application tourne
pm2 status philamdt
pm2 logs philamdt --lines 50
curl -I https://philamdt.church
```

---

## 🔄 CI/CD (GitHub Actions)

Le pipeline est défini dans `.github/workflows/deploy.yml`.

### Secrets GitHub à configurer

| Secret | Description |
|--------|-------------|
| `APP_KEY` | Clé secrète AdonisJS |
| `VPS_HOST` | Adresse IP du VPS Hostinger |
| `VPS_USER` | Utilisateur SSH |
| `VPS_SSH_KEY` | Clé SSH privée |
| `VPS_PORT` | Port SSH (défaut : 22) |

### Pipeline CI/CD

```
PUSH vers main
    │
    ▼
🔍 Quality Check (TypeScript + ESLint)
    │
    ▼
🔐 Security Audit (npm audit)
    │
    ▼
🧪 Tests (Unit + Functional)
    │
    ▼
🏗️ Production Build (AdonisJS + Vite)
    │
    ▼
🚀 Deploy to VPS (SSH + SCP)
    │
    ▼
🗄️ Migration Database
    │
    ▼
♻️ PM2 Reload
    │
    ▼
🏥 Health Check
    │
    ▼
✅ Déploiement terminé
    │
    ▼ (si échec)
🔄 Rollback automatique
```

---

## 🔐 Sécurité

- ✅ CSRF Protection (AdonisJS Shield)
- ✅ Headers de sécurité HTTP (X-Frame-Options, X-Content-Type-Options, HSTS)
- ✅ SSL/TLS Let's Encrypt
- ✅ Sessions sécurisées (httpOnly, secure, sameSite)
- ✅ Hashage des mots de passe (bcrypt via AdonisJS Hash)
- ✅ Validation des données d'entrée (VineJS)
- ✅ reCAPTCHA v2 sur les formulaires publics
- ✅ CORS restreint en production
- ✅ Variables d'environnement validées au démarrage

---

## 🛠️ Résolution de problèmes courants

### L'application ne démarre pas en production

```bash
# Vérifier les logs PM2
pm2 logs philamdt --lines 100

# Vérifier que le fichier .env est bien en place
cat /var/www/philamdt/.env | grep NODE_ENV

# Vérifier la connexion MySQL
mysql -u mdt_user -p -e "SELECT 1"
```

### Erreur de migration

```bash
cd /var/www/philamdt/build
node ace migration:status
node ace migration:run --force
```

### Nginx ne démarre pas

```bash
sudo nginx -t  # Tester la configuration
sudo journalctl -u nginx -n 50  # Voir les logs
```

### Renouvellement SSL

```bash
sudo certbot renew --dry-run  # Tester le renouvellement
sudo certbot renew            # Renouveler
```

---

## 📝 Licence

UNLICENSED — Phila Maison de Témoignages © 2025
