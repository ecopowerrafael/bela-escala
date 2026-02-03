FROM node:20-alpine

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci --only=production && npm install -g prisma

# Copiar código fonte
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Compilar TypeScript
RUN npm install --save-dev typescript @types/node && npm run build && npm uninstall --save-dev typescript @types/node

# Limpar node_modules de dev
RUN npm ci --only=production

EXPOSE 3000

# O comando será sobrescrito pelo docker-compose
CMD ["npm", "start"]
