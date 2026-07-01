import { createFactory } from "hono/factory";
import type { NewApplication } from '@classroom/shared';

const factory = createFactory<{Variables: {application: NewApplication}}>();