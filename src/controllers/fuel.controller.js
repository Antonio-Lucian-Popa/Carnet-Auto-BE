const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createFuelLog = async (req, res) => {
  const { carId, odometer, liters, price, station } = req.body;
  const userId = req.user.id;

  try {
    const fuelLog = await prisma.fuelLog.create({
      data: {
        carId,
        userId,
        odometer,
        liters,
        price,
        station,
      },
    });
    res.status(201).json(fuelLog);
  } catch (error) {
    console.error("Error creating fuel log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFuelLogs = async (req, res) => {
  const { carId } = req.params;
  const userId = req.user.id;

  try {
    const logs = await prisma.fuelLog.findMany({
      where: {
        carId,
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching fuel logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllFuelLogs = async (req, res) => {
  const userId = req.user.id;
  try {
    const logs = await prisma.fuelLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching all fuel logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteFuelLog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const existing = await prisma.fuelLog.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await prisma.fuelLog.delete({
      where: { id },
    });

    res.json({ message: "Fuel log deleted successfully" });
  } catch (error) {
    console.error("Error deleting fuel log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
