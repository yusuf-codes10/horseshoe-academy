import { createFactory } from "hono/factory";
import type { NewUser, NewStudent, NewTeacher } from '@classroom/shared';

const factory = createFactory<{Variables: {user: NewUser & NewStudent | NewUser & NewTeacher}}>();

export default factory;