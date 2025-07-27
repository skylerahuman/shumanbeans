<script lang="ts">
  import type { Player } from '$lib/server/socket';
  
  export let sessionId: string;
  export let players: Player[];
  export let canStart: boolean;
  export let onStartGame: () => void;
  
  const minimumPlayers = 2;
</script>

<div class="lobby">
  <div class="session-info">
    <h2>Game Lobby</h2>
    <p class="session-code">Session Code: <span class="code">{sessionId}</span></p>
  </div>

  <div class="players-section">
    <h3>Players ({players.length})</h3>
    <div class="players-list">
      {#each players as player}
        <div class="player-card">
          <span class="player-name">{player.nickname}</span>
          <span class="player-score">{player.score} pts</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="game-controls">
    {#if players.length < minimumPlayers}
      <p class="waiting-message">
        Waiting for more players... ({minimumPlayers - players.length} more needed)
      </p>
    {/if}
    
    <button 
      class="start-button" 
      disabled={!canStart || players.length < minimumPlayers}
      on:click={onStartGame}
    >
      Start Game
    </button>
  </div>
</div>

<style>
  .lobby {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  .session-info {
    margin-bottom: 2rem;
  }

  .session-code {
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }

  .code {
    font-family: 'Courier New', monospace;
    background-color: #f0f0f0;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: bold;
    letter-spacing: 0.1em;
  }

  .players-section {
    margin-bottom: 2rem;
  }

  .players-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .player-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    border: 2px solid #e9ecef;
  }

  .player-name {
    font-weight: 600;
    color: #495057;
  }

  .player-score {
    color: #6c757d;
    font-size: 0.9rem;
  }

  .game-controls {
    margin-top: 2rem;
  }

  .waiting-message {
    color: #6c757d;
    font-style: italic;
    margin-bottom: 1rem;
  }

  .start-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .start-button:hover:not(:disabled) {
    background-color: #218838;
  }

  .start-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
</style>
