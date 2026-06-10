import { PrismaClient, CefrMainLevel, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const CEFR_LEVELS: Array<{
  code: CefrMainLevel;
  displayName: string;
  sortOrder: number;
  subLevels: Array<{ code: string; displayName: string; sortOrder: number }>;
}> = [
  {
    code: 'A1',
    displayName: 'A1 — Beginner',
    sortOrder: 1,
    subLevels: [
      { code: 'A1.1', displayName: 'A1.1 — Absolute Beginner', sortOrder: 1 },
      { code: 'A1.2', displayName: 'A1.2 — Beginner+', sortOrder: 2 },
    ],
  },
  {
    code: 'A2',
    displayName: 'A2 — Elementary',
    sortOrder: 2,
    subLevels: [
      { code: 'A2.1', displayName: 'A2.1 — Elementary 1', sortOrder: 1 },
      { code: 'A2.2', displayName: 'A2.2 — Elementary 2', sortOrder: 2 },
    ],
  },
  {
    code: 'B1',
    displayName: 'B1 — Pre-Intermediate',
    sortOrder: 3,
    subLevels: [
      { code: 'B1.1', displayName: 'B1.1 — Pre-Intermediate 1', sortOrder: 1 },
      { code: 'B1.2', displayName: 'B1.2 — Pre-Intermediate 2', sortOrder: 2 },
    ],
  },
  {
    code: 'B2',
    displayName: 'B2 — Intermediate',
    sortOrder: 4,
    subLevels: [
      { code: 'B2.1', displayName: 'B2.1 — Intermediate 1', sortOrder: 1 },
      { code: 'B2.2', displayName: 'B2.2 — Intermediate 2', sortOrder: 2 },
    ],
  },
  {
    code: 'C1',
    displayName: 'C1 — Upper-Intermediate',
    sortOrder: 5,
    subLevels: [
      { code: 'C1.1', displayName: 'C1.1 — Upper-Intermediate 1', sortOrder: 1 },
      { code: 'C1.2', displayName: 'C1.2 — Upper-Intermediate 2', sortOrder: 2 },
    ],
  },
  {
    code: 'C2',
    displayName: 'C2 — Advanced',
    sortOrder: 6,
    subLevels: [
      { code: 'C2.1', displayName: 'C2.1 — Advanced 1', sortOrder: 1 },
      { code: 'C2.2', displayName: 'C2.2 — Advanced 2', sortOrder: 2 },
    ],
  },
];

async function main() {
  console.log('Seeding database...');

  for (const levelData of CEFR_LEVELS) {
    const level = await prisma.level.upsert({
      where: { code: levelData.code },
      update: { displayName: levelData.displayName, sortOrder: levelData.sortOrder },
      create: {
        code: levelData.code,
        displayName: levelData.displayName,
        sortOrder: levelData.sortOrder,
      },
    });

    for (const sl of levelData.subLevels) {
      await prisma.subLevel.upsert({
        where: { code: sl.code },
        update: { displayName: sl.displayName, sortOrder: sl.sortOrder },
        create: {
          levelId: level.id,
          code: sl.code,
          displayName: sl.displayName,
          sortOrder: sl.sortOrder,
        },
      });
    }
    console.log(`  ✓ ${levelData.code} (${levelData.subLevels.length} sublevels)`);
  }

  // Sample topics for A1.1
  const a11 = await prisma.subLevel.findUnique({ where: { code: 'A1.1' } });
  const a1 = await prisma.level.findUnique({ where: { code: 'A1' } });
  if (a11 && a1) {
    const sampleTopics = [
      { slug: 'a1-1-artikel', displayName: 'Artikel (der/die/das)', sortOrder: 1 },
      { slug: 'a1-1-zahlen', displayName: 'Zahlen (Numbers)', sortOrder: 2 },
    ];
    for (const topic of sampleTopics) {
      await prisma.topic.upsert({
        where: { slug: topic.slug },
        update: {},
        create: {
          subLevelId: a11.id,
          levelId: a1.id,
          slug: topic.slug,
          displayName: topic.displayName,
          sortOrder: topic.sortOrder,
          status: 'ACTIVE',
        },
      });
    }
    console.log('  ✓ A1.1 sample topics');
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@germanlearning.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin12345';
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: UserRole.ADMIN,
      displayName: 'Platform Admin',
    },
  });
  console.log(`  ✓ Admin user: ${adminEmail}`);

  const teacherEmail = process.env.SEED_TEACHER_EMAIL ?? 'teacher@germanlearning.local';
  const teacherPassword = process.env.SEED_TEACHER_PASSWORD ?? 'teacher12345';
  await prisma.user.upsert({
    where: { email: teacherEmail },
    update: {},
    create: {
      email: teacherEmail,
      passwordHash: await bcrypt.hash(teacherPassword, 12),
      role: UserRole.TEACHER,
      displayName: 'Demo Teacher',
    },
  });
  console.log(`  ✓ Teacher user: ${teacherEmail}`);

  const studentEmail = process.env.SEED_STUDENT_EMAIL ?? 'student@germanlearning.local';
  const studentPassword = process.env.SEED_STUDENT_PASSWORD ?? 'student12345';
  await prisma.user.upsert({
    where: { email: studentEmail },
    update: {},
    create: {
      email: studentEmail,
      passwordHash: await bcrypt.hash(studentPassword, 12),
      role: UserRole.STUDENT,
      displayName: 'Demo Student',
    },
  });
  console.log(`  ✓ Student user: ${studentEmail}`);

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
