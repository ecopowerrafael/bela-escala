FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy all source files first
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Install dependencies and Prisma
RUN npm ci --only=production && npm install -g prisma

# Generate Prisma types
RUN npx prisma generate

# Compile TypeScript
RUN npm install --save-dev typescript @types/node
RUN npm run build
RUN npx tsc prisma/seed.ts --target ES2022 --module NodeNext --moduleResolution NodeNext --esModuleInterop
RUN npm uninstall --save-dev typescript @types/node

# Clean dev dependencies
RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]
