<script>
  import { onMount } from 'svelte';
  
  export let contentId = '';
  export let content = '';
  export let isAdmin = false;
  export let tag = 'div';
  export let className = '';
  export let placeholder = 'Click to edit this text...';
  
  let isEditing = false;
  let editedContent = content;
  let currentContent = content;
  let textareaRef;
  let saving = false;
  let showSuccess = false;
  
  onMount(async () => {
    if (isAdmin && contentId) {
      // Load saved content from server
      try {
        const response = await fetch(`/admin/content/get/${contentId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.content && data.content.content) {
            currentContent = data.content.content;
            editedContent = currentContent;
          }
        }
      } catch (error) {
        console.log('Using default content for', contentId, ':', error);
      }
    }
  });
  
  function startEdit() {
    if (!isAdmin) return;
    isEditing = true;
    editedContent = currentContent || content;
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus();
        textareaRef.select();
      }
    }, 50);
  }
  
  function cancelEdit() {
    isEditing = false;
    editedContent = currentContent;
  }
  
  async function saveEdit() {
    if (saving) return;
    saving = true;
    
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
        currentContent = editedContent;
        isEditing = false;
        showSuccess = true;
        setTimeout(() => showSuccess = false, 2000);
        console.log(`✅ Updated content for ${contentId}`);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      saving = false;
    }
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
  <!-- Editing Mode -->
  <div class="simple-editable-editing">
    <textarea
      bind:this={textareaRef}
      bind:value={editedContent}
      on:keydown={handleKeydown}
      class="simple-editable-textarea {className}"
      {placeholder}
      rows="4"
    ></textarea>
    <div class="simple-editable-buttons">
      <button
        on:click={saveEdit}
        disabled={saving}
        class="simple-editable-save"
        title="Save changes (Ctrl+Enter)"
      >
        {#if saving}
          <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Saving...
        {:else}
          ✅ Save
        {/if}
      </button>
      <button
        on:click={cancelEdit}
        disabled={saving}
        class="simple-editable-cancel"
        title="Cancel editing (Esc)"
      >
        ❌ Cancel
      </button>
    </div>
    <div class="simple-editable-help">
      Press <kbd>Ctrl+Enter</kbd> to save or <kbd>Esc</kbd> to cancel
    </div>
  </div>
{:else}
  <!-- Display Mode -->
  <div class="simple-editable-wrapper">
    <svelte:element
      this={tag}
      class="{className} {isAdmin ? 'simple-editable-content' : ''}"
    >
      {@html currentContent || content || placeholder}
    </svelte:element>
    
    {#if isAdmin}
      <button
        on:click={startEdit}
        class="simple-editable-edit-btn"
        title="Edit this text"
      >
        ✏️ Edit
      </button>
    {/if}
    
    {#if showSuccess}
      <div class="simple-editable-success">
        ✅ Saved!
      </div>
    {/if}
  </div>
{/if}

<style>
  .simple-editable-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
  }
  
  .simple-editable-content {
    min-height: 1.5rem;
    outline: none;
  }
  
  .simple-editable-edit-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    z-index: 10;
  }
  
  .simple-editable-edit-btn:hover {
    background: #1d4ed8;
    transform: scale(1.05);
  }
  
  .simple-editable-editing {
    width: 100%;
  }
  
  .simple-editable-textarea {
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 2px solid #3b82f6;
    border-radius: 8px;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    resize: vertical;
    outline: none;
    background: white;
  }
  
  .simple-editable-textarea:focus {
    border-color: #1d4ed8;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .simple-editable-buttons {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  
  .simple-editable-save,
  .simple-editable-cancel {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .simple-editable-save {
    background: #059669;
    color: white;
  }
  
  .simple-editable-save:hover:not(:disabled) {
    background: #047857;
  }
  
  .simple-editable-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .simple-editable-cancel {
    background: #6b7280;
    color: white;
  }
  
  .simple-editable-cancel:hover:not(:disabled) {
    background: #4b5563;
  }
  
  .simple-editable-help {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
  }
  
  .simple-editable-help kbd {
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 3px;
    padding: 1px 4px;
    font-size: 11px;
  }
  
  .simple-editable-success {
    position: absolute;
    top: -30px;
    right: 0;
    background: #059669;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    z-index: 20;
    animation: fadeInOut 2s ease-in-out;
  }
  
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(10px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
</style>
