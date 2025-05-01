<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import AddTask from '../add-task/add-task.svelte';
  import EditTask from '../add-task/edit-task.svelte';

  type Task = {
    id: number;
    title: string;
    description: string;
    duedate: string;
    status: 'todo' | 'doing' | 'done';
    user_id: number;
  };

  const statuses = ['todo', 'doing', 'done'] as const;
  type Status = typeof statuses[number];

  let tasks = writable<Task[]>([]);
  let showModal = false;
  let editModal = false;
  let deleteModal = false;
  let selectedTask: Task | null = null;
  let draggedTask: Task | null = null;
  let user: any | null = null;

  onMount(() => {
    fetchTasks();
    const storedUser = localStorage.getItem('user');
    if (storedUser) user = JSON.parse(storedUser);
  });

  async function fetchTasks() {
    try {
      const response = await fetch('/api/task');
      const taskData = await response.json();
      tasks.set(taskData.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  function handleCloseModal() {
    showModal = false;
    editModal = false;
    deleteModal = false;
    selectedTask = null;
  }

  function handleDragStart(event: DragEvent, task: Task) {
    draggedTask = task;
  }

  async function handleDrop(newStatus: Status) {
    if (!draggedTask) return;

    // Update the task's status in the database
    try {
      const response = await fetch('/api/task', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: draggedTask.id,
          status: newStatus
        })
      });

      const result = await response.json();
      if (result.success) {
        // Update the task's status in the store
        tasks.update((allTasks) =>
          allTasks.map((task) =>
            task.id === draggedTask!.id ? { ...task, status: newStatus } : task
          )
        );
      } else {
        alert('Failed to update task status.');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }

    draggedTask = null; // Reset the dragged task
  }

  async function deleteTask(taskId: number) {
    try {
      const response = await fetch('/api/task', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: taskId })
      });

      const result = await response.json();
      if (result.success) {
        fetchTasks();
        alert('Task deleted successfully.');
      } else {
        alert('Failed to delete task.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
</script>

<!-- Header Section -->
<div class="flex justify-between items-center pt-8">
  <h1 class="text-4xl font-bold text-pink-600">To Do List</h1>
  <button 
    class="bg-pink-500 hover:bg-pink-600 text-white w-30 h-12 rounded-lg transition cursor-pointer"
    on:click={() => showModal = true}>
    <p class="font-semibold">Add Task</p>
  </button>
</div>

<!-- Divider Line -->
<div class="bg-pink-300 w-full h-[1.5px] rounded-full mt-5"></div>

<!-- Modals -->
{#if showModal}
  <AddTask on:close={handleCloseModal} on:addtask={fetchTasks} />
{/if}

{#if editModal}
  <EditTask 
    task={selectedTask ? { 
      ...selectedTask, 
      id: selectedTask.id.toString(), 
      user_id: selectedTask.user_id.toString(), 
      status: selectedTask.status 
    } : null} 
    on:close={handleCloseModal} 
    on:edittask={fetchTasks} 
  />
{/if}

{#if deleteModal}
  <div class="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 backdrop-blur-sm">
    <div class="bg-pink-100 w-[90%] max-w-md p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4 text-pink-600">Delete Task</h2>
      <p class="mb-4">Are you sure you want to delete this task?</p>
      <button 
        class="bg-red-500 hover:bg-red-600 text-white w-full h-12 rounded-lg transition cursor-pointer"
        on:click={() => deleteTask(selectedTask!.id)}>
        Delete
      </button>
      <button 
        class="bg-gray-300 hover:bg-gray-400 text-black w-full h-12 rounded-lg transition cursor-pointer mt-2"
        on:click={handleCloseModal}>
        Cancel
      </button>
    </div>
  </div>
{/if}

<!-- Task Columns -->
<div class="flex gap-5 justify-center items-center mt-5">

  <!-- Column Template -->
  {#each statuses as status (status)}
    <article class="w-[35%] h-[80vh] bg-pink-200 rounded-2xl shadow-inner p-6 overflow-y-auto"
      on:dragover={(event) => event.preventDefault()}
      on:drop={() => handleDrop(status)}>
      <div class="flex justify-between items-center mb-4">
        <h1 class="font-semibold text-pink-800 text-lg">
          {status === 'todo' ? 'To Do' : status === 'doing' ? 'Doing' : 'Done'}
        </h1>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          viewBox="0 0 24 24" fill="none" stroke="#696969" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-icon">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </div>

      <div class="flex flex-col gap-4">
        {#each $tasks.filter(task => task.status === status && task.user_id === user?.id) as task (task.id)}
          <div class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
            role="listitem"
            draggable="true"
            on:dragstart={(event) => handleDragStart(event, task)}>
            <div class="flex flex-col">
              <h1 class="text-lg font-semibold text-pink-800">{task.title}</h1>
              <h2 class="text-pink-700 my-1">{task.description}</h2>
              <p class="text-sm text-pink-400">{task.duedate}</p>
            </div>
            <div class="flex gap-2 items-center">
              <!-- Edit -->
              <button aria-label="edit" on:click={() => { selectedTask = { ...task }; editModal = true; }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil">
                  <path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </button>

              <!-- Delete -->
              <button aria-label="delete" on:click={() => { selectedTask = { ...task }; deleteModal = true; }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        {/each}
      </div>
    </article>
  {/each}
</div>