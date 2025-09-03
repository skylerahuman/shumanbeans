<script>
  import { fly } from "svelte/transition";

  export let title = "";
  export let image = "";
  export let price = "";
  export let url = "";
  export let source = "";
  export let index = 0;

  let imageError = false;

  function handleImageError() {
    imageError = true;
  }

  function handleClick() {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }
</script>

<div
  class="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-cream-200 hover:border-coffee-300"
  on:click={handleClick}
  on:keydown={(e) => e.key === "Enter" && handleClick()}
  role="button"
  tabindex="0"
  aria-label={`View ${title} on ${source}`}
  in:fly={{ y: 30, duration: 600, delay: index * 100 }}
>
  <!-- Product Image -->
  <div class="aspect-square bg-cream-50 relative overflow-hidden">
    {#if !imageError && image}
      <img
        src={image}
        alt={title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        on:error={handleImageError}
      />
    {:else}
      <div class="flex items-center justify-center h-full text-coffee-400">
        <div class="text-center">
          <span class="text-4xl mb-2 block">🎁</span>
          <p class="text-sm">No Image Available</p>
        </div>
      </div>
    {/if}

    <!-- Source Badge -->
    {#if source}
      <div
        class="absolute top-2 right-2 bg-coffee-700 text-cream-100 px-2 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        {source}
      </div>
    {/if}
  </div>

  <!-- Product Info -->
  <div class="p-4">
    <h3
      class="text-sm font-medium text-coffee-800 mb-2 line-clamp-2 group-hover:text-coffee-900 transition-colors"
    >
      {title || "Product Title"}
    </h3>

    {#if price}
      <p class="text-lg font-semibold text-coffee-700 mb-2">
        {price}
      </p>
    {/if}

    <div class="flex items-center justify-between">
      <span
        class="text-sm text-coffee-600 group-hover:text-coffee-700 transition-colors"
      >
        Click to view
      </span>

      <svg
        class="w-4 h-4 text-coffee-500 group-hover:text-coffee-700 group-hover:translate-x-1 transition-all duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
  }
</style>
