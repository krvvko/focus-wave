"use client";

import Link from "next/link";
import React from "react";
import {formatDate, getGridDates} from "@/utils/grid";

export type DayStatus = "completed" | "partially_completed" | "failed";
export interface Day {
    date: string;
    status: DayStatus;
}

interface CommitGridProps {
    days: Day[];
    today: string;
    startingWeekDay?: "mon" | "sun";
}


interface GridCellProps {
    date: Date;
    dayData?: Day;
}
function GridCell({ date, dayData }: GridCellProps) {
    const key = formatDate(date);
    const getColor = (dayData?: Day): string => {
        if (!dayData) return "gray";
        if (dayData.status === "completed") return "green";
        if (dayData.status === "partially_completed") return "yellow";
        if (dayData.status === "failed") return "red";
        return "gray";
    };

    return (
        <Link href={`/day/${key}`}>
            <div
                style={{
                    width: 10,
                    height: 10,
                    backgroundColor: getColor(dayData),
                    border: "1px solid #ccc",
                    cursor: "pointer",
                }}
            />
        </Link>
    );
}

export default function CommitGrid({ days, today, startingWeekDay = "sun" }: CommitGridProps) {
    const todayDate = new Date(today);
    const dates = getGridDates(todayDate, startingWeekDay);

    const dayMap = new Map<string, Day>();
    days.forEach((d) => {
        const key = d.date.split("T")[0];
        dayMap.set(key, d);
    });

    return (
        <div style={{ position: "relative" }}>
            <div
                style={{
                    display: "grid",
                    gap: 4,
                    gridAutoFlow: "column",
                    gridTemplateRows: "repeat(7, 1fr)",
                }}
            >
                {dates.map((date) => {
                    const key = formatDate(date);
                    const dayData = dayMap.get(key);
                    return (
                        <GridCell
                            key={key}
                            date={date}
                            dayData={dayData}
                        />
                    );
                })}
            </div>
        </div>
    );
}