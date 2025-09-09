<script>
  import { page } from "$app/stores";

  export let hasSubmittedRSVP = false;

  let innerWidth = 0;
  $: isMobile = innerWidth < 768;

  $: navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/story", label: "Our Story", icon: "💕" },
    { href: "/registry", label: "Registry", icon: "🎁" },
    { href: "/rsvp", label: hasSubmittedRSVP ? "RSVP Info" : "RSVP", icon: hasSubmittedRSVP ? "📝" : "✉️" },
  ];

  $: currentPath = $page.url.pathname;
</script>

<svelte:window bind:innerWidth />

{#if isMobile}
  <!-- Mobile Bottom Navigation -->
  <nav
    class="fixed bottom-0 left-0 right-0 bg-coffee-800 border-t-2 border-cream-200 z-50"
  >
    <div class="flex justify-around py-2 px-1">
      {#each navItems as { href, label, icon }}
        <a
          {href}
          class="flex flex-col items-center justify-center py-2 px-3 text-cream-100 transition-all duration-300 hover:text-cream-50 {currentPath ===
          href
            ? 'text-cream-50 bg-coffee-700/50 rounded-lg'
            : ''}"
          aria-current={currentPath === href ? "page" : undefined}
        >
          <span class="text-lg mb-1" role="img" aria-hidden="true">{icon}</span>
          <span class="text-xs font-medium">{label}</span>
        </a>
      {/each}
    </div>
  </nav>
{:else}
  <!-- Desktop Top Navigation -->
  <nav class="bg-coffee-800 text-cream-100 shadow-lg">
    <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <a
        href="/"
        class="flex items-center space-x-3 text-cream-50 hover:text-cream-100 transition-colors group"
      >
        <img
          src="/logo-128.png"
          alt="The Shumanbeans Logo"
          class="h-10 w-10 group-hover:scale-105 transition-transform duration-300"
        />
        <span class="text-2xl font-serif font-bold">The Shumanbeans</span>
      </a>
      <div class="flex space-x-8">
        {#each navItems.slice(1) as { href, label }}
          <a
            {href}
            class="font-medium transition-all duration-300 hover:text-cream-50 hover:transform hover:translate-y-[-2px] {currentPath ===
            href
              ? 'text-cream-50 underline underline-offset-4'
              : 'text-cream-200'}"
            aria-current={currentPath === href ? "page" : undefined}
          >
            {label}
          </a>
        {/each}
      </div>
    </div>
  </nav>
{/if}
