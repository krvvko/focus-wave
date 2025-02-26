"use client";

import React, { useState, useEffect } from "react";
import { FocusGoal, DayLog, mapFieldToKey } from "@/lib/focusUtils";

function computeStatus(
    goal: FocusGoal,
    loggedValue?: number | null
): "unknown" | "completed" | "failed" {
    if (loggedValue === null || loggedValue === undefined) return "unknown";
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
    return condition ? "completed" : "failed";
}

const TodaysGoals: React.FC = () => {
    const [dayLog, setDayLog] = useState<DayLog | null>(null);
    const [focusItems, setFocusItems] = useState<FocusGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [dayRes, focusRes] = await Promise.all([
                fetch("/api/day"),
                fetch("/api/focus"),
            ]);
            const dayData = await dayRes.json();
            const focusData = await focusRes.json();
            setDayLog(dayData.dayLog);
            setFocusItems(focusData.focusItems || []);
        } catch (err) {
            console.error("Error fetching today's goals", err);
            setError("Failed to fetch today's goals.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        fetchData();
    };

    if (error) return <div>{error}</div>;

    const goalsDisplay = focusItems.map((goal) => {
        const key = mapFieldToKey(goal.field);
        const loggedValue = dayLog ? dayLog[key] : undefined;
        const status = computeStatus(goal, loggedValue);
        return {
            field: goal.field,
            status,
            loggedValue,
            target: goal.time,
        };
    });

    return (
        <div>
            <h2>Todays Goals</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {goalsDisplay.map((g, index) => (
                    <li key={index} style={{ marginBottom: "8px" }}>
                        <strong>{g.field}:</strong> {g.status}
                        {g.status !== "unknown" && (
                            <span>
                                {" "}({g.loggedValue} / {g.target})
                            </span>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={handleRefresh}>Refresh Data</button>
        </div>
    );
};

export default TodaysGoals;