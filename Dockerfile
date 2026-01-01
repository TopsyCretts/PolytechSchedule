# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.3.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Install serve globally as root
RUN npm install -g serve

EXPOSE 3000

# Run as non-root user
USER node

# ИСПРАВЛЕНО: используем dist вместо build ✅
CMD ["serve", "-s", "dist", "-l", "3000"]