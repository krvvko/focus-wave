"use client";
import React from "react";
import { FocusGoal, fieldMap } from "@/lib/focusUtils";
import styles from './index.module.css';

type ItemProps = {
    goal: FocusGoal;
    onDelete: (goalId: string) => void;
};

const Item = ({ goal, onDelete }: ItemProps) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
            }}
        >
      <span>
        I want to spend {goal.time} hours{" "}
          {goal.operator === "LESS_THAN"
              ? "less"
              : goal.operator === "GREATER_THAN"
                  ? "more"
                  : "="}{" "}
          doing {fieldMap[goal.field]}
      </span>
            <button onClick={() => onDelete(goal.id)}>
                Delete Goal
            </button>
        </div>
    );
};

export default Item;
