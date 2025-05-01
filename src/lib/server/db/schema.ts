import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// User table (one)
export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull()
});

// Task table (many)
export const task = sqliteTable('task', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	duedate: text('duedate').notNull(),
	status: text('status').notNull().default('todo'), // default status is pending
	user_id: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }) // each task belongs to one user
});