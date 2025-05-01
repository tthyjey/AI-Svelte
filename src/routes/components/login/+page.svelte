<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let name = '';
	let email = '';
	let password = '';
	let isRegister = false;
	let errorMessage = '';

	async function handleLogin() {
		if (!email || !password) {
			errorMessage = 'Email and password are required.';
			return;
		}

		const res = await fetch('/api/users', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const result = await res.json();

		if (result.success) {
			localStorage.setItem('user', JSON.stringify(result.user));
			localStorage.setItem('token', result.token);
			dispatch('login');
		} else {
			errorMessage = result.message || 'Login failed.';
		}
	}

	async function handleRegister() {
		if (!name || !email || !password) {
			errorMessage = 'All fields are required.';
			return;
		}

		const res = await fetch('/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, email, password })
		});

		const result = await res.json();

		if (result.success) {
			isRegister = false;
			errorMessage = '';
		} else {
			errorMessage = result.message || 'Registration failed.';
		}
	}

	function handleKeyPress(event: any) {
		if (event.key === 'Enter') {
			isRegister ? handleRegister() : handleLogin();
		}
	}
</script>

<form class="flex flex-col justify-center items-center h-screen bg-pink-100"
      on:submit|preventDefault={isRegister ? handleRegister : handleLogin}>
	<h1 class="text-3xl mb-4 font-bold text-pink-700">
		{isRegister ? 'Register' : 'Login'}
	</h1>

	{#if isRegister}
		<input bind:value={name} placeholder="Name" type="text" class="mb-2 p-2 rounded w-80 border border-pink-300" />
	{/if}

	<input bind:value={email} placeholder="Email" type="email" class="mb-2 p-2 rounded w-80 border border-pink-300" />
	<input bind:value={password} placeholder="Password" type="password" class="mb-4 p-2 rounded w-80 border border-pink-300" />

	<button 
		on:click={isRegister ? handleRegister : handleLogin} 
		class="bg-pink-500 text-white px-20 py-2 rounded hover:bg-pink-600 transition"
	>
		{isRegister ? 'Register' : 'Login'}
	</button>

	<p class="text-center text-gray-600 mt-4">
		{#if isRegister}
			Already have an account?
			<a href="/" on:click|preventDefault={() => isRegister = false} class="text-pink-500 hover:underline">Login</a>
		{:else}
			Don't have an account?
			<a href="/" on:click|preventDefault={() => isRegister = true} class="text-pink-500 hover:underline">Register</a>
		{/if}
	</p>

	{#if errorMessage}
		<p class="text-red-500 mt-2">{errorMessage}</p>
	{/if}
</form>