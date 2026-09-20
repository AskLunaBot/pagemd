/* oxlint-disable promise/avoid-new -- Web-compatible delay without node:timers. */

export async function sleep(ms: number): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
