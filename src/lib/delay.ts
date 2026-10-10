/** Resolve immediately — no artificial latency delay. */
export const delay = (_ms?: number) => Promise.resolve();
