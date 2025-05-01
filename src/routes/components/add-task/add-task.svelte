<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	let taskTitle = "";
	let taskDescription = "";
	let dueDate = "";
    let user = JSON.parse(localStorage.getItem('user') || '{}'); // Parse user from localStorage
    let status = "todo";

	async function addTask() {
		if (taskTitle.trim() && taskDescription.trim() && dueDate.trim()) {
			const response = await fetch('/api/task', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: taskTitle,
					description: taskDescription,
					duedate: dueDate,
                    status: status,
                    user_id: user.id // Access user_id after parsing
				})
			});

			const result = await response.json();

			if (result.success) {
				dispatch("addtask", {
					title: taskTitle,
					description: taskDescription,
					dueDate: dueDate,
                    status: status,
                    user_id: user.id // Access user_id after parsing
				});
				closeModal();
			} else {
				alert("Failed to add task");
			}
		}
	}

	function closeModal() {
		dispatch("close");
	}
</script>


<div class="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 backdrop-blur-sm">
    <div class="bg-pink-100 w-[90%] max-w-md p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4 text-pink-600">Add New Task</h2>
        <div class="mb-4">
            <label for="taskTitle" class="block text-sm font-medium text-gray-700">Task Title</label>
            <input
                id="taskTitle"
                type="text"
                bind:value={taskTitle}
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter task title"
            />
        </div>
        <div class="mb-4">
            <label for="taskDescription" class="block text-sm font-medium text-gray-700">Task Description</label>
            <textarea
                id="taskDescription"
                bind:value={taskDescription}
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter task description"
            ></textarea>
        </div>
        <div class="mb-4">
            <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
            <input
                id="dueDate"
                type="date"
                bind:value={dueDate}
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            />
        </div>
        <div class="mb-4">
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
                id="status"
                bind:value={status}
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            >
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
            </select>
        </div>
        <div class="flex justify-end gap-4">
            <button
                on:click={closeModal}
                class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
            >
                Cancel
            </button>
            <button
                on:click={addTask}
                class="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md"
            >
                Add Task
            </button>
        </div>
    </div>
</div>