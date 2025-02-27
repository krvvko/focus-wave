import React from 'react';
import { mapFieldToKey } from '@/lib/focusUtils';
import {Day, Focus} from "@prisma/client";
import {Fire} from "@mynaui/icons-react";
import Stat from "@/components/ui/Profile/Stat/Stat";
import { Crosshair, SmileGhost } from "@mynaui/icons-react";

const HoursOfFocused = ({ focus_on, day_logs }: { day_logs: Day[], focus_on: Focus[] }) => {
    const getGreaterThanSumForDay = (day: Day) => {
        const dayRecord = day as Record<string, any>;

        return focus_on
            .filter((item) => item.operator === 'GREATER_THAN')
            .reduce((sum, item) => {
                const key = mapFieldToKey(item.field);
                const logged = dayRecord[key] != null ? dayRecord[key] : 0;
                return logged > item.time ? sum + logged : sum;
            }, 0);
    };

    const getLessThanSavedForDay = (day: Day) => {
        const dayRecord = day as Record<string, any>;

        return focus_on
            .filter((item) => item.operator === 'LESS_THAN')
            .reduce((saved, item) => {
                const key = mapFieldToKey(item.field);
                const logged = dayRecord[key] != null ? dayRecord[key] : 0;
                return logged < item.time ? saved + (item.time - logged) : saved;
            }, 0);
    };


    const totalTimeFocused = day_logs.reduce(
        (total, day) => total + getGreaterThanSumForDay(day),
        0
    );
    const totalSavedTime = day_logs.reduce(
        (total, day) => total + getLessThanSavedForDay(day),
        0
    );

    return (
        <>
            <Stat value={`${totalTimeFocused} Hours`} color={'var(--purple)'} icon={Crosshair} name={'Focused time'} />
            <Stat value={`${totalSavedTime} Hours`} color={'var(--pink)'} icon={SmileGhost} name={'Saved time'} />
        </>
    );
};

export default HoursOfFocused;
