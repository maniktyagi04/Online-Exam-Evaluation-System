import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@system.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admincontrol@1234', 12);
    const admin = await prisma.user.create({
      data: {
        name: 'System Admin',
        email: 'admin@system.com',
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log(`✅ Admin created: ${admin.email}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${existingAdmin.email}`);
  }

  console.log('🌱 Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
