export const splitDateTime = (isoString) => {
    if (!isoString) return { date: "", time: "" };

    const dateObj = new Date(isoString);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
    };
};
