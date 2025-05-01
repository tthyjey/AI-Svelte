
<script lang="ts">
    import { createEventDispatcher } from "svelte";
  
    export let task: any | null = null; // Accept the task as a prop
    const dispatch = createEventDispatcher();
  
    let taskTitle = "";
    let taskDescription = "";
    let dueDate = "";
    let status = "todo";
  
    // Initialize the form fields with the task's details
    $: if (task) {
      taskTitle = task.title;
      taskDescription = task.description;
      dueDate = task.duedate;
      status = task.status;
    }
  
    function closeModal() {
      dispatch("close");
    }
  
    async function editTask() {
      if (taskTitle.trim() && taskDescription.trim() && dueDate.trim()) {
        const response = await fetch('/api/task', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: task?.id ?? "", // Include the task ID
            title: taskTitle,
            description: taskDescription,
            duedate: dueDate,
            status: status,
            user_id: task?.user_id ?? "" // Keep the user ID unchanged
          })
        });
  
        const result = await response.json();
  
        if (result.success) {
          dispatch("edittask"); // Notify the parent to refresh the task list
          closeModal();
        } else {
          alert("Failed to edit task");
        }
      }
    }
  </script>
  
  <div class="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 backdrop-blur-sm">
    <div class="bg-pink-100 w-[90%] max-w-md p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4 text-pink-600">Edit Task</h2>
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
          on:click={editTask}
          class="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
