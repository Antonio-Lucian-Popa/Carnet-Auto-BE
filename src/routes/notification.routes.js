const express = require("express");
const router = express.Router();
const prisma = require("../../prismaClient");

router.post("/token", async (req, res) => {
    const { userId, token } = req.body;
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { expoPushToken: token },
        });
        res.json({ message: "Token updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update token" });
    }
});

module.exports = router;
