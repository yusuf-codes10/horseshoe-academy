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

// 1-on-1 relationship to respresent inheritance
export const teachers = pgTable('teachers', {
    id: bigserial('id', {mode: "number"}).primaryKey().references(() => users.id)
})

export const students = pgTable('students', {
    id: bigserial('id', {mode: "number"}).primaryKey().references(() => users.id)
})

export const admins = pgTable('admins', {
    id: bigserial('id', {mode: "number"}).primaryKey().references(() => users.id)
})