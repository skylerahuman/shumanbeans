<script lang="ts">
  import { onMount } from "svelte";

  let weddingDate = new Date("2025-06-21"); // Update with actual date
  let daysUntilWedding = 0;

  onMount(() => {
    const today = new Date();
    const timeDiff = weddingDate.getTime() - today.getTime();
    daysUntilWedding = Math.ceil(timeDiff / (1000 * 3600 * 24));
  });
</script>

<section
  class="relative min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-wedding-cream via-wedding-blush to-wedding-champagne"
>
  <!-- Hero Content -->
  <div class="text-center max-w-4xl mx-auto mb-12 animate-fade-in">
    <!-- Wedding Logo -->
    <div class="mb-8">
      <img
        src="/logo.png"
        alt="Shumanbeans Wedding Logo"
        class="mx-auto h-24 md:h-32 w-auto drop-shadow-lg"
      />
    </div>

    <h1 class="text-5xl md:text-7xl font-extrabold mb-6 text-wedding-charcoal">
      The <span class="text-wedding-gold">Shumanbeans</span>
    </h1>

    <p
      class="text-xl md:text-2xl mb-8 text-wedding-navy max-w-3xl mx-auto leading-relaxed font-serif"
    >
      Two hearts, one journey, endless love. Join us as we celebrate our union
      and begin our adventure together.
    </p>

    <!-- Wedding Date Countdown -->
    {#if daysUntilWedding > 0}
      <div class="mb-8 p-6 bg-white/80 rounded-lg shadow-lg backdrop-blur-sm">
        <div class="text-lg text-wedding-navy mb-2">
          Counting down to our special day
        </div>
        <div class="text-4xl font-bold text-wedding-gold">
          {daysUntilWedding}
        </div>
        <div class="text-wedding-sage">days until we say "I do"</div>
      </div>
    {/if}

    <!-- CTA Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
      <a
        href="#rsvp"
        class="bg-wedding-gold text-white font-semibold text-lg px-8 py-4 rounded-lg hover:bg-wedding-champagne transition-colors shadow-lg"
      >
        💕 RSVP Now
      </a>
      <a
        href="#details"
        class="bg-wedding-sage text-white font-semibold text-lg px-8 py-4 rounded-lg hover:bg-wedding-eucalyptus transition-colors shadow-lg"
      >
        📅 Wedding Details
      </a>
    </div>
  </div>

  <!-- Wedding Info Cards -->
  <div class="grid md:grid-cols-2 gap-6 max-w-4xl w-full mx-auto">
    <!-- Date & Time Card -->
    <div
      class="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg text-center"
    >
      <h3 class="text-xl font-bold text-wedding-navy mb-2">📅 When</h3>
      <p class="text-wedding-charcoal">June 21st, 2025</p>
      <p class="text-wedding-sage">4:00 PM Ceremony</p>
    </div>

    <!-- Location Card -->
    <div
      class="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg text-center"
    >
      <h3 class="text-xl font-bold text-wedding-navy mb-2">📍 Where</h3>
      <p class="text-wedding-charcoal">Location TBD</p>
      <p class="text-wedding-sage">Details coming soon</p>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-8 animate-bounce">
    <svg
      class="w-6 h-6 text-wedding-gold"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </svg>
  </div>
</section>
