import {redirect} from "next/navigation";
import {prisma} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import GridDisplay from "@/components/logic/GridDisplay/GridDisplay";
import TodaysGoals from "@/components/ui/TodayFocus/TodayFocus";
import styles from './index.module.css';
import Profile from "@/components/ui/Profile/Profile";
import DayLogStatus from "@/components/ui/DayLogStatus/DayLogStatus";
import React from "react";

export default async function AppPage() {
    const session = await getServerSession(authOptions);

    const userData = await prisma.user.findUnique({
        where: { email: session!.user!.email! },
        include: { focus_on: true, days_logs: true },
    });

    if (userData!.focus_on.length === 0) {
        redirect('/goals');
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.left}>
                    <Profile initialUser={userData!} />
                </div>
                <div className={styles.right}>
                    <DayLogStatus focus_on={userData!.focus_on!} days_logs={userData!.days_logs!} />
                    <TodaysGoals focus_on={userData!.focus_on!} days_logs={userData!.days_logs!} />
                </div>
            </div>
            <GridDisplay />
        </div>
    );
}
