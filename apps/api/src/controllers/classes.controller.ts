import { createFactory } from "hono/factory";
import type {NewClass} from '@classroom/shared';

const factory = createFactory<{Variables: {class: NewClass}}>();

// create a class
export const createClass = factory.createHandlers();