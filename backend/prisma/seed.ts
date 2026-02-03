import { PrismaClient, Role, InvoiceStatus, MeetingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ranks = [
  { name: "Bronze", minPoints: 0 },
  { name: "Prata", minPoints: 200 },
  { name: "Ouro", minPoints: 500 },
  { name: "Diamante", minPoints: 1000 }
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
  },
  {
    slug: "curso-marketing",
    name: "Marketing Digital 30 Dias",
    priceCents: 29900,
    category: "Cursos"
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
      { title: "Proposta de Valor", durationMin: 40, order: 3 },
      { title: "Identidade Visual", durationMin: 25, order: 4 }
    ]
  },
  {
    slug: "marketing-digital",
    title: "Marketing Digital Prático",
    description: "Do zero à primeira venda em 30 dias.",
    category: "Marketing",
    lessons: [
      { title: "Configurando o Business Manager", durationMin: 15, order: 1 },
      { title: "Criativos que convertem", durationMin: 30, order: 2 },
      { title: "Copywriting Essencial", durationMin: 45, order: 3 }
    ]
  },
  {
    slug: "vendas-b2b",
    title: "Vendas B2B de Alto Ticket",
    description: "Como fechar contratos acima de 5k.",
    category: "Vendas",
    lessons: [
      { title: "Prospecção Fria", durationMin: 20, order: 1 },
      { title: "Reunião de Diagnóstico", durationMin: 40, order: 2 },
      { title: "Fechamento e Objeções", durationMin: 35, order: 3 }
    ]
  }
];

const demoUsers = [
  {
    name: "Administrador",
    email: "admin@belaescala.com",
    role: Role.ADMIN
  },
  {
    name: "Cliente Premium",
    email: "cliente@belaescala.com",
    role: Role.PREMIUM
  },
  {
    name: "Usuário Grátis",
    email: "user@belaescala.com",
    role: Role.FREE
  }
];

const run = async () => {
  const passwordHash = await bcrypt.hash("123456", 10);

  // 1. Ranks
  console.log("Seeding Ranks...");
  for (const rank of ranks) {
    await prisma.rank.upsert({
      where: { name: rank.name },
      update: { minPoints: rank.minPoints },
      create: rank
    });
  }

  // 2. Products
  console.log("Seeding Products...");
  const productMap = new Map();
  for (const product of products) {
    const p = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        priceCents: product.priceCents,
        category: product.category
      },
      create: product
    });
    productMap.set(product.slug, p);
  }

  // 3. Mentors
  console.log("Seeding Mentors...");
  for (const mentor of mentors) {
    await prisma.user.upsert({
      where: { email: mentor.email },
      update: {
        name: mentor.name,
        headline: mentor.headline,
        city: mentor.city,
        socials: mentor.socials,
        role: Role.MENTOR
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

  // 4. Users
  console.log("Seeding Users...");
  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role
      },
      create: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        city: "São Paulo, BR"
      }
    });
  }

  // 5. Courses & Lessons
  console.log("Seeding Courses...");
  const courseMap = new Map();
  for (const course of courses) {
    const c = await prisma.course.upsert({
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
    courseMap.set(course.slug, c);

    for (const lesson of course.lessons) {
      await prisma.lesson.upsert({
        where: { courseId_order: { courseId: c.id, order: lesson.order } },
        update: {
          title: lesson.title,
          durationMin: lesson.durationMin
        },
        create: {
          courseId: c.id,
          title: lesson.title,
          durationMin: lesson.durationMin,
          order: lesson.order
        }
      });
    }
  }

  // 6. Connect Products to Courses
  console.log("Connecting Products to Courses...");
  const estrategiaCourse = courseMap.get("estrategia-marca");
  const trilhaProduct = productMap.get("trilha-estrategia");
  
  if (estrategiaCourse && trilhaProduct) {
     await prisma.courseProduct.upsert({
         where: { courseId_productId: { productId: trilhaProduct.id, courseId: estrategiaCourse.id } },
         update: {},
         create: {
             productId: trilhaProduct.id,
             courseId: estrategiaCourse.id
         }
     });
  }

  // 7. Demo Data: Purchases & Meetings
  console.log("Generating Demo Purchases & Meetings...");
  const premiumUser = await prisma.user.findUnique({ where: { email: "cliente@belaescala.com" } });
  const mentor = await prisma.user.findUnique({ where: { email: "camila@belaescala.com" } });
  const vipProduct = productMap.get("sala-vip");

  if (premiumUser && vipProduct) {
      // Purchase history (Invoice)
      await prisma.invoice.create({
          data: {
              userId: premiumUser.id,
              productId: vipProduct.id,
              amountCents: vipProduct.priceCents,
              status: InvoiceStatus.PAGA,
              invoiceNumber: `INV-DEMO-${Date.now()}`
          }
      });
      
      // Grant product access
      await prisma.userProduct.upsert({
          where: { userId_productId: { userId: premiumUser.id, productId: vipProduct.id }},
          update: {},
          create: {
              userId: premiumUser.id,
              productId: vipProduct.id
          }
      });
  }

  if (premiumUser && mentor) {
      // Create a meeting next week
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(14, 0, 0, 0);

      await prisma.meeting.create({
          data: {
              userId: premiumUser.id,
              mentorId: mentor.id,
              scheduledAt: nextWeek,
              status: MeetingStatus.CONFIRMADA,
              jitsiRoomId: `meeting-demo-${Date.now()}`
          }
      });
  }

  console.log("🌱 Seed completed successfully!");
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
