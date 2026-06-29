import {createFactory} from 'hono/factory';
import type {NewDepartment } from '@classroom/shared';
import { insertDepartmentSchema } from '@classroom/shared';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db/index';
import { departments } from '../db/schema';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

const factory = createFactory<{Variables: {department: NewDepartment}}>();

export const createNewDepartment = factory.createHandlers(
    zValidator("json", insertDepartmentSchema),
    async (c) => {
        // grab user data
        const body = c.req.valid('json');

        // check is the depratemnt is already in the databse
        try {
            const [duplicate] = await db.select()
            .from(departments)
            .where(eq(departments.code, body.code));

            if (!duplicate) throw new HTTPException(400, {message: 'Department already exists!'});
        } catch (error) {
            console.log(error);
            
        }

        return c.json({msg: 'departements'});
    }
);