import { createFactory } from "hono/factory";
import type { NewSession } from '@classroom/shared';
import { zValidator } from "@hono/zod-validator";
import { insertSessionSchema } from '@classroom/shared';
import { db } from '../db/index';
import { classes } from "../db/schema";
import { eq } from 'drizzle-orm';
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{Variables: {session: NewSession}}>();

export const createSession = factory.createHandlers(
    zValidator('json', insertSessionSchema),
    async (c) => {
        // grab the class id
        const classId = Number(c.req.param('classId'));

        try {
            const [foundClass] = await db.select()
            .from(classes)
            .where(eq(classes.id, classId));

            if (!foundClass) throw new HTTPException(404, {message: 'class does not exist!'});

            // now create the session


        } catch (error) {
            console.log(error);
        }

    }
)