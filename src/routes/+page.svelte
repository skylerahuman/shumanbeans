<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import FeatureCard from '$lib/components/FeatureCard.svelte';
  import IntentShowcase from '$lib/components/IntentShowcase.svelte';
</script>

<svelte:head>
  <title>The Shumanbeans Wedding — Two Hearts, One Journey</title>
  <meta name="description" content="Join us in celebrating our love story and upcoming wedding. Find all the details, RSVP, and share in our joy at shumanbeans.com." />
</svelte:head>

<!-- Hero Section -->
<Hero />

<!-- Features Section -->
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

<!-- Intent Showcase Section -->
<IntentShowcase />

<!-- Trust & Social Proof Section -->
<section class="py-20 px-6 bg-kairos-gunmetal">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-kairos-silver mb-6">
        Built on <span class="text-kairos-trust-blue">Trust</span>, Loved by Users
      </h2>
    </div>
    
    <!-- User Avatars -->
    <div class="flex justify-center items-center space-x-8 mb-12">
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-kairos-trust-blue to-kairos-responsible-green rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
          T
        </div>
        <div class="text-kairos-cool-gray text-sm">Theologians</div>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-kairos-responsible-green to-kairos-warm-amber rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
          P
        </div>
        <div class="text-kairos-cool-gray text-sm">Productivity Coaches</div>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-kairos-warm-amber to-kairos-trust-blue rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
          A
        </div>
        <div class="text-kairos-cool-gray text-sm">Privacy Advocates</div>
      </div>
    </div>
    
    <!-- Testimonials -->
    <div class="bg-kairos-charcoal rounded-lg p-8 max-w-2xl mx-auto">
      <div class="text-center">
        <p class="text-kairos-silver text-lg mb-4 italic">
          "KairOS changed how I work—I'm 40% more focused and never miss a deadline."
        </p>
        <div class="text-kairos-cool-gray">— Chloe R.</div>
      </div>
    </div>
    
    <div class="bg-kairos-charcoal rounded-lg p-8 max-w-2xl mx-auto mt-6">
      <div class="text-center">
        <p class="text-kairos-silver text-lg mb-4 italic">
          "Finally, a browser that respects my time and data."
        </p>
        <div class="text-kairos-cool-gray">— Pastor J. Nguyen</div>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="py-16 px-6 bg-kairos-charcoal border-t border-kairos-cool-gray/20">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div>
        <h3 class="text-kairos-silver font-bold text-xl mb-4">KairOS</h3>
        <p class="text-kairos-cool-gray">
          Redeem your time with the intent-driven browser.
        </p>
      </div>
      
      <div>
        <h4 class="text-kairos-silver font-semibold mb-4">Product</h4>
        <ul class="space-y-2 text-kairos-cool-gray">
          <li><a href="#features" class="hover:text-kairos-trust-blue transition-colors">Features</a></li>
          <li><a href="#docs" class="hover:text-kairos-trust-blue transition-colors">Documentation</a></li>
          <li><a href="#github" class="hover:text-kairos-trust-blue transition-colors">GitHub</a></li>
        </ul>
      </div>
      
      <div>
        <h4 class="text-kairos-silver font-semibold mb-4">Company</h4>
        <ul class="space-y-2 text-kairos-cool-gray">
          <li><a href="#privacy" class="hover:text-kairos-trust-blue transition-colors">Privacy Policy</a></li>
          <li><a href="#about" class="hover:text-kairos-trust-blue transition-colors">About</a></li>
        </ul>
      </div>
      
      <div>
        <h4 class="text-kairos-silver font-semibold mb-4">Scripture</h4>
        <p class="text-kairos-cool-gray text-sm italic">
          "Look carefully then how you walk, not as unwise but as wise, making the best use of the time..."
        </p>
        <div class="text-kairos-trust-blue text-sm mt-2">— Ephesians 5:15–16</div>
      </div>
    </div>
    
    <div class="border-t border-kairos-cool-gray/20 pt-8 text-center">
      <p class="text-kairos-cool-gray">
        © 2025 Kairōs Inc. All rights reserved. | Pronounced <span class="text-kairos-trust-blue">/kī-ROHS/</span>
      </p>
    </div>
  </div>
</footer> 