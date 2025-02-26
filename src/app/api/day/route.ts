import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTodayMidnight } from "@/lib/date.server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const today = getTodayMidnight();

    const dayLog = await prisma.day.findFirst({
        where: {
            userId: user.id,
            day: today,
        },
    });

    return NextResponse.json({ dayLog });
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { logs } = await request.json();
        if (!logs || !Array.isArray(logs)) {
            return NextResponse.json({ error: "Invalid logs data" }, { status: 400 });
        }

        // Map logs dynamically to the day model fields
        const dayValues: Record<string, number | undefined> = {};

        logs.forEach((log: { field: string; time: number }) => {
            dayValues[log.field.toLowerCase()] = log.time;
        });

        const today = getTodayMidnight();

        let dayLog = await prisma.day.findFirst({
            where: {
                userId: user.id,
                day: today,
            },
        });

        if (dayLog) {
            dayLog = await prisma.day.update({
                where: { id: dayLog.id },
                data: dayValues,
            });
        } else {
            dayLog = await prisma.day.create({
                data: {
                    userId: user.id,
                    day: today,
                    ...dayValues,
                },
            });
        }

        return NextResponse.json({ dayLog });
    } catch (error) {
        console.error("Error saving day log:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}