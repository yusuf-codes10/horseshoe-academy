// sse/index.ts
import type { SSEStreamingApi } from 'hono/streaming';

export const activeConnections = new Map<number, SSEStreamingApi>();