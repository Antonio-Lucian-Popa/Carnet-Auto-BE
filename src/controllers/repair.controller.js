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

exports.getAllRepairLogs = async (req, res) => {
 const userId = req.user.id;
console.log("Fetching all repair logs for user:", userId);
  try {
    // Găsim toate mașinile utilizatorului
    const cars = await prisma.car.findMany({
      where: { userId },
      select: { id: true }
    });

    const carIds = cars.map(car => car.id);
    console.log("Car IDs for user:", carIds);

    // Găsim toate log-urile de reparații asociate acelor mașini
    const logs = await prisma.repairLog.findMany({
      where: {
        carId: { in: carIds }
      },
      orderBy: { date: "desc" },
      include: { car: true }
    });

    res.json(logs);
  } catch (error) {
    console.error("Error fetching repair logs for user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// exports.getAllRepairLogs = async (req, res) => {
//   console.log("Fetching all repair logs for user");
//  const authHeader = req.headers["authorization"];

//   let userId;
//   try {
//     userId = getCurrentUser(authHeader);
//     console.log("User ID:", userId);
//   } catch (error) {
//     return res.status(401).json({ error: "Unauthorized: " + error.message });
//   }

//   try {
//     // Găsim toate mașinile utilizatorului
//     const cars = await prisma.car.findMany({
//       where: { userId },
//       select: { id: true }
//     });

//     const carIds = cars.map(car => car.id);
//     console.log("Car IDs for user:", carIds);

//     // Găsim toate log-urile de reparații asociate acelor mașini
//     const logs = await prisma.repairLog.findMany({
//       where: {
//         carId: { in: carIds }
//       },
//       orderBy: { date: "desc" },
//       include: { car: true }
//     });

//     res.json(logs);
//   } catch (error) {
//     console.error("Error fetching repair logs for user:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

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