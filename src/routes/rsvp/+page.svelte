<script>
  import { enhance } from '$app/forms';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  
  export let form;
  
  let mounted = false;
  let attendeeNames = [''];
  let childrenNames = [''];
  let hasChildren = false;
  let isSubmitting = false;
  
  onMount(() => {
    mounted = true;
  });
  
  function addAttendee() {
    attendeeNames = [...attendeeNames, ''];
  }
  
  function removeAttendee(index) {
    attendeeNames = attendeeNames.filter((_, i) => i !== index);
  }
  
  function addChild() {
    childrenNames = [...childrenNames, ''];
  }
  
  function removeChild(index) {
    childrenNames = childrenNames.filter((_, i) => i !== index);
  }
  
  function handleSubmit() {
    isSubmitting = true;
    return async ({ update }) => {
      await update();
      isSubmitting = false;
    };
  }
</script>

<svelte:head>
  <title>RSVP - Chloe & Skyler's Wedding</title>
  <meta name="description" content="Please RSVP for Chloe and Skyler's wedding on November 22, 2025. Let us know if you'll join us for this special celebration." />
</svelte:head>

<div class="min-h-screen bg-cream-50">
  <!-- Header Section -->
  <section class="bg-coffee-800 text-cream-100 py-16 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-bold mb-4">RSVP</h1>
      <p class="text-xl text-cream-200">
        We can't wait to celebrate with you!
      </p>
    </div>
  </section>

  <div class="max-w-2xl mx-auto py-16 px-4 md:px-6">
    {#if form?.success}
      <!-- Success Message -->
      <div class="text-center" in:fade={{ duration: 600 }}>
        <div class="bg-green-100 border border-green-400 text-green-700 px-8 py-12 rounded-lg mb-8">
          <div class="text-6xl mb-4">🎉</div>
          <h2 class="text-2xl font-serif font-bold mb-4">Thank You!</h2>
          <p class="text-lg">
            We've received your RSVP and can't wait to celebrate with you on November 22nd!
          </p>
          <p class="text-sm mt-4 text-green-600">
            You should receive a confirmation email shortly with all the wedding details.
          </p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/story" 
            class="bg-coffee-700 text-cream-100 px-6 py-3 rounded-md hover:bg-coffee-800 transition-colors duration-300"
          >
            Read Our Story
          </a>
          <a 
            href="/registry" 
            class="bg-coffee-100 text-coffee-800 border-2 border-coffee-700 px-6 py-3 rounded-md hover:bg-coffee-200 transition-colors duration-300"
          >
            View Registry
          </a>
        </div>
      </div>
    {:else}
      <!-- RSVP Form -->
      {#if mounted}
        <div in:fly={{ y: 30, duration: 600, delay: 200 }}>
          <div class="bg-white p-8 rounded-lg shadow-lg">
            <form method="POST" use:enhance={handleSubmit}>
              
              <!-- Contact Information -->
              <section class="mb-8">
                <h2 class="text-2xl font-serif font-semibold text-coffee-800 mb-4">Contact Information</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="primaryName" class="block text-sm font-medium text-coffee-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="primaryName"
                      name="primaryName"
                      required
                      value={form?.data?.primaryName || ''}
                      class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                    {#if form?.errors?.find(e => e.path.includes('primaryName'))}
                      <p class="text-red-600 text-sm mt-1">{form.errors.find(e => e.path.includes('primaryName')).message}</p>
                    {/if}
                  </div>
                  
                  <div>
                    <label for="email" class="block text-sm font-medium text-coffee-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={form?.data?.email || ''}
                      class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                      placeholder="your@email.com"
                    />
                    {#if form?.errors?.find(e => e.path.includes('email'))}
                      <p class="text-red-600 text-sm mt-1">{form.errors.find(e => e.path.includes('email')).message}</p>
                    {/if}
                  </div>
                </div>
              </section>

              <!-- Attendance Information -->
              <section class="mb-8">
                <h2 class="text-2xl font-serif font-semibold text-coffee-800 mb-4">Who's Attending?</h2>
                
                <div class="mb-4">
                  <label class="block text-sm font-medium text-coffee-700 mb-2">
                    Attendee Names *
                  </label>
                  {#each attendeeNames as name, index}
                    <div class="flex gap-2 mb-2">
                      <input
                        type="text"
                        name="attendeeNames"
                        bind:value={attendeeNames[index]}
                        placeholder="Full name of attendee"
                        class="flex-1 px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                      />
                      {#if index > 0}
                        <button
                          type="button"
                          on:click={() => removeAttendee(index)}
                          class="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          aria-label="Remove attendee"
                        >
                          ×
                        </button>
                      {/if}
                    </div>
                  {/each}
                  
                  <button
                    type="button"
                    on:click={addAttendee}
                    class="text-coffee-700 font-medium hover:text-coffee-900 transition-colors text-sm"
                  >
                    + Add Another Attendee
                  </button>
                </div>
                
                <div class="mb-4">
                  <label for="attendanceCount" class="block text-sm font-medium text-coffee-700 mb-2">
                    Total Number of Attendees *
                  </label>
                  <input
                    type="number"
                    id="attendanceCount"
                    name="attendanceCount"
                    min="1"
                    value={form?.data?.attendanceCount || attendeeNames.length}
                    class="w-32 px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                  />
                </div>
                
                <div class="mb-4">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      name="hasChildren"
                      bind:checked={hasChildren}
                      class="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-coffee-300 rounded"
                    />
                    <span class="ml-2 text-sm font-medium text-coffee-700">
                      I'll be bringing children
                    </span>
                  </label>
                </div>
                
                {#if hasChildren}
                  <div class="ml-6 mb-4" transition:fade={{ duration: 300 }}>
                    <label class="block text-sm font-medium text-coffee-700 mb-2">
                      Children's Names
                    </label>
                    {#each childrenNames as name, index}
                      <div class="flex gap-2 mb-2">
                        <input
                          type="text"
                          name="childrenNames"
                          bind:value={childrenNames[index]}
                          placeholder="Child's name and age"
                          class="flex-1 px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                        />
                        {#if index > 0}
                          <button
                            type="button"
                            on:click={() => removeChild(index)}
                            class="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                            aria-label="Remove child"
                          >
                            ×
                          </button>
                        {/if}
                      </div>
                    {/each}
                    
                    <button
                      type="button"
                      on:click={addChild}
                      class="text-coffee-700 font-medium hover:text-coffee-900 transition-colors text-sm"
                    >
                      + Add Another Child
                    </button>
                  </div>
                {/if}
              </section>

              <!-- Practical Information -->
              <section class="mb-8">
                <h2 class="text-2xl font-serif font-semibold text-coffee-800 mb-4">Let Us Know</h2>
                
                <div class="mb-4">
                  <label class="block text-sm font-medium text-coffee-700 mb-2">
                    Will you need parking?
                  </label>
                  <div class="space-y-2">
                    {#each [['yes', 'Yes'], ['no', 'No'], ['unsure', "I'm not sure yet"]] as [value, label]}
                      <label class="flex items-center">
                        <input
                          type="radio"
                          name="needsParking"
                          {value}
                          checked={form?.data?.needsParking === value}
                          class="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-coffee-300"
                        />
                        <span class="ml-2 text-sm text-coffee-700">{label}</span>
                      </label>
                    {/each}
                  </div>
                </div>
                
                <div class="mb-4">
                  <label for="dietaryRestrictions" class="block text-sm font-medium text-coffee-700 mb-2">
                    Dietary Restrictions or Food Allergies
                  </label>
                  <textarea
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    rows="3"
                    value={form?.data?.dietaryRestrictions || ''}
                    placeholder="Please let us know about any dietary needs..."
                    class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                  ></textarea>
                </div>
              </section>

              <!-- Fun Questions -->
              <section class="mb-8">
                <h2 class="text-2xl font-serif font-semibold text-coffee-800 mb-4">Just for Fun ☕</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="favoriteCoffee" class="block text-sm font-medium text-coffee-700 mb-2">
                      What's your favorite coffee drink?
                    </label>
                    <input
                      type="text"
                      id="favoriteCoffee"
                      name="favoriteCoffee"
                      value={form?.data?.favoriteCoffee || ''}
                      placeholder="Cappuccino, Pour over, Cold brew..."
                      class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label for="favoriteSong" class="block text-sm font-medium text-coffee-700 mb-2">
                      Favorite song for dancing?
                    </label>
                    <input
                      type="text"
                      id="favoriteSong"
                      name="favoriteSong"
                      value={form?.data?.favoriteSong || ''}
                      placeholder="Artist - Song Title"
                      class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div class="mb-6">
                  <label for="specialMessage" class="block text-sm font-medium text-coffee-700 mb-2">
                    Special Message for the Couple
                  </label>
                  <textarea
                    id="specialMessage"
                    name="specialMessage"
                    rows="4"
                    value={form?.data?.specialMessage || ''}
                    placeholder="Share a memory, blessing, or any special message for Chloe and Skyler..."
                    class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                  ></textarea>
                </div>
              </section>

              <!-- Submit Button -->
              <div class="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  class="bg-coffee-700 text-cream-100 px-8 py-3 rounded-md font-semibold text-lg hover:bg-coffee-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:transform hover:scale-105"
                >
                  {#if isSubmitting}
                    Submitting...
                  {:else}
                    Send RSVP
                  {/if}
                </button>
                
                <p class="text-sm text-coffee-600 mt-4">
                  * Required fields
                </p>
              </div>
            </form>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>
