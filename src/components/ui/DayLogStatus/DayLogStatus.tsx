import { mapFieldToKey } from "@/lib/focusUtils";
import { Day, Focus } from "@prisma/client";
import { getTodayMidnight } from "@/lib/date.server";
import Link from "next/link";
import styles from "./index.module.css";

export default function DayLogStatus({ days_logs, focus_on }: { days_logs: Day[]; focus_on: Focus[] }) {
    const today = getTodayMidnight();
    const todayLog = days_logs.find((log) => new Date(log.day).getTime() === today.getTime());

    const missingFields = focus_on.filter((item: Focus) => {
        const key = mapFieldToKey(item.field);
        return !todayLog || todayLog[key as keyof Day] === null || todayLog[key as keyof Day] === undefined;
    });

    let message = "";
    let buttonLabel = "";
    let linkHref = "";

    if (missingFields.length === 0) {
        message = "You filled all today's goals!";
        buttonLabel = "Edit";
        const todayStr = new Date().toISOString().split("T")[0];
        linkHref = `/day/${todayStr}`;
    } else if (missingFields.length === focus_on.length) {
        message = "You didn't fill today's goals!";
        buttonLabel = "Fill";
        linkHref = "/day/today";
    } else {
        message = "Continue filling today's goals!";
        buttonLabel = "Continue";
        linkHref = "/day/today";
    }

    return (
        <div className={styles.container}>
            <span className={styles.message}>{message}</span>
            <Link href={linkHref} className={styles.button}>
                {buttonLabel}
            </Link>
        </div>
    );
}