import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";

type SocialTag = { label: string; color: string };

export const registerOnboardingModule = async (app: FastifyInstance) => {
  app.post("/onboarding", { preHandler: [app.authenticate] }, async (request) => {
    const userId = request.user.sub;
    const { headline, city, socials } = request.body as {
      headline?: string;
      city?: string;
      socials?: SocialTag[];
    };

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        headline: headline ?? null,
        city: city ?? null,
        socials: socials ?? undefined
      },
      select: { id: true, name: true, headline: true, city: true, socials: true }
    });

    return { user };
  });
};
