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
  return (
    (Math.floor(Math.floor(sec) / 3600) % 60) +
    ':' +
    (Math.floor(Math.floor(sec) / 60) % 60) +
    ':' +
    (Math.floor(sec) % 60)
  );
}
