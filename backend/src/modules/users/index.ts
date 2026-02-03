import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { Role } from "@prisma/client";

type SocialTag = { label: string; color: string };

export const registerUsersModule = async (app: FastifyInstance) => {
	app.get("/members", async () => {
		const mentors = await prisma.user.findMany({
			where: { role: Role.MENTOR },
			select: {
				id: true,
				name: true,
				headline: true,
				city: true,
				socials: true
			}
		});

		const members = mentors.map((mentor) => ({
			id: mentor.id,
			name: mentor.name,
			role: mentor.headline ?? "Mentor",
			city: mentor.city ?? "",
			socials: (mentor.socials as SocialTag[] | null) ?? []
		}));

		return { members };
	});

	app.get(
		"/admin/users",
		{ preHandler: [app.authorize([Role.ADMIN])] },
		async () => {
			const users = await prisma.user.findMany({
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
					points: true,
					createdAt: true
				},
				orderBy: { createdAt: "desc" }
			});

			return { users };
		}
	);

	app.patch(
		"/admin/users/:id/role",
		{ preHandler: [app.authorize([Role.ADMIN])] },
		async (request, reply) => {
			const { id } = request.params as { id: string };
			const { role } = request.body as { role?: Role };

			if (!role || !(role in Role)) {
				return reply.code(400).send({ error: "Invalid role" });
			}

			const user = await prisma.user.update({
				where: { id },
				data: { role }
			});

			return { user };
		}
	);
};
