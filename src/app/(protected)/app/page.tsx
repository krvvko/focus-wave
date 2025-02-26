import {redirect} from "next/navigation";
import DayLogFiller from "@/components/ui/DayLogFiller/DayLogFiller";
import {prisma} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import GridDisplay from "@/components/logic/GridDisplay/GridDisplay";
import TodaysGoals from "@/components/ui/TodayFocus/TodayFocus";
import styles from './index.module.css';
import Profile from "@/components/ui/Profile/Profile";

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
        <div className={styles.main}>
            <Profile initialUser={userData!} />
            <DayLogFiller />
            <GridDisplay />
            <TodaysGoals />
        </div>
    );
}
