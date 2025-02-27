"use client";

import Link from "next/link";
import React, {useState} from "react";
import {formatDate, getGridDates} from "@/utils/grid";
import styles from './index.module.css';

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
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const [isHovered, setIsHovered] = useState(false);

    const getColor = (dayData?: Day): string => {
        if (!dayData) return "var(--border-color-4)";
        if (dayData.status === "completed") return "var(--green)";
        if (dayData.status === "partially_completed") return "var(--yellow)";
        if (dayData.status === "failed") return "var(--red)";
        return "var(--border-color-4)";
    };

    return (
        <Link href={`/day/${key}`} style={{ position: "relative" }}>
            <div
                className={styles.cell}
                style={{ backgroundColor: getColor(dayData) }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isHovered && (
                    <div className={styles.tooltip}>{formattedDate}</div>
                )}
            </div>
        </Link>
    );
}

const Description = ({color, text}: {color: string, text: string}) => {
    return (
        <div className={styles.description}>
            <div className={styles.descriptionInner} style={{backgroundColor: color}}></div>
            - {text}
        </div>
    )
}

export default function CommitGrid({
                                       days,
                                       today,
                                       startingWeekDay = "sun",
                                   }: CommitGridProps) {
    const todayDate = new Date(today);
    const dates = getGridDates(todayDate, startingWeekDay);

    const dayMap = new Map<string, Day>();
    days.forEach((d) => {
        const key = d.date.split("T")[0];
        dayMap.set(key, d);
    });

    const numColumns = Math.ceil(dates.length / 7);
    const weekColumns: Date[][] = [];
    for (let col = 0; col < numColumns; col++) {
        weekColumns.push(dates.slice(col * 7, col * 7 + 7));
    }

    const weekDayNames =
        startingWeekDay === "mon"
            ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const labelIndices = startingWeekDay === "sun" ? [1, 3, 5] : [0, 2, 4];

    const monthPositions: { [key: number]: string } = {};
    weekColumns.forEach((week, colIndex) => {
        week.forEach((date) => {
            if (date.getDate() === 1) {
                monthPositions[colIndex] = date.toLocaleString("en-US", { month: "short" });
            }
        });
    });

    return (
        <div className={styles.wrapper}>
            <span className={styles.headline}>Your focus history</span>
            <div className={styles.container}>
                <div className={styles.monthLabelsWrapperStyle}>
                    <div className={styles.monthLabelsStyle}>
                        {weekColumns.map((_, colIndex) => (
                            <div key={colIndex} className={styles.monthLabelCellStyle}>
                                {monthPositions[colIndex] || ""}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.gridWrapperStyle}>
                    <div className={styles.weekLabelsStyle}>
                        {weekDayNames.map((dayName, rowIndex) => (
                            <div key={rowIndex} className={styles.weekLabelCellStyle}>
                                {labelIndices.includes(rowIndex) ? dayName : ""}
                            </div>
                        ))}
                    </div>

                    <div className={styles.commitGridStyle}>
                        {weekColumns.map((week, colIndex) => (
                            <div key={colIndex} className={styles.weekColumnStyle}>
                                {week.map((date) => {
                                    const key = formatDate(date);
                                    const dayData = dayMap.get(key);
                                    return <GridCell key={key} date={date} dayData={dayData} />;
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <Description text={'Completed :)'} color={'var(--green)'} />
                <Description text={'Partially Completed :|'} color={'var(--yellow)'} />
                <Description text={'Failed :('} color={'var(--red)'} />
                <Description text={'No Data'} color={'var(--border-color-4)'} />
            </div>

        </div>
    );
}