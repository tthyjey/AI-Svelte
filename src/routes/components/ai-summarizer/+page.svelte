<script>
    let inpuText = "";
  </script>
  
  <div class="flex-1 flex flex-col p-8 overflow-hidden">
    <h1 class="text-4xl font-bold text-pink-600 mb-6">AI-Summarizer</h1>
    <div class="flex-1 bg-white rounded-2xl shadow-inner p-6 overflow-y-auto mb-4">
    </div>
    <div class="flex space-x-2">
      <input
        bind:value={inpuText}
        type="text"
        placeholder="CHIKA MO NGA DITO BE!!"
        class="flex-1 px-4 py-2 rounded-full border border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"/>
      <button
        class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition">
        Send
      </button>
    </div>
  </div>