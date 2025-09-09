<script>
  export let isAdmin = false;
  
  let dragActive = false;
  let uploading = false;
  let uploadMessage = '';
  let fileInput;
  
  function handleDragOver(e) {
    e.preventDefault();
    dragActive = true;
  }
  
  function handleDragLeave(e) {
    e.preventDefault();
    dragActive = false;
  }
  
  function handleDrop(e) {
    e.preventDefault();
    dragActive = false;
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }
  
  function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }
  
  async function handleFiles(files) {
    for (const file of files) {
      await uploadFile(file);
    }
  }
  
  async function uploadFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('Please upload image files only', 'error');
      return;
    }
    
    // Validate filename format (ProductName-Price.jpg)
    const filename = file.name;
    const namePattern = /^(.+)-(\d+(?:\.\d{2})?)\.(jpg|jpeg|png|webp)$/i;
    const match = filename.match(namePattern);
    
    if (!match) {
      showMessage(`Invalid filename format. Use: ProductName-Price.jpg (e.g., "Coffee Maker-49.99.jpg")`, 'error');
      return;
    }
    
    const [, productName, price, extension] = match;
    
    uploading = true;
    showMessage(`Uploading ${filename}...`, 'info');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productName', productName);
      formData.append('price', price);
      
      const response = await fetch('/admin/registry/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        showMessage(`Successfully added ${result.productName} - $${result.price}`, 'success');
        // Trigger page refresh to show new item
        window.location.reload();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showMessage(`Failed to upload ${filename}: ${error.message}`, 'error');
    } finally {
      uploading = false;
    }
  }
  
  function showMessage(message, type) {
    uploadMessage = message;
    const messageEl = document.querySelector('.upload-message');
    if (messageEl) {
      messageEl.className = `upload-message ${type}`;
    }
    
    setTimeout(() => {
      uploadMessage = '';
    }, 5000);
  }
</script>

{#if isAdmin}
  <div class="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
    <h3 class="text-lg font-semibold text-red-800 mb-4 flex items-center">
      <span class="text-xl mr-2">⚙️</span>
      Registry Admin Panel
    </h3>
    
    <div class="mb-4">
      <p class="text-sm text-red-700 mb-2">
        Upload images with the format: <strong>ProductName-Price.jpg</strong>
      </p>
      <p class="text-xs text-red-600">
        Example: "Coffee-Maker-49.99.jpg" will create a "Coffee Maker" item for $49.99
      </p>
    </div>
    
    <div
      class="border-2 border-dashed border-red-300 rounded-lg p-8 text-center transition-colors {dragActive ? 'border-red-500 bg-red-100' : 'hover:border-red-400'}"
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
    >
      {#if uploading}
        <div class="text-red-600">
          <div class="animate-spin w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Uploading...</p>
        </div>
      {:else}
        <div class="text-red-700">
          <svg class="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          <p class="text-lg font-medium mb-2">Drop images here or click to upload</p>
          <p class="text-sm text-red-600">Supports JPG, PNG, WebP</p>
        </div>
        
        <input
          bind:this={fileInput}
          type="file"
          multiple
          accept="image/*"
          class="hidden"
          on:change={handleFileSelect}
        >
        
        <button
          class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          on:click={() => fileInput.click()}
        >
          Choose Files
        </button>
      {/if}
    </div>
    
    {#if uploadMessage}
      <div class="upload-message mt-4 p-3 rounded text-sm font-medium">
        {uploadMessage}
      </div>
    {/if}
  </div>
{/if}

<style>
  .upload-message.success {
    background-color: #d1fae5;
    border: 1px solid #a7f3d0;
    color: #065f46;
  }
  
  .upload-message.error {
    background-color: #fee2e2;
    border: 1px solid #fca5a5;
    color: #991b1b;
  }
  
  .upload-message.info {
    background-color: #dbeafe;
    border: 1px solid #93c5fd;
    color: #1e40af;
  }
</style>
