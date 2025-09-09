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
  <div class="relative inline-block w-full">
    <textarea
      bind:value={editedContent}
      on:keydown={handleKeydown}
      class="w-full min-h-[100px] p-2 border-2 border-blue-500 rounded bg-white text-black resize-y"
      placeholder="Enter your content here..."
      autofocus
    ></textarea>
    <div class="flex gap-2 mt-2">
      <button
        on:click={saveEdit}
        class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
      >
        Save (Ctrl+Enter)
      </button>
      <button
        on:click={cancelEdit}
        class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
      >
        Cancel (Esc)
      </button>
    </div>
  </div>
{:else}
  <svelte:element
    this={tag}
    class="{className} {isAdmin ? 'admin-editable' : ''}"
    on:click={startEdit}
    on:keydown={(e) => e.key === 'Enter' && startEdit()}
    tabindex={isAdmin ? 0 : undefined}
    title={isAdmin ? 'Click to edit' : undefined}
    role={isAdmin ? 'button' : undefined}
  >
    {@html content}
  </svelte:element>
{/if}

<style>
  :global(.admin-editable) {
    cursor: pointer !important;
    position: relative;
    border: 2px dashed transparent;
    transition: border-color 0.2s ease;
    padding: 4px;
    border-radius: 4px;
  }
  
  :global(.admin-editable:hover) {
    border-color: #3b82f6 !important;
    background-color: rgba(59, 130, 246, 0.1);
  }
  
  :global(.admin-editable:focus) {
    outline: none;
    border-color: #1d4ed8 !important;
    background-color: rgba(59, 130, 246, 0.1);
  }
</style>
