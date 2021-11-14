export type TimeInSeconds = number;
export type TimeInMilliseconds = number;
export type TimeInHoursMinutesSeconds = string;

export function millisecondsToSeconds(
  seconds: TimeInSeconds
): TimeInMilliseconds {
  return seconds * 0.001;
}

export function milliToHMS(
  millis: TimeInMilliseconds
): TimeInHoursMinutesSeconds {
  return (
    Math.floor(millis / (1000 * 60 * 60)) +
    ':' +
    (Math.floor(millis / (1000 * 60)) % 60) +
    ':' +
    (Math.floor(millis / 1000) % 60)
  );
}

export function secToHMS(sec: TimeInSeconds): TimeInHoursMinutesSeconds {
  return new Date(sec * 1000).toISOString().substr(11, 8);
}
