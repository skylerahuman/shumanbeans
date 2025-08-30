<script lang="ts">
  import CoffeeBeanWithBowtie from '$lib/components/CoffeeBeanWithBowtie.svelte';
  import QRCodeComponent from '$lib/components/QRCodeComponent.svelte';
</script>

<svelte:head>
  <title>The Shumanbeans Wedding — Two Hearts, One Journey</title>
  <meta name="description" content="Join us in celebrating our love story and upcoming wedding. Find all the details, RSVP, and share in our joy at shumanbeans.com." />
</svelte:head>

<!-- New Hero Section -->
<section class="hero flex flex-col items-center justify-center bg-coffee-light text-coffee-dark min-h-screen">
  <h1 class="text-4xl md:text-6xl font-bold mb-6 text-center">
    Welcome to The Shumanbeans Wedding!
  </h1>
  <p class="text-lg md:text-xl mb-8 max-w-lg mx-auto text-center">
    Join us in celebrating our love story and upcoming wedding.
  </p>
  <div class="flex flex-col md:flex-row gap-8 items-center">
    <CoffeeBeanWithBowtie className="w-32 md:w-40" />
    <QRCodeComponent size={200} />
  </div>

  <!-- CTA Buttons -->
  <div class="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-4">
    <button class="btn-primary text-lg px-8 py-4">
      RSVP Now
    </button>
    <button class="btn-secondary text-lg px-8 py-4">
      Our Story
    </button>
  </div>
</section>

<!-- Features Section - Temporarily commented out missing components -->
<!-- 
<section class="py-20 px-6 bg-gradient-to-b from-kairos-charcoal to-kairos-gunmetal">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <FeatureCard
        icon="cursor-arrow"
        title="Action in One Line"
        copy="Type or speak your intention—like 'Email my October invoices'—and watch KairOS handle the rest, from file retrieval to send-off."
      />
      
      <FeatureCard
        icon="hourglass-lock"
        title="Focus with Boundaries"
        copy="Time-boxed social sessions and one-click focus locks mean you get what you need—then walk away, guilt-free."
      />
      
      <FeatureCard
        icon="shield-keyhole"
        title="Zero-Data Collection"
        copy="Encrypted local-first architecture and open-source transparency. Your data never leaves your machine unless you say so."
      />
      
      <FeatureCard
        icon="building-blocks"
        title="Tiny Actions, Big Impact"
        copy="Chain simple, audited 'skills'—like summarise, translate, or share—into powerful routines without writing a line of code."
      />
    </div>
  </div>
</section>
-->

<!-- Simple Wedding Footer -->
<footer class="py-8 px-6 bg-coffee-dark text-coffee-light border-t border-coffee-medium">
  <div class="max-w-4xl mx-auto text-center">
    <p class="text-lg mb-2">
      💕 The Shumanbeans Wedding 💕
    </p>
    <p class="text-coffee-medium">
      © 2025 | Made with love for our special day
    </p>
  </div>
</footer>
