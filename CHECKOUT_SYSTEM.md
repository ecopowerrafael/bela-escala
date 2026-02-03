# Sistema de Checkout - Bela Escala

## 📋 Resumo

Sistema interno de pagamento e gestão de invoices, sem dependência de SaaS (Stripe, PayPal, etc.). Permite que usuários adicionem produtos ao carrinho e confirmem pagamento com rastreamento via banco de dados.

## 🔧 Backend - Endpoints

### POST `/checkout` (Autenticado)
Cria um novo invoice em status PENDENTE
```json
Request: { "productId": "abc123" }
Response: { "invoice": { "id", "invoiceNumber", "amountCents", "status", "createdAt" } }
```

### POST `/checkout/:invoiceId/confirm` (Autenticado)
Confirma pagamento e libera acesso ao produto
```json
Response: { "invoice": { "status": "PAGA", "paidAt": "2024-..." } }
```

### GET `/me/invoices` (Autenticado)
Lista invoices do usuário logado
```json
Response: { "invoices": [ { "id", "invoiceNumber", "amountCents", "status", "product" } ] }
```

### GET `/admin/invoices` (Admin Only)
Lista todas as invoices (relatório administrativo)
```json
Response: { "invoices": [ { "user", "product", "status", ... } ] }
```

## 🎨 Frontend - Páginas

### `/checkout`
- **Componente**: `[checkout]/page.tsx`
- **Funcionalidades**:
  - Tabela de invoices do usuário com status visual (PENDENTE/PAGA/CANCELADA)
  - Cards de resumo (total pendente, total pago)
  - Botão "Confirmar Pagamento" para invoices PENDENTE
  - Link de volta ao catálogo

### `/admin/invoices`
- **Componente**: `/admin/invoices/page.tsx`
- **Funcionalidades**:
  - Dashboard administrativo de invoices
  - Filtro por status (Todos, Pendente, Pago, Cancelado)
  - Statísticas em cards (total, pendentes, pagos, valor filtrado)
  - Tabela completa com dados de usuário, produto, valor e data

## 🛒 ProductGrid Integrado

Alterações em `ProductGrid.tsx`:
- Botão mudou de "Comprar" → "Adicionar ao Carrinho"
- Chama POST `/checkout` em vez de POST `/products/:id/purchase`
- Após sucesso, redireciona para `/checkout`
- Estados visuais: `loading`, `success`, `already_owned`, `error`, `token_required`

## 📊 Fluxo Completo

1. **Usuário navega pelo catálogo**
   - Vê produtos com preço
   - Clica em "Adicionar ao Carrinho"

2. **Sistema cria Invoice**
   - POST `/checkout` com productId
   - Retorna invoice em status PENDENTE
   - Redireciona para `/checkout`

3. **Usuário revisa pedido**
   - Vê tabela de invoices pendentes
   - Clica "Confirmar Pagamento"

4. **Pagamento processado**
   - POST `/checkout/:id/confirm`
   - Invoice marcado como PAGA
   - UserProduct criado (libera acesso a trilhas)
   - Redirecionado para trilhas/courses

5. **Admin acompanha**
   - Acessa `/admin/invoices`
   - Vê todos os pedidos e status de pagamento
   - Filtra por status conforme necessário

## 🗄️ Modelo de Dados

```prisma
model Invoice {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  productId     String
  product       Product  @relation(fields: [productId], references: [id])
  status        InvoiceStatus @default(PENDENTE)
  amountCents   Int      // Valor em centavos
  invoiceNumber String   @unique // INV-2024-ABC123-123456
  paidAt        DateTime? // Null se não pagou
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId])
  @@index([status])
}

enum InvoiceStatus {
  PENDENTE
  PAGA
  CANCELADA
}
```

## 🔐 Segurança

- ✅ Todos endpoints verificam JWT
- ✅ GET `/me/invoices` filtra por userId
- ✅ POST `/checkout/:id/confirm` valida propriedade do invoice
- ✅ GET `/admin/invoices` restringe a ADMIN
- ✅ amountCents vem do banco (não do cliente)

## 📍 Navegação

| Página | Rota | Acesso |
|--------|------|--------|
| Carrinho | `/checkout` | Autenticado |
| Admin Invoices | `/admin/invoices` | Admin |
| Catálogo | `/catalog` | Público |

**Links adicionados:**
- Home navbar: novo link "Carrinho" entre Meetings e Onboarding
- Admin dashboard: novo link "Invoices" no menu superior

## 🚀 Próximos Passos (Opcional)

1. Integrações de pagamento reais (Stripe webhook)
2. Email de recebimento para cliente
3. Relatórios por período (monthly revenue)
4. Retry automático para invoices PENDENTE > 7 dias
5. Cancelamento de invoice com reembolso (status CANCELADA)

## 📝 Notas

- Invoice number é único e auto-gerado: `INV-{YEAR}-{RANDOM}-{TIMESTAMP}`
- Valor armazenado em centavos (int) para evitar erros de float
- paidAt preenchido apenas quando status = PAGA
- Migrations executadas automaticamente (Prisma)
