<script lang="ts">
  import { onMount } from 'svelte';
  import QRCode from 'qrcode';

  export let url: string = 'https://shumanbeans.com';
  export let size: number = 200;
  export let className: string = '';

  let qrCodeDataURL: string = '';
  let qrContainer: HTMLDivElement;

  onMount(async () => {
    try {
      qrCodeDataURL = await QRCode.toDataURL(url, {
        width: size,
        margin: 2,
        color: {
          dark: '#2D1810',    // Dark coffee brown
          light: '#F5E6D3'    // Cream color
        },
        errorCorrectionLevel: 'M'
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  });
</script>

<div class="qr-code-container {className}" bind:this={qrContainer}>
  {#if qrCodeDataURL}
    <div class="qr-code-wrapper">
      <img 
        src={qrCodeDataURL} 
        alt="QR Code for {url}" 
        class="qr-code-image"
        width={size}
        height={size}
      />
      <div class="qr-code-label">
        <p class="text-sm text-coffee-dark font-medium mb-1">Scan to visit</p>
        <p class="text-xs text-coffee-medium">shumanbeans.com</p>
      </div>
    </div>
  {:else}
    <div class="qr-placeholder" style="width: {size}px; height: {size}px;">
      <div class="animate-pulse bg-coffee-light rounded-lg"></div>
    </div>
  {/if}
</div>

<style>
  .qr-code-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .qr-code-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: linear-gradient(135deg, #F5E6D3 0%, #E8D5B7 100%);
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(45, 24, 16, 0.15);
    border: 2px solid #D4C4A8;
  }

  .qr-code-image {
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(45, 24, 16, 0.1);
  }

  .qr-code-label {
    text-align: center;
  }

  .qr-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F5E6D3;
    border-radius: 0.5rem;
    border: 2px solid #D4C4A8;
  }

  .qr-placeholder > div {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #E8D5B7, #F5E6D3, #E8D5B7);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite ease-in-out;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
</style>
