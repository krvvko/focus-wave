"use client";
import React, { useState } from "react";
import { redirect } from "next/navigation";
import styles from "./index.module.css";
import {
    FocusGoal,
    AllowedFields,
} from "@/lib/focusUtils";
import Form from "./Form/Form";
import List from "./List/List";
import { v4 as uuidv4 } from 'uuid';

type GoalsFormProps = {
    initialGoals: FocusGoal[];
};

const GoalsForm = ({ initialGoals }: GoalsFormProps) => {
    const [goals, setGoals] = useState<FocusGoal[]>(initialGoals);
    const [showForm, setShowForm] = useState(false);

    const remainingOptions = AllowedFields.filter(
        (opt) => !goals.some((goal) => goal.field === opt)
    );

    const addGoal = (newGoal: Omit<FocusGoal, "id">) => {
        const goalWithId: FocusGoal = {
            id: uuidv4(),
            ...newGoal,
        };
        setGoals((prev) => [...prev, goalWithId]);
        setShowForm(false);
    };

    const deleteGoal = (goalId: string) => {
        setGoals(goals.filter((goal) => goal.id !== goalId));
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
            <div className={styles.top}>
                <h2>Set Your Goals</h2>
                {remainingOptions.length === 0 ? (
                    <button disabled className={styles.add}>
                        All goals are set
                    </button>
                ) : (
                    <button className={styles.add} onClick={() => setShowForm(true)}>
                        Add Goal
                    </button>
                )}
            </div>

            {showForm && (
                <Form
                    availableFields={remainingOptions}
                    onAddGoal={addGoal}
                    onCancel={() => setShowForm(false)}
                />
            )}
            <List goals={goals} onDelete={deleteGoal} />

            {goals.length > 0 && (
                <button className={styles.save} onClick={handleNext}>
                    Save Goals
                </button>
            )}
        </div>
    );
};

export default GoalsForm;