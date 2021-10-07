export type TimeInSeconds = number;
export type TimeInMilliseconds = number;
export function millisecondsToSeconds(
  seconds: TimeInSeconds
): TimeInMilliseconds {
  return seconds * 0.001;
}
