const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createRepairLog = async (req, res) => {
  const { carId, date, description, cost, service } = req.body;
  try {
    const repairLog = await prisma.repairLog.create({
      data: {
        carId,
        date: new Date(date),
        description,
        cost,
        service,
      },
    });
    res.status(201).json(repairLog);
  } catch (error) {
    console.error("Error creating repair log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getRepairLogs = async (req, res) => {
  const { carId } = req.params;
  try {
    const logs = await prisma.repairLog.findMany({
      where: { carId },
      orderBy: { date: "desc" },
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching repair logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteRepairLog = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.repairLog.delete({
      where: { id },
    });
    res.json({ message: "Repair log deleted successfully" });
  } catch (error) {
    console.error("Error deleting repair log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
