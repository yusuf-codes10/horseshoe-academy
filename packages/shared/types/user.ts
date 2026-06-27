import { users } from '../../../apps/api/src/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

// Base infered types
type User = InferSelectModel<typeof users>;


export type { User };
