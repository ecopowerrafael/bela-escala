#!/bin/bash

# 🚀 Script de Deploy Automatizado - Bela Escala
# Execute com: sudo bash deploy.sh

set -e  # Parar em caso de erro

echo "╔════════════════════════════════════════════════════════╗"
echo "║   🚀 Bela Escala - Deploy Automatizado para VPS Ubuntu  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se está rodando com sudo
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}❌ Execute com sudo: sudo bash deploy.sh${NC}"
  exit 1
fi

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${BLUE}📦 Instalando Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Verificar se Docker Compose está instalado
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não encontrado.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker e Docker Compose encontrados${NC}"
echo ""

# Diretório base
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR"

# Verificar .env files
echo "📋 Verificando arquivos de configuração..."

if [ ! -f "$BASE_DIR/backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env não encontrado. Copiando de .env.example...${NC}"
    cp "$BASE_DIR/backend/.env.example" "$BASE_DIR/backend/.env"
    echo -e "${RED}❌ IMPORTANTE: Edite backend/.env com suas credenciais reais!${NC}"
    exit 1
fi

if [ ! -f "$BASE_DIR/frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠️  frontend/.env.local não encontrado. Copiando de .env.example...${NC}"
    cp "$BASE_DIR/frontend/.env.example" "$BASE_DIR/frontend/.env.local"
    echo -e "${RED}❌ IMPORTANTE: Edite frontend/.env.local com sua URL de API!${NC}"
    exit 1
fi

if [ ! -f "$BASE_DIR/infra/.env" ]; then
    echo -e "${YELLOW}⚠️  infra/.env não encontrado. Copiando de .env.example...${NC}"
    cp "$BASE_DIR/infra/.env.example" "$BASE_DIR/infra/.env"
    echo -e "${RED}❌ IMPORTANTE: Edite infra/.env com senhas seguras!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Arquivos de configuração OK${NC}"
echo ""

# Perguntar modo de deploy
echo "Escolha o modo de deploy:"
echo "1) Deploy completo (primeira vez)"
echo "2) Atualização (rebuild sem perder dados)"
echo "3) Apenas reiniciar serviços"
read -p "Opção [1-3]: " DEPLOY_MODE

case $DEPLOY_MODE in
    1)
        echo ""
        echo "======================================"
        echo "🔨 Deploy Completo (Primeira Vez)"
        echo "======================================"
        
        # Parar containers existentes
        echo ""
        echo "🛑 Parando containers existentes..."
        cd "$BASE_DIR/infra"
        docker compose down || true
        
        # Subir apenas banco de dados
        echo ""
        echo "🗄️  Iniciando banco de dados..."
        docker compose up -d db
        sleep 5
        
        # Instalar dependências backend
        echo ""
        echo "📦 Instalando dependências do backend..."
        cd "$BASE_DIR/backend"
        npm install
        
        # Gerar Prisma Client
        echo ""
        echo "🔧 Gerando Prisma Client..."
        npx prisma generate
        
        # Executar migrations
        echo ""
        echo "🗃️  Executando migrations..."
        npx prisma migrate deploy
        
        # Seed
        echo ""
        echo "🌱 Executando seed (dados iniciais)..."
        npx prisma db seed || echo "Seed já executado ou falhou"
        
        # Build backend
        echo ""
        echo "🔨 Compilando backend..."
        npm run build
        
        # Instalar dependências frontend
        echo ""
        echo "📦 Instalando dependências do frontend..."
        cd "$BASE_DIR/frontend"
        npm install
        
        # Build frontend
        echo ""
        echo "🔨 Compilando frontend..."
        npm run build
        
        # Subir todos os serviços
        echo ""
        echo "🚀 Iniciando todos os serviços..."
        cd "$BASE_DIR/infra"
        docker compose up -d
        
        echo ""
        echo -e "${GREEN}✅ Deploy completo concluído!${NC}"
        ;;
        
    2)
        echo ""
        echo "======================================"
        echo "🔄 Atualização (Rebuild)"
        echo "======================================"
        
        # Pull código (se estiver usando git)
        if [ -d "$BASE_DIR/.git" ]; then
            echo ""
            echo "📥 Atualizando código do Git..."
            git pull || true
        fi
        
        # Rebuild backend
        echo ""
        echo "📦 Reinstalando dependências do backend..."
        cd "$BASE_DIR/backend"
        npm install
        npx prisma generate
        
        echo ""
        echo "🔨 Recompilando backend..."
        npm run build
        
        # Executar novas migrations (se houver)
        echo ""
        echo "🗃️  Executando novas migrations..."
        npx prisma migrate deploy
        
        # Rebuild frontend
        echo ""
        echo "📦 Reinstalando dependências do frontend..."
        cd "$BASE_DIR/frontend"
        npm install
        
        echo ""
        echo "🔨 Recompilando frontend..."
        npm run build
        
        # Recriar containers
        echo ""
        echo "🔄 Recriando containers..."
        cd "$BASE_DIR/infra"
        docker compose up -d --build --force-recreate
        
        echo ""
        echo -e "${GREEN}✅ Atualização concluída!${NC}"
        ;;
        
    3)
        echo ""
        echo "======================================"
        echo "🔄 Reiniciando Serviços"
        echo "======================================"
        
        cd "$BASE_DIR/infra"
        docker compose restart
        
        echo ""
        echo -e "${GREEN}✅ Serviços reiniciados!${NC}"
        ;;
        
    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac

# Status final
echo ""
echo "======================================"
echo "📊 Status dos Serviços"
echo "======================================"
cd "$BASE_DIR/infra"
docker compose ps

echo ""
echo "======================================"
echo "📝 Próximos Passos"
echo "======================================"
echo ""
echo "1️⃣  Verificar logs:"
echo "   cd infra && docker compose logs -f"
echo ""
echo "2️⃣  Testar API:"
echo "   curl http://localhost:3000/health"
echo ""
echo "3️⃣  Acessar frontend:"
echo "   http://localhost:3001 (ou porta configurada)"
echo ""
echo "4️⃣  Configurar Nginx Proxy Manager:"
echo "   http://SEU_IP:81"
echo "   Login: admin@example.com / changeme"
echo ""
echo "5️⃣  Configurar DNS apontando para este servidor"
echo ""
echo -e "${GREEN}✅ Deploy finalizado com sucesso!${NC}"
