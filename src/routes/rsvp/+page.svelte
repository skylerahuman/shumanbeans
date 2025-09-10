<script lang="ts">
  import { enhance } from "$app/forms";
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";

  export let form;
  export let data;

  let mounted = false;
  let attendeeNames = [""];
  let childrenNames = [""];
  let hasChildren = false;
  let isSubmitting = false;

  onMount(() => {
    mounted = true;
  });

  function addAttendee() {
    attendeeNames = [...attendeeNames, ""];
  }

  function removeAttendee(index: number) {
    attendeeNames = attendeeNames.filter((_, i) => i !== index);
  }

  function addChild() {
    childrenNames = [...childrenNames, ""];
  }

  function removeChild(index: number) {
    childrenNames = childrenNames.filter((_, i) => i !== index);
  }

  function handleSubmit() {
    isSubmitting = true;
    return async ({ update }: { update: () => Promise<void> }) => {
      await update();
      isSubmitting = false;
    };
  }

  function hasError(path: string) {
    return form?.errors?.find((e: any) => e.path.includes(path));
  }
</script>

<svelte:head>
  <title>RSVP - Chloe & Skyler's Wedding</title>
  <meta
    name="description"
    content="Please RSVP for Chloe and Skyler's wedding on November 22, 2025. Let us know if you'll join us for this special celebration."
  />
</svelte:head>

<div class="min-h-screen bg-cream-50">
  <!-- Header Section -->
  <section class="bg-coffee-800 text-cream-100 py-16 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-bold mb-4">RSVP</h1>
      <p class="text-xl text-cream-200">We can't wait to celebrate with you!</p>
    </div>
  </section>

  <div class="max-w-2xl mx-auto py-16 px-4 md:px-6">
    {#if data.hasSubmittedRSVP}
      <!-- Already Submitted RSVP Information -->
      <div class="text-center" in:fade={{ duration: 600 }}>
        <div
          class="bg-gradient-to-br from-coffee-50 to-cream-100 border-2 border-coffee-300 text-coffee-800 px-8 py-12 rounded-xl mb-8 shadow-lg"
        >
          <div class="text-6xl mb-6">📝</div>
          <h2 class="text-3xl font-serif font-bold mb-6 text-coffee-800">RSVP Information</h2>
          <p class="text-lg mb-6 leading-relaxed">
            Hi {data.submissionData.primaryName}! We have your RSVP on file.
          </p>
          
          <!-- RSVP Details Card -->
          <div class="bg-white p-6 rounded-lg border border-coffee-200 mb-6 mx-auto max-w-md">
            <h3 class="text-xl font-serif font-semibold text-coffee-800 mb-4">Your RSVP Details</h3>
            <div class="text-coffee-700 space-y-2">
              <p class="text-base">👥 <strong>{data.submissionData.attendanceCount} Guest{data.submissionData.attendanceCount > 1 ? 's' : ''}</strong></p>
              <p class="text-sm">📅 Submitted: {new Date(data.submissionData.submittedAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <!-- Wedding Details Card -->
          <div class="bg-white p-6 rounded-lg border border-coffee-200 mb-6 mx-auto max-w-md">
            <h3 class="text-xl font-serif font-semibold text-coffee-800 mb-4">Wedding Details</h3>
            <div class="text-coffee-700 space-y-2">
              <p class="text-lg font-medium">📅 <strong>November 22nd, 2025</strong></p>
              <p class="text-base">🕐 <strong>Arrive by 2:00 PM</strong></p>
              <p class="text-base">💒 <strong>Ceremony starts at 2:30 PM</strong></p>
            </div>
          </div>
          
          <p class="text-sm text-coffee-600 mb-4">
            Need to make changes to your RSVP? Please text Skyler at <strong>423-370-6198</strong>.
          </p>
          
          <p class="text-coffee-700 font-medium">
            We can't wait to celebrate with you! ☕💕
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
    {:else if form?.adminLogin}
      <!-- Admin Login Success -->
      <div class="text-center" in:fade={{ duration: 600 }}>
        <div
          class="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 text-red-800 px-8 py-12 rounded-xl mb-8 shadow-lg"
        >
          <div class="text-7xl mb-6">⚡</div>
          <h2 class="text-3xl font-serif font-bold mb-6 text-red-800">Admin Access Granted!</h2>
          <p class="text-lg mb-6 leading-relaxed">
            Welcome, Chloe! You now have admin privileges to edit content throughout the site.
          </p>
          
          <div class="bg-white p-6 rounded-lg border border-red-200 mb-6 mx-auto max-w-md">
            <h3 class="text-xl font-serif font-semibold text-red-800 mb-4">Admin Features</h3>
            <div class="text-red-700 space-y-2 text-left">
              <p class="text-sm">✏️ <strong>Edit Content:</strong> Click any text to edit it</p>
              <p class="text-sm">📸 <strong>Upload Registry Items:</strong> Add new items with images</p>
              <p class="text-sm">🎨 <strong>Update Site Text:</strong> Modify content across all pages</p>
            </div>
          </div>
          
          <p class="text-sm text-red-600 mb-4">
            Look for the red admin bar at the top of the page. Click "Exit" when you're done.
          </p>
          
          <p class="text-red-700 font-medium">
            Happy editing! 🎉
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            class="bg-red-700 text-white px-6 py-3 rounded-md hover:bg-red-800 transition-colors duration-300"
          >
            Go to Homepage
          </a>
          <a
            href="/registry"
            class="bg-red-100 text-red-800 border-2 border-red-700 px-6 py-3 rounded-md hover:bg-red-200 transition-colors duration-300"
          >
            Manage Registry
          </a>
        </div>
      </div>
    {:else if form?.success && !form?.adminLogin}
      <!-- Success Message -->
      <div class="text-center" in:fade={{ duration: 600 }}>
        <div
          class="bg-gradient-to-br from-coffee-50 to-cream-100 border-2 border-coffee-300 text-coffee-800 px-8 py-12 rounded-xl mb-8 shadow-lg"
        >
          <div class="text-7xl mb-6">🎉</div>
          <h2 class="text-3xl font-serif font-bold mb-6 text-coffee-800">Thank You!</h2>
          <p class="text-lg mb-6 leading-relaxed">
            We've received your RSVP and are absolutely thrilled that you'll be joining us for our special day!
          </p>
          
          <!-- Wedding Details Card -->
          <div class="bg-white p-6 rounded-lg border border-coffee-200 mb-6 mx-auto max-w-md">
            <h3 class="text-xl font-serif font-semibold text-coffee-800 mb-4">Save the Date</h3>
            <div class="text-coffee-700 space-y-2">
              <p class="text-lg font-medium">📅 <strong>November 22nd, 2025</strong></p>
              <p class="text-base">🕐 <strong>Arrive by 2:00 PM</strong></p>
              <p class="text-base">💒 <strong>Ceremony starts at 2:30 PM</strong></p>
            </div>
          </div>
          
          <p class="text-sm text-coffee-600 mb-4">
            You should receive a confirmation email shortly with all the wedding details and venue information.
          </p>
          
          <p class="text-coffee-700 font-medium">
            We can't wait to celebrate with you! ☕💕
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
      <!-- Error Messages -->
      {#if form?.isDuplicate}
        <div class="mb-8" in:fade={{ duration: 600 }}>
          <div class="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
            <div class="flex items-center mb-4">
              <div class="text-amber-500 text-2xl mr-3">⚠️</div>
              <h2 class="text-xl font-semibold text-amber-800">RSVP Already Submitted</h2>
            </div>
            <p class="text-amber-700 mb-4">{form.message}</p>
            <div class="text-sm text-amber-600">
              <p>If you need to make changes, please contact us directly:</p>
              <p class="font-medium mt-1">📧 <a href="mailto:us@shumanbeans.com" class="underline hover:text-amber-800">us@shumanbeans.com</a></p>
              <p class="font-medium">📱 Text Skyler at <a href="tel:423-370-6198" class="underline hover:text-amber-800">423-370-6198</a></p>
            </div>
          </div>
        </div>
      {:else if form?.message && !form?.success}
        <div class="mb-8" in:fade={{ duration: 600 }}>
          <div class="bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <div class="flex items-center mb-4">
              <div class="text-red-500 text-2xl mr-3">❌</div>
              <h2 class="text-xl font-semibold text-red-800">Submission Error</h2>
            </div>
            <p class="text-red-700 mb-4">{form.message}</p>
            <p class="text-sm text-red-600">Please try again, or contact us if the problem persists.</p>
          </div>
        </div>
      {/if}
      
      <!-- RSVP Form -->
      {#if mounted}
        <div in:fly={{ y: 30, duration: 600, delay: 200 }}>
          <div class="bg-white p-8 rounded-lg shadow-lg">
            <form method="POST" use:enhance={handleSubmit}>
              <!-- Contact Information -->
              <section class="mb-8">
                <h2
                  class="text-2xl font-serif font-semibold text-coffee-800 mb-4"
                >
                  Contact Information
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="primaryName"
                      class="block text-sm font-medium text-coffee-700 mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="primaryName"
                      name="primaryName"
                      required
                      value={form?.data?.primaryName || ""}
                      class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                    {#if hasError("primaryName")}
                      <p class="text-red-600 text-sm mt-1">
                        {hasError("primaryName")?.message}
                      </p>
                    {/if}
                  </div>

                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-coffee-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autocomplete="email"
                      spellcheck="false"
                      value={form?.data?.email || ""}
                      on:blur={(e) => {
                        // Clean up email input on blur
                        e.target.value = e.target.value.trim().toLowerCase();
                      }}
                      class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                      placeholder="your@email.com"
                      title="Please enter a valid email address (e.g., user@gmail.com)"
                    />
                    {#if hasError("email")}
                      <p class="text-red-600 text-sm mt-1">
                        {hasError("email")?.message}
                      </p>
                    {/if}
                  </div>
                </div>
              </section>

              <!-- Attendance Information -->
              <section class="mb-8">
                <h2
                  class="text-2xl font-serif font-semibold text-coffee-800 mb-4"
                >
                  Who's Attending?
                </h2>

                <div class="mb-4">
                  <fieldset class="border border-coffee-200 rounded-lg p-4">
                    <legend class="text-sm font-medium text-coffee-700 px-2">
                      Attendee Names *
                    </legend>
                    {#each attendeeNames as _, index}
                      <div class="flex gap-2 mb-2">
                        <label for="attendee-{index}" class="sr-only"
                          >Attendee {index + 1} name</label
                        >
                        <input
                          type="text"
                          id="attendee-{index}"
                          name="attendeeNames"
                          bind:value={attendeeNames[index]}
                          placeholder="Full name of attendee {index + 1}"
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
                  </fieldset>
                </div>

                <div class="mb-4">
                  <label
                    for="attendanceCount"
                    class="block text-sm font-medium text-coffee-700 mb-2"
                  >
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
                    <fieldset class="border border-coffee-200 rounded-lg p-4">
                      <legend class="text-sm font-medium text-coffee-700 px-2">
                        Children's Names
                      </legend>
                      {#each childrenNames as _, index}
                        <div class="flex gap-2 mb-2">
                          <label for="child-{index}" class="sr-only"
                            >Child {index + 1} name and age</label
                          >
                          <input
                            type="text"
                            id="child-{index}"
                            name="childrenNames"
                            bind:value={childrenNames[index]}
                            placeholder="Child {index + 1} name and age"
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
                    </fieldset>
                  </div>
                {/if}
              </section>

              <!-- Practical Information -->
              <section class="mb-8">
                <h2
                  class="text-2xl font-serif font-semibold text-coffee-800 mb-4"
                >
                  Let Us Know
                </h2>


                <div class="mb-4">
                  <label
                    for="dietaryRestrictions"
                    class="block text-sm font-medium text-coffee-700 mb-2"
                  >
                    Dietary Restrictions or Food Allergies
                  </label>
                  <textarea
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    rows="3"
                    value={form?.data?.dietaryRestrictions || ""}
                    placeholder="Please let us know about any dietary needs..."
                    class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                  />
                </div>
              </section>

              <!-- Fun Questions -->
              <section class="mb-8">
                <h2
                  class="text-2xl font-serif font-semibold text-coffee-800 mb-4"
                >
                  Just for Fun ☕
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      for="favoriteCoffee"
                      class="block text-sm font-medium text-coffee-700 mb-2"
                    >
                      What's your favorite coffee drink?
                    </label>
                    <input
                      type="text"
                      id="favoriteCoffee"
                      name="favoriteCoffee"
                      value={form?.data?.favoriteCoffee || ""}
                      placeholder="Cappuccino, Pour over, Cold brew..."
                      class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      for="favoriteSong"
                      class="block text-sm font-medium text-coffee-700 mb-2"
                    >
                      Favorite song for dancing?
                    </label>
                    <input
                      type="text"
                      id="favoriteSong"
                      name="favoriteSong"
                      value={form?.data?.favoriteSong || ""}
                      placeholder="Artist - Song Title"
                      class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                    />
                  </div>
                </div>

                <div class="mb-6">
                  <label
                    for="specialMessage"
                    class="block text-sm font-medium text-coffee-700 mb-2"
                  >
                    Special Message for the Couple
                  </label>
                  <textarea
                    id="specialMessage"
                    name="specialMessage"
                    rows="4"
                    value={form?.data?.specialMessage || ""}
                    placeholder="Share a memory, blessing, or any special message for Chloe and Skyler..."
                    class="w-full px-4 py-2 border border-coffee-300 rounded-md focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors"
                  />
                </div>
              </section>

              <!-- Contact Information Notice -->
              <div class="bg-coffee-50 border border-coffee-200 rounded-lg p-4 mb-6">
                <div class="flex items-start gap-3">
                  <div class="text-coffee-600 mt-1">
                    <span class="text-lg">📱</span>
                  </div>
                  <div class="text-sm text-coffee-700">
                    <p class="font-medium mb-1">Need help with your RSVP?</p>
                    <p>If you submit an RSVP and don't receive a confirmation email within a few minutes, please text Skyler at <strong>423-370-6198</strong>.</p>
                  </div>
                </div>
              </div>

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

                <p class="text-sm text-coffee-600 mt-4">* Required fields</p>
              </div>
            </form>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>
