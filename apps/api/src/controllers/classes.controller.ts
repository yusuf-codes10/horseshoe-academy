import { createFactory } from "hono/factory";
import type {NewClass} from '@classroom/shared';
import { insertClassSchema } from '@classroom/shared';
import { zValidator } from "@hono/zod-validator";

const factory = createFactory<{Variables: {class: NewClass}}>();

// create a class
export const createClass = factory.createHandlers(
    zValidator('json', insertClassSchema),
    async (c) => {
        
    }
);