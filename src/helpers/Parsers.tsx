import { monthNames } from "./static/data";

export function parseDate(dateString: string) {
    const dateParts = dateString.split("-");
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);
    const day = Number(dateParts[2]);

    // Create a new Date object from the parsed parts
    const date = new Date(year, month - 1, day);
    // Get the abbreviated month name
    const abbreviatedMonth = monthNames[date.getMonth()];
    return `${abbreviatedMonth} ${day}, ${year}`;
};