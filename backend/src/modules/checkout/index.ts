import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { InvoiceStatus } from "../../lib/types.js";

const generateInvoiceNumber = () => {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-6);
  const random = Math.random().toString(36).substring(7).toUpperCase();
  return `INV-${date.getFullYear()}-${random}-${timestamp}`;
};

export const registerCheckoutModule = async (app: FastifyInstance) => {
  app.post("/checkout", { preHandler: [app.authenticate] }, async (request, reply) => {
    const userId = request.user.sub;
    const { productId } = request.body as { productId?: string };

    if (!productId) {
      return reply.code(400).send({ error: "Product ID required" });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return reply.code(404).send({ error: "Product not found" });
    }

    const existing = await prisma.userProduct.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existing) {
      return reply.code(409).send({ error: "Already owned" });
    }

    const invoiceNumber = generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        productId,
        status: InvoiceStatus.PENDENTE,
        amountCents: product.priceCents,
        invoiceNumber
      },
      include: { product: true }
    });

    return { invoice };
  });

  app.post(
    "/checkout/:invoiceId/confirm",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const userId = request.user.sub;
      const { invoiceId } = request.params as { invoiceId: string };

      const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
      if (!invoice) {
        return reply.code(404).send({ error: "Invoice not found" });
      }

      if (invoice.userId !== userId) {
        return reply.code(403).send({ error: "Forbidden" });
      }

      if (invoice.status === InvoiceStatus.PAGA) {
        return reply.code(409).send({ error: "Already paid" });
      }

      const existing = await prisma.userProduct.findUnique({
        where: { userId_productId: { userId, productId: invoice.productId } }
      });

      if (!existing) {
        await prisma.userProduct.create({
          data: { userId, productId: invoice.productId }
        });
      }

      const updated = await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: InvoiceStatus.PAGA, paidAt: new Date() },
        include: { product: true }
      });

      return { invoice: updated };
    }
  );

  app.get("/me/invoices", { preHandler: [app.authenticate] }, async (request) => {
    const userId = request.user.sub;
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" }
    });

    return { invoices };
  });

  app.get(
    "/admin/invoices",
    { preHandler: [app.authorize(["ADMIN"])] },
    async () => {
      const invoices = await prisma.invoice.findMany({
        include: { user: true, product: true },
        orderBy: { createdAt: "desc" }
      });

      return { invoices };
    }
  );
};
