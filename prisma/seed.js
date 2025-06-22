const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.subscriptionPlan.createMany({
    data: [
      { id: "free-plan-id", name: "FREE", price: 0 },
      { id: "pro-plan-id", name: "PRO", price: 9.99 },
      { id: "fleet-plan-id", name: "FLEET", price: 29.99 },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
