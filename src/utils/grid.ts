export const formatDate = (date: Date): string => date.toISOString().split("T")[0];

export const getGridDates = (today: Date, startingWeekDay: "mon" | "sun" = "sun"): Date[] => {
    const jsDay = today.getDay();
    const todayIndex = startingWeekDay === "mon" ? (jsDay === 0 ? 6 : jsDay - 1) : jsDay;
    const lastWeekCount = todayIndex + 1;
    const fullWeeks = 20;
    const totalCells = fullWeeks * 7 + lastWeekCount;

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (totalCells - 1));

    const dates: Date[] = [];
    for (let i = 0; i < totalCells; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        dates.push(d);
    }
    return dates;
};
