"use client";
import React from "react";
import { FocusGoal } from "@/lib/focusUtils";
import Item from "@/components/ui/GoalsForm/Item/Item";
import styles from './index.module.css';

type GoalsListProps = {
    goals: FocusGoal[];
    onDelete: (goalId: string) => void;
};

const List = ({ goals, onDelete }: GoalsListProps) => {
    if (goals.length === 0) {
        return <div>No goals yet</div>;
    }
    return (
        <div>
            <h3>Your Goals:</h3>
            {goals.map((goal) => (
                <Item key={goal.id} goal={goal} onDelete={onDelete} />
            ))}
        </div>
    );
};

export default List;
