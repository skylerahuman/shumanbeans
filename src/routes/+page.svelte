<script>
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";
  import EditableContent from "$lib/components/EditableContent.svelte";

  export let data;
  
  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Chloe & Skyler — November 22, 2025</title>
  <meta
    name="description"
    content="Join us in celebrating our covenant before God. Chloe & Skyler's wedding on November 22, 2025, at 2:30 PM. A gospel-centered celebration of love."
  />
</svelte:head>

<!-- Hero Section with Background Image -->
<section class="relative h-[500px] md:h-[600px] overflow-hidden">
  <!-- Background Image -->
  <div class="absolute inset-0">
    <img
      src="/images/optimized/hero_large.jpg"
      alt="Chloe and Skyler in the countryside"
      class="absolute inset-0 w-full h-full object-cover"
      style="filter: sepia(0.4) brightness(0.7) contrast(1.1);"
    />
    <!-- Overlay -->
    <div class="absolute inset-0 bg-coffee-900/30" />
  </div>

  <!-- Hero Content -->
  <div
    class="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center"
  >
    {#if mounted}
      <div class="mb-6" in:fly={{ y: 30, duration: 800, delay: 100 }}>
        <img
          src="/logo.png"
          alt="The Shumanbeans Logo"
          class="h-20 w-20 md:h-24 md:w-24 mx-auto drop-shadow-lg"
        />
      </div>

      <h1
        class="text-4xl md:text-6xl font-serif font-bold mb-4"
        in:fly={{ y: 30, duration: 800, delay: 200 }}
      >
        Chloe & Skyler
      </h1>

      <blockquote
        class="text-lg md:text-xl italic mb-4 max-w-2xl"
        in:fade={{ duration: 800, delay: 600 }}
      >
        "In vain have I struggled. It will not do. My feelings will not be
        repressed."
      </blockquote>

      <p
        class="text-base md:text-lg mb-2"
        in:fly={{ y: 20, duration: 600, delay: 1000 }}
      >
        We joyfully invite you to witness our covenant — Mr. Darcy
      </p>

      <p
        class="text-base md:text-lg mb-8 font-medium"
        in:fly={{ y: 20, duration: 600, delay: 1200 }}
      >
        November 22, 2025 • 2:30 PM
      </p>

      <a
        href="/rsvp"
        class="bg-red-700 text-white rounded-none border-2 border-white px-8 py-3 font-semibold text-lg transition-all duration-300 hover:bg-red-800 hover:transform hover:translate-y-[-2px] hover:shadow-lg"
        in:fly={{ y: 20, duration: 600, delay: 1400 }}
      >
        RSVP
      </a>
    {:else}
      <!-- Fallback content for SSR -->
      <h1 class="text-4xl md:text-6xl font-serif font-bold mb-4">
        Chloe & Skyler
      </h1>
      <blockquote class="text-lg md:text-xl italic mb-4 max-w-2xl">
        "In vain have I struggled. It will not do. My feelings will not be
        repressed."
      </blockquote>
      <p class="text-base md:text-lg mb-2">
        We joyfully invite you to witness our covenant — Mr. Darcy
      </p>
      <p class="text-base md:text-lg mb-8 font-medium">
        November 22, 2025 • 2:30 PM
      </p>
      <a
        href="/rsvp"
        class="bg-red-700 text-white rounded-none border-2 border-white px-8 py-3 font-semibold text-lg transition-all duration-300 hover:bg-red-800"
      >
        RSVP
      </a>
    {/if}
  </div>
</section>

<!-- Covenant Section -->
<section class="bg-cream-100 py-12 md:py-16 px-4 md:px-6">
  <div class="max-w-4xl mx-auto text-center">
    <EditableContent
      contentId="covenant-title"
      content="A Covenant Before God"
      isAdmin={data.isAdmin}
      tag="h2"
      className="text-3xl md:text-4xl font-serif text-coffee-800 mb-6"
    />

    <div class="prose prose-lg max-w-none text-coffee-900">
      <EditableContent
        contentId="covenant-text"
        content="We joyfully invite you to witness before God our covenant of marriage. As believers in the Gospel, we see marriage as a reflection of Christ's love for His Church. We gather together not just as friends and family, but as a community united in faith, to celebrate God's grace and faithfulness in bringing us together."
        isAdmin={data.isAdmin}
        tag="p"
        className="text-base md:text-lg leading-relaxed"
      />
    </div>

    <!-- Decorative Element -->
    <div
      class="flex items-center justify-center mt-8 space-x-4 text-coffee-600"
    >
      <div class="flex items-center space-x-2">
        <span class="text-2xl">☕</span>
        <span class="w-8 h-px bg-coffee-400" />
        <span class="text-2xl">💒</span>
        <span class="w-8 h-px bg-coffee-400" />
        <span class="text-2xl">✨</span>
      </div>
    </div>
  </div>
</section>

<!-- Quick Links Section -->
<section class="bg-coffee-50 py-12 px-4">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center group">
        <div
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <span class="text-4xl mb-4 block">💕</span>
          <h3 class="text-xl font-serif font-semibold text-coffee-800 mb-2">
            Our Story
          </h3>
          <p class="text-coffee-600 text-sm mb-4">
            From Mean Mug to forever — discover how our love story began with
            coffee and faith.
          </p>
          <a
            href="/story"
            class="inline-block text-coffee-700 font-medium hover:text-coffee-900 transition-colors duration-300 group-hover:underline"
          >
            Read More →
          </a>
        </div>
      </div>

      <div class="text-center group">
        <div
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <span class="text-4xl mb-4 block">🎁</span>
          <h3 class="text-xl font-serif font-semibold text-coffee-800 mb-2">
            Wedding Registry
          </h3>
          <p class="text-coffee-600 text-sm mb-4">
            Help us build our home together with items from our carefully
            curated registries.
          </p>
          <a
            href="/registry"
            class="inline-block text-coffee-700 font-medium hover:text-coffee-900 transition-colors duration-300 group-hover:underline"
          >
            View Registry →
          </a>
        </div>
      </div>

      <div class="text-center group">
        <div
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <span class="text-4xl mb-4 block">✉️</span>
          <h3 class="text-xl font-serif font-semibold text-coffee-800 mb-2">
            RSVP
          </h3>
          <p class="text-coffee-600 text-sm mb-4">
            Let us know if you'll join us for this special celebration of
            covenant and community.
          </p>
          <a
            href="/rsvp"
            class="inline-block bg-coffee-700 text-cream-100 px-6 py-2 rounded-md hover:bg-coffee-800 transition-colors duration-300"
          >
            RSVP Now
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
