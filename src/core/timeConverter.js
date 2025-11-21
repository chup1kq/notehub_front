export function convertDurationToDateTime(durationSeconds) {
    const now = new Date();
    const target = new Date(now.getTime() + durationSeconds * 1000);

    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, "0");
    const day = String(target.getDate()).padStart(2, "0");
    const hours = String(target.getHours()).padStart(2, "0");
    const minutes = String(target.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}


export function convertDateTimeToDuration(dateTimeString) {
    if (!dateTimeString) return null;

    const now = new Date();
    const target = new Date(dateTimeString);

    const diffMs = target - now;

    if (diffMs <= 0) return null;

    const totalMinutes = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `PT${hours}H${minutes}M`;
}
