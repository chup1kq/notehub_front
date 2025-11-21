export function convertDurationToTime(duration){
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

export function convertTimeToDuration(timeString){
    if (timeString){
        const [hours, minutes] = timeString.split(':').map(Number);
        return `PT${hours}H${minutes}M`; // Формат ISO-8601 для Duration
    }
    return null;
}
