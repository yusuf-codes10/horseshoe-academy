import {createFactory} from 'hono/factory';
import type {NewDepartment } from '@classroom/shared';
import { insertDepartmentSchema } from '@classroom/shared';
import { zValidator } from '@hono/zod-validator';

const factory = createFactory<{Variables: {department: NewDepartment}}>();

export const createNewDepartment = factory.createHandlers(
    // zValidator("json", insertDepartmentSchema),
    (c) => {
        // grab user data
        // const 

        return c.json({msg: 'departements'});
    }
);