<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import AddTask from '../../components/add-task/add-task.svelte'
  import EditTask from '../../components/add-task/edit-task.svelte';
  

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

<div class="flex justify-between items-center pt-8">
    <h1 class="text-4xl font-bold text-pink-600">
        To Do List
    </h1>
    <button aria-label="Add Task" class="bg-pink-500 hover:bg-pink-600 text-white w-30 h-12 rounded-lg transition cursor-pointer">
    <p class="font-semibold">
        Add Task
    </p>
    </button>
</div>

<!-- LINE -->
 <div class="bg-pink-300 w-[100%] h-[1.5px] rounded-full mt-5"> </div>

<!-- TO DO LIST CONTENTS -->
<div class="flex gap-5 justify-center items-center mt-5">

<!-- TO DO  -->
<article class="w-[35%] h-[80vh] bg-pink-200 rounded-2xl shadow-inner p-6 overflow-y-auto">
    <div class="flex justify-between items-center mb-4">
        <h1 class="font-semibold text-pink-800 text-lg">To Do</h1>
        <svg 
        xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
        viewBox="0 0 24 24" fill="none" stroke="#696969" 
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
        class="lucide lucide-align-justify-icon lucide-align-justify">
        <path d="M3 12h18"/><path d="M3 18h18"/><path d="M3 6h18"/>
      </svg>
    </div>
 <!-- DITO MO PO I TUTUTLOY YUNG DESIGN NG NASA LOOB PO NG KASA TASKS -->
  <div class="flex flex-col gap-4">
    <div class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
  <div class="flex flex-col">
    <h1 class="text-lg font semibold text-pink-800">task title</h1>
    <h2 class=" text-pink-700 my-1">task description</h2>
    <p class="text-sm text-pink-400">task duedate</p>
  </div>
    <div class="flex gap-2 items-center">

<!-- Edit Button -->
<button aria-label="edit" class="cursor-pointer flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-pencil-icon lucide-pencil">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
      <path d="m15 5 4 4"/>
    </svg>
  </button>
  <!-- Delete Button -->
  <button aria-label="delete" class="cursor-pointer flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-trash-icon lucide-trash">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  </button>
    </div>    
    </div>


  </div>
</article>

<!-- PROCESSING -->
 <article class="w-[35%] h-[80vh] bg-pink-200 rounded-2xl shadow-inner p-6 overflow-y-auto">
    <div class="flex justify-between items-center mb-4">
        <h1 class="font-semibold text-pink-800 text-lg">Doing</h1>
        <svg 
          xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
          viewBox="0 0 24 24" fill="none" stroke="#696969" 
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
          class="lucide lucide-list-restart-icon lucide-list-restart">
          <path d="M21 6H3"/><path d="M7 12H3"/><path d="M7 18H3"/>
          <path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/>
          <path d="M11 10v4h4"/>
        </svg>
      </div>

    <!-- DITO MO PO I TUTUTLOY YUNG DESIGN NG NASA LOOB PO NG KASA TASKS -->
    <div class="flex flex-col gap-4">
        <div class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <div class="flex flex-col">
                <h1 class="text-lg font-semibold text-pink-800">task title</h1>
                <h2 class="text-pink-700 my-1">task description</h2>
                <p  class="text-sm text-pink-400">task duedate</p>
              </div>
              <div class="flex gap-2 items-center">
               <!-- Edit Button -->
          <button aria-label="edit" class="cursor-pointer flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-pencil-icon lucide-pencil">
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button> 
          <!-- Delete Button -->
          <button aria-label="delete" class="cursor-pointer flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-trash-icon lucide-trash">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
              </div>
        </div>
 </article>
<!-- DONE-->
<article class="w-[35%] h-[80vh] bg-pink-200 rounded-2xl shadow-inner p-6 overflow-y-auto">
    <div class="flex justify-between items-center mb-4">
        <h1 class="font-semibold text-pink-800 text-lg">Done</h1>
        <svg 
        xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
        viewBox="0 0 24 24" fill="none" stroke="#696969" 
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
        class="lucide lucide-list-check-icon lucide-list-check">
        <path d="M11 18H3"/><path d="m15 18 2 2 4-4"/><path d="M16 12H3"/><path d="M16 6H3"/>
      </svg>
      </div>

    <!-- DITO MO PO I TUTUTLOY YUNG DESIGN NG NASA LOOB PO NG KASA TASKS -->
    <div class="flex flex-col gap-4">
        <div class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <div class="flex flex-col">
                <h1 class="text-lg font-semibold text-pink-800">task title</h1>
                <h2 class="text-pink-700 my-1">task description</h2>
                <p  class="text-sm text-pink-400">task duedate</p>
              </div>
              <div class="flex gap-2 items-center">
               <!-- Edit Button -->
          <button aria-label="edit" class="cursor-pointer flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-pencil-icon lucide-pencil">
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button> 
          <!-- Delete Button -->
          <button aria-label="delete" class="cursor-pointer flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-trash-icon lucide-trash">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
              </div>
        </div>
 </article>
 
</div>
 