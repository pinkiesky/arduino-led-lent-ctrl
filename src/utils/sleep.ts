export function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function timeout(ms: number, msg?: string) {
  await sleep(ms);
  throw new Error(msg || 'Timeout');
}

export function withTimeout<T>(
  p: Promise<T>,
  timeoutMs: number,
  msg?: string,
): Promise<T> {
  return Promise.race([p, timeout(timeoutMs, msg)]) as any;
}
