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
    "PROGRAMMING",
    "SELF_EDUCATION"
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

export const fieldMap = {
    "SLEEP": 'sleep',
    "SOCIAL_NETWORKS": 'social networks',
    "WORK": 'work',
    "STUDY": 'study',
    "EXERCISE": 'exercise',
    "OTHER": 'other',
    "ENTERTAINMENT": 'entertainment',
    "MEAL": 'meal',
    "RELAXATION": 'relaxation',
    "HOBBIES": 'hobbies',
    "FAMILY_TIME": 'family time',
    "TRAVEL": 'travel',
    "SHOPPING": 'shopping',
    "MEDITATION": 'meditation',
    "GAMING": 'gaming',
    "CHORES": 'chores',
    "HEALTHCARE": 'healthcare',
    "READING": 'reading',
    "PLANNING": 'planning',
    "COMMUNITY_SERVICE": 'community service',
    "OUTDOOR_ACTIVITY": 'outdoor activity',
    "PROGRAMMING": 'programming',
    "SELF_EDUCATION": 'self eduction',
};