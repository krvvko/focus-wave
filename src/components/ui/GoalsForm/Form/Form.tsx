"use client";
import React, { useState } from "react";
import { FocusGoal, FocusField, Operator, fieldMap } from "@/lib/focusUtils";
import styles from './index.module.css';

type FormProps = {
    availableFields: FocusField[];
    onAddGoal: (goal: Omit<FocusGoal, "id">) => void;
    onCancel: () => void;
};

const Form = ({ availableFields, onAddGoal, onCancel }: FormProps) => {
    const [time, setTime] = useState("");
    const [operator, setOperator] = useState<Operator | "">("");
    const [selectedField, setSelectedField] = useState<FocusField | "">("");

    const handleAdd = () => {
        if (!time || !operator || !selectedField) {
            alert("Please fill out all required fields");
            return;
        }
        onAddGoal({
            time: parseInt(time),
            operator: operator as Operator,
            field: selectedField as FocusField,
        });
        setTime("");
        setOperator("");
        setSelectedField("");
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <label>
                    I want to spend{" "}
                    <input
                        type="number"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        max={24}
                        className={styles.input + " " + styles.inN}
                    />{" "}
                    hour(s)
                </label>
                <select
                    className={styles.input + ' ' + styles.inOp}
                    value={operator}
                    onChange={(e) => setOperator(e.target.value as Operator)}
                    required
                >
                    <option value="" disabled>
                        Select
                    </option>
                    <option value="LESS_THAN">less</option>
                    <option value="GREATER_THAN">more</option>
                </select>
                doing{" "}
                <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value as FocusField)}
                    required
                    className={styles.input}
                >
                    <option value="" disabled>
                        Select
                    </option>
                    {availableFields.map((opt) => (
                        <option key={opt} value={opt}>
                            {fieldMap[opt]}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.buttons}>
                <button onClick={onCancel} className={styles.cancel}>
                    Cancel
                </button>
                <button onClick={handleAdd} className={styles.add}>
                    Add
                </button>
            </div>
        </div>
    );
};

export default Form;