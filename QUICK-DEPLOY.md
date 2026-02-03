#!/bin/bash

# 📋 Guia Rápido de Deploy - Bela Escala na VPS Ubuntu

echo "╔════════════════════════════════════════════════════════╗"
echo "║        Bela Escala - Guia Rápido de Deploy            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# 1. Conectar ao servidor
echo "1️⃣  CONECTAR AO SERVIDOR"
echo "ssh root@seu-ip-vps"
echo ""

# 2. Download do script
echo "2️⃣  FAZER DOWNLOAD E EXECUTAR SCRIPT"
echo "curl -O https://raw.githubusercontent.com/ecopowerrafael/bela-escala/main/deploy.sh"
echo "chmod +x deploy.sh"
echo "sudo ./deploy.sh"
echo ""

# 3. Acessar aplicação
echo "3️⃣  APÓS DEPLOY, ACESSE:"
echo "🌐 Frontend:     http://seu-dominio.com"
echo "🔌 Backend API:  http://seu-dominio.com/api"
echo "⚙️  Admin Panel:  http://seu-dominio.com:81"
echo ""

# 4. Configurar domínio
echo "4️⃣  CONFIGURAR DOMÍNIO E SSL"
echo "   a) Faça login no Nginx Proxy Manager (porta 81)"
echo "   b) Adicione 'Proxy Host' apontando para seu domínio"
echo "   c) Habilite SSL com Let's Encrypt"
echo ""

# 5. Verificar status
echo "5️⃣  VERIFICAR STATUS DOS CONTAINERS"
echo "docker-compose -f /opt/bela-escala/infra/docker-compose.yml ps"
echo ""

# 6. Ver logs
echo "6️⃣  VER LOGS (útil para debug)"
echo "docker-compose -f /opt/bela-escala/infra/docker-compose.yml logs -f"
echo ""

echo "🎉 Pronto! Sua plataforma Bela Escala está no ar!"
