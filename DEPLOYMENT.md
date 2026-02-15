# Agent47 Deployment Guide

## 🚀 Deploy to Railway (Recommended)

This project is optimized for deployment on [Railway](https://railway.app/).

### Prerequisites

1.  A [Railway account](https://railway.app/) (GitHub login recommended).
2.  Your [Agent47 GitHub Repository](https://github.com/espadaw/Agent47) connected.

### Step-by-Step Deployment

1.  **New Project**
    *   Click **New Project** → **Deploy from GitHub repo**.
    *   Select `espadaw/Agent47`.

2.  **Service Configuration**
    *   Railway should automatically detect the `Dockerfile` or `package.json`.
    *   If prompted, select `Dockerfile` as the deployment source.

3.  **Environment Variables**
    *   Go to the **Variables** tab for your service.
    *   Add the following:
        *   `NODE_ENV`: `production`
        *   `VIRTUALS_API_KEY`: (Your Virtuals Protocol Key)
        *   `RENTAHUMAN_API_KEY`: (Your RentAHuman Key)
        *   `PORT`: `3000` (or leave default if Dockerfile exposes it)

4.  **Database (Optional but Recommended)**
    *   Right-click on the canvas → **Add Database** → **PostgreSQL**.
    *   Railway will automatically inject `DATABASE_URL` into your service.

5.  **Redis (Optional but Recommended)**
    *   Right-click → **Add Database** → **Redis**.
    *   Railway will inject `REDIS_URL`.

6.  **Verify Deployment**
    *   Wait for the build to complete.
    *   Check the **Deployments** tab for "Active" status.
    *   View logs to confirm the server started: `Agent47 MCP server running...`

### Docker Deployment (Alternative)

If you prefer running with Docker directly:

```bash
# Build the image
docker build -t agent47 .

# Run the container
docker run -p 3000:3000 \
  -e VIRTUALS_API_KEY=your_key \
  agent47
```

## 🛡️ Production Checklist

- [ ] **Environment Variables**: Ensure all API keys are set in Railway.
- [ ] **Resource Limits**: Hobbby plan (512MB RAM) is sufficient.
- [ ] **Database**: Connect PostgreSQL/Redis if using persistence features.
- [ ] **Domain**: (Optional) Add a custom domain in Railway settings.
