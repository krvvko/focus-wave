import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {AllowedFields} from "@/lib/focusUtils";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const focusItems = await prisma.focus.findMany({
        where: { userId: user.id },
    });
    return NextResponse.json({ focusItems });
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { goals } = await request.json();
        if (!goals || !Array.isArray(goals)) {
            return NextResponse.json({ error: "Invalid goals data" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        await prisma.focus.deleteMany({ where: { userId: user.id } });

        const createdGoals = await prisma.$transaction(
            goals.map((goal) => {
                if (
                    !goal.time ||
                    !goal.operator ||
                    !goal.field ||
                    !AllowedFields.includes(goal.field)
                ) {
                    throw new Error("Invalid or missing goal fields");
                }
                return prisma.focus.create({
                    data: {
                        userId: user.id,
                        time: goal.time,
                        operator: goal.operator as "LESS_THAN" | "GREATER_THAN" | "EQUALS",
                        field: goal.field as typeof AllowedFields[number],
                    },
                });
            })
        );

        return NextResponse.json({ goals: createdGoals });
    } catch (error) {
        console.error("Error saving focus goals:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
