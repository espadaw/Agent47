# Use Node.js 22 Alpine (lightweight)
FROM node:22-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy workspace configuration files
COPY package.json package-lock.json* ./
COPY turbo.json ./

# Copy all workspace packages and apps (entire structure)
COPY apps ./apps
COPY packages ./packages

# Install dependencies (this will link workspace packages)
RUN npm install

# Build the web app
RUN npx turbo build --filter=web

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=base --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=base --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the application using standalone output
CMD ["node", "apps/web/server.js"]
