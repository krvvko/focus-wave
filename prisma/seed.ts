import { PrismaClient, AvailableField, Operator } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create users
    const user1 = await prisma.user.upsert({
        where: { email: "user1@example.com" },
        update: {},
        create: {
            name: "John Doe",
            email: "user1@example.com",
            password: "securepassword",
            goal: "Improve work-life balance",
            image: "https://via.placeholder.com/150",
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: "user2@example.com" },
        update: {},
        create: {
            name: "Jane Smith",
            email: "user2@example.com",
            password: "anothersecurepassword",
            goal: "Reduce screen time and exercise more",
            image: "https://via.placeholder.com/150",
        },
    });

    // Insert focus goals for users
    await prisma.focus.createMany({
        data: [
            {
                userId: user1.id,
                field: AvailableField.WORK,
                operator: Operator.LESS_THAN,
                time: 6,
            },
            {
                userId: user1.id,
                field: AvailableField.SLEEP,
                operator: Operator.GREATER_THAN,
                time: 7,
            },
            {
                userId: user2.id,
                field: AvailableField.SOCIAL_NETWORKS,
                operator: Operator.LESS_THAN,
                time: 2,
            },
            {
                userId: user2.id,
                field: AvailableField.EXERCISE,
                operator: Operator.GREATER_THAN,
                time: 3,
            },
        ],
    });

    // Function to safely create or update Day logs
    async function upsertDayLog(userId: string, day: string, logData: any) {
        await prisma.day.upsert({
            where: {
                userId_day: {
                    userId,
                    day: new Date(day),
                }, // Uses composite unique constraint
            },
            update: logData,
            create: { userId, day: new Date(day), ...logData },
        });
    }

    // Insert daily logs
    await upsertDayLog(user1.id, "2025-02-23", {
        sleep: 8,
        social_networks: 2,
        work: 5,
        study: 3,
        exercise: 1,
        other: 1,
    });

    await upsertDayLog(user1.id, "2025-02-22", {
        sleep: 6,
        social_networks: 3,
        work: 7,
        study: 2,
        exercise: 0,
        other: 2,
    });

    await upsertDayLog(user2.id, "2025-02-23", {
        sleep: 7,
        social_networks: 1,
        work: 6,
        study: 2,
        exercise: 4,
        other: 1,
    });

    console.log("✅ Seeding complete!");
}

main()
    .catch((error) => {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
