import { db } from '$lib/server/db';
import { task } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const data = await db.select().from(task);
	return json({ data: data });
};

export const POST: RequestHandler = async ({ request }) => {
	const { title, description, duedate, status, user_id } = await request.json();

	await db.insert(task).values({
		title,
		description,
		duedate,
		status,
		user_id
	});

	return json({ success: true });
};

export const PUT: RequestHandler = async ({ request }) => {
	const { id, title, description, duedate, status } = await request.json();

	await db.update(task).set({ title, description, duedate, status }).where(eq(task.id, id));

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = await request.json();

	await db.delete(task).where(eq(task.id, id));

	return json({ success: true });
};