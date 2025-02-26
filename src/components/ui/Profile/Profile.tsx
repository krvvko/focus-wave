"use client";
import React, { useState } from "react";
import styles from "./index.module.css";
import {Day, Focus, User} from "@prisma/client";

export type UserWithRelations = User & {
    focus_on: Focus[];
    days_logs: Day[];
};

interface ProfileProps {
    initialUser: UserWithRelations;
}


const Profile: React.FC<ProfileProps> = ({ initialUser }) => {
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);
    const [goalInput, setGoalInput] = useState(user.goal || "");

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const res = await fetch("/api/update-goal", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ goal: goalInput }),
            });
            if (!res.ok) {
                alert("Failed to update goal");
            }
            const updatedUser = await res.json();
            setUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating goal:", error);
        }
    };
    return (
        <div className={styles.container}>
            <h1>Profile Info</h1>
            <p>
                <strong>Name:</strong> {user.name || "N/A"}
            </p>
            <p>
                <strong>Email:</strong> {user.email || "N/A"}
            </p>
            {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            })}
            <div>
                <h2>Goal</h2>
                {isEditing ? (
                    <div>
                        <input
                            type="text"
                            value={goalInput}
                            onChange={(e) => setGoalInput(e.target.value)}
                            placeholder="Enter your goal"
                        />
                        <button onClick={handleSaveClick}>Save</button>
                    </div>
                ) : (
                    <div>
                        <span>{user.goal ? user.goal : "Goal is not specified"}</span>
                        <button onClick={handleEditClick}>
                            {user.goal ? "Edit" : "Set Goal"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;