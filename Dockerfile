# --- Stage 1: Build Client ---
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# --- Stage 2: Build Server ---
FROM node:18-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# --- Stage 3: Production Runtime ---
FROM node:18-alpine
WORKDIR /app

# Copy built assets
COPY --from=client-build /app/client/dist ./client/dist
COPY --from=server-build /app/server/dist ./server/dist
COPY --from=server-build /app/server/package*.json ./server/
COPY --from=server-build /app/server/node_modules ./server/node_modules

# Setup environment
WORKDIR /app/server
ENV PORT=3000
ENV NODE_ENV=production

# Create uploads directory
RUN mkdir -p ../uploads

EXPOSE 3000

CMD ["node", "dist/server.js"]