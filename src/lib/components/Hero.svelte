<script lang="ts">
  let intentValue = '';
  let isProcessing = false;
  let result = '';
  let actions: string[] = [];
  
  async function handleIntentSubmit() {
    if (intentValue.trim() && !isProcessing) {
      isProcessing = true;
      result = '';
      actions = [];
      
      try {
        const response = await fetch('http://localhost:3000/api/intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ intent: intentValue }),
        });
        
        if (response.ok) {
          const data = await response.json();
          result = data.result;
          actions = data.actions || [];
        } else {
          result = 'Error processing intent';
        }
      } catch (error) {
        console.error('Error:', error);
        result = 'Unable to connect to KairOS server';
      } finally {
        isProcessing = false;
      }
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleIntentSubmit();
    }
  }
  
  function clearResult() {
    result = '';
    actions = [];
    intentValue = '';
  }
</script>

<section class="relative min-h-screen flex flex-col items-center justify-center px-6 starfield">
  <!-- Hero Content -->
  <div class="text-center max-w-4xl mx-auto mb-12 animate-fade-in">
    <h1 class="text-5xl md:text-7xl font-extrabold mb-6 text-kairos-silver">
      One Prompt. <span class="text-kairos-trust-blue">Every Purpose.</span>
    </h1>
    
    <p class="text-xl md:text-2xl mb-8 text-kairos-cool-gray max-w-3xl mx-auto leading-relaxed">
      KairOS: The intent-driven browser that guards your attention, honors your focus, and frees you from endless scrolls.
    </p>
    
    <!-- CTA Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
      <button class="btn-primary text-lg px-8 py-4">
        Get KairOS
      </button>
      <button class="btn-secondary text-lg px-8 py-4">
        Try in Your Browser
      </button>
    </div>
  </div>
  
  <!-- Intent Prompt Box -->
  <div class="intent-prompt p-8 max-w-2xl w-full mx-auto">
    <div class="relative">
      <input
        type="text"
        bind:value={intentValue}
        on:keydown={handleKeydown}
        placeholder="What do you intend to do today?"
        disabled={isProcessing}
        class="w-full bg-transparent text-kairos-silver text-xl placeholder-kairos-cool-gray border-none outline-none py-4 px-2 disabled:opacity-50"
      />
      {#if isProcessing}
        <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div class="w-6 h-6 border-2 border-kairos-trust-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      {:else if !intentValue && !result}
        <div class="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-60">
          <div class="w-3 h-6 bg-kairos-trust-blue animate-pulse"></div>
        </div>
      {/if}
      
      {#if intentValue && !isProcessing}
        <button
          on:click={handleIntentSubmit}
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-kairos-trust-blue hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      {/if}
    </div>
    
    <!-- Results Display -->
    {#if result || actions.length > 0}
      <div class="mt-6 p-4 bg-kairos-charcoal/50 rounded-lg border border-kairos-trust-blue/20">
        {#if actions.length > 0}
          <div class="space-y-2 mb-4">
            {#each actions as action, index}
              <div class="animate-fade-in text-kairos-cool-gray" style="animation-delay: {index * 200}ms;">
                {action}
              </div>
            {/each}
          </div>
        {/if}
        
        {#if result}
          <div class="text-kairos-responsible-green font-semibold mb-4">
            {result}
          </div>
        {/if}
        
        <button
          on:click={clearResult}
          class="text-sm text-kairos-trust-blue hover:text-white transition-colors"
        >
          Try another intent →
        </button>
      </div>
    {:else}
      <div class="mt-4 text-sm text-kairos-cool-gray text-center">
        Press <kbd class="px-2 py-1 bg-kairos-gunmetal rounded text-kairos-silver">⌘/</kbd> to start with your first intent.
      </div>
    {/if}
  </div>
  
  <!-- Scroll indicator -->
  <div class="absolute bottom-8 animate-bounce">
    <svg class="w-6 h-6 text-kairos-trust-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
  </div>
</section> 