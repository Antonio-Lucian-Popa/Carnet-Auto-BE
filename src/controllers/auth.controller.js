const prisma = require("../../prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret123";

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // verifică dacă userul există deja
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email deja folosit." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
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

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "2d",
    });

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Eroare internă." });
  }
};
