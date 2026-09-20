import type { SwitchState } from "@/types/options.ts";

export function isSwitchOn(
  state: SwitchState | undefined,
  fallback: SwitchState,
): boolean {
  if (state === undefined) {
    return fallback === "on";
  }
  return state === "on";
}
