import  { createFactory } from 'hono/factory';
import type { NewUser } from '@classroom/shared';

export const factory = createFactory<{Variables: {user: NewUser}}>();

export const registerUser = () => {

}