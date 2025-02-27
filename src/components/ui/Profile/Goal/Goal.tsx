"use client";
import React, { useState } from "react";
import styles from "./index.module.css";
import { Pencil } from "@mynaui/icons-react";

interface GoalProps {
    goal: string | null;
    onGoalUpdated: any;
}

const Goal: React.FC<GoalProps> = ({ goal, onGoalUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [goalInput, setGoalInput] = useState(goal || "");

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const res = await fetch("/api/update-goal", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ goal: goalInput }),
            });
            if (!res.ok) {
                alert("Failed to update goal");
                return;
            }
            const updatedUser = await res.json();
            onGoalUpdated(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating goal:", error);
        }
    };

    return (
        <div className={styles.goal}>
            <div className={styles.small}><div className={styles.box}></div> your goal</div>
            <div className={styles.goalWrapper}>
                {isEditing ? (
                    <>
                        <input
                            className={styles.goalText}
                            type="text"
                            value={goalInput}
                            onChange={(e) => setGoalInput(e.target.value)}
                            placeholder="Enter your goal"
                        />
                        <button onClick={handleSaveClick} className={styles.button}>Save</button>
                    </>
                ) : (
                    <>
                        <span className={styles.goalText}>{goal ? goal : "Goal is not specified"}</span>
                        {goal ?
                            <button onClick={handleEditClick} className={styles.edit}>
                                <Pencil size={16} />
                            </button>
                            :
                            <button onClick={handleEditClick} className={styles.button}>
                                Set Goal
                            </button>
                        }
                    </>
                )}
            </div>

        </div>
    );
};

export default Goal;
