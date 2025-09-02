<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import ProductCard from '$lib/components/ProductCard.svelte';
  
  export let data;
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
  
  $: amazonProducts = data.amazonProducts || [];
  $: hasError = data.error;
</script>

<svelte:head>
  <title>Wedding Registry - Chloe & Skyler</title>
  <meta name="description" content="Help Chloe and Skyler start their new life together! Browse their carefully curated wedding registry with items from Amazon, Crate & Barrel, and more." />
</svelte:head>

<div class="min-h-screen bg-cream-50">
  <!-- Header Section -->
  <section class="bg-coffee-800 text-cream-100 py-16 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-bold mb-4">Wedding Registry</h1>
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
          href="#" 
          class="bg-coffee-600 hover:bg-coffee-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 flex items-center gap-2"
        >
          <span>🏠</span> Crate & Barrel (Coming Soon)
        </a>
        <a 
          href="#" 
          class="bg-coffee-600 hover:bg-coffee-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 flex items-center gap-2"
        >
          <span>🔨</span> Home Depot (Coming Soon)
        </a>
      </div>
    </div>
  </section>

  <!-- Registry Introduction -->
  <section class="py-12 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <p class="text-lg text-coffee-800 leading-relaxed">
        As we prepare to start this new chapter of our lives together, we've carefully selected items that will help us build a warm and welcoming home. From kitchen essentials for our morning coffee rituals to items that will help us host friends and family, each piece has been chosen with love and intention.
      </p>
    </div>
  </section>

  <!-- Products Grid -->
  <section class="pb-16 px-4">
    <div class="max-w-7xl mx-auto">
      {#if hasError}
        <div class="text-center py-12">
          <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
            <h3 class="font-semibold mb-2">Oops! Something went wrong</h3>
            <p class="text-sm">
              We're having trouble loading the registry items right now. Please try again later or visit our registries directly.
            </p>
          </div>
        </div>
      {:else if amazonProducts.length === 0}
        <div class="text-center py-12">
          <div class="text-coffee-600 mb-4">
            <span class="text-6xl block mb-4">🎁</span>
            <h3 class="text-xl font-semibold mb-2">Loading Registry Items...</h3>
            <p>Please wait while we fetch the latest items from our registry.</p>
          </div>
        </div>
      {:else}
        <!-- Amazon Products Section -->
        <div class="mb-12">
          {#if mounted}
            <div in:fly={{ y: 30, duration: 600, delay: 200 }}>
              <h2 class="text-2xl md:text-3xl font-serif font-semibold text-coffee-800 mb-2 text-center">
                From Our Amazon Registry
              </h2>
              <p class="text-coffee-600 text-center mb-8">
                Kitchen essentials, home goods, and everything in between
              </p>
            </div>
          {/if}
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {#each amazonProducts as product, index}
              <ProductCard
                title={product.title}
                image={product.image}
                price={product.price}
                url={product.url}
                source={product.source}
                {index}
              />
            {/each}
          </div>
        </div>

        <!-- Coming Soon Sections -->
        {#if mounted}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16" in:fade={{ duration: 600, delay: 800 }}>
            <div class="text-center p-6 bg-white rounded-lg shadow-md border border-coffee-200">
              <div class="text-4xl mb-4">🏠</div>
              <h3 class="text-xl font-serif font-semibold text-coffee-800 mb-2">Crate & Barrel</h3>
              <p class="text-coffee-600 text-sm mb-4">
                Elegant home decor and dining essentials
              </p>
              <p class="text-xs text-coffee-500">Coming Soon</p>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg shadow-md border border-coffee-200">
              <div class="text-4xl mb-4">🔨</div>
              <h3 class="text-xl font-serif font-semibold text-coffee-800 mb-2">Home Depot</h3>
              <p class="text-coffee-600 text-sm mb-4">
                Tools and home improvement essentials
              </p>
              <p class="text-xs text-coffee-500">Coming Soon</p>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg shadow-md border border-coffee-200">
              <div class="text-4xl mb-4">🎯</div>
              <h3 class="text-xl font-serif font-semibold text-coffee-800 mb-2">Target</h3>
              <p class="text-coffee-600 text-sm mb-4">
                Everyday essentials and home basics
              </p>
              <p class="text-xs text-coffee-500">Coming Soon</p>
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </section>

  <!-- Thank You Section -->
  <section class="bg-coffee-100 py-12 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-2xl md:text-3xl font-serif font-semibold text-coffee-800 mb-4">
        Thank You for Your Love and Generosity
      </h2>
      <p class="text-lg text-coffee-700 leading-relaxed">
        Your presence at our wedding is the greatest gift of all. If you choose to honor us with a gift, know that it will be treasured and put to wonderful use as we begin our married life together. Each item will be a reminder of the love and support from our cherished friends and family.
      </p>
      
      <div class="flex items-center justify-center mt-8 space-x-2">
        <span class="text-2xl">☕</span>
        <span class="text-coffee-600 font-medium">With love and gratitude,</span>
        <span class="text-2xl">💕</span>
      </div>
      <p class="text-xl font-serif text-coffee-800 mt-2">Chloe & Skyler</p>
    </div>
  </section>
</div>
