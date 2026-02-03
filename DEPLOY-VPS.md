# 🎯 Bela Escala - Deployment na VPS Ubuntu

## ⚡ Quick Start (5 minutos)

```bash
# 1. Conectar ao servidor
ssh root@seu-vps-ip

# 2. Executar script de deployment
curl -O https://raw.githubusercontent.com/ecopowerrafael/bela-escala/main/deploy.sh
chmod +x deploy.sh
sudo bash deploy.sh

# 3. Acessar a aplicação
# Frontend: http://seu-ip:3001
# Backend: http://seu-ip:3000
```

---

## 📋 Checklist de Deployment

- [ ] Ubuntu 22.04 LTS ou superior instalado
- [ ] 4GB RAM mínimo (8GB recomendado)
- [ ] 50GB espaço livre em disco
- [ ] Acesso SSH com root ou sudo
- [ ] Porta 80, 81, 443 liberadas no firewall
- [ ] Domínio apontado para IP da VPS (opcional, mas recomendado)

---

## 🐳 O que é instalado automaticamente?

| Serviço | Porta | Função |
|---------|-------|--------|
| **PostgreSQL** | 5432 | Banco de dados principal |
| **Redis** | 6379 | Cache e sessões |
| **MinIO** | 9000 | Storage S3 compatível |
| **Backend API** | 3000 | API Node.js/Fastify |
| **Frontend** | 3001 | Next.js |
| **Nginx Proxy Manager** | 81 | Gerenciador de domínio/SSL |

---

## 🔐 Configurações Pós-Deploy

### 1. Alterar Senhas Padrão

```bash
cd /opt/bela-escala/infra
# Editar .env
nano .env
```

Alterar:
- `DB_PASSWORD` - Senha do PostgreSQL
- `MINIO_PASSWORD` - Senha do MinIO
- `JWT_SECRET` - Chave secreta JWT

Depois:
```bash
docker-compose restart api db minio
```

### 2. Configurar Domínio com SSL

1. Acesse: `http://seu-vps-ip:81`
2. Login padrão: `admin@example.com` / `changeme`
3. Adicione "Proxy Host":
   - Domain: `seu-dominio.com`
   - Scheme: `http`
   - Forward Hostname: `web` (para frontend)
   - SSL: Let's Encrypt
4. Repita para backend na rota `/api`

### 3. Configurar OPENAI_API_KEY

Para funcionalidade de chat inteligente:

```bash
cd /opt/bela-escala/infra
nano .env
# Adicionar sua chave OpenAI
docker-compose restart api
```

---

## 🔍 Monitoramento

### Ver status dos containers
```bash
cd /opt/bela-escala/infra
docker-compose ps
```

### Ver logs em tempo real
```bash
docker-compose logs -f api     # Backend
docker-compose logs -f web     # Frontend
docker-compose logs -f db      # Database
```

### Acessar terminal de um container
```bash
docker-compose exec api bash   # Terminal no backend
docker-compose exec web bash   # Terminal no frontend
```

---

## 💾 Backup e Restore

### Fazer backup do banco de dados
```bash
cd /opt/bela-escala/infra
docker-compose exec db pg_dump -U admin bela_escala > backup.sql
```

### Restaurar backup
```bash
docker-compose exec -T db psql -U admin bela_escala < backup.sql
```

---

## 🚀 Deploy de Atualizações

```bash
cd /opt/bela-escala
git pull origin main
cd infra
docker-compose down
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Porta já em uso
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Container não inicia
```bash
docker-compose logs api    # Ver erro específico
docker-compose restart api # Reiniciar
```

### Sem acesso ao Nginx
```bash
docker-compose restart nginx-proxy
```

---

## 📞 Suporte

Para issues ou dúvidas:
- GitHub: https://github.com/ecopowerrafael/bela-escala/issues
- Email: seu-email@seu-dominio.com

---

**Versão**: 1.0.0  
**Última atualização**: 03/02/2026
