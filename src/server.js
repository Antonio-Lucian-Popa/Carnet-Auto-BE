const app = require("./app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("🟢 Connected to PostgreSQL via Prisma");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      require("./jobs/reminderNotifier");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
}

main().then(r => {
    console.log("✅ Server started successfully");
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected");
  process.exit(0);
});
