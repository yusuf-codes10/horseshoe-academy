import { createFactory } from "hono/factory";
import type {NewEnrollement} from '@classroom/shared';

const factory = createFactory<{Variables: {enrollement: NewEnrollement}}>();

// a transcation POST query
export const acceptApplications = factory.createHandlers(
    (c) => {
        return c.json({msg: 'accept applications'});
    }
);