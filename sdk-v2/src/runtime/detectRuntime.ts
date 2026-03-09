import { Runtime } from "../types";

export function detectRuntime(): Runtime {
  if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    return "browser";
  }
  return "node";
}
