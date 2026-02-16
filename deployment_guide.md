# Deployment Guide: Railway Only (All-in-One)

This guide explains how to launch **Agent47.org** entirely on **Railway**.

## Architecture Overview

- **Service 1: Website** (`apps/web`) -> `agent47.org`
- **Service 2: API/MCP** (`packages/mcp-server`) -> `api.agent47.org`
- **Service 3: Database** (PostgreSQL)
- **Service 4: Redis**

---

## Part 1: Initial Project Setup

1.  **New Project** on [Railway](https://railway.app).
2.  **Provision Database**: Add **PostgreSQL**.
3.  **Provision Queue**: Add **Redis**.

---

## Part 2: Deploy Backend (MCP Server)

1.  **Add Service** -> **GitHub Repo** -> `espadaw/Agent47`.
2.  **Settings** -> **General**:
    - **Root Directory**: `/` (Use root to perform full monorepo install).
    - **Build Command**: `npx turbo build --filter=@agent47/mcp-server...` (or just `npm install && npm run build` if config allows, but Turbo is safer).
    - **Start Command**: `npm start --workspace=@agent47/mcp-server`
3.  **Variables**: Add the variables listed below.
4.  **Domain**: Assign `api.agent47.org` (CNAME).

---

## Part 3: Deploy Frontend (Website)

1.  **Add Service** -> **GitHub Repo** -> `espadaw/Agent47` (Add the repo AGAIN).
2.  **Settings** -> **General**:
    - **Root Directory**: `/apps/web` (Or `/` with specific start command).
      - *Note*: For Next.js in Railway monorepo, it's often best to set Root to `/` and filter build.
      - **Build Command**: `npx turbo build --filter=web...`
      - **Start Command**: `npm start --workspace=web` (Ensure `package.json` has `start` script: `next start -p $PORT`).
3.  **Variables**:
    - `PORT`: `3000` (or leave empty, Railway assigns one).
    - `NEXT_PUBLIC_API_URL`: `https://api.agent47.org`
4.  **Domain**: Assign `agent47.org` (CNAME).

---

## Part 4: Configure Squarespace DNS

1.  Log in to **Squarespace**.
2.  **DNS Settings**.
3.  **Add Frontend Record** (from Part 3):
    - **CNAME**: `www` -> `web-production.up.railway.app` (Example)
    - **CNAME**: `@` -> Railway might require CNAME flattening or alias. If Squarespace supports **ANAME** or **Alias**, use that. Otherwise, most domains require `www` as primary on CNAME-based hosts.
4.  **Add Backend Record** (from Part 2):
    - **CNAME**: `api` -> `server-production.up.railway.app`

---

## Environment Variables (For Backend Service)

```env
NODE_ENV=production
# Database & Redis (Railway adds these automatically if linked)
DATABASE_URL=...
REDIS_URL=...

# Integration Secrets
VIRTUALS_ENTITY_ID=0x50f922BFf181f01Dc85c62A4a9B39Cd88a0cf8Bc
WALLET_PRIVATE_KEY=...
RENTAHUMAN_API_KEY=...
```
