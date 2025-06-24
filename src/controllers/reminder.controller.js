const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createReminder = async (req, res) => {
  const { carId, type, dueDate, repeatDays } = req.body;
  try {
    const reminder = await prisma.reminder.create({
      data: {
        carId,
        type,
        dueDate: new Date(dueDate),
        repeatDays,
      },
    });
    res.status(201).json(reminder);
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getRemindersForAllCars = async (req, res) => {
    const userId = req.user.id;
    try {
        // Find all cars for the user
        const cars = await prisma.car.findMany({
        where: { userId },
        select: { id: true },
        });

        const carIds = cars.map(car => car.id);

        // Fetch reminders for all cars
        const reminders = await prisma.reminder.findMany({
        where: { carId: { in: carIds } },
        orderBy: { dueDate: "asc" },
        });

        res.json(reminders);
    } catch (error) {
        console.error("Error fetching reminders for all cars:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getRemindersForCar = async (req, res) => {
  const { carId } = req.params;
  try {
    const reminders = await prisma.reminder.findMany({
      where: { carId },
      orderBy: { dueDate: "asc" },
    });
    res.json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateReminder = async (req, res) => {
  const { id } = req.params;
  const { type, dueDate, repeatDays, notified } = req.body;
  try {
    const updated = await prisma.reminder.update({
      where: { id },
      data: {
        type,
        dueDate: new Date(dueDate),
        repeatDays,
        notified,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error("Error updating reminder:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteReminder = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.reminder.delete({
      where: { id },
    });
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
