---
name: onecx-local-env-cli
description: Deploy and manage OneCX POC applications in a local development environment
tags: [deployment, local-env, onecx, docker]
---

# OneCX Local Environment CLI Skill

## Purpose

This skill guides deployment engineers and developers to properly deploy generated OneCX Proof of Concept applications to a local development environment for testing and validation.

## When to Use This Skill

- When a POC has been successfully generated and needs to be deployed
- When setting up a local OneCX environment for development
- When configuring environment variables for local testing
- When troubleshooting deployment issues
- When running smoke tests and validation after deployment

## What is a Local OneCX Environment?

A **local OneCX environment** is a complete Docker-based setup of the OneCX platform running on a single machine or development server. It includes:

- **PostgreSQL Database** — persistent data storage
- **Redis** — caching and sessions
- **Elasticsearch** — full-text search
- **Portal Gateway API** — main API endpoint
- **Authorization Service** — authentication and OAuth
- **Backend Services** — business logic microservices
- **Portal Frontend** — shell UI container

The entire environment runs in Docker containers and is started/stopped via Docker Compose.

## Prerequisites

Before attempting to deploy, verify:

```bash
□ Docker installed and running
  └─ Command: docker --version (should be 20.10 or higher)

□ Docker Compose installed
  └─ Command: docker-compose --version (should be 2.0 or higher)

□ Node.js and npm installed
  └─ Commands: node --version, npm --version
  └─ Required: Node.js >= 18, npm >= 9

□ Git installed
  └─ Command: git --version

□ 8+ GB RAM available on machine
  └─ Command: free -h (on Linux) or About This Mac (on macOS)

□ 20+ GB free disk space
  └─ For Docker images, databases, and application code

□ Ports available
  └─ 4200 (Angular app)
  └─ 8080 (API Gateway)
  └─ 5432 (PostgreSQL)
  └─ 6379 (Redis)
  └─ 9200 (Elasticsearch)
```

## Local Environment Directory Structure

```
onecx-local-env/
├── README.md                      ← Setup instructions
├── docker-compose.yml             ← All services definition
├── docker-compose.override.yml    ← Local overrides (git-ignored)
├── .env                           ← Environment variables (you create this)
├── .env.example                   ← Template (reference)
├── scripts/
│   ├── start.sh                   ← Start all services
│   ├── stop.sh                    ← Stop all services  
│   ├── health-check.sh            ← Check service status
│   ├── init-db.sh                 ← Initialize database
│   ├── reset.sh                   ← Full reset (DELETE all data)
│   └── logs.sh                    ← View service logs
├── config/
│   ├── postgres/                  ← PostgreSQL configuration
│   ├── elasticsearch/             ← Elasticsearch config
│   └── application.yml            ← OneCX app configuration
├── init/
│   ├── 01-create-databases.sql    ← Database initialization
│   └── 02-create-users.sql        ← User setup
└── data/                          ← Persistent data (gitignored)
    ├── postgres/                  ← PostgreSQL data files
    ├── elasticsearch/             ← Elasticsearch indices
    └── redis/                     ← Redis dump files
```

## Quick Start: 5-Minute Setup

### Step 1: Verify Prerequisites

```bash
# Check all requirements
docker --version         # Should be: Docker version 20.10+
docker-compose --version # Should be: Docker Compose version 2.0+
node --version           # Should be: v18.x.x or v20.x.x
npm --version            # Should be: 9.x.x or 10.x.x
```

### Step 2: Get Local Environment Files

If you don't have `onecx-local-env` folder yet:

```bash
# Option A: Clone from repository
git clone https://github.com/onecx/onecx-local-env.git
cd onecx-local-env

# Option B: Use reference implementation
# Location on disk: D:\onecx\onecx\onecx-all\onecx-local-env
cp -r D:\onecx\onecx\onecx-all\onecx-local-env .
cd onecx-local-env
```

### Step 3: Create .env File

In `onecx-local-env` directory, create `.env`:

```env
# Copy this into file: onecx-local-env/.env

# ======================================
# Database Configuration
# ======================================
POSTGRES_DB=onecx_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_dev_password_123
DB_HOST=postgres
DB_PORT=5432

# ======================================
# Gateway & API Configuration
# ======================================
GATEWAY_HOST=localhost
GATEWAY_PORT=8080
GATEWAY_PROTOCOL=http
GATEWAY_URL=http://localhost:8080

# ======================================
# JWT & Security
# ======================================
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long!!
JWT_EXPIRY_MINUTES=1440
JWT_REFRESH_EXPIRY_DAYS=30

# ======================================
# OAuth Configuration
# ======================================
OIDC_CLIENT_ID=onecx-client
OIDC_CLIENT_SECRET=your-secret-here
OIDC_PROVIDER_URL=http://localhost:8080/auth/realms/onecx
OIDC_REDIRECT_URL=http://localhost:4200/callback

# ======================================
# Application Configuration
# ======================================
NODE_ENV=development
LOG_LEVEL=INFO
DEBUG_MODE=false
ENABLE_MOCK_DATA=false

# ======================================
# Service Endpoints (for applications to connect)
# ======================================
GATEWAY_API_URL=http://localhost:8080/api
AUTH_URL=http://localhost:8080/auth
RESOURCES_URL=http://localhost:8080/resources

# ======================================
# Redis Configuration
# ======================================
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# ======================================
# Elasticsearch Configuration
# ======================================
ELASTICSEARCH_HOST=elasticsearch
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=elastic_dev_password_123
```

### Step 4: Start Services

```bash
# Navigate to local environment directory
cd onecx-local-env

# Start all services in background
./scripts/start.sh

# Monitor startup (watch for all services to be "running")
docker-compose ps

# View logs (optional)
docker-compose logs -f
```

**Expected startup sequence (watch the logs):**

```
1. postgres_1      | "database system is ready to accept connections"
   ↓ Wait 30 seconds

2. elasticsearch_1 | "started"
   ↓ Wait 30 seconds

3. redis_1         | "Ready to accept connections"
   ↓ Wait 30 seconds

4. gateway_1       | "Application startup complete"
   ↓ Wait 1 minute

All services should show: Up (healthy) or Up (running)
```

### Step 5: Verify Services are Ready

```bash
# Run health checks
./scripts/health-check.sh

# Expected output:
# ✓ PostgreSQL is ready
# ✓ Redis is ready
# ✓ Elasticsearch is ready
# ✓ Gateway API is responding
# ✓ Authorization Service is responding
# ✅ ALL SYSTEMS READY

# If any fails, check logs:
docker-compose logs <service-name>
```

### Step 6: Deploy Your POC

Now that local environment is ready, deploy your generated POC:

```bash
# Navigate to your POC folder
cd my-employee-management

# Create environment configuration
cat > .env.local << 'EOF'
GATEWAY_URL=http://localhost:8080
AUTH_URL=http://localhost:8080/auth
API_BASE_URL=http://localhost:8080/api
OIDC_CLIENT_ID=onecx-client
OIDC_REDIRECT_URL=http://localhost:4200/callback
NODE_ENV=development
EOF

# Install dependencies
npm install

# Start development server
npm run start

# Application should be available at: http://localhost:4200
```

### Step 7: Access Your POC

Open browser and navigate to:
- **Application:** http://localhost:4200
- **API Gateway:** http://localhost:8080/api
- **Docs (if available):** http://localhost:8080/api/docs

Login with test credentials (check `configuration.md` for defaults).

## Environment Variables Explained

| Variable | Purpose | Example | Required |
|---|---|---|---|
| `GATEWAY_URL` | Public URL to access API Gateway | `http://localhost:8080` | ✓ Yes |
| `GATEWAY_API_URL` | Full API URL (used by apps) | `http://localhost:8080/api` | ✓ Yes |
| `AUTH_URL` | Authentication endpoint | `http://localhost:8080/auth` | ✓ Yes |
| `DB_HOST` | Database hostname (Docker name) | `postgres` | ✓ Yes |
| `DB_PORT` | Database port (inside Docker) | `5432` | ✓ Yes |
| `POSTGRES_DB` | Database name to create | `onecx_dev` | ✓ Yes |
| `POSTGRES_USER` | Database user | `postgres` | ✓ Yes |
| `POSTGRES_PASSWORD` | Database password | `secure_password_123` | ✓ Yes |
| `JWT_SECRET` | Secret for signing JWTs | `[32+ char random string]` | ✓ Yes |
| `LOG_LEVEL` | Logging verbosity | `INFO`, `DEBUG`, `WARN`, `ERROR` | Optional |
| `NODE_ENV` | Environment mode | `development`, `production` | Optional |
| `REDIS_HOST` | Redis hostname (Docker name) | `redis` | Optional |
| `REDIS_PORT` | Redis port | `6379` | Optional |

## Monitoring & Troubleshooting

### Check Service Status

```bash
# List all services and their status
docker-compose ps

# Output should show:
# NAME              STATUS
# postgres          Up (healthy)
# redis             Up (running)
# elasticsearch     Up (running)
# gateway           Up (running)
# auth              Up (running)
```

### View Service Logs

```bash
# All logs
docker-compose logs

# Specific service
docker-compose logs postgres
docker-compose logs gateway

# Follow logs in real-time
docker-compose logs -f gateway

# Last N lines
docker-compose logs --tail=100 gateway
```

### Common Issues & Solutions

#### Issue 1: Docker Not Running
```bash
❌ Error: Cannot connect to Docker daemon

✅ Solution:
- Start Docker Desktop (Windows/macOS) or docker daemon (Linux)
- Verify: docker ps
```

#### Issue 2: Port Already in Use
```bash
❌ Error: bind: address already in use

✅ Solution:
# Find what's using the port (e.g., 8080)
netstat -an | grep 8080  # Windows
lsof -i :8080             # macOS/Linux

# Either:
- Kill the process using that port
- Change port in docker-compose.yml
```

#### Issue 3: Database Won't Start
```bash
❌ Error: PostgreSQL connection refused

✅ Solution:
# Check database logs
docker-compose logs postgres

# Purge old database and reset
docker-compose down -v
./scripts/start.sh
```

#### Issue 4: Out of Disk Space
```bash
❌ Error: no space left on device

✅ Solution:
# Remove old Docker images and volumes
docker system prune -a
docker volume prune

# Or see usage
docker system df
```

## Integration with OneCX Applications

### Connecting Your POC to Local Environment

Your generated POC must be configured to connect to the local environment services:

**Option A: Environment Variables** (.env.local)

```env
# In your POC's .env.local file:
GATEWAY_URL=http://localhost:8080
AUTH_URL=http://localhost:8080/auth
API_BASE_URL=http://localhost:8080/api
OIDC_CLIENT_ID=onecx-client
OIDC_REDIRECT_URL=http://localhost:4200/callback
```

**Option B: Source Code Configuration** (src/environments/environment.ts)

```typescript
export const environment = {
  production: false,
  gatewayUrl: 'http://localhost:8080',
  authUrl: 'http://localhost:8080/auth',
  apiBaseUrl: 'http://localhost:8080/api',
  oidcClientId: 'onecx-client',
  oidcRedirectUrl: 'http://localhost:4200/callback'
};
```

### Using Shell UI & Tenant UI Containers

If using OneCX Shell UI (portal shell):

```bash
# Navigate to shell UI
cd onecx-shell-ui

# Build it
npm install
npm run build

# Start it
npm run start

# Accessible at: http://localhost:4200/shell/
```

If using Tenant UI:

```bash
# Navigate to tenant UI
cd onecx-tenant-ui

# Build and start similarly
npm install
npm run build
npm run start

# Accessible at: http://localhost:4200/tenant/
```

## Stopping & Cleanup

### Stop Services (Keep Data)

```bash
# Gracefully stop all services
./scripts/stop.sh

# Or use compose directly
docker-compose stop
```

Data is preserved (database files remain), so services can be restarted.

### Full Reset (DELETE All Data)

```bash
# WARNING: This deletes all database data!
./scripts/reset.sh

# Or manually:
docker-compose down -v  # -v removes volumes
./scripts/start.sh      # Start fresh
```

## Verification Checklist

After deployment, verify all functionality:

```
Post-Deployment Validation
==========================

Browser & Loading:
  □ Application loads at http://localhost:4200
  □ No 404 or connection errors in console
  □ Initial page renders without errors

Authentication:
  □ Login page appears
  □ Can log in with test credentials
  □ Authorization/ redirect works
  □ No CORS errors in console

API Connectivity:
  □ API calls to http://localhost:8080/api succeed
  □ Response times are acceptable (< 2-3 seconds)
  □ Data is returned correctly

Database:
  □ Data persists after page refresh
  □ Create/update/delete operations work
  □ Queries are reasonably fast

Performance:
  □ Page load time < 3 seconds
  □ Search response time < 2 seconds
  □ No memory leaks (check DevTools)
  □ No console errors or warnings

Features:
  □ All required features load
  □ No broken links or missing pages
  □ Audit logs are being recorded
  □ All CRUD operations work
```

If any item fails, check logs and troubleshoot accordingly.

## Advanced: Custom Configuration

### Using Override File

Create `docker-compose.override.yml` for local customizations:

```yaml
version: '3.8'

services:
  postgres:
    ports:
      - "5433:5432"  # Expose on different port locally
    environment:
      POSTGRES_PASSWORD: my_custom_password

  gateway:
    environment:
      LOG_LEVEL: DEBUG  # Enable debug logging
```

### Running Single Service Only

```bash
# Start only database
docker-compose up -d postgres

# Start only gateway
docker-compose up -d gateway
```

### Accessing Container Shell

```bash
# Get bash shell inside postgres container
docker-compose exec postgres bash

# Run commands inside container
docker-compose exec postgres psql -U postgres -d onecx_dev -c "SELECT * FROM users;"
```

## Performance Optimization

### Reduce Memory Usage

If running low on memory, reduce Elasticsearch allocation:

```yaml
# In docker-compose.yml:
elasticsearch:
  environment:
    "ES_JAVA_OPTS": "-Xms512m -Xmx512m"  # Instead of 1GB each
```

### Speed Up Database

Add indexes for frequently used columns:

```sql
-- In onecx-local-env/init/03-add-indexes.sql
CREATE INDEX idx_employee_name ON employees(name);
CREATE INDEX idx_employee_dept ON employees(department_id);
```

## References

- **OneCX Documentation:** https://onecx.github.io/
- **Docker Compose Reference:** https://docs.docker.com/compose/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Local Environment:** `D:\onecx\onecx\onecx-all\onecx-local-env`
