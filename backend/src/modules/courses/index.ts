import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { Role } from "../../lib/types";

export const registerCoursesModule = async (app: FastifyInstance) => {
  app.get("/courses", async () => {
    const courses = await prisma.course.findMany({
      include: { lessons: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" }
    });

    return { courses };
  });

  app.get("/courses/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const userId = request.user?.sub;

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: { orderBy: { order: "asc" } },
        products: { select: { productId: true } }
      }
    });

    if (!course) {
      return reply.code(404).send({ error: "Course not found" });
    }

    if (course.products.length > 0) {
      if (!userId) {
        return reply.code(403).send({ error: "Locked - must be authenticated" });
      }

      const owned = await prisma.userProduct.findFirst({
        where: {
          userId,
          productId: { in: course.products.map((p) => p.productId) }
        }
      });

      if (!owned) {
        return reply.code(403).send({ error: "Locked - must purchase" });
      }
    }

    return { course };
  });

  app.post(
    "/admin/courses",
    { preHandler: [app.authorize([Role.ADMIN, Role.MENTOR])] },
    async (request, reply) => {
      const { slug, title, description, category } = request.body as {
        slug?: string;
        title?: string;
        description?: string;
        category?: string;
      };

      if (!slug || !title) {
        return reply.code(400).send({ error: "Invalid payload" });
      }

      const course = await prisma.course.create({
        data: { slug, title, description: description ?? null, category: category ?? null }
      });

      return { course };
    }
  );

  app.post(
    "/admin/courses/:courseId/products/:productId",
    { preHandler: [app.authorize([Role.ADMIN])] },
    async (request, reply) => {
      const { courseId, productId } = request.params as {
        courseId: string;
        productId: string;
      };

      const existing = await prisma.courseProduct.findUnique({
        where: { courseId_productId: { courseId, productId } }
      });

      if (existing) {
        return { status: "already_linked" };
      }

      await prisma.courseProduct.create({
        data: { courseId, productId }
      });

      return { status: "linked" };
    }
  );

  app.delete(
    "/admin/courses/:courseId/products/:productId",
    { preHandler: [app.authorize([Role.ADMIN])] },
    async (request) => {
      const { courseId, productId } = request.params as {
        courseId: string;
        productId: string;
      };

      await prisma.courseProduct.deleteMany({
        where: { courseId, productId }
      });

      return { status: "unlinked" };
    }
  );

  app.post(
    "/admin/courses/:courseId/lessons",
    { preHandler: [app.authorize([Role.ADMIN, Role.MENTOR])] },
    async (request, reply) => {
      const { courseId } = request.params as { courseId: string };
      const { title, durationMin, order, contentUrl } = request.body as {
        title?: string;
        durationMin?: number;
        order?: number;
        contentUrl?: string;
      };

      if (!title || typeof durationMin !== "number" || typeof order !== "number") {
        return reply.code(400).send({ error: "Invalid payload" });
      }

      const lesson = await prisma.lesson.create({
        data: {
          courseId,
          title,
          durationMin,
          order,
          contentUrl: contentUrl ?? null
        }
      });

      return { lesson };
    }
  );

  app.post(
    "/lessons/:lessonId/progress",
    { preHandler: [app.authenticate] },
    async (request) => {
      const userId = request.user.sub;
      const { lessonId } = request.params as { lessonId: string };
      const { completed } = request.body as { completed?: boolean };

      const progress = await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: { completed: completed ?? true },
        create: { userId, lessonId, completed: completed ?? true }
      });

      return { progress };
    }
  );

  app.get(
    "/me/progress",
    { preHandler: [app.authenticate] },
    async (request) => {
      const userId = request.user.sub;
      const progress = await prisma.lessonProgress.findMany({
        where: { userId },
        include: { lesson: { include: { course: true } } }
      });

      return { progress };
    }
  );

  app.get(
    "/admin/courses",
    { preHandler: [app.authorize([Role.ADMIN, Role.MENTOR])] },
    async () => {
      const courses = await prisma.course.findMany({
        include: {
          lessons: { orderBy: { order: "asc" } },
          products: { select: { productId: true, product: { select: { slug: true, name: true } } } }
        },
        orderBy: { createdAt: "desc" }
      });

      return { courses };
    }
  );
};
