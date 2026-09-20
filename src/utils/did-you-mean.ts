import { levenshtein } from "./levenshtein.ts";

export function didYouMean(
  input: string,
  allowed: string[],
): string | undefined {
  let best: string | undefined;
  let distance = 3;
  for (const candidate of allowed) {
    const current = levenshtein(input, candidate);
    if (current < distance && current > 0) {
      best = candidate;
      distance = current;
    }
  }
  return best;
}
