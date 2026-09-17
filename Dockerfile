# NetLab - Dockerfile for Self-Hosted Network Lab Platform
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy full application source code
COPY . .

# Build production bundle (client + SSR server)
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package info
COPY package*.json ./

# Copy dependencies and built application artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose web service port
EXPOSE 3000

# Run NetLab using the built SSR server
CMD ["node", "dist/app/server/server.mjs"]
