#!/bin/bash
# Script para iniciar os servidores

echo "Iniciando Backend..."
cd /c/bela-escala/backend
npx tsc
node ./dist/main.js &
BACKEND_PID=$!

echo "Backend iniciado com PID: $BACKEND_PID"

echo "Iniciando Frontend..."
cd /c/bela-escala/frontend
npm run dev &
FRONTEND_PID=$!

echo "Frontend iniciado com PID: $FRONTEND_PID"
echo ""
echo "✅ Servidores rodando:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:3001"
echo ""

wait
