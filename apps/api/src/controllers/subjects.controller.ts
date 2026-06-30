import { createFactory } from "hono/factory";
import type { NewSubject } from '@classroom/shared';
import { zValidator } from "@hono/zod-validator";
import { insertSubjectSchema } from '@classroom/shared';

const factory = createFactory<{Variables: {subject: NewSubject}}>();

export const createSubjectForDepartment = factory.createHandlers(
    // zValidator('json', insertSubjectSchema),
    (c) => {
        // grab the dep is
        const depId = c.req.param('id');
        console.log(depId);
        return c.json({msg: 'The dep is...', depId});
    }
);