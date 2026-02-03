import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { Role } from "../../lib/types";

export const registerAdminModule = async (app: FastifyInstance) => {
  app.get(
    "/admin/overview",
    { preHandler: [app.authorize([Role.ADMIN])] },
    async () => {
      const [users, products, meetings, points] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.meeting.count(),
        prisma.pointsTransaction.aggregate({
          _sum: { points: true }
        })
      ]);

      return {
        users,
        products,
        meetings,
        totalPoints: points._sum.points ?? 0
      };
    }
  );
};
