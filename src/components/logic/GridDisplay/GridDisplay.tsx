import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dynamic from "next/dynamic";
import { getTodayMidnight } from "@/lib/date.server";

const CommitGrid = dynamic(() => import("@/components/ui/CommitGrid/CommitGrid"));

export default async function GridDisplay() {
    const session = await getServerSession(authOptions);

    const userData = await prisma.user.findUnique({
        where: { email: session!.user!.email! },
        include: { days_logs: true, focus_on: true },
    });

    const compiledDays = userData!.days_logs.map((log) => {
        const totalGoals = userData!.focus_on.length;
        let metCount = 0;
        for (const goal of userData!.focus_on) {
            const key = goal.field.toLowerCase();
            const value = (log as never)[key];
            if (value !== null && value !== undefined) {
                if (goal.operator === "GREATER_THAN" && value >= goal.time) {
                    metCount++;
                } else if (goal.operator === "LESS_THAN" && value < goal.time) {
                    metCount++;
                } else if (goal.operator === "EQUALS" && value === goal.time) {
                    metCount++;
                }
            }
        }
        let status: "completed" | "partially_completed" | "failed";
        if (metCount === totalGoals) {
            status = "completed";
        } else if (metCount > 0) {
            status = "partially_completed";
        } else {
            status = "failed";
        }
        return {
            date: log.day.toISOString(),
            status,
        };
    });

    const today = getTodayMidnight().toISOString();

    return (
        <CommitGrid days={compiledDays} today={today} startingWeekDay="sun" />
    );
}