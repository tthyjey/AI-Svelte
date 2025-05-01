<script>
  let summary = '';

  async function summarizeTasks() {
    const res = await fetch('/api/ai-summarizer', { method: 'POST' });
    const data = await res.json();
    summary = data.success ? data.response : data.error;
  }
</script>

<div class="flex-1 flex flex-col p-8 overflow-hidden">
	<h1 class="text-4xl font-bold text-pink-600 mb-6">AI Assistant</h1>
	<div class="flex space-x-2">
		<button
			class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition"
			on:click={summarizeTasks}>
      Summarize Tasks
		</button>
	</div>
  <p>{summary}</p>
</div>