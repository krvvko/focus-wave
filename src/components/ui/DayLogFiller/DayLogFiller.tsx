"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mapFieldToKey } from "@/lib/focusUtils";
import {Focus} from "@prisma/client"; // ensure this export exists

export default function DayLogFiller() {
    const [dayLog, setDayLog] = useState(null);
    const [focusItems, setFocusItems] = useState([]);
    const [missingFields, setMissingFields] = useState<Focus[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
            const missing = focusItems.filter((item: Focus) => {
                const key = mapFieldToKey(item.field);
                return !dayLog || dayLog[key] === null || dayLog[key] === undefined;
            });
            setMissingFields(missing);
        }
    }, [dayLog, focusItems, loading]);

    const handleNextPrompt = async () => {
        if (!inputValue) return alert("Please enter a value");

        const currentFocus: Focus = missingFields[0];
        const logUpdate = {
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

    if (missingFields.length === 0) {
        // Everything is filled – offer a button to go back to the app.
        return (
            <div>
                <p>All filled.</p>
                <button onClick={() => router.push("/app")}>Back to App</button>
            </div>
        );
    }

    return (
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
    );
}