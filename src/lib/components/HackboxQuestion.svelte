<script lang="ts">
  export let question: string;
  export let answer: string = '';
  export let hasSubmitted: boolean = false;
  export let onSubmit: (answer: string) => void;
  
  let inputElement: HTMLInputElement;
  
  function handleSubmit() {
    if (answer.trim() && !hasSubmitted) {
      onSubmit(answer.trim());
      hasSubmitted = true;
    }
  }
  
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="question-container">
  <div class="question-card">
    <h2 class="question-title">Fill in the blank:</h2>
    <div class="question-text">
      {question}
    </div>
    
    {#if !hasSubmitted}
      <div class="answer-input-section">
        <label for="answer-input" class="input-label">Your answer:</label>
        <input
          id="answer-input"
          bind:this={inputElement}
          bind:value={answer}
          on:keypress={handleKeyPress}
          type="text"
          class="answer-input"
          placeholder="Type your funny answer here..."
          maxlength="100"
          disabled={hasSubmitted}
        />
        <div class="character-count">
          {answer.length}/100 characters
        </div>
        <button 
          class="submit-button"
          on:click={handleSubmit}
          disabled={!answer.trim() || hasSubmitted}
        >
          Submit Answer
        </button>
      </div>
    {:else}
      <div class="submitted-state">
        <div class="checkmark">✓</div>
        <p class="submitted-message">Answer submitted!</p>
        <div class="submitted-answer">"{answer}"</div>
        <p class="waiting-message">Waiting for other players...</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .question-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .question-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border: 3px solid #e9ecef;
  }

  .question-title {
    color: #495057;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .question-text {
    font-size: 1.5rem;
    font-weight: 600;
    color: #212529;
    text-align: center;
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 12px;
    border-left: 4px solid #007bff;
  }

  .answer-input-section {
    margin-top: 2rem;
  }

  .input-label {
    display: block;
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.5rem;
  }

  .answer-input {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
  }

  .answer-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  .answer-input:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
  }

  .character-count {
    text-align: right;
    font-size: 0.85rem;
    color: #6c757d;
    margin-top: 0.25rem;
  }

  .submit-button {
    width: 100%;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.2s ease;
  }

  .submit-button:hover:not(:disabled) {
    background-color: #0056b3;
  }

  .submit-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  .submitted-state {
    text-align: center;
    margin-top: 2rem;
  }

  .checkmark {
    font-size: 3rem;
    color: #28a745;
    margin-bottom: 1rem;
  }

  .submitted-message {
    font-size: 1.2rem;
    font-weight: 600;
    color: #28a745;
    margin-bottom: 1rem;
  }

  .submitted-answer {
    font-size: 1.1rem;
    color: #495057;
    font-style: italic;
    background: #e7f3ff;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
  }

  .waiting-message {
    color: #6c757d;
    font-size: 0.95rem;
  }
</style>
