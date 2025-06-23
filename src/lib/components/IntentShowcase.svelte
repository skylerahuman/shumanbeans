<script lang="ts">
  import { onMount } from 'svelte';
  
  let currentStep = 0;
  let showResults = false;
  
  const demoSteps = [
    "Summarize my last 10 Slack messages...",
    "• Meeting scheduled for 2PM with design team",
    "• Budget approval needed for Q1 marketing",
    "• New feature request from customer support",
    "• Server maintenance window this weekend",
    "• Team lunch planned for Friday",
    "Sending to email: done ✓"
  ];
  
  onMount(() => {
    const interval = setInterval(() => {
      if (currentStep < demoSteps.length - 1) {
        currentStep++;
      } else {
        currentStep = 0;
        showResults = false;
      }
      
      if (currentStep === 1) {
        showResults = true;
      }
    }, 1500);
    
    return () => clearInterval(interval);
  });
</script>

<section class="py-20 px-6">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-kairos-silver mb-6">
        See It in <span class="text-kairos-trust-blue">Action</span>
      </h2>
    </div>
    
    <!-- Interactive Browser Mockup -->
    <div class="bg-kairos-gunmetal rounded-lg border border-kairos-cool-gray/20 overflow-hidden max-w-4xl mx-auto">
      <!-- Browser Header -->
      <div class="bg-kairos-charcoal px-4 py-3 border-b border-kairos-cool-gray/20">
        <div class="flex items-center space-x-2">
          <div class="flex space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div class="flex-1 bg-kairos-charcoal rounded px-3 py-1 text-sm text-kairos-cool-gray ml-4">
            kairos://intent
          </div>
        </div>
      </div>
      
      <!-- Browser Content -->
      <div class="grid md:grid-cols-2 min-h-96">
        <!-- Left Pane - Intent Input -->
        <div class="p-8 border-r border-kairos-cool-gray/20">
          <div class="intent-prompt p-4">
            <div class="text-kairos-silver text-lg">
              {#if currentStep === 0}
                <span class="opacity-60">What do you intend to do today?</span>
                <span class="animate-pulse text-kairos-trust-blue">|</span>
              {:else}
                {demoSteps[0]}
              {/if}
            </div>
          </div>
        </div>
        
        <!-- Right Pane - Results Stream -->
        <div class="p-8 bg-kairos-charcoal/50">
          <div class="text-kairos-silver space-y-3">
            {#if showResults}
              {#each demoSteps.slice(1, currentStep + 1) as step, index}
                <div class="animate-fade-in" style="animation-delay: {index * 200}ms;">
                  {#if step.startsWith('•')}
                    <div class="text-kairos-cool-gray pl-4">{step}</div>
                  {:else if step.includes('done ✓')}
                    <div class="text-kairos-responsible-green font-semibold">{step}</div>
                  {:else}
                    <div class="text-kairos-trust-blue font-medium">{step}</div>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Demo CTA -->
    <div class="text-center mt-12">
      <button class="btn-secondary text-lg px-8 py-4">
        🎬 Watch Full Demo
      </button>
    </div>
  </div>
</section> 