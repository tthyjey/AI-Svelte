<script lang="ts">
	import ToDoList from "./components/to-do-list/+page.svelte";
	import AiSummarizer from "./components/ai-summarizer/+page.svelte";
	import Login from "./components/login/+page.svelte";
	import { onMount } from 'svelte';

	let isLoggedIn = false;
	let currentPage: 'todo' | 'ai' = 'todo';
	let user: { name: string; email: string } | null = null;
	let tokenTimeout: ReturnType<typeof setTimeout> | null = null;

	function handleLoginSuccess() {
		isLoggedIn = true;
		currentPage = 'todo';

		tokenTimeout = setTimeout(() => {
			handleLogout(); // Auto logout after 1 hour
		}, 3600000);
	}

	function handleLogout() {
		isLoggedIn = false;
		user = null;
		localStorage.removeItem('token');
		localStorage.removeItem('user');

		if (tokenTimeout) {
			clearTimeout(tokenTimeout);
			tokenTimeout = null;
		}
	}

	onMount(() => {
		const token = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');

		if (token && storedUser) {
			isLoggedIn = true;
			user = JSON.parse(storedUser);

			tokenTimeout = setTimeout(() => {
				handleLogout();
			}, 3600000);
		}
	});
</script>

{#if !isLoggedIn}
	<Login on:login={handleLoginSuccess} />
{:else}
	<div class="flex">
		<!-- SIDEBAR -->
		<aside class="h-screen w-[15%] pt-10 bg-pink-400 rounded-r-2xl flex flex-col justify-between">
			<!-- USER PROFILE -->
			<div class="m-2">
				<div class="flex flex-col justify-center items-center mb-20">
					<!-- Avatar -->
					<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none"
						stroke="#953553" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
						class="lucide lucide-circle-user-round">
						<path d="M18 20a6 6 0 0 0-12 0" />
						<circle cx="12" cy="10" r="4" />
						<circle cx="12" cy="12" r="10" />
					</svg>

					<!-- Name & Email -->
					{#if user}
						<h1 class="text-xl font-bold text-white pt-3">{user.name}</h1>
						<p class="text-sm font-semibold text-white">{user.email}</p>
					{/if}

					<!-- Divider -->
					<div class="bg-pink-300 w-45 h-[1.5px] rounded-full mt-1"></div>
				</div>

				<!-- NAVIGATION -->
				<ul class="text-white font-bold flex flex-col items-center gap-2 mt-8">
					{#each [
						{ label: 'To-Do-List', page: 'todo' as 'todo', size: 'text-2xl' },
						{ label: 'AI-Summarizer', page: 'ai' as 'ai', size: 'text-xl' }
					] as nav}
						<button 
							on:click={() => currentPage = nav.page}
							class={`h-15 w-50 flex justify-center items-center ${nav.size} rounded-full transition duration-300 ease-in-out
								hover:bg-white hover:text-pink-600
								${currentPage === nav.page ? 'bg-white text-pink-600' : ''}`}>
							{nav.label}
						</button>
					{/each}
				</ul>
			</div>

			<!-- LOGOUT -->
			<div class="flex justify-center items-center pb-6">
				<button aria-label="logout" class="cursor-pointer" on:click={handleLogout}>
					<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
						stroke-linecap="round" stroke-linejoin="round"
						class="lucide lucide-log-out bg-pink-900 p-2 rounded-xl hover:bg-pink-600 transition duration-300 ease-in-out">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<polyline points="16 17 21 12 16 7" />
						<line x1="21" x2="9" y1="12" y2="12" />
					</svg>
				</button>
			</div>
		</aside>

		<!-- MAIN CONTENT -->
		<main class="w-full p-6">
			{#if currentPage === 'todo'}
				<ToDoList />
			{:else if currentPage === 'ai'}
				<AiSummarizer />
			{/if}
		</main>
	</div>
{/if}