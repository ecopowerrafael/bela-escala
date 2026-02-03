import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { Role } from "@prisma/client";

export const registerProductsModule = async (app: FastifyInstance) => {
	app.get("/products", async () => {
		const products = await prisma.product.findMany({
			select: { id: true, slug: true, name: true, priceCents: true, category: true }
		});

		return { products };
	});

	app.get("/me/products", { preHandler: [app.authenticate] }, async (request) => {
		const userId = request.user.sub;
		const products = await prisma.userProduct.findMany({
			where: { userId },
			include: { product: true }
		});

		return {
			products: products.map((entry: any) => ({
				id: entry.product.id,
				slug: entry.product.slug,
				name: entry.product.name,
				priceCents: entry.product.priceCents,
				category: entry.product.category,
				purchasedAt: entry.purchasedAt
			}))
		};
	});

	app.post(
		"/products/:id/purchase",
		{ preHandler: [app.authenticate] },
		async (request, reply) => {
			const userId = request.user.sub;
			const { id } = request.params as { id: string };

			const product = await prisma.product.findUnique({ where: { id } });
			if (!product) {
				return reply.code(404).send({ error: "Product not found" });
			}

			const existing = await prisma.userProduct.findUnique({
				where: { userId_productId: { userId, productId: id } }
			});

			if (existing) {
				return { status: "already_owned" };
			}

			await prisma.userProduct.create({
				data: { userId, productId: id }
			});

			return { status: "purchased" };
		}
	);

	app.post(
		"/admin/products",
		{ preHandler: [app.authorize([Role.ADMIN])] },
		async (request, reply) => {
			const { slug, name, priceCents, category } = request.body as {
				slug?: string;
				name?: string;
				priceCents?: number;
				category?: string;
			};

			if (!slug || !name || typeof priceCents !== "number") {
				return reply.code(400).send({ error: "Invalid payload" });
			}

			const product = await prisma.product.create({
				data: { slug, name, priceCents, category: category ?? null }
			});

			return { product };
		}
	);

	app.get("/home", async (request) => {
		const { userId } = request.query as { userId?: string };

		if (!userId) {
			return { products: [] };
		}
		const [products, user] = await Promise.all([
			prisma.product.findMany({
				select: { id: true, slug: true, name: true, priceCents: true, category: true }
			}),
			prisma.user.findUnique({
				where: { id: userId },
				select: { purchasedProducts: { select: { productId: true } } }
			})
		]);

		const owned = new Set(user?.purchasedProducts.map((p: { productId: string }) => p.productId));

		const productsWithLock = products.map((product: { id: string; slug: string; name: string; priceCents: number; category: string | null }) => ({
			...product,
			isLocked: !owned.has(product.id)
		}));

		return { products: productsWithLock };
	});
};
