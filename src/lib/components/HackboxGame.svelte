<script lang="ts">
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';
  import { writable } from 'svelte/store';

  const socket = io(); // Connect to Socket.io server
  export let sessionId: string;
  export let nickname: string;

  const players = writable([]);
  const question = writable('');
  const answers = writable([]);
  const timer = writable(0);
  const gameState = writable<'waiting' | 'answering' | 'voting' | 'results' | 'finished'>('waiting');

  let answer = '';

  onMount(() => {
    socket.emit('join-session', { sessionId, nickname }, (response) => {
      if (!response.success) {
        console.error(response.error);
      }
    });

    socket.on('players-updated', (newPlayers) => {
      players.set(newPlayers);
    });

    socket.on('game-started', ({ question: q, timeRemaining }) => {
      question.set(q);
      timer.set(timeRemaining);
      gameState.set('answering');
    });

    socket.on('voting-phase', ({ answers: a, timeRemaining }) => {
      answers.set(a);
      timer.set(timeRemaining);
      gameState.set('voting');
    });

    socket.on('results', ({ results, leaderboard }) => {
      gameState.set('results');
      // Handle results display...
    });

    socket.on('timer-update', (timeRemaining) => {
      timer.set(timeRemaining);
    });

    socket.on('game-finished', ({ finalLeaderboard }) => {
      gameState.set('finished');
      // Handle game finish...
    });
  });

  function submitAnswer() {
    socket.emit('submit-answer', { sessionId, answer });
    answer = '';
  }

  function vote(answerId) {
    socket.emit('submit-vote', { sessionId, answerId });
  }
</script>

<main>
  <div bind:this={gameState}>
    {#if $gameState === 'waiting'}
      <h2>Lobby</h2>
      <p>Players:</p>
      <ul>
        {#each $players as player}<li>{player.nickname}</li>{/each}
      </ul>
      <button on:click={() => socket.emit('start-game', sessionId)}>Start Game</button>
    {/if}

    {#if $gameState === 'answering'}
      <h2>Answer the question!</h2>
      <p>{$question}</p>
      <label>
        Your answer:
        <input type="text" bind:value={answer}>
      </label>
      <button on:click={submitAnswer}>Submit</button>
    {/if}

    {#if $gameState === 'voting'}
      <h2>Vote for the best answer!</h2>
      <ul>
        {#each $answers as {id, answer}}
        <li>
          {answer}
          <button on:click={() => vote(id)}>Vote</button>
        </li>
        {/each}
      </ul>
    {/if}

    {#if $gameState === 'results'}
      <h2>Results</h2>
      <!-- Display results here -->
    {/if}

    {#if $gameState === 'finished'}
      <h2>Game Over</h2>
      <!-- Final leaderboard display -->
    {/if}
  </div>

  <p>Time Left: {$timer}s</p>
</main>

<style>
  main {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  input[type="text"] {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
  }
  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
  }
</style>
