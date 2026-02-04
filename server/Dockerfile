FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
# Or if you don't have a build script yet, just run with ts-node
# CMD ["npx", "ts-node", "src/server.ts"]

# But let's assume we want to run compiled JS
EXPOSE 3000

CMD ["npx", "ts-node", "src/server.ts"]