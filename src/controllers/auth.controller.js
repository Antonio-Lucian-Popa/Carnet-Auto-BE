const prisma = require("../../prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret123";

exports.register = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    // verifică dacă userul există deja
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email deja folosit." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Utilizator înregistrat cu succes." });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Eroare internă." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Date de autentificare incorecte." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Parolă greșită." });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" } // scurt, pentru acces
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" } // mai lung
    );

    const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60; // Unix time in sec

    res.json({
      accessToken,
      refreshToken,
      expiresAt,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Eroare internă." });
  }
};


exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(400).json({ message: "Refresh token lipsă." });

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60;

    res.json({ accessToken: newAccessToken, expiresAt });
  } catch (error) {
    return res.status(403).json({ message: "Refresh token invalid sau expirat." });
  }
};

exports.getCurrentUser = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token lipsă" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        name: true
        // poți adăuga mai multe câmpuri dacă ai nevoie
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit." });
    }

    res.json(user);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(403).json({ message: "Token invalid sau expirat." });
  }
};

exports.updateAccount = async (req, res) => {
  const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token lipsă" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const { name, email } = req.body;

        // Verifică dacă email-ul este deja folosit de alt utilizator
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.id !== userId) {
            return res.status(400).json({ message: "Email deja folosit." });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, email },
        });

        res.json(updatedUser);
    }
    catch (error) {
        console.error("Update account error:", error);
        res.status(500).json({ message: "Eroare internă." });
    }
}

exports.updatePassword = async (req, res) => {
  const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token lipsă" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const { oldPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.password) {
            return res.status(401).json({ message: "Date de autentificare incorecte." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(403).json({ message: "Parolă greșită." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        res.json({ message: "Parola actualizată cu succes." });
    }
    catch (error) {
      console.error("Update password error:", error);
      res.status(500).json({message: "Eroare internă."});
    }
}

exports.deleteAccount = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token lipsă" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const carIds = await prisma.car.findMany({
      where: { userId },
      select: { id: true },
    });
    const ids = carIds.map((c) => c.id);

    await prisma.reminder.deleteMany({ where: { carId: { in: ids } } });
    await prisma.repairLog.deleteMany({ where: { carId: { in: ids } } });
    await prisma.fuelLog.deleteMany({ where: { carId: { in: ids } } });
    await prisma.car.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: "Cont șters cu succes." });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Eroare internă." });
  }
};
