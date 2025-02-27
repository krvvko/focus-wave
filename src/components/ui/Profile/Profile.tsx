"use client";
import React, { useState } from "react";
import styles from "./index.module.css";
import { Day, Focus, User } from "@prisma/client";
import Streak from "@/components/ui/Profile/Streak/Streak";
import HoursOfFocused from "@/components/ui/Profile/HoursOfFocused/HoursOfFocused";
import Goal from "@/components/ui/Profile/Goal/Goal";
import { FunnyGhostSolid } from "@mynaui/icons-react";

export type UserWithRelations = User & {
    focus_on: Focus[];
    days_logs: Day[];
};

interface ProfileProps {
    initialUser: UserWithRelations;
}

const Profile: React.FC<ProfileProps> = ({ initialUser }) => {
    const [user, setUser] = useState(initialUser);

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <FunnyGhostSolid size={64} fill={"var(--color-1)"} />
                <div className={styles.infoText}>
                    <span>{user.name || "N/A"}</span>
                    <span>{user.email || "N/A"}</span>
                </div>
            </div>

            <div className={styles.stats}>
                <Streak day_logs={user.days_logs} />
                <HoursOfFocused focus_on={user.focus_on} day_logs={user.days_logs} />
            </div>
            <Goal goal={user.goal} onGoalUpdated={setUser} />
        </div>
    );
};

export default Profile;
