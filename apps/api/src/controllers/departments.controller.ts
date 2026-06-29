import {createFactory} from 'hono/factory';
import type {NewDepartment } from '@classroom/shared';

const factory = createFactory<{Variables: {department: NewDepartment}}>();

export const createNewDepartment = factory.createHandlers();