<script lang="ts">
  export let question: string;
  export let answers: Array<{ id: string; answer: string }>;
  export let hasVoted: boolean = false;
  export let votedFor: string | null = null;
  export let onVote: (answerId: string) => void;
  
  function handleVote(answerId: string) {
    if (!hasVoted) {
      onVote(answerId);
      hasVoted = true;
      votedFor = answerId;
    }
  }
</script>

<div class="voting-container">
  <div class="voting-card">
    <h2 class="voting-title">Vote for the Best Answer!</h2>
    <div class="question-reminder">
      {question}
    </div>
    
    <div class="answers-grid">
      {#each answers as answerItem, index}
        <button
          class="answer-option {hasVoted && votedFor === answerItem.id ? 'voted' : ''} {hasVoted && votedFor !== answerItem.id ? 'not-voted' : ''}"
          on:click={() => handleVote(answerItem.id)}
          disabled={hasVoted}
        >
          <div class="answer-number">{index + 1}</div>
          <div class="answer-text">{answerItem.answer}</div>
          {#if hasVoted && votedFor === answerItem.id}
            <div class="vote-indicator">✓ Your Vote</div>
          {/if}
        </button>
      {/each}
    </div>
    
    {#if hasVoted}
      <div class="voted-state">
        <p class="voted-message">Vote cast! Waiting for other players...</p>
      </div>
    {:else}
      <div class="voting-instructions">
        <p>Choose the funniest answer! You cannot vote for your own.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .voting-container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .voting-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border: 3px solid #e9ecef;
  }

  .voting-title {
    color: #495057;
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .question-reminder {
    font-size: 1.1rem;
    color: #6c757d;
    text-align: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    font-style: italic;
  }

  .answers-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .answer-option {
    position: relative;
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 1rem;
    min-height: 80px;
  }

  .answer-option:hover:not(:disabled) {
    border-color: #007bff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  }

  .answer-option:disabled {
    cursor: not-allowed;
  }

  .answer-option.voted {
    border-color: #28a745;
    background: #f8fff9;
  }

  .answer-option.not-voted {
    opacity: 0.6;
  }

  .answer-number {
    background: #007bff;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .answer-option.voted .answer-number {
    background: #28a745;
  }

  .answer-text {
    flex: 1;
    font-size: 1.1rem;
    color: #212529;
    font-weight: 500;
  }

  .vote-indicator {
    color: #28a745;
    font-weight: 600;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .voted-state {
    text-align: center;
  }

  .voted-message {
    color: #28a745;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .voting-instructions {
    text-align: center;
  }

  .voting-instructions p {
    color: #6c757d;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    .voting-card {
      padding: 1rem;
    }

    .answer-option {
      padding: 1rem;
      min-height: 60px;
    }

    .answer-number {
      width: 32px;
      height: 32px;
      font-size: 1rem;
    }

    .answer-text {
      font-size: 1rem;
    }
  }
</style>
