import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

type JwtPayload = {
	sub: string;
	role: Role;
};

export const registerAuthModule = async (app: FastifyInstance) => {
	app.post("/auth/register", async (request, reply) => {
		const { email, name, password } = request.body as {
			email?: string;
			name?: string;
			password?: string;
		};

		if (!email || !name || !password) {
			return reply.code(400).send({ error: "Invalid payload" });
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return reply.code(409).send({ error: "User already exists" });
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: { email, name, passwordHash, role: Role.FREE }
		});

		const token = app.jwt.sign({ sub: user.id, role: user.role } satisfies JwtPayload);

		return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
	});

	app.post("/auth/login", async (request, reply) => {
		const { email, password } = request.body as {
			email?: string;
			password?: string;
		};

		if (!email || !password) {
			return reply.code(400).send({ error: "Invalid payload" });
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return reply.code(401).send({ error: "Invalid credentials" });
		}

		const match = await bcrypt.compare(password, user.passwordHash);
		if (!match) {
			return reply.code(401).send({ error: "Invalid credentials" });
		}

		const token = app.jwt.sign({ sub: user.id, role: user.role } satisfies JwtPayload);

		return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
	});

	app.get("/auth/me", { preHandler: [app.authenticate] }, async (request) => {
		const userId = request.user.sub;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, name: true, email: true, role: true }
		});

		return { user };
	});
};
