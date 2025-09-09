<script>
  export let adminData;
  
  let isMinimized = false;
  
  function logout() {
    // Call admin logout endpoint
    window.location.href = '/admin/logout';
  }
</script>

{#if adminData}
  <div class="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg transition-all duration-300 {isMinimized ? 'h-8' : 'h-16'}">
    <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <span class="text-lg">⚡</span>
          <span class="font-semibold">Admin Mode</span>
        </div>
        {#if !isMinimized}
          <div class="text-sm opacity-90">
            Welcome, {adminData.name}
          </div>
        {/if}
      </div>
      
      <div class="flex items-center space-x-3">
        {#if !isMinimized}
          <div class="text-xs opacity-75">
            Content editing enabled • Click text to edit
          </div>
        {/if}
        
        <button
          on:click={() => isMinimized = !isMinimized}
          class="text-white hover:text-red-200 transition-colors p-1"
          title={isMinimized ? 'Expand' : 'Minimize'}
        >
          {isMinimized ? '▼' : '▲'}
        </button>
        
        <button
          on:click={logout}
          class="text-xs bg-red-700 hover:bg-red-800 px-2 py-1 rounded transition-colors"
          title="Exit Admin Mode"
        >
          Exit
        </button>
      </div>
    </div>
  </div>
  
  <!-- Spacer to push content down -->
  <div class="transition-all duration-300 {isMinimized ? 'h-8' : 'h-16'}"></div>
{/if}

<style>
  /* Ensure admin bar stays on top */
  :global(body.admin-mode) {
    padding-top: 0;
  }
</style>
