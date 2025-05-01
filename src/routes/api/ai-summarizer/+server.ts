import { json, type RequestHandler } from '@sveltejs/kit';
import { Ollama } from 'ollama';
import { db } from '$lib/server/db';
import { task } from '$lib/server/db/schema'; // Make sure this matches your schema file

type Task = {
	id: number;
	title: string;
	description: string;
	status: string;
	duedate: string;
};

export const POST: RequestHandler = async () => {
	const ollama = new Ollama({ host: 'http://localhost:11434' }); // Make sure Ollama is running

	try {
		// Default system prompt
		const defaultPrompt = 'Summarize all tasks with their titles, status, and due dates.';

		// Fetch tasks from the database
		const tasks = await db.select().from(task);

		if (!tasks.length) {
			return json({ success: false, error: 'No tasks found.' }, { status: 404 });
		}

		// Format task data
		const taskData = tasks.map((task: Task) => ({
			id: task.id,
			title: task.title,
			description: task.description,
			status: task.status,
			duedate: task.duedate
		}));

		// Optional: log the data to check structure
		console.log('Sending task data to Ollama:', taskData);

		// Send data to Ollama for summarization
		const response = await ollama.chat({
			model: 'tinyllama', // Try 'llama2' if 'deepseek:1.3b' doesn't work
			messages: [
				{
					role: 'system',
					content: `You are a helpful assistant. Based only on the data below, summarize the tasks:\n\n${JSON.stringify(taskData)}`
				},
				{
					role: 'user',
					content: defaultPrompt
				}
			]
		});

		// Return summarized result
		return json({ success: true, response: response.message.content });
	} catch (error) {
		console.error('Error during summarization:', error);

		// Return error to frontend with details
		return json(
			{
				success: false,
				error: `Failed to summarize tasks: ${
					error instanceof Error ? error.message : String(error)
				}`
			},
			{ status: 500 }
		);
	}
};