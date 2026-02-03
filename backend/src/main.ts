import "dotenv/config";
import Fastify from "fastify";
import jwt from "@fastify/jwt";
import { Role } from "@prisma/client";
import { registerProductsModule } from "./modules/products/index.js";
import { registerMeetingsModule } from "./modules/meetings/index.js";
import { registerChatModule } from "./modules/chat/index.js";
import { registerUsersModule } from "./modules/users/index.js";
import { registerAuthModule } from "./modules/auth/index.js";
import { registerOnboardingModule } from "./modules/onboarding/index.js";
import { registerAdminModule } from "./modules/admin/index.js";
import { registerCoursesModule } from "./modules/courses/index.js";
import { registerCheckoutModule } from "./modules/checkout/index.js";

export const bootstrap = async () => {
  const app = Fastify({ logger: true });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "bela-escala-secret"
  });

  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });

  app.decorate("authorize", (roles: Role[]) => {
    return async (request, reply) => {
      await app.authenticate(request, reply);
      if (reply.sent) return;
      if (!request.user || !roles.includes(request.user.role)) {
        reply.code(403).send({ error: "Forbidden" });
      }
    };
  });

  app.get("/health", async () => ({ status: "ok" }));

  app.get("/", async () => ({
    name: "Bela Escala API",
    version: "1.0.0",
    status: "online",
    documentation: "/documentation" // Placeholder if swagger is added later
  }));

  await registerAuthModule(app);
  await registerProductsModule(app);
  await registerMeetingsModule(app);
  await registerChatModule(app);
  await registerUsersModule(app);
  await registerOnboardingModule(app);
  await registerAdminModule(app);
  await registerCoursesModule(app);
  await registerCheckoutModule(app);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen({ port, host: "0.0.0.0" });
};

bootstrap();
