"use client";
import React from "react";
import {FocusGoal, fieldMap} from "@/lib/focusUtils";
import styles from './index.module.css';

type ItemProps = {
    goal: FocusGoal;
    onDelete: (goalId: string) => void;
};

const Item = ({goal, onDelete}: ItemProps) => {
    const { id, time, operator, field } = goal;

    const operatorText = {
        LESS_THAN: "less",
        GREATER_THAN: "more",
        EQUALS: "=",
    }[operator];

    return (
        <div className={styles.container}>
            <span className={styles.text}>
                I want to spend
                <span className={styles.mark}>{time}</span>
                hours
                <span className={styles.mark}>{operatorText} </span>
                doing
                <span className={styles.mark}>{fieldMap[field]}</span>
            </span>
            <button
                className={styles.delete}
                onClick={() => onDelete(id)}
                aria-label="Delete goal"
            >
                Delete Goal
            </button>
        </div>
    );
};

export default Item;
