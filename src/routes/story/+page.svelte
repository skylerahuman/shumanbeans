<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  let mounted = false;
  let showBackToTop = false;
  
  onMount(() => {
    mounted = true;
    
    const handleScroll = () => {
      showBackToTop = window.scrollY > 400;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
  
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<svelte:head>
  <title>Our Story - Chloe & Skyler</title>
  <meta name="description" content="Discover how Chloe and Skyler's love story began at Mean Mug Coffee and blossomed through faith, coffee, and countless adventures together." />
</svelte:head>

<div class="min-h-screen bg-cream-50">
  <!-- Header Section -->
  <section class="bg-coffee-800 text-cream-100 py-16 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-bold mb-4">Our Story</h1>
      <p class="text-xl text-cream-200">
        A love story brewed with coffee, faith, and God's perfect timing
      </p>
    </div>
  </section>

  <!-- Story Content -->
  <article class="max-w-4xl mx-auto py-16 px-4 md:px-6">
    <div class="prose prose-lg max-w-none text-coffee-900">
      
      <!-- Chapter 1: First Meeting -->
      <section class="mb-16">
        {#if mounted}
          <div in:fly={{ y: 30, duration: 600, delay: 200 }}>
            <div class="flex items-center justify-center mb-8">
              <span class="text-3xl">☕</span>
              <span class="w-16 h-px bg-coffee-400 mx-4"></span>
              <h2 class="text-2xl md:text-3xl font-serif font-semibold text-coffee-800">The Meeting</h2>
              <span class="w-16 h-px bg-coffee-400 mx-4"></span>
              <span class="text-3xl">💕</span>
            </div>
            
            <div class="bg-white p-8 rounded-lg shadow-md">
              <p class="text-lg leading-relaxed mb-6">
                November 26th, 2023 — a date we'll never forget. The Northshore Mean Mug in Chattanooga was 
                bustling with the usual Sunday afternoon crowd. Skyler had claimed a table, but when he saw 
                Chloe looking for a place to sit, he offered his spot with a simple gesture of kindness.
              </p>
              
              <p class="text-lg leading-relaxed mb-6">
                Before she could even sit down, someone else swooped in and took the table! What could have 
                been an awkward moment turned into the beginning of our love story. Rather than let the 
                situation fizzle into uncomfortable silence, Skyler struck up a conversation.
              </p>
              
              <p class="text-lg leading-relaxed">
                By the end of that conversation, he had asked her on a date. And thankfully, she said yes.
              </p>
            </div>
          </div>
        {/if}
      </section>

      <!-- Chapter 2: The First Date -->
      <section class="mb-16">
        {#if mounted}
          <div in:fly={{ y: 30, duration: 600, delay: 400 }}>
            <div class="flex items-center justify-center mb-8">
              <span class="text-3xl">😅</span>
              <span class="w-16 h-px bg-coffee-400 mx-4"></span>
              <h2 class="text-2xl md:text-3xl font-serif font-semibold text-coffee-800">The First Date</h2>
              <span class="w-16 h-px bg-coffee-400 mx-4"></span>
              <span class="text-3xl">🗺️</span>
            </div>
            
            <div class="bg-cream-100 p-8 rounded-lg">
              <p class="text-lg leading-relaxed mb-6">
                Here's where it gets interesting (and embarrassing for Skyler). Our first official date was 
                supposed to be back at Mean Mug. Simple, right? Well, Chattanooga has multiple Mean Mug locations, 
                and Skyler went to the <em>wrong one</em>.
              </p>
              
              <p class="text-lg leading-relaxed mb-6">
                Thirty minutes. Chloe waited thirty entire minutes for him to show up. Any reasonable person 
                would have left, written him off as unreliable, and moved on. But praise God, Chloe is patient 
                and gracious beyond measure.
              </p>
              
              <p class="text-lg leading-relaxed">
                When Skyler finally realized his mistake and arrived (frazzled and profusely apologetic), 
                Chloe still agreed to more dates. By the third date, they had established a new rule: 
                Skyler picks her up, so they go to the same place at the same time. Smart thinking.
              </p>
            </div>
          </div>
        {/if}
      </section>

      <!-- Chapter 3: Growing in Faith -->
      <section class="mb-16">
        {#if mounted}
          <div in:fly={{ y: 30, duration: 600, delay: 600 }}>
            <div class="flex items-center justify-center mb-8">
              <span class="text-3xl">⛪</span>
              <span class="w-16 h-px bg-coffee-400 mx-4"></span>
              <h2 class="text-2xl md:text-3xl font-serif font-semibold text-coffee-800">Growing in Faith</h2>
              <span class="w-16 h-px bg-coffee-400 mx-4"></span>
              <span class="text-3xl">🙏</span>
            </div>
            
            <div class="bg-white p-8 rounded-lg shadow-md">
              <p class="text-lg leading-relaxed mb-6">
                In July 2024, we made what some might call a risky decision. We both left our respective 
                churches to join Christ Reformed Baptist Church together. It was a step of faith that 
                brought us closer to God and to each other.
              </p>
              
              <p class="text-lg leading-relaxed mb-6">
                The Lord was faithful to bless us with a wonderful community of believers who loved hearing 
                the Gospel preached faithfully. As we grew in our understanding of God's Word and His grace, 
                our relationship deepened and strengthened.
              </p>
              
              <p class="text-lg leading-relaxed">
                Of course, no relationship is perfect. We don't shy away from talking about our challenges 
                and the conflicts we've worked through. But we learned to see every difficult moment as an 
                opportunity to glorify God, to practice forgiveness, and to grow in love for one another.
              </p>
            </div>
          </div>
        {/if}
      </section>

      <!-- Chapter 4: The Proposal -->
      <section class="mb-16">
        {#if mounted}
          <div in:fly={{ y: 30, duration: 600, delay: 800 }}>
            <div class="flex items-center justify-center mb-8">
              <span class="text-3xl">💍</span>
              <span class="w-16 h-px bg-coffee-400 mx-4"></span>
              <h2 class="text-2xl md:text-3xl font-serif font-semibold text-coffee-800">The Proposal</h2>
              <span class="w-16 h-px bg-coffee-400 mx-4"></span>
              <span class="text-3xl">🏔️</span>
            </div>
            
            <div class="bg-coffee-50 p-8 rounded-lg">
              <p class="text-lg leading-relaxed mb-6">
                July 2025, Raccoon Mountain. Skyler had it all planned out — a romantic sunrise, 
                freshly made coffee, and the perfect mountain backdrop for popping the question.
              </p>
              
              <p class="text-lg leading-relaxed mb-6">
                But as they say, man plans and God laughs. Skyler's car decided that morning was the perfect 
                time to break down. No car meant no homemade coffee setup. Instead of the carefully crafted 
                coffee experience he'd planned, Skyler had to stop at... Starbucks.
              </p>
              
              <p class="text-lg leading-relaxed mb-6">
                If you know Chloe and Skyler, you know that Starbucks is pretty much the antithesis of 
                everything we stand for in coffee culture. It was less than ideal, to put it mildly.
              </p>
              
              <p class="text-lg leading-relaxed font-medium text-coffee-800">
                But despite the broken-down car, the subpar coffee, and all the ways the proposal didn't 
                go according to plan, Chloe said YES! 
              </p>
            </div>
          </div>
        {/if}
      </section>

      <!-- Chapter 5: Looking Forward -->
      <section class="mb-16">
        {#if mounted}
          <div in:fly={{ y: 30, duration: 600, delay: 1000 }}>
            <div class="flex items-center justify-center mb-8">
              <span class="text-3xl">💒</span>
              <span class="w-16 h-px bg-coffee-400 mx-4"></span>
              <h2 class="text-2xl md:text-3xl font-serif font-semibold text-coffee-800">Our Wedding Day</h2>
              <span class="w-16 h-px bg-coffee-400 mx-4"></span>
              <span class="text-3xl">🎉</span>
            </div>
            
            <div class="bg-white p-8 rounded-lg shadow-md">
              <p class="text-lg leading-relaxed mb-6">
                November 22nd, 2025, at 2:30 PM, we'll exchange vows at the beautiful Highlands Chapel 
                at Howe Farms. We're beyond excited to celebrate this covenant before God with all our 
                favorite people.
              </p>
              
              <p class="text-lg leading-relaxed">
                And yes, there will be proper coffee and pizza at the reception — two things that have 
                been central to our story from the very beginning. We can't wait to share this joy with 
                you and celebrate how God has written our love story with His perfect hand.
              </p>
            </div>
          </div>
        {/if}
      </section>

    </div>
  </article>
  
  <!-- Back to Top Button -->
  {#if showBackToTop}
    <button
      class="fixed bottom-24 md:bottom-8 right-8 bg-coffee-700 text-white p-3 rounded-full shadow-lg hover:bg-coffee-800 transition-all duration-300 hover:transform hover:scale-110 z-40"
      on:click={scrollToTop}
      aria-label="Back to top"
      transition:fade={{ duration: 300 }}
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
      </svg>
    </button>
  {/if}
</div>
