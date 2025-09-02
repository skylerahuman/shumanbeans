<script>
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import { page } from '$app/stores';
  
  let innerWidth = 0;
  $: isMobile = innerWidth < 768;
</script>

<svelte:window bind:innerWidth />

<div class="min-h-screen flex flex-col">
  <Nav />
  
  <main class="flex-1 {isMobile ? 'pb-20' : ''}">
    <slot />
  </main>
  
  <footer class="bg-coffee-900 text-cream-100 py-8 px-6 border-t border-coffee-700">
    <div class="max-w-4xl mx-auto text-center space-y-4">
      <div class="flex items-center justify-center mb-4">
        <img 
          src="/logo-128.png" 
          alt="The Shumanbeans Logo" 
          class="h-12 w-12 opacity-80"
        />
      </div>
      <div class="flex items-center justify-center space-x-2">
        <span class="text-2xl" role="img" aria-label="coffee">☕</span>
        <p class="text-lg font-serif">
          Two hearts, one journey, endless coffee
        </p>
        <span class="text-2xl" role="img" aria-label="heart">💕</span>
      </div>
      <p class="text-sm text-cream-300 italic">
        "Therefore what God has joined together, let no one separate." - Mark 10:9
      </p>
      <p class="text-cream-400 text-sm">
        © 2025 The Shumanbeans | Made with love for our special day
      </p>
    </div>
  </footer>
</div>
