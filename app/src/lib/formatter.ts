export function formatDateToWords(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
        throw new Error('Invalid date input');
    }

    const hasTime =
        dateInput instanceof Date ||
        (typeof dateInput === 'string' && /T\d{2}:\d{2}/.test(dateInput));

    const options: Intl.DateTimeFormatOptions = hasTime
        ? {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short',
        }
        : {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function formatToPeso(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatTimestamptzToWords(dateString: string): string {
    const date = new Date(dateString);

    // Check if valid date
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
    }

    // Format to "Month Day, Year"
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }

    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long", // full month name
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true, // 12-hour format with AM/PM
    });
}
