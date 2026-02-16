# Use Node.js 22 Alpine (lightweight)
FROM node:22-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy workspace configuration files
COPY package.json package-lock.json* ./
COPY turbo.json ./

# Copy all workspace packages
COPY apps ./apps
COPY packages ./packages

# Install dependencies (this will link workspace packages)
RUN npm install

# Build the web app
RUN npx turbo build --filter=web

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

# Copy necessary files from builder
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/web/public ./apps/web/public
COPY --from=base /app/apps/web/package.json ./apps/web/package.json
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start", "--workspace=web"]
