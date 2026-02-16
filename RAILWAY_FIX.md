# Railway Deployment Fix - Monorepo Configuration

## Problem
Railway build failed with error:
```
npm error 404 '@agent47/aggregator@*' could not be found
```

**Root Cause:** Root Directory set to `apps/web` breaks workspace package resolution.

---

## ✅ Solution: Update Railway Settings

### 1. Root Directory
**Change from:** `apps/web`  
**Change to:** `.` (repository root)

### 2. Build Command
```bash
npm install && npm run build --workspace=web
```

### 3. Start Command  
```bash
npm run start --workspace=web
```

### 4. Install Command (optional, if available)
```bash
npm install
```

---

## 📝 Step-by-Step Instructions

1. **Go to Railway Dashboard → Your Project → Settings**

2. **Scroll to "Root Directory"**
   - Delete `apps/web`
   - Enter: `.` (just a dot)
   - Click Save

3. **Scroll to "Build Command"**
   - Enter: `npm install && npm run build --workspace=web`
   - Click Save

4. **Scroll to "Start Command"**  
   - Enter: `npm run start --workspace=web`
   - Click Save

5. **Redeploy**
   - Go to Deployments tab
   - Click "Deploy" or "Redeploy"

---

## Why This Works

- ✅ Root directory `.` gives Railway access to `package.json` (workspace config)
- ✅ `npm install` at root links all workspace packages (`@agent47/*`)
- ✅ `npm run build --workspace=web` builds only the web app (via Turbo)
- ✅ `npm run start --workspace=web` runs the production server

---

## Expected Build Time
~3-5 minutes (longer on first build)

## Expected Output
```
✓ Building workspace: web
✓ Compiled successfully
✓ Production build complete
✓ Server listening on port 3000
```
