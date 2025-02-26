import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goal } = await request.json();

    try {
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: { goal },
            include: { focus_on: true, days_logs: true },
        });
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Update goal error:", error);
        return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
    }
}