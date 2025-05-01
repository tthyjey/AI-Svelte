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

<div class="flex flex-col justify items-center h-screen bg-pink-100">
    <h1 class="text-3xl mb-4 font-bold text-pink-700">Login</h1>
 
    <input  placeholder="Name" type="text" class="mb-2 p-2 rounded w-80 border border-pink-300" />
    <input placeholder="Email" type="email" class="mb-2 p-2 rounded w-80 border border-pink-300" />
    <input type="Password" placeholder="Password" class="mb-2 p-2 rounded w-80 border border-pink-300" />
    <button  class="bg-pink-500 text-white px-20 py-2 rounded hover:bg-pink-600 transition">Register</button>

    <input placeholder="Email" type="email" class="mb-2 p-2 rounded w-80 border border-pink-300" />
    <input  placeholder="Password" type="password"  class="mb-4 p-2 rounded w-80 border border-pink-300" />
    <button class="bg-pink-500 text-white px-20 py-2 rounded hover:bg-pink-600 transition">Login

    </button>
</div>
 
<div>
<p class="text-center text-gray-600 mt-4">
    Already have an account? <a href="/" class="text-pink-500 hover:underline">Login</a>
        Don't have an account? <a href="/" class="text-pink-500 hover:underline">Register</a>
</p>
<p class="text-red-500 mt-2">errorMessage</p>
</div>