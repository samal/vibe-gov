# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Run
EXPOSE 3002
CMD ["node", "dist/index.js"] 