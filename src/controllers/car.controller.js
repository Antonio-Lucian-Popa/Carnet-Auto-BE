const prisma = require("../../prismaClient");

exports.addCar = async (req, res) => {
  const userId = req.user.userId;
  const { name, model, year, numberPlate, vin } = req.body;

  try {
    // Obținem userul cu planul și mașinile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        plan: true,
        cars: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit." });
    }

    // Verificare dacă planul e free și deja are o mașină
    if (user.plan?.name === "free" && user.cars.length >= 1) {
      return res.status(403).json({
        message: "Planul Free permite doar o singură mașină. Upgradează pentru a adăuga mai multe.",
      });
    }

    const car = await prisma.car.create({
      data: {
        userId,
        name,
        model,
        year: Number(year),
        numberPlate,
        vin,
      },
    });

    res.status(201).json(car);
  } catch (error) {
    console.error("AddCar error:", error);
    res.status(500).json({ message: "Eroare la adăugarea mașinii." });
  }
};


exports.getUserCars = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cars = await prisma.car.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(cars);
  } catch (error) {
    console.error("GetCars error:", error);
    res.status(500).json({ message: "Eroare la încărcarea mașinilor." });
  }
};

exports.deleteCar = async (req, res) => {
  const userId = req.user.userId;
  const carId = req.params.id;

  try {
    const car = await prisma.car.findUnique({ where: { id: carId } });

    if (!car || car.userId !== userId) {
      return res.status(403).json({ message: "Nu ai voie să ștergi această mașină." });
    }

    await prisma.car.delete({ where: { id: carId } });

    res.json({ message: "Mașină ștearsă cu succes." });
  } catch (error) {
    console.error("DeleteCar error:", error);
    res.status(500).json({ message: "Eroare la ștergerea mașinii." });
  }
};
