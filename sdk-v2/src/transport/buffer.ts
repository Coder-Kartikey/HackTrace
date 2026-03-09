import { TraceEvent } from "../types";

let buffer: TraceEvent[] = [];
const MAX_BUFFER_SIZE = 1000;


export function addToBuffer(event: TraceEvent) {
  if (buffer.length >= MAX_BUFFER_SIZE) {
    // Drop oldest event
    buffer.shift();
    console.warn("HackTrace: Buffer full. Dropping oldest event.");
  }
  
  buffer.push(event);
}

export function getBuffer(): TraceEvent[] {
  return buffer;
}

export function clearBuffer() {
  buffer = [];
}