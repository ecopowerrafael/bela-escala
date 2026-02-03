import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ranks = [
  { name: "Bronze", minPoints: 0 },
  { name: "Silver", minPoints: 200 },
  { name: "Gold", minPoints: 500 },
  { name: "Diamond", minPoints: 1000 }
];

const products = [
  {
    slug: "trilha-estrategia",
    name: "Trilha Estratégia de Marca",
    priceCents: 19900,
    category: "Trilhas"
  },
  {
    slug: "clube-premium",
    name: "Clube Premium",
    priceCents: 49900,
    category: "Comunidade"
  },
  {
    slug: "sala-vip",
    name: "Sala VIP",
    priceCents: 99900,
    category: "Exclusivo"
  }
];

const mentors = [
  {
    name: "Camila Rocha",
    email: "camila@belaescala.com",
    headline: "Mentora Growth",
    city: "São Paulo, BR",
    socials: [
      { label: "LinkedIn", color: "#0A66C2" },
      { label: "Instagram", color: "#E1306C" }
    ]
  },
  {
    name: "Eduardo Lima",
    email: "eduardo@belaescala.com",
    headline: "Founder Mentor",
    city: "Lisboa, PT",
    socials: [
      { label: "X", color: "#111111" },
      { label: "YouTube", color: "#FF0000" }
    ]
  }
];

const courses = [
  {
    slug: "estrategia-marca",
    title: "Estratégia de Marca",
    description: "Fundamentos para posicionamento premium.",
    category: "Trilhas",
    lessons: [
      { title: "Fundamentos", durationMin: 20, order: 1 },
      { title: "Posicionamento", durationMin: 35, order: 2 },
      { title: "Proposta de Valor", durationMin: 40, order: 3 }
    ]
  }
];

const run = async () => {
  for (const rank of ranks) {
    await prisma.rank.upsert({
      where: { name: rank.name },
      update: { minPoints: rank.minPoints },
      create: rank
    });
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        priceCents: product.priceCents,
        category: product.category
      },
      create: product
    });
  }

  for (const mentor of mentors) {
    const passwordHash = await bcrypt.hash("BelaEscala#2026", 10);

    await prisma.user.upsert({
      where: { email: mentor.email },
      update: {
        name: mentor.name,
        headline: mentor.headline,
        city: mentor.city,
        socials: mentor.socials
      },
      create: {
        name: mentor.name,
        email: mentor.email,
        passwordHash,
        role: Role.MENTOR,
        headline: mentor.headline,
        city: mentor.city,
        socials: mentor.socials
      }
    });
  }

  for (const course of courses) {
    const created = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        title: course.title,
        description: course.description,
        category: course.category
      },
      create: {
        slug: course.slug,
        title: course.title,
        description: course.description,
        category: course.category
      }
    });

    for (const lesson of course.lessons) {
      await prisma.lesson.upsert({
        where: { courseId_order: { courseId: created.id, order: lesson.order } },
        update: {
          title: lesson.title,
          durationMin: lesson.durationMin
        },
        create: {
          courseId: created.id,
          title: lesson.title,
          durationMin: lesson.durationMin,
          order: lesson.order
        }
      });
    }
  }
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
