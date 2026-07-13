/** Resolve after `ms` milliseconds — used to simulate network latency in mock services. */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
