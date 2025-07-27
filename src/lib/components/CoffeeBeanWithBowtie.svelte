<script lang="ts">
  export let size: number = 120;
  export let className: string = '';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 120 120" 
  class="coffee-bean-bowtie {className}"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Coffee Bean Body -->
  <ellipse 
    cx="60" 
    cy="60" 
    rx="35" 
    ry="50" 
    fill="#6F4E37" 
    stroke="#4A2C2A" 
    stroke-width="2"
  />
  
  <!-- Coffee Bean Center Crack -->
  <path 
    d="M 35 60 Q 60 50 85 60 Q 60 70 35 60" 
    fill="#4A2C2A" 
    opacity="0.8"
  />
  
  <!-- Coffee Bean Highlights -->
  <ellipse 
    cx="50" 
    cy="45" 
    rx="8" 
    ry="12" 
    fill="#8B6B3A" 
    opacity="0.6"
  />
  
  <!-- Bow-tie Base -->
  <polygon 
    points="40,25 80,25 70,35 50,35" 
    fill="#8B0000" 
    stroke="#660000" 
    stroke-width="1"
  />
  
  <!-- Bow-tie Wings -->
  <path 
    d="M 35 20 Q 25 30 35 40 Q 45 30 35 20" 
    fill="#DC143C" 
    stroke="#8B0000" 
    stroke-width="1"
  />
  
  <path 
    d="M 85 20 Q 95 30 85 40 Q 75 30 85 20" 
    fill="#DC143C" 
    stroke="#8B0000" 
    stroke-width="1"
  />
  
  <!-- Bow-tie Center Knot -->
  <rect 
    x="55" 
    y="22" 
    width="10" 
    height="16" 
    fill="#660000" 
    stroke="#4A0000" 
    stroke-width="1" 
    rx="2"
  />
  
  <!-- Bow-tie Pattern Details -->
  <circle cx="30" cy="30" r="2" fill="#FFB6C1" opacity="0.7"/>
  <circle cx="90" cy="30" r="2" fill="#FFB6C1" opacity="0.7"/>
  <circle cx="35" cy="25" r="1.5" fill="#FF69B4" opacity="0.8"/>
  <circle cx="85" cy="25" r="1.5" fill="#FF69B4" opacity="0.8"/>
</svg>

<style>
  .coffee-bean-bowtie {
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
    transition: transform 0.3s ease;
  }
  
  .coffee-bean-bowtie:hover {
    transform: scale(1.05) rotate(2deg);
  }
</style>
