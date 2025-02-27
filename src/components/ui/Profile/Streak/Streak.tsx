import React from 'react';
import styles from './index.module.css';
import { Day } from '@prisma/client';
import {getTodayMidnight} from "@/lib/date.server";
import Stat from "@/components/ui/Profile/Stat/Stat";
import { Fire } from "@mynaui/icons-react";

const Streak = ({ day_logs }: { day_logs: Day[] }) => {
    const logDaysSet = new Set(
        day_logs.map((log) => {
            const d = new Date(log.day);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        })
    );

    const today = getTodayMidnight();
    let streak = 1;
    const previousDay = new Date(today);

    while (true) {
        previousDay.setDate(previousDay.getDate() - 1);
        if (logDaysSet.has(previousDay.getTime())) {
            streak++;
        } else {
            break;
        }
    }

    return (
        <Stat value={`${streak} ${streak === 1 ? "Day" : "Days"}`} color={'var(--orange)'} icon={Fire} name={'Streak'} />
    );
};

export default Streak;
