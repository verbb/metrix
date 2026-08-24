function pad(num, size) {
    return (`000${num}`).slice(size * -1);
}

export function durationFormat(duration) {
    const hours = Math.floor(duration / 60 / 60);
    const minutes = Math.floor(duration / 60) % 60;
    const seconds = Math.floor(duration - (minutes * 60) - (hours * 60 * 60));

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    if (minutes > 0) {
        return `${minutes}m ${pad(seconds, 2)}s`;
    }

    return `${seconds}s`;
}
