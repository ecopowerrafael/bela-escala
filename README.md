# 🎯 Bela Escala - Ecossistema de Mentoria Escalável

Plataforma completa de mentoria e comunidade com trilhas de aprendizado, gamificação, chat RAG e gestão de produtos. **100% self-hosted, sem dependências SaaS.**

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Requisitos](#-requisitos)
- [Instalação Rápida](#-instalação-rápida)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Deploy em Produção](#-deploy-em-produção)
- [Documentação](#-documentação)

---

## 🌟 Visão Geral

**Bela Escala** é um ecossistema de mentoria e comunidade premium, desenvolvido para instalação autônoma em VPS Ubuntu, sem dependência de serviços proprietários.

### Principais Diferenciais
- ✅ **Self-Hosted**: 100% no seu servidor, sem vendor lock-in
- ✅ **Escalável**: Arquitetura modular com Docker
- ✅ **Premium Design**: Paleta piano black + gold com glassmorphism
- ✅ **RAG Chat**: IA contextual com OpenAI + knowledge base local
- ✅ **Gamificação**: Sistema de pontos, ranks e conquistas
- ✅ **Checkout Interno**: Gestão de invoices sem SaaS de pagamento

---

## 🛠️ Stack Tecnológica

### Backend
- **Runtime**: Node.js 20 + TypeScript
- **Framework**: Fastify 4.26
- **ORM**: Prisma (PostgreSQL 15+)
- **Auth**: JWT (@fastify/jwt)
- **Hashing**: bcryptjs

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS 3.4 (tema customizado)
- **Design**: Glassmorphism + Gold Gradient

### Infraestrutura
- **Database**: PostgreSQL 15 (dados principais)
- **Vector DB**: pgvector (embeddings para RAG)
- **Cache/Queue**: Redis 7 Alpine
- **Storage**: MinIO (S3-compatible local)
- **Gateway**: Nginx Proxy Manager (SSL/HTTPS)
- **Orquestração**: Docker Compose

---

## ⚙️ Requisitos

### Sistema Operacional Recomendado
**Ubuntu Server 22.04 LTS** ou **24.04 LTS**

### Hardware Mínimo
- **CPU**: 2 vCPUs (recomendado 4 vCPUs)
- **RAM**: 4 GB (recomendado 8 GB)
- **Disco**: 50 GB SSD (recomendado 100 GB)
- **Largura de Banda**: 100 Mbps

### Software
- Docker 25+
- Docker Compose v2.24+
- Node.js 20+ (para desenvolvimento local)
- Git

---

## 🚀 Instalação Rápida

### 1. Clonar Repositório
```bash
cd /opt
sudo git clone https://github.com/SEU_USUARIO/bela-escala.git
sudo chown -R $USER:$USER bela-escala
cd bela-escala
```

### 2. Configurar Variáveis de Ambiente
```bash
# Backend
cp backend/.env.example backend/.env
nano backend/.env  # Editar credenciais

# Frontend
cp frontend/.env.example frontend/.env.local
nano frontend/.env.local  # Editar API URL

# Infraestrutura
cp infra/.env.example infra/.env
nano infra/.env  # Editar senhas do banco
```

### 3. Deploy Automatizado
```bash
chmod +x deploy.sh
./deploy.sh
# Escolha opção 1 (Deploy completo - primeira vez)
```

### 4. Acessar Aplicação
- **API**: `http://localhost:3000/health`
- **Frontend**: `http://localhost:3001`
- **Nginx Proxy Manager**: `http://localhost:81` (admin@example.com / changeme)
- **MinIO Console**: `http://localhost:9001`

---

## 📁 Estrutura do Projeto

```
bela-escala/
├── backend/                    # API Fastify + TypeScript
│   ├── src/
│   │   ├── main.ts            # Bootstrap (JWT, módulos)
│   │   ├── lib/
│   │   │   └── prisma.ts      # Prisma client
│   │   ├── modules/           # Módulos da aplicação
│   │   │   ├── auth/          # Autenticação (register/login/me)
│   │   │   ├── products/      # Catálogo + compras
│   │   │   ├── courses/       # Trilhas + lições + progresso
│   │   │   ├── meetings/      # Reuniões com mentores
│   │   │   ├── chat/          # RAG com OpenAI
│   │   │   ├── users/         # Membros + admin
│   │   │   ├── onboarding/    # Perfil do usuário
│   │   │   ├── admin/         # Dashboard admin
│   │   │   └── checkout/      # Invoices + pagamentos
│   │   └── types/
│   │       └── fastify.d.ts   # Augmentação JWT
│   ├── prisma/
│   │   ├── schema.prisma      # Modelos (14 models)
│   │   ├── migrations/        # SQL migrations
│   │   └── seed.ts            # Dados iniciais
│   ├── Dockerfile             # Build de produção
│   └── package.json
│
├── frontend/                   # Next.js 14 + React 18
│   ├── app/
│   │   ├── page.tsx           # Home (Netflix-style)
│   │   ├── map/               # Mapa de membros
│   │   ├── catalog/           # Catálogo de produtos
│   │   ├── courses/           # Trilhas (com lock)
│   │   ├── meetings/          # Agendar reuniões
│   │   ├── checkout/          # Carrinho + invoices
│   │   ├── onboarding/        # Completar perfil
│   │   └── admin/             # Dashboard admin
│   │       ├── users/         # Gestão de usuários
│   │       ├── meetings/      # Gestão de meetings
│   │       ├── courses/       # Criar trilhas/lições
│   │       └── invoices/      # Gestão de pagamentos
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Rail.tsx           # Scroll horizontal
│   │   ├── ProductGrid.tsx    # Cards de produtos
│   │   ├── ChatWidget.tsx     # Chat RAG
│   │   ├── MapCard.tsx        # Cards de membros
│   │   └── AuthTokenBar.tsx   # Token JWT (dev)
│   ├── tailwind.config.ts     # Tema Bela Escala
│   ├── globals.css            # Glassmorphism
│   └── package.json
│
├── infra/                      # Docker Compose
│   ├── docker-compose.yml     # Orquestração (6 serviços)
│   ├── .env.example           # Variáveis infra
│   └── volumes/               # Persistência de dados
│
├── deploy.sh                   # Script de deploy automatizado
├── GUIA_INSTALACAO.md         # Guia completo Ubuntu
├── CHECKOUT_SYSTEM.md         # Documentação do checkout
└── README.md                   # Este arquivo
```

---

## ✨ Funcionalidades

### 🔐 Autenticação & RBAC
- JWT com refresh tokens
- 4 roles: ADMIN, MENTOR, PREMIUM, FREE
- Guards customizados por endpoint

### 📚 Trilhas de Aprendizado (Courses)
- Criação de cursos e lições
- Progresso individualizado por usuário
- Lock de trilhas por produto (CourseProduct)
- Vídeo/conteúdo externo (YouTube, Vimeo)

### 🛒 E-commerce Interno
- Catálogo de produtos com categorias
- Sistema de checkout sem SaaS
- Invoices (PENDENTE/PAGA/CANCELADA)
- Histórico de compras

### 🎮 Gamificação
- Sistema de pontos por ações
- Ranks progressivos (Bronze → Diamond)
- Triggers automáticos (reunião concluída = +50 pontos)
- Histórico de transações

### 💬 Chat RAG (IA Contextual)
- Integração OpenAI GPT-4
- Knowledge base local (pgvector)
- Busca semântica por embeddings
- Citação de fontes

### 🗺️ Mapa de Membros
- Descoberta de mentores
- Perfis com headline, cidade, redes sociais
- Agendamento de reuniões

### 📊 Admin Dashboard
- Métricas overview (users, products, meetings, points)
- Gestão de usuários (change roles)
- Gestão de produtos (CRUD)
- Gestão de trilhas e lições
- Relatório de invoices

### 📅 Meetings
- Agendamento com mentores
- Estados: PENDENTE, CONFIRMADA, CONCLUIDA, CANCELADA
- Integração Jitsi (salas virtuais)
- Trigger de pontos ao concluir

---

## 🌐 Deploy em Produção

### Configurar DNS
```
api.seudominio.com.br → IP_DO_SERVIDOR
app.seudominio.com.br → IP_DO_SERVIDOR
```

### Nginx Proxy Manager (SSL/HTTPS)
1. Acessar `http://SEU_IP:81`
2. Login: `admin@example.com` / `changeme`
3. **Proxy Hosts** → **Add Proxy Host**
4. Configurar:
   - Domain: `api.seudominio.com.br`
   - Forward to: `api:3000`
   - SSL: Request Let's Encrypt
   - Force SSL: ✅
5. Repetir para frontend (`app.seudominio.com.br`)

### Firewall (UFW)
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### Backup Automático
```bash
# Executar script diário (via crontab)
0 3 * * * /usr/local/bin/backup-bela-escala.sh
```

Ver detalhes completos em: **[GUIA_INSTALACAO.md](./GUIA_INSTALACAO.md)**

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [GUIA_INSTALACAO.md](./GUIA_INSTALACAO.md) | Guia completo passo a passo (Ubuntu) |
| [CHECKOUT_SYSTEM.md](./CHECKOUT_SYSTEM.md) | Documentação do sistema de checkout |
| [backend/README.md](./backend/README.md) | Documentação da API |
| [frontend/README.md](./frontend/README.md) | Documentação do frontend |

---

## 🔧 Desenvolvimento Local

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Acessar
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`

---

## 🧪 Testes

### Health Check
```bash
curl http://localhost:3000/health
```

### Registro de Usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","name":"Teste","password":"senha123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"senha123"}'
```

---

## 📝 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:senha@db:5432/bela_escala"
JWT_SECRET="chave-secreta-longa-min-32-chars"
OPENAI_API_KEY="sk-proj-..."
MINIO_ROOT_USER="admin"
MINIO_ROOT_PASSWORD="senha-minio"
REDIS_URL="redis://redis:6379"
PORT=3000
NODE_ENV=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.seudominio.com.br
```

### Infra (.env)
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=senha-postgres
POSTGRES_DB=bela_escala
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=senha-minio
```

---

## 🐳 Docker Compose

### Subir todos os serviços
```bash
cd infra
docker compose up -d
```

### Ver logs
```bash
docker compose logs -f api
```

### Parar tudo
```bash
docker compose down
```

### Rebuild
```bash
docker compose up -d --build --force-recreate
```

---

## 🎨 Design System

### Paleta de Cores
```css
--piano: #0A0A0A          /* Fundo principal */
--platinum: #E0E0E0       /* Texto secundário */
--gold-start: #D4AF37     /* Gradiente dourado início */
--gold-end: #F2D47E       /* Gradiente dourado fim */
--white: #FFFFFF          /* Texto primário */
```

### Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
}
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

## 🆘 Suporte

- **Logs**: `docker compose logs -f`
- **Troubleshooting**: Ver [GUIA_INSTALACAO.md](./GUIA_INSTALACAO.md#-troubleshooting)
- **Issues**: Abra uma issue no GitHub

---

## 🚀 Status do Projeto

**✅ Pronto para Produção**

- [x] Backend completo (9 módulos)
- [x] Frontend completo (11 páginas)
- [x] Docker Compose configurado
- [x] Migrations e seeds
- [x] Sistema de checkout
- [x] Admin dashboard
- [x] Chat RAG
- [x] Gamificação
- [x] Documentação completa

---

**Desenvolvido com ❤️ para escalabilidade e autonomia.**
