const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret123";

exports.createFuelLog = async (req, res) => {
  const { carId, odometer, liters, price, station } = req.body;
  const authHeader = req.headers["authorization"];
  const userId = getCurrentUser(authHeader);
  console.log("Creating fuel log for user:", userId, "carId:", carId);

  try {
    const fuelLog = await prisma.fuelLog.create({
      data: {
       user: {
        connect: { id: userId },
      },
        odometer,
        liters,
        price,
        station,
        car: {
          connect: {
            id: carId
          }
        }
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


const getCurrentUser = (authHeader) => {
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) throw new Error("Token missing");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id || decoded.userId; // Depinde cum ai generat token-ul
  } catch (error) {
    console.error("getCurrentUser error:", error);
    throw new Error("Token invalid sau expirat.");
  }
};