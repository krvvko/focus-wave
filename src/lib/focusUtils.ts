export const AllowedFields = [
    "SLEEP",
    "SOCIAL_NETWORKS",
    "WORK",
    "STUDY",
    "EXERCISE",
    "OTHER",
    "ENTERTAINMENT",
    "MEAL",
    "RELAXATION",
    "HOBBIES",
    "FAMILY_TIME",
    "TRAVEL",
    "SHOPPING",
    "MEDITATION",
    "GAMING",
    "CHORES",
    "HEALTHCARE",
    "READING",
    "PLANNING",
    "COMMUNITY_SERVICE",
    "OUTDOOR_ACTIVITY",
] as const;

export type FocusField = typeof AllowedFields[number];

export type Operator = "LESS_THAN" | "GREATER_THAN" | "EQUALS";

export interface FocusGoal {
    id: string;
    field: FocusField;
    operator: Operator;
    time: number;
}

export interface DayLog {
    [key: string]: number | null | undefined;
}

export const mapFieldToKey = (field: FocusField): string => field.toLowerCase();
