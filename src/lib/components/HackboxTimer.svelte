<script lang="ts">
  export let timeRemaining: number;
  export let phase: 'answering' | 'voting' | 'results';
  
  $: percentage = ((timeRemaining / getMaxTime()) * 100);
  $: isUrgent = timeRemaining <= 10;
  
  function getMaxTime(): number {
    switch (phase) {
      case 'answering': return 60;
      case 'voting': return 30;
      case 'results': return 10;
      default: return 60;
    }
  }
  
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs.toString();
  }
</script>

<div class="timer-container">
  <div class="timer {isUrgent ? 'urgent' : ''}">
    <div class="time-display">
      {formatTime(timeRemaining)}
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill {isUrgent ? 'urgent' : ''}" 
        style="width: {percentage}%"
      ></div>
    </div>
    <div class="phase-label">
      {#if phase === 'answering'}
        Time to answer
      {:else if phase === 'voting'}
        Time to vote
      {:else}
        Results
      {/if}
    </div>
  </div>
</div>

<style>
  .timer-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
  }

  .timer {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 120px;
    text-align: center;
    transition: all 0.3s ease;
  }

  .timer.urgent {
    border-color: #dc3545;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .time-display {
    font-family: 'Courier New', monospace;
    font-size: 1.5rem;
    font-weight: bold;
    color: #495057;
    margin-bottom: 0.5rem;
  }

  .timer.urgent .time-display {
    color: #dc3545;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background-color: #28a745;
    transition: width 1s linear;
    border-radius: 4px;
  }

  .progress-fill.urgent {
    background-color: #dc3545;
  }

  .phase-label {
    font-size: 0.8rem;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
</style>
