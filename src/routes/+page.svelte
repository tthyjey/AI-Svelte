<div class="flex">
    <!-- SIDE BAR -->
     <div class="h-screen w-[15%] pt-10 bg-pink-400 rounded-r-2xl flex flex-col justify-between">
        <div class="m-2">
            <!-- PROFILE PICTURE -->
            <div class="flex flex-col justify-center items-center mb-20">
                <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="80" height="80" viewBox="0 0 24 24" 
                        fill="none" stroke="#953553" stroke-width="1.5" 
                        stroke-linecap="round" stroke-linejoin="round" 
                        class="lucide lucide-circle-user-round-icon lucide-circle-user-round">
                        <path d="M18 20a6 6 0 0 0-12 0"/>
                        <circle cx="12" cy="10" r="4"/>
                        <circle cx="12" cy="12" r="10"/>
                </svg>
                    <!-- USER NAME -->
                    <div>
                        <h1 class="text=xl font-bold text-white pt-3">username</h1>
                        <p class="text-sm font-semibold text-white flex justify-center items">email</p>
                    </div>
                    <!-- LINE -->
                <div class="bg-pink-300 w-45 h-[1.5px] rounded-full mt-1"></div>
            </div>
            <!-- NAVIGATION -->
             <ul class="text-white font-bold flex flex-col justify-center items-center gap-2 mt-8">
                <button class="h-15 w-50 flex justify-center items-center text-xl rounded-full transition duration-300 ease-in-out
                hover:bg-white hover:text-pink-600">To Do List
                </button>
                <button class="h-15 w-50 flex justify-center items-center text-xl rounded-full transition duration-300 ease-in-out
                hover:bg-white hover:text-pink-600">AI Summarizer

                </button>
             </ul>
        </div>
        <!-- LOGOUT -->
         <div class=" flex justify-center items-center pb-6">
            <button aria-label="logout" class="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
						stroke-linecap="round" stroke-linejoin="round"
						class="lucide lucide-log-out bg-pink-900 p-2 rounded-xl hover:bg-pink-600 transition delay-100 duration-300 ease-in-out">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
						<polyline points="16 17 21 12 16 7"/>
						<line x1="21" x2="9" y1="12" y2="12"/>
					</svg>

            </button>

         </div>
     </div>
     <!-- MAIN PAGE -->
      <div class="w-full p-6">

      </div>
</div>