<script lang="ts">
  import { onMount } from "svelte";

  let currentStep = 0;
  let showResults = false;

  const demoSteps = [
    "RSVP for John and Sarah Miller, attending with 2 guests...",
    "• Processing guest information",
    "• Checking dietary restrictions: vegetarian",
    "• Updating seating arrangements",
    "• Sending confirmation email",
    "• Adding to wedding day timeline",
    "RSVP confirmed successfully! ✓",
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

<section class="py-20 px-6 bg-wedding-cream">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-wedding-charcoal mb-6">
        RSVP <span class="text-wedding-gold">Made Simple</span>
      </h2>
      <p class="text-wedding-navy text-lg max-w-2xl mx-auto">
        Our automated system makes it easy for guests to respond and helps us
        plan the perfect day
      </p>
    </div>

    <!-- Interactive RSVP Demo -->
    <div
      class="bg-white rounded-lg border border-wedding-gold/20 overflow-hidden max-w-4xl mx-auto shadow-xl"
    >
      <!-- Demo Header -->
      <div
        class="bg-wedding-gold px-4 py-3 border-b border-wedding-champagne/20"
      >
        <div class="flex items-center space-x-2">
          <div class="flex space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full" />
            <div class="w-3 h-3 bg-yellow-500 rounded-full" />
            <div class="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div
            class="flex-1 bg-wedding-champagne rounded px-3 py-1 text-sm text-wedding-navy ml-4"
          >
            💕 shumanbeans.com/rsvp
          </div>
        </div>
      </div>

      <!-- Demo Content -->
      <div class="grid md:grid-cols-2 min-h-96">
        <!-- Left Pane - RSVP Input -->
        <div class="p-8 border-r border-wedding-gold/20">
          <div class="wedding-prompt p-4 bg-wedding-blush/30 rounded-lg">
            <div class="text-wedding-charcoal text-lg">
              {#if currentStep === 0}
                <span class="opacity-60">Please share your RSVP details...</span
                >
                <span class="animate-pulse text-wedding-gold">|</span>
              {:else}
                {demoSteps[0]}
              {/if}
            </div>
          </div>
        </div>

        <!-- Right Pane - Processing Stream -->
        <div class="p-8 bg-wedding-blush/50">
          <div class="text-wedding-charcoal space-y-3">
            {#if showResults}
              {#each demoSteps.slice(1, currentStep + 1) as step, index}
                <div
                  class="animate-fade-in"
                  style="animation-delay: {index * 200}ms;"
                >
                  {#if step.startsWith("•")}
                    <div class="text-wedding-navy pl-4">{step}</div>
                  {:else if step.includes("successfully! ✓")}
                    <div class="text-wedding-sage font-semibold">{step}</div>
                  {:else}
                    <div class="text-wedding-gold font-medium">{step}</div>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- RSVP CTA -->
    <div class="text-center mt-12">
      <a
        href="#rsvp"
        class="bg-wedding-sage text-white font-semibold text-lg px-8 py-4 rounded-lg hover:bg-wedding-eucalyptus transition-colors shadow-lg"
      >
        💕 RSVP Now
      </a>
    </div>
  </div>
</section>
