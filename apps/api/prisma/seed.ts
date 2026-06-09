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
    displayName: 'A1 — Başlangıç',
    sortOrder: 1,
    subLevels: [
      { code: 'A1.1', displayName: 'A1.1 — Temel Başlangıç', sortOrder: 1 },
      { code: 'A1.2', displayName: 'A1.2 — Başlangıç+', sortOrder: 2 },
    ],
  },
  {
    code: 'A2',
    displayName: 'A2 — Temel',
    sortOrder: 2,
    subLevels: [
      { code: 'A2.1', displayName: 'A2.1 — Temel 1', sortOrder: 1 },
      { code: 'A2.2', displayName: 'A2.2 — Temel 2', sortOrder: 2 },
    ],
  },
  {
    code: 'B1',
    displayName: 'B1 — Orta Öncesi',
    sortOrder: 3,
    subLevels: [
      { code: 'B1.1', displayName: 'B1.1 — Orta Öncesi 1', sortOrder: 1 },
      { code: 'B1.2', displayName: 'B1.2 — Orta Öncesi 2', sortOrder: 2 },
    ],
  },
  {
    code: 'B2',
    displayName: 'B2 — Orta',
    sortOrder: 4,
    subLevels: [
      { code: 'B2.1', displayName: 'B2.1 — Orta 1', sortOrder: 1 },
      { code: 'B2.2', displayName: 'B2.2 — Orta 2', sortOrder: 2 },
    ],
  },
  {
    code: 'C1',
    displayName: 'C1 — Üst Orta',
    sortOrder: 5,
    subLevels: [
      { code: 'C1.1', displayName: 'C1.1 — Üst Orta 1', sortOrder: 1 },
      { code: 'C1.2', displayName: 'C1.2 — Üst Orta 2', sortOrder: 2 },
    ],
  },
  {
    code: 'C2',
    displayName: 'C2 — İleri',
    sortOrder: 6,
    subLevels: [
      { code: 'C2.1', displayName: 'C2.1 — İleri 1', sortOrder: 1 },
      { code: 'C2.2', displayName: 'C2.2 — İleri 2', sortOrder: 2 },
    ],
  },
];

async function main() {
  console.log('🌱 Seed başlıyor...');

  // CEFR Levels + SubLevels
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
    console.log(`  ✓ ${levelData.code} + ${levelData.subLevels.length} alt seviye`);
  }

  // Sample Topics for A1.1
  const a11 = await prisma.subLevel.findUnique({ where: { code: 'A1.1' } });
  const a1 = await prisma.level.findUnique({ where: { code: 'A1' } });
  if (a11 && a1) {
    const sampleTopics = [
      { slug: 'a1-1-artikel', displayName: 'Artikel (der/die/das)', sortOrder: 1 },
      { slug: 'a1-1-zahlen', displayName: 'Zahlen (Sayılar)', sortOrder: 2 },
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
    console.log('  ✓ A1.1 örnek konular');
  }

  // GLS-152 Admin Account
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@almanca.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin12345';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
      displayName: 'Platform Admin',
    },
  });
  console.log(`  ✓ Admin kullanıcı: ${adminEmail}`);

  console.log('✅ Seed tamamlandı.');
}

main()
  .catch((e) => {
    console.error('Seed hatası:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
