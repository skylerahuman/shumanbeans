<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Wedding Registry - Chloe & Skyler</title>
  <meta
    name="description"
    content="Help Chloe and Skyler start their new life together! Browse their carefully curated wedding registry with items from Amazon, Crate & Barrel, and more."
  />
</svelte:head>

<div class="min-h-screen bg-cream-50">
  <!-- Header Section -->
  <section class="bg-coffee-800 text-cream-100 py-16 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-bold mb-4">
        Wedding Registry
      </h1>
      <p class="text-xl text-cream-200 mb-8">
        Help us build our home together with these thoughtfully chosen items
      </p>

      <!-- Registry Links -->
      <div class="flex flex-wrap justify-center gap-4">
        <a
          href="https://www.amazon.com/wedding/share/shumanbeans"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 flex items-center gap-2"
        >
          <span>🛒</span> Amazon Registry
        </a>
        <a
          href="https://www.crateandbarrel.com/gift-registry/skyler-shuman-and-chloe-williams/r7393315"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 flex items-center gap-2"
        >
          <span>🏠</span> Crate & Barrel Registry
        </a>
      </div>
    </div>
  </section>

  <!-- Registry Introduction -->
  <section class="py-12 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <p class="text-lg text-coffee-800 leading-relaxed">
        As we prepare to start this new chapter of our lives together, we've
        carefully selected items that will help us build a warm and welcoming
        home. From kitchen essentials for our morning coffee rituals to items
        that will help us host friends and family, each piece has been chosen
        with love and intention.
      </p>
    </div>
  </section>


  <!-- Thank You Section -->
  <section class="bg-coffee-100 py-12 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h2
        class="text-2xl md:text-3xl font-serif font-semibold text-coffee-800 mb-4"
      >
        Thank You for Your Love and Generosity
      </h2>
      <p class="text-lg text-coffee-700 leading-relaxed">
        Your presence at our wedding is the greatest gift of all. If you choose
        to honor us with a gift, know that it will be treasured and put to
        wonderful use as we begin our married life together. Each item will be a
        reminder of the love and support from our cherished friends and family.
      </p>

      <div class="flex items-center justify-center mt-8 space-x-2">
        <span class="text-2xl">☕</span>
        <span class="text-coffee-600 font-medium">With love and gratitude,</span
        >
        <span class="text-2xl">💕</span>
      </div>
      <p class="text-xl font-serif text-coffee-800 mt-2">Chloe & Skyler</p>
    </div>
  </section>
</div>
