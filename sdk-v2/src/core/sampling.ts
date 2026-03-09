import { getState } from "../state";

export function shouldSample(): boolean {
  const { config } = getState();

  if (config.sampleRate >= 1) return true;
  if (config.sampleRate <= 0) return false;

  return Math.random() < config.sampleRate;
}
