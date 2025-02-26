"use client";

import { useState, useEffect } from "react";
import { FocusField, mapFieldToKey } from "@/lib/focusUtils";

type FocusItem = {
    id: string;
    field: FocusField;
};

type LogResponse = {
    field: FocusField;
    time: number;
};

type DayLog = {
    [key: string]: any;
};

export default function DayLogFiller() {
    const [dayLog, setDayLog] = useState<DayLog | null>(null);
    const [focusItems, setFocusItems] = useState<FocusItem[]>([]);
    const [missingFields, setMissingFields] = useState<FocusItem[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [dayRes, focusRes] = await Promise.all([
                    fetch("/api/day"),
                    fetch("/api/focus"),
                ]);
                const dayData = await dayRes.json();
                const focusData = await focusRes.json();
                setFocusItems(focusData.focusItems || []);
                setDayLog(dayData.dayLog || {});
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading) {
            const missing = focusItems.filter((item) => {
                if (!dayLog) return true;
                const key = mapFieldToKey(item.field);
                return dayLog[key] === null || dayLog[key] === undefined;
            });
            setMissingFields(missing);
        }
    }, [dayLog, focusItems, loading]);

    const handleNextPrompt = async () => {
        if (!inputValue) return alert("Please enter a value");

        const currentFocus = missingFields[0];
        const logUpdate: LogResponse = {
            field: currentFocus.field,
            time: parseFloat(inputValue),
        };

        try {
            const res = await fetch("/api/day", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ logs: [logUpdate] }),
            });
            if (res.ok) {
                const updated = await res.json();
                setDayLog(updated.dayLog);
                setInputValue("");
            } else {
                alert("Error saving day log");
            }
        } catch (error) {
            console.error("Error saving day log", error);
            alert("Error saving day log");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            {missingFields.length > 0 ? (
                <div>
                    <p>Please complete the missing field: {missingFields[0].field}</p>
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                    />
                    <button onClick={handleNextPrompt}>Next</button>
                </div>
            ) : (
                <p>All goals filled.</p>
            )}
        </div>
    );
}
