# 🚀 Guia de Instalação - Bela Escala

## 📋 Sistema Operacional Recomendado

**Ubuntu Server 22.04 LTS (ou 24.04 LTS)**

### Por que Ubuntu?
- ✅ Estabilidade comprovada para ambientes de produção
- ✅ Suporte LTS (Long Term Support) de 5 anos
- ✅ Documentação extensa em português
- ✅ Compatibilidade total com Docker
- ✅ Repositórios oficiais atualizados
- ✅ Comunidade ativa para suporte

### Requisitos Mínimos de Hardware

| Componente | Mínimo | Recomendado |
|------------|---------|-------------|
| CPU | 2 vCPUs | 4 vCPUs |
| RAM | 4 GB | 8 GB |
| Disco | 50 GB SSD | 100 GB SSD |
| Largura de Banda | 100 Mbps | 1 Gbps |

---

## 🔧 Instalação Passo a Passo

### 1️⃣ Preparação do Servidor Ubuntu

#### Conectar ao servidor via SSH
```bash
ssh root@SEU_IP_DO_SERVIDOR
# ou se usar usuário não-root:
ssh usuario@SEU_IP_DO_SERVIDOR
```

#### Atualizar sistema
```bash
sudo apt update && sudo apt upgrade -y
```

#### Instalar pacotes essenciais
```bash
sudo apt install -y curl git wget vim ufw fail2ban
```

#### Configurar firewall (UFW)
```bash
# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP e HTTPS (Nginx Proxy Manager)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Permitir Nginx Proxy Manager Admin (opcional, pode fechar depois)
sudo ufw allow 81/tcp

# Ativar firewall
sudo ufw enable
sudo ufw status
```

---

### 2️⃣ Instalar Docker & Docker Compose

#### Remover versões antigas (se houver)
```bash
sudo apt remove docker docker-engine docker.io containerd runc
```

#### Instalar Docker (método oficial)
```bash
# Adicionar repositório oficial do Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker (evitar sudo)
sudo usermod -aG docker $USER

# Aplicar mudanças de grupo (ou faça logout/login)
newgrp docker

# Verificar instalação
docker --version
docker compose version
```

**Saída esperada:**
```
Docker version 25.x.x, build xxxxx
Docker Compose version v2.24.x
```

#### Configurar Docker para iniciar no boot
```bash
sudo systemctl enable docker
sudo systemctl start docker
```

---

### 3️⃣ Clonar Repositório (ou Upload via SCP/FTP)

#### Opção A: Clonar do Git (se tiver repositório)
```bash
cd /opt
sudo git clone https://github.com/SEU_USUARIO/bela-escala.git
sudo chown -R $USER:$USER bela-escala
cd bela-escala
```

#### Opção B: Upload manual via SCP (do seu PC)
```bash
# No seu computador local (Windows/Mac/Linux):
scp -r c:\bela-escala usuario@SEU_IP:/opt/bela-escala
```

#### Opção C: Upload via SFTP (FileZilla, WinSCP)
1. Conecte via SFTP no IP do servidor
2. Navegue até `/opt`
3. Arraste a pasta `bela-escala` completa

---

### 4️⃣ Configurar Variáveis de Ambiente

#### Backend
```bash
cd /opt/bela-escala/backend
cp .env.example .env
nano .env
```

**Edite o arquivo `.env` com suas credenciais:**

```env
# Database
DATABASE_URL="postgresql://postgres:SENHA_SEGURA_AQUI@db:5432/bela_escala?schema=public"

# JWT
JWT_SECRET="GERE_UMA_CHAVE_SECRETA_LONGA_AQUI_MIN_32_CHARS"

# OpenAI (Chat RAG)
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxx"

# MinIO (S3-Compatible Storage)
MINIO_ROOT_USER="admin"
MINIO_ROOT_PASSWORD="SENHA_MINIO_SEGURA"
MINIO_ENDPOINT="http://minio:9000"
MINIO_BUCKET="bela-escala-uploads"

# Redis
REDIS_URL="redis://redis:6379"

# Server
PORT=3000
NODE_ENV=production
```

**🔐 IMPORTANTE - Gerar senhas seguras:**
```bash
# Gerar JWT_SECRET
openssl rand -base64 48

# Gerar senha para PostgreSQL
openssl rand -base64 32

# Gerar senha para MinIO
openssl rand -base64 24
```

#### Frontend
```bash
cd /opt/bela-escala/frontend
cp .env.example .env.local
nano .env.local
```

**Edite:**
```env
NEXT_PUBLIC_API_URL=https://api.SEU_DOMINIO.com.br
# ou durante desenvolvimento local:
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Docker Compose (Infraestrutura)
```bash
cd /opt/bela-escala/infra
cp .env.example .env
nano .env
```

**Edite:**
```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=MESMA_SENHA_DO_DATABASE_URL
POSTGRES_DB=bela_escala

# MinIO
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=MESMA_SENHA_DO_BACKEND

# Redis (sem senha por padrão, em rede interna)
```

---

### 5️⃣ Executar Migrations do Banco de Dados

#### Subir apenas o banco de dados primeiro
```bash
cd /opt/bela-escala/infra
docker compose up -d db
```

#### Executar migrations no backend
```bash
cd /opt/bela-escala/backend

# Instalar dependências (primeira vez)
npm install

# Gerar client Prisma
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Seed (dados iniciais: mentores, ranks, produtos)
npx prisma db seed
```

---

### 6️⃣ Build e Deploy da Aplicação

#### Buildar Backend
```bash
cd /opt/bela-escala/backend
npm run build
```

#### Buildar Frontend
```bash
cd /opt/bela-escala/frontend
npm install
npm run build
```

#### Subir todos os serviços com Docker Compose
```bash
cd /opt/bela-escala/infra
docker compose up -d
```

**Verificar status dos containers:**
```bash
docker compose ps
```

**Saída esperada:**
```
NAME                     STATUS    PORTS
bela-escala-api          Up        0.0.0.0:3000->3000/tcp
bela-escala-db           Up        5432/tcp
bela-escala-redis        Up        6379/tcp
bela-escala-minio        Up        9000-9001/tcp
bela-escala-nginx-proxy  Up        0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

#### Ver logs em tempo real
```bash
# Todos os serviços
docker compose logs -f

# Apenas API
docker compose logs -f api

# Apenas Frontend (se estiver no docker-compose)
docker compose logs -f frontend
```

---

### 7️⃣ Configurar Nginx Proxy Manager

#### Acessar painel admin
```
http://SEU_IP:81
```

**Login padrão (primeira vez):**
- Email: `admin@example.com`
- Senha: `changeme`

**⚠️ Altere imediatamente após primeiro login!**

#### Configurar Proxy Host para API

1. **Proxy Hosts** → **Add Proxy Host**
2. Preencher:
   - **Domain Names**: `api.seudominio.com.br`
   - **Scheme**: `http`
   - **Forward Hostname / IP**: `api` (nome do serviço no docker-compose)
   - **Forward Port**: `3000`
   - **Cache Assets**: ✅ (opcional)
   - **Block Common Exploits**: ✅
   - **Websockets Support**: ✅ (importante para chat)

3. **SSL Tab**:
   - **SSL Certificate**: Request a new SSL Certificate with Let's Encrypt
   - **Force SSL**: ✅
   - **HTTP/2 Support**: ✅
   - **Email**: seu@email.com
   - Aceitar termos

#### Configurar Proxy Host para Frontend

Repetir processo acima com:
- **Domain Names**: `app.seudominio.com.br` ou `seudominio.com.br`
- **Forward Hostname / IP**: `localhost` ou IP onde o frontend está rodando
- **Forward Port**: `3001` (ou porta do Next.js)

---

### 8️⃣ Configurar DNS

No seu provedor de domínio (Registro.br, GoDaddy, Cloudflare, etc.):

#### Registros A
```
api.seudominio.com.br → SEU_IP_VPS
app.seudominio.com.br → SEU_IP_VPS
# ou
seudominio.com.br → SEU_IP_VPS
```

**⏱️ Aguarde propagação DNS (5 minutos a 48 horas)**

Verificar:
```bash
nslookup api.seudominio.com.br
```

---

### 9️⃣ Executar Frontend (Standalone)

Se estiver rodando fora do Docker:

```bash
cd /opt/bela-escala/frontend
npm run build
npm start
```

**Para rodar em background (PM2):**
```bash
# Instalar PM2
sudo npm install -g pm2

# Iniciar aplicação
cd /opt/bela-escala/frontend
pm2 start npm --name "bela-escala-frontend" -- start

# Configurar auto-restart no boot
pm2 startup
pm2 save
```

---

### 🔟 Verificação Final

#### Testar endpoints da API
```bash
# Health check
curl https://api.seudominio.com.br/health

# Registro de usuário
curl -X POST https://api.seudominio.com.br/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","name":"Teste","password":"senha123"}'
```

#### Acessar frontend
```
https://seudominio.com.br
```

#### Verificar logs
```bash
cd /opt/bela-escala/infra

# Backend
docker compose logs -f api

# Database
docker compose logs db

# Nginx
docker compose logs nginx-proxy-manager
```

---

## 🛡️ Segurança Pós-Instalação

### Fail2Ban (proteção contra força bruta)
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Backup Automático do Banco
```bash
# Criar script de backup
sudo nano /usr/local/bin/backup-bela-escala.sh
```

**Conteúdo:**
```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/bela-escala"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec bela-escala-db pg_dump -U postgres bela_escala > \
  $BACKUP_DIR/db_backup_$DATE.sql

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete

echo "Backup concluído: $DATE"
```

**Tornar executável e agendar:**
```bash
sudo chmod +x /usr/local/bin/backup-bela-escala.sh

# Agendar diariamente às 3h da manhã
sudo crontab -e
# Adicionar linha:
0 3 * * * /usr/local/bin/backup-bela-escala.sh >> /var/log/bela-backup.log 2>&1
```

### Monitoramento de Recursos
```bash
# Instalar htop
sudo apt install htop -y

# Ver uso em tempo real
htop

# Ver uso de disco
df -h

# Ver logs do Docker
docker stats
```

---

## 🔄 Atualizações Futuras

### Atualizar código
```bash
cd /opt/bela-escala

# Se estiver usando Git
git pull origin main

# Rebuild backend
cd backend
npm install
npm run build

# Rebuild frontend
cd ../frontend
npm install
npm run build

# Recriar containers
cd ../infra
docker compose down
docker compose up -d --build
```

### Executar novas migrations
```bash
cd /opt/bela-escala/backend
npx prisma migrate deploy
```

---

## 📊 Comandos Úteis

```bash
# Ver containers rodando
docker compose ps

# Reiniciar serviço específico
docker compose restart api

# Parar tudo
docker compose down

# Subir tudo
docker compose up -d

# Ver logs
docker compose logs -f api

# Acessar terminal do container
docker compose exec api sh

# Limpar volumes (⚠️ APAGA DADOS)
docker compose down -v
```

---

## ❓ Troubleshooting

### API não inicia
```bash
# Verificar logs
docker compose logs api

# Verificar se o banco está acessível
docker compose exec api ping db
```

### Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
docker compose ps db

# Testar conexão
docker compose exec db psql -U postgres -c "SELECT 1"
```

### SSL não funciona
1. Verificar DNS apontando corretamente
2. Verificar porta 80/443 abertas no firewall
3. Verificar logs do Nginx Proxy Manager
4. Aguardar propagação DNS completa

### MinIO não sobe
```bash
# Verificar permissões da pasta de volumes
sudo chown -R 1000:1000 /opt/bela-escala/infra/volumes/minio
```

---

## 📞 Suporte

- **Documentação**: `/opt/bela-escala/README.md`
- **Logs**: `docker compose logs -f`
- **Sistema**: `journalctl -xe`

---

## ✅ Checklist de Instalação

- [ ] Ubuntu 22.04/24.04 instalado
- [ ] Firewall configurado (UFW)
- [ ] Docker & Docker Compose instalados
- [ ] Código clonado/enviado para `/opt/bela-escala`
- [ ] Variáveis `.env` configuradas (backend, frontend, infra)
- [ ] Migrations executadas
- [ ] Seed de dados iniciais rodado
- [ ] Build do backend concluído
- [ ] Build do frontend concluído
- [ ] Docker Compose rodando (todos os serviços UP)
- [ ] DNS configurado (registros A)
- [ ] Nginx Proxy Manager configurado
- [ ] SSL/HTTPS ativo
- [ ] Teste de endpoints (health, register, login)
- [ ] Frontend acessível no navegador
- [ ] Backup automático configurado
- [ ] Fail2Ban ativo

🎉 **Instalação concluída!**
