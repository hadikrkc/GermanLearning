import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed baslatiliyor...');

  // Sprint 1'den itibaren burasi doldurulacak:
  // - Level (CEFR ana seviyeleri)
  // - SubLevel (A1.1, A1.2, ...)
  // - Ornek Topic
  // - Admin User (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)

  console.log('Seed tamamlandi (Sprint 0 - hic veri eklenmedi).');
}

main()
  .catch((e) => {
    console.error('Seed hatasi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
