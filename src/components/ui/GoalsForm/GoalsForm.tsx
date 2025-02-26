"use client";
import React, { useState } from "react";
import { redirect } from "next/navigation";
import styles from "./index.module.css";
import { FocusGoal, FocusField, Operator, AllowedFields } from "@/lib/focusUtils";

type GoalsFormProps = {
    initialGoals: FocusGoal[];
};

const GoalsForm = ({ initialGoals }: GoalsFormProps) => {
    const [goals, setGoals] = useState<FocusGoal[]>(initialGoals);
    const [showForm, setShowForm] = useState(initialGoals.length > 0);
    const [time, setTime] = useState("");
    const [operator, setOperator] = useState<Operator | "">("");
    const [availableField, setAvailableField] = useState<FocusField | "">("");

    const remainingOptions = AllowedFields.filter(
        (opt) => !goals.some((goal) => goal.field === opt)
    );

    const addGoal = () => {
        if (!time || !operator || !availableField) {
            alert("Please fill out all required fields");
            return;
        }
        if (goals.some((goal) => goal.field === availableField)) {
            alert(`Goal for ${availableField} already added`);
            return;
        }
        const newGoal: FocusGoal = {
            id: crypto.randomUUID(),
            time: parseInt(time),
            operator: operator as Operator,
            field: availableField as FocusField,
        };
        setGoals([...goals, newGoal]);
        setTime("");
        setOperator("");
        setAvailableField("");
    };

    const deleteGoal = (index: number) => {
        const updatedGoals = goals.filter((_, i) => i !== index);
        setGoals(updatedGoals);
    };

    const handleNext = async () => {
        const res = await fetch("/api/focus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ goals }),
        });
        if (res.ok) {
            redirect("/app");
        } else {
            alert("Failed to save goals");
        }
    };

    return (
        <div className={styles.container}>
            <h2>Set Your Goals</h2>
            {remainingOptions.length === 0 ? (
                <p>Youve set all available goals!</p>
            ) : !showForm ? (
                <button onClick={() => setShowForm(true)}>Add Goal</button>
            ) : (
                <div style={{ marginTop: "10px" }}>
                    <label>
                        I want to spend{" "}
                        <input
                            type="number"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            style={{ width: "60px", margin: "0 5px" }}
                        />{" "}
                        hours
                    </label>
                    <select
                        value={operator}
                        onChange={(e) => setOperator(e.target.value as Operator)}
                        required
                        style={{ margin: "0 5px" }}
                    >
                        <option value="" disabled>
                            Select operator
                        </option>
                        <option value="LESS_THAN">&lt;</option>
                        <option value="GREATER_THAN">&gt;</option>
                        <option value="EQUALS">=</option>
                    </select>
                    doing{" "}
                    <select
                        value={availableField}
                        onChange={(e) => setAvailableField(e.target.value as FocusField)}
                        required
                        style={{ margin: "0 5px" }}
                    >
                        <option value="" disabled>
                            Select field
                        </option>
                        {remainingOptions.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                    <button onClick={addGoal} style={{ marginLeft: "10px" }}>
                        Add Goal
                    </button>
                </div>
            )}
            {/* List added goals */}
            {goals.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Your Goals:</h3>
                    {goals.map((goal, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                margin: "10px 0",
                            }}
                        >
                            <span>
                                I want to spend {goal.time} hours{" "}
                                {goal.operator === "LESS_THAN"
                                    ? "<"
                                    : goal.operator === "GREATER_THAN"
                                        ? ">"
                                        : "="}{" "}
                                doing {goal.field}
                            </span>
                            <button
                                onClick={() => deleteGoal(index)}
                                style={{ marginLeft: "10px" }}
                            >
                                Delete Goal
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {goals.length > 0 && (
                <button onClick={handleNext} style={{ marginTop: "20px" }}>
                    Next
                </button>
            )}
        </div>
    );
};

export default GoalsForm;