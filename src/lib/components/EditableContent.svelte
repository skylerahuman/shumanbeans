<script>
  export let contentId = '';
  export let content = '';
  export let isAdmin = false;
  export let tag = 'div'; // HTML tag to render
  export let className = '';
  
  let isEditing = false;
  let editedContent = content;
  let originalContent = content;
  
  function startEdit() {
    if (!isAdmin) return;
    isEditing = true;
    editedContent = content;
    originalContent = content;
  }
  
  function cancelEdit() {
    isEditing = false;
    editedContent = originalContent;
  }
  
  async function saveEdit() {
    try {
      const response = await fetch('/admin/content/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          content: editedContent
        })
      });
      
      if (response.ok) {
        content = editedContent;
        isEditing = false;
        // Show success feedback
        showFeedback('Content updated!', 'success');
      } else {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      showFeedback('Failed to update content', 'error');
      cancelEdit();
    }
  }
  
  function showFeedback(message, type) {
    // Simple feedback system - you could make this more elaborate
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.className = `fixed top-20 right-4 z-50 px-4 py-2 rounded text-white text-sm ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 3000);
  }
  
  function handleKeydown(event) {
    if (event.key === 'Enter' && event.ctrlKey) {
      saveEdit();
    } else if (event.key === 'Escape') {
      cancelEdit();
    }
  }
</script>

{#if isEditing}
  <div class="relative w-full">
    <textarea
      bind:value={editedContent}
      on:keydown={handleKeydown}
      class="w-full min-h-[100px] p-3 border-2 border-blue-500 rounded-lg bg-white text-black resize-y font-inherit"
      placeholder="Enter your content here..."
      autofocus
    ></textarea>
    <div class="flex gap-2 mt-3">
      <button
        on:click={saveEdit}
        class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Save (Ctrl+Enter)
      </button>
      <button
        on:click={cancelEdit}
        class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        Cancel (Esc)
      </button>
    </div>
  </div>
{:else}
  <div class="{isAdmin ? 'admin-content-wrapper' : ''}">
    <svelte:element
      this={tag}
      class="{className} {isAdmin ? 'admin-editable' : ''}"
      on:click={isAdmin ? startEdit : undefined}
      on:keydown={(e) => isAdmin && e.key === 'Enter' && startEdit()}
      tabindex={isAdmin ? 0 : undefined}
      role={isAdmin ? 'button' : undefined}
    >
      {@html content}
    </svelte:element>
    {#if isAdmin}
      <button
        on:click={startEdit}
        class="admin-edit-btn opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        title="Edit this content"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
      </button>
    {/if}
  </div>
{/if}

<style>
  :global(.admin-content-wrapper) {
    position: relative;
    display: inline-block;
    width: 100%;
  }
  
  :global(.admin-content-wrapper:hover) {
    /* Show the edit button on hover */
  }
  
  :global(.admin-content-wrapper:hover .admin-edit-btn) {
    opacity: 1 !important;
  }
  
  .admin-edit-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }
  
  .admin-edit-btn:hover {
    background: #1d4ed8;
    transform: scale(1.1);
  }
  
  :global(.admin-editable) {
    cursor: pointer !important;
    position: relative;
    border: 2px dashed transparent;
    transition: all 0.2s ease;
    padding: 8px;
    border-radius: 6px;
    min-height: 20px;
  }
  
  :global(.admin-editable:hover) {
    border-color: #3b82f6 !important;
    background-color: rgba(59, 130, 246, 0.05);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
  
  :global(.admin-editable:focus) {
    outline: none;
    border-color: #1d4ed8 !important;
    background-color: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }
  
  /* Add a small indicator that content is editable */
  :global(.admin-editable::before) {
    content: '';
    position: absolute;
    top: -3px;
    right: -3px;
    width: 8px;
    height: 8px;
    background: #3b82f6;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  :global(.admin-editable:hover::before) {
    opacity: 0.7;
  }
</style>
