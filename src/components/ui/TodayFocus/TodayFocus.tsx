import React from "react";
import {fieldMap, FocusGoal, mapFieldToKey} from "@/lib/focusUtils";
import {Focus, Day} from "@prisma/client";
import {getTodayMidnight} from "@/lib/date.server";
import styles from './index.module.css';

function computeStatus(
    goal: FocusGoal,
    loggedValue?: number | null
): ["Unknown", string] | ["Completed", string] | ["Not Completed", string] {
    if (loggedValue === null || loggedValue === undefined) return ["Unknown", 'var(--color-4)'];
    let condition = false;
    switch (goal.operator) {
        case "GREATER_THAN":
            condition = loggedValue >= goal.time;
            break;
        case "LESS_THAN":
            condition = loggedValue < goal.time;
            break;
        case "EQUALS":
            condition = loggedValue === goal.time;
            break;
        default:
            condition = false;
    }
    return condition ? ["Completed", 'var(--green)'] : ["Not Completed", 'var(--red)'];
}

const TodayFocus = ({days_logs, focus_on}: {days_logs: Day[], focus_on: Focus[]}) => {
    const today = getTodayMidnight();
    const todayLog: Day | undefined = days_logs.find(log => new Date(log.day).getTime() === today.getTime());

    const goalsDisplay = focus_on.map((goal) => {
        const key = mapFieldToKey(goal.field);
        // @ts-ignore
        const loggedValue = todayLog ? todayLog[key] : undefined;
        const status = computeStatus(goal, loggedValue);
        return {
            field: goal.field,
            status,
            loggedValue,
            target: goal.time,
        };
    });

    return (
        <div className={styles.container}>
            <span className={styles.headline}>Today's Goals</span>
            <div className={styles.list}>
                {goalsDisplay.map((g, index) => (
                    <div key={index} className={styles.item}>
                        <span className={styles.field}>{fieldMap[g.field]}:</span>
                        <span className={styles.status} style={{color: g.status[1]}}>{g.status[0]}</span>
                        {g.status[0] !== "Unknown" && (<span className={styles.stats}>- {g.loggedValue}h/{g.target}h</span>)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodayFocus;