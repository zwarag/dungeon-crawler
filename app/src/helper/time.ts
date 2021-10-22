export type TimeInSeconds = number;
export type TimeInMilliseconds = number;
export function millisecondsToSeconds(
  seconds: TimeInSeconds
): TimeInMilliseconds {
  return seconds * 0.001;
}

export function millisToHoursMinutesAndSeconds(millis: number) {
  return (
    Math.floor(millis / (1000 * 60 * 60)) +
    ":" +
    (Math.floor(millis / (1000 * 60)) % 60) +
    ":" +
    (Math.floor(millis / 1000) % 60)
  );
}
