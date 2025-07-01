const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();

const sendPushNotification = async (token, title, body) => {
    await axios.post("https://exp.host/--/api/v2/push/send", {
        to: token,
        title,
        body,
    });
};

cron.schedule("0 * * * *", async () => {
    console.log("⏰ Checking reminders...");
    const now = new Date();
    const soon = new Date(now.getTime() + 60 * 60 * 1000); // in next hour

    const reminders = await prisma.reminder.findMany({
        where: {
            dueDate: {
                gte: now,
                lte: soon,
            },
            notified: false,
        },
        include: {
            car: {
                include: {
                    user: true,
                },
            },
        },
    });

    for (const reminder of reminders) {
        const token = reminder.car.user.expoPushToken;
        if (token) {
            const title = "⏰ Reminder: " + reminder.type;
            const body = `Due soon for ${reminder.car.name} at ${reminder.dueDate.toLocaleString()}`;
            await sendPushNotification(token, title, body);

            await prisma.reminder.update({
                where: { id: reminder.id },
                data: { notified: true },
            });
        }
    }
});
