<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade, fly } from 'svelte/transition';

  export const data = {};

  let mounted = false;
  let emailSent = false;
  let emailError = null;

  onMount(() => {
    mounted = true;
    // Get email status from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    emailSent = urlParams.get('emailSent') === 'true';
    emailError = urlParams.get('emailError');
  });
</script>

<svelte:head>
  <title>RSVP Confirmed - Skyler & Chloe's Wedding</title>
  <meta name="description" content="Your RSVP has been successfully submitted for Skyler and Chloe's wedding!" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
  {#if mounted}
    <div class="max-w-2xl w-full" in:fade={{ duration: 600 }}>
      <!-- Success Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-12 text-center text-white">
          <div class="text-6xl mb-4" in:fly={{ y: -30, duration: 800, delay: 200 }}>🎉</div>
          <h1 class="text-3xl md:text-4xl font-serif font-bold mb-3" in:fly={{ y: 20, duration: 600, delay: 400 }}>
            RSVP Confirmed!
          </h1>
          <p class="text-xl opacity-90" in:fly={{ y: 20, duration: 600, delay: 600 }}>
            Thank you for letting us know you're coming
          </p>
        </div>

        <!-- Content -->
        <div class="px-8 py-12">
          <div class="text-center mb-8" in:fly={{ y: 30, duration: 600, delay: 800 }}>
            <h2 class="text-2xl font-serif text-gray-800 mb-4">We can't wait to celebrate with you!</h2>
            <p class="text-lg text-gray-600 leading-relaxed">
              Your RSVP has been successfully submitted and saved. We'll be sending out more details 
              about the ceremony and reception as we get closer to the big day.
            </p>
          </div>

          <!-- Email Status -->
          {#if emailSent}
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6" in:fly={{ y: 20, duration: 600, delay: 1000 }}>
              <div class="flex items-center">
                <div class="text-green-500 mr-3">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-green-800">Confirmation email sent!</p>
                  <p class="text-sm text-green-600">Check your inbox for a confirmation email with all the details.</p>
                </div>
              </div>
            </div>
          {:else if emailError}
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6" in:fly={{ y: 20, duration: 600, delay: 1000 }}>
              <div class="flex items-center">
                <div class="text-yellow-500 mr-3">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-yellow-800">RSVP saved, but email not sent</p>
                  <p class="text-sm text-yellow-600">Your RSVP is confirmed, but we couldn't send the confirmation email. No worries - your response is safely recorded!</p>
                </div>
              </div>
            </div>
          {/if}

          <!-- Next Steps -->
          <div class="bg-blue-50 rounded-lg p-6 mb-8" in:fly={{ y: 30, duration: 600, delay: 1200 }}>
            <h3 class="text-lg font-semibold text-blue-800 mb-3">What's Next?</h3>
            <ul class="space-y-2 text-blue-700">
              <li class="flex items-center">
                <span class="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                We'll send more details about the ceremony and reception soon
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Check out our <a href="/registry" class="underline hover:text-blue-800">wedding registry</a> if you'd like
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Contact us if you need to make any changes to your RSVP
              </li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="text-center space-y-4" in:fly={{ y: 30, duration: 600, delay: 1400 }}>
            <a 
              href="/" 
              class="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Back to Home
            </a>
            <div class="flex justify-center space-x-4 text-sm">
              <a href="/registry" class="text-blue-600 hover:text-blue-800 underline">
                View Registry
              </a>
              <a href="/story" class="text-blue-600 hover:text-blue-800 underline">
                Our Story
              </a>
            </div>
          </div>

          <!-- Contact -->
          <div class="mt-8 text-center text-sm text-gray-500" in:fly={{ y: 20, duration: 600, delay: 1600 }}>
            <p>Need to make changes? Contact us at <a href="mailto:us@shumanbeans.com" class="text-blue-600 hover:underline">us@shumanbeans.com</a></p>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
