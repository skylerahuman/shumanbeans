<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { io } from 'socket.io-client';
  import HackboxLobby from '$lib/components/HackboxLobby.svelte';
  import HackboxQuestion from '$lib/components/HackboxQuestion.svelte';
  import HackboxVoting from '$lib/components/HackboxVoting.svelte';
  import HackboxTimer from '$lib/components/HackboxTimer.svelte';
  import type { Player } from '$lib/server/socket';

  let socket: any;
  let gameState: 'join' | 'lobby' | 'answering' | 'voting' | 'results' | 'finished' = 'join';
  let sessionId = '';
  let nickname = '';
  let players: Player[] = [];
  let currentQuestion = '';
  let currentAnswer = '';
  let hasSubmitted = false;
  let votingAnswers: Array<{ id: string; answer: string }> = [];
  let hasVoted = false;
  let votedFor: string | null = null;
  let timeRemaining = 0;
  let results: Array<{ nickname: string; answer: string; votes: number }> = [];
  let leaderboard: Player[] = [];
  let isHost = false;

  onMount(() => {
    if (browser) {
      socket = io();
      setupSocketListeners();
    }
  });

  function setupSocketListeners() {
    socket.on('players-updated', (newPlayers: Player[]) => {
      players = newPlayers;
    });

    socket.on('game-started', ({ question, timeRemaining: time }: { question: string; timeRemaining: number }) => {
      currentQuestion = question;
      timeRemaining = time;
      gameState = 'answering';
      hasSubmitted = false;
      currentAnswer = '';
    });

    socket.on('voting-phase', ({ answers, timeRemaining: time }: { answers: Array<{ id: string; answer: string }>; timeRemaining: number }) => {
      votingAnswers = answers;
      timeRemaining = time;
      gameState = 'voting';
      hasVoted = false;
      votedFor = null;
    });

    socket.on('results', ({ results: gameResults, leaderboard: board }: { results: Array<{ nickname: string; answer: string; votes: number }>; leaderboard: Player[] }) => {
      results = gameResults;
      leaderboard = board;
      gameState = 'results';
    });

    socket.on('next-question', ({ question, timeRemaining: time }: { question: string; timeRemaining: number }) => {
      currentQuestion = question;
      timeRemaining = time;
      gameState = 'answering';
      hasSubmitted = false;
      currentAnswer = '';
    });

    socket.on('timer-update', (time: number) => {
      timeRemaining = time;
    });

    socket.on('game-finished', ({ finalLeaderboard }: { finalLeaderboard: Player[] }) => {
      leaderboard = finalLeaderboard;
      gameState = 'finished';
    });
  }

  function createSession() {
    if (!nickname.trim()) return;
    
    socket.emit('create-session', `${nickname}'s Game`, (response: { success: boolean; sessionId?: string; error?: string }) => {
      if (response.success && response.sessionId) {
        sessionId = response.sessionId;
        isHost = true;
        joinSession();
      }
    });
  }

  function joinSession() {
    if (!sessionId.trim() || !nickname.trim()) return;
    
    socket.emit('join-session', { sessionId: sessionId.toUpperCase(), nickname }, (response: { success: boolean; player?: Player; error?: string }) => {
      if (response.success) {
        gameState = 'lobby';
      } else {
        alert(response.error || 'Failed to join session');
      }
    });
  }

  function startGame() {
    if (isHost) {
      socket.emit('start-game', sessionId);
    }
  }

  function submitAnswer(answer: string) {
    socket.emit('submit-answer', { sessionId, answer });
    currentAnswer = answer;
    hasSubmitted = true;
  }

  function submitVote(answerId: string) {
    socket.emit('submit-vote', { sessionId, answerId });
    hasVoted = true;
    votedFor = answerId;
  }

  function getTimerPhase(): 'answering' | 'voting' | 'results' {
    if (gameState === 'answering') return 'answering';
    if (gameState === 'voting') return 'voting';
    return 'results';
  }
</script>

<svelte:head>
  <title>Hackbox - Wedding Edition</title>
</svelte:head>

<main class="hackbox-main">
  {#if gameState !== 'join'}
    <HackboxTimer timeRemaining={timeRemaining} phase={getTimerPhase()} />
  {/if}

  {#if gameState === 'join'}
    <div class="join-screen">
      <div class="join-card">
        <h1 class="game-title">🎮 Hackbox</h1>
        <p class="game-subtitle">Wedding Edition - Fill in the Blanks!</p>
        
        <div class="nickname-section">
          <label for="nickname-input">Enter your nickname:</label>
          <input
            id="nickname-input"
            type="text"
            bind:value={nickname}
            placeholder="Your funny nickname"
            maxlength="20"
            class="nickname-input"
          />
        </div>

        <div class="session-section">
          <label for="session-input">Session Code (optional):</label>
          <input
            id="session-input"
            type="text"
            bind:value={sessionId}
            placeholder="Leave blank to create new game"
            maxlength="6"
            class="session-input"
          />
        </div>

        <div class="button-group">
          <button 
            class="create-button" 
            on:click={createSession}
            disabled={!nickname.trim()}
          >
            Create New Game
          </button>
          
          <button 
            class="join-button" 
            on:click={joinSession}
            disabled={!nickname.trim() || !sessionId.trim()}
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if gameState === 'lobby'}
    <HackboxLobby
      {sessionId}
      {players}
      canStart={isHost}
      onStartGame={startGame}
    />
  {/if}

  {#if gameState === 'answering'}
    <HackboxQuestion
      question={currentQuestion}
      answer={currentAnswer}
      {hasSubmitted}
      onSubmit={submitAnswer}
    />
  {/if}

  {#if gameState === 'voting'}
    <HackboxVoting
      question={currentQuestion}
      answers={votingAnswers}
      {hasVoted}
      {votedFor}
      onVote={submitVote}
    />
  {/if}

  {#if gameState === 'results'}
    <div class="results-screen">
      <div class="results-card">
        <h2>Round Results</h2>
        
        <div class="question-display">
          <em>{currentQuestion}</em>
        </div>
        
        <div class="results-list">
          {#each results as result, index}
            <div class="result-item rank-{index + 1}">
              <div class="result-rank">#{index + 1}</div>
              <div class="result-content">
                <div class="result-answer">"{result.answer}"</div>
                <div class="result-author">- {result.nickname}</div>
              </div>
              <div class="result-votes">{result.votes} votes</div>
            </div>
          {/each}
        </div>

        <div class="leaderboard">
          <h3>Current Standings</h3>
          <div class="leaderboard-list">
            {#each leaderboard as player, index}
              <div class="leaderboard-item">
                <span class="position">#{index + 1}</span>
                <span class="player-name">{player.nickname}</span>
                <span class="score">{player.score} pts</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if gameState === 'finished'}
    <div class="game-finished">
      <div class="finished-card">
        <h2>🎉 Game Over!</h2>
        
        <div class="final-standings">
          <h3>Final Standings</h3>
          {#each leaderboard as player, index}
            <div class="final-player {index === 0 ? 'winner' : ''}">
              {#if index === 0}
                <div class="crown">👑</div>
              {/if}
              <span class="final-position">#{index + 1}</span>
              <span class="final-name">{player.nickname}</span>
              <span class="final-score">{player.score} pts</span>
            </div>
          {/each}
        </div>

        <button 
          class="play-again-button"
          on:click={() => gameState = 'join'}
        >
          Play Again
        </button>
      </div>
    </div>
  {/if}
</main>

<style>
  .hackbox-main {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
  }

  .join-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .join-card {
    background: white;
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;
  }

  .game-title {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .game-subtitle {
    color: #666;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .nickname-section, .session-section {
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .nickname-section label, .session-section label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .nickname-input, .session-input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
  }

  .nickname-input:focus, .session-input:focus {
    outline: none;
    border-color: #667eea;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .create-button, .join-button {
    padding: 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .create-button {
    background: #28a745;
    color: white;
  }

  .create-button:hover:not(:disabled) {
    background: #218838;
  }

  .join-button {
    background: #007bff;
    color: white;
  }

  .join-button:hover:not(:disabled) {
    background: #0056b3;
  }

  .create-button:disabled, .join-button:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  .results-screen, .game-finished {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }

  .results-card, .finished-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    max-width: 700px;
    width: 100%;
  }

  .results-card h2, .finished-card h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  .question-display {
    text-align: center;
    font-size: 1.1rem;
    color: #6c757d;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .results-list {
    margin-bottom: 2rem;
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    border: 2px solid #e9ecef;
  }

  .result-item.rank-1 {
    border-color: #ffd700;
    background: #fffbf0;
  }

  .result-item.rank-2 {
    border-color: #c0c0c0;
    background: #f8f9fa;
  }

  .result-item.rank-3 {
    border-color: #cd7f32;
    background: #f8f9fa;
  }

  .result-rank {
    font-weight: bold;
    font-size: 1.2rem;
    color: #666;
  }

  .result-content {
    flex: 1;
  }

  .result-answer {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  .result-author {
    color: #6c757d;
    font-size: 0.9rem;
  }

  .result-votes {
    font-weight: 600;
    color: #007bff;
  }

  .leaderboard {
    border-top: 2px solid #e9ecef;
    padding-top: 2rem;
  }

  .leaderboard h3 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .leaderboard-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .leaderboard-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 6px;
  }

  .final-standings {
    margin-bottom: 2rem;
  }

  .final-player {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
    border-radius: 8px;
    background: #f8f9fa;
  }

  .final-player.winner {
    background: #fff3cd;
    border: 2px solid #ffd700;
  }

  .crown {
    font-size: 1.5rem;
  }

  .play-again-button {
    width: 100%;
    padding: 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
  }

  .play-again-button:hover {
    background: #0056b3;
  }
</style>
