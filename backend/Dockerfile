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

# Run as non-root user
USER node

# Document the application port
EXPOSE 4000

# Start the application
CMD ["node", "dist/index.js"]
