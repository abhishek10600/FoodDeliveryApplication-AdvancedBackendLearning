# STAGE 1 - BUILDER

FROM node:24-bookworm-slim AS builder

# Set the working directory
WORKDIR /app

# Copy the dependency manifests first to maximize the Docker cache usage
COPY package*.json ./

# Install all dependenies (including dev dependencies)
RUN npm ci

# Copy the remaining application source code
COPY . .

# Crete the dist folder
RUN npm run build


# STAGE 2 - Production

FROM node:24-bookworm-slim AS production

# Set production environment
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# copy dependency manifests
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Copy Prisma client and Schema
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

# Run as non-root user
USER node

# Document the application port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "fetch('http://127.0.0.1:4000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start the application
CMD ["node", "dist/main.js"]
