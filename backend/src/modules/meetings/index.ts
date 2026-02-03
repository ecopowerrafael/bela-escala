import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { MeetingStatus, Role } from "../../lib/types.js";

export const registerMeetingsModule = async (app: FastifyInstance) => {
  app.post(
    "/meetings",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const userId = request.user.sub;
      const { mentorId, jitsiRoomId, scheduledAt } = request.body as {
        mentorId?: string;
        jitsiRoomId?: string;
        scheduledAt?: string;
      };

      if (!jitsiRoomId) {
        return reply.code(400).send({ error: "jitsiRoomId is required" });
      }

      const meeting = await prisma.meeting.create({
        data: {
          userId,
          mentorId: mentorId ?? null,
          jitsiRoomId,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null
        }
      });

      return { meeting };
    }
  );

  app.get(
    "/me/meetings",
    { preHandler: [app.authenticate] },
    async (request) => {
      const userId = request.user.sub;
      const meetings = await prisma.meeting.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });

      return { meetings };
    }
  );

  app.get(
    "/admin/meetings",
    { preHandler: [app.authorize([Role.ADMIN])] },
    async () => {
      const meetings = await prisma.meeting.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          mentor: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: "desc" }
      });

      return { meetings };
    }
  );

  app.patch(
    "/meetings/:id/status",
    { preHandler: [app.authorize([Role.ADMIN, Role.MENTOR])] },
    async (request) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status?: string };

    if (!status || !(status in MeetingStatus)) {
      return { error: "Invalid status" };
    }

    const meeting = await prisma.meeting.update({
      where: { id },
      data: { status: status as MeetingStatus }
    });

    return { meeting };
  }
  );
};
