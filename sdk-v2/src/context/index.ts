import { detectRuntime } from "../runtime/detectRuntime";
import * as browserContext from "./browserContext";
import * as nodeContext from "./nodeContext";

const runtime = detectRuntime();

const context =
  runtime === "node" ? nodeContext : browserContext;

export const runWithContext = context.runWithContext;
export const pushSpan = context.pushSpan;
export const popSpan = context.popSpan;
export const getCurrentSpan = context.getCurrentSpan;
