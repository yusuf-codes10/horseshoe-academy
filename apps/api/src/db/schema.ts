// the database schema is going to be here
import {bigserial, pgTable, text, timestamp} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: bigserial('id', {mode: "number"}).primaryKey(),
    username: text('username').unique().notNull(),
    email: text('email').unique().notNull(),
    fullName: text('fullName'),
    createdAt: timestamp('createdAt').defaultNow()
})