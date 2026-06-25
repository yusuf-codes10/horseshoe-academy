// the database schema is going to be here
import {bigserial, pgTable, text, timestamp, pgEnum} from 'drizzle-orm/pg-core';

const roleEnum = pgEnum('role', ['admin', 'teacher', 'student']);

export const users = pgTable('users', {
    id: bigserial('id', {mode: "number"}).primaryKey(),
    username: text('username').unique().notNull(),
    email: text('email').unique().notNull(),
    fullName: text('fullName'),
    role: roleEnum('role'),
    createdAt: timestamp('createdAt').defaultNow()
})