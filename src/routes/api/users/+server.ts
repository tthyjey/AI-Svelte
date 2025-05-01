import { db } from '$lib/server/db';
import { user, task } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const result = await db
		.select({
			userId: user.id,
			userName: user.name,
			userEmail: user.email,
			taskId: task.id,
			taskTitle: task.title,
			taskDescription: task.description,
			taskDueDate: task.duedate
		})
		.from(user)
		.leftJoin(task, eq(user.id, task.user_id));

	// Group tasks by user
	const userMap = new Map<number, { id: number; name: string; email: string; tasks: any[] }>();

	for (const row of result) {
		if (!userMap.has(row.userId)) {
			userMap.set(row.userId, {
				id: row.userId,
				name: row.userName,
				email: row.userEmail,
				tasks: []
			});
		}

		if (row.taskId) {
			userMap.get(row.userId)?.tasks.push({
				id: row.taskId,
				title: row.taskTitle,
				description: row.taskDescription,
				duedate: row.taskDueDate
			});
		}
	}

	const data = Array.from(userMap.values());

	return json({ data });
};

export const POST: RequestHandler = async ({ request }) => {
	const { name, email, password } = await request.json();
	await db.insert(user).values({ name: name, email: email, password: password });
	return json({ success: true });
};

export const PUT: RequestHandler = async ({ request }) => {
	const { email, password } = await request.json();

	// Check if the user exists
	const login = await db.select().from(user).where(eq(user.email, email));

	if (login.length === 0) {
		return json({ success: false, message: 'User not found' });
	}

	// Check if the password matches
	const userData = login[0];

	if (userData.password !== password) {
		return json({ success: false, message: 'Incorrect password' });
	}

	return json({ success: true, user: userData });
};