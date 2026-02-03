# Script para iniciar os servidores Bela Escala

Write-Host "🚀 Iniciando servidores Bela Escala..." -ForegroundColor Green
Write-Host ""

# Backend
Write-Host "📦 Iniciando Backend na porta 3001..." -ForegroundColor Cyan
Set-Location -Path "c:\bela-escala\backend"
npx tsc 2>&1 | Out-Null
Start-Process -FilePath "node" -ArgumentList ".\dist\main.js" -NoNewWindow -PassThru | Out-Null
Write-Host "✅ Backend iniciado" -ForegroundColor Green

Start-Sleep -Seconds 2

# Frontend
Write-Host "🎨 Iniciando Frontend na porta 3000..." -ForegroundColor Cyan
Set-Location -Path "c:\bela-escala\frontend"
Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow -PassThru | Out-Null
Write-Host "✅ Frontend iniciado" -ForegroundColor Green

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "🎉 Servidores rodando!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "🌐 Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "📡 Backend:   http://localhost:3001" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""
