// State management
let currentData = null;
let selectedTopic = null;
let flippedCardsCount = 0;

// Fetch JSON data on application start
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    currentData = data;
  })
  .catch(error => {
    console.error('Error loading card data:', error);
    alert('Failed to load flashcard data. Please make sure data.json is present.');
  });

/**
 * Handle screen navigation and generate the card grid
 * @param {string} topic - The key chosen ('community' or 'science')
 */
function selectTopic(topic) {
  if (!currentData) return;
  
  selectedTopic = topic;
  flippedCardsCount = 0;
  
  // UI Updates
  document.getElementById('current-topic-title').innerText = topic;
  document.getElementById('flipped-count').innerText = "0";
  
  document.getElementById('topic-screen').classList.remove('active');
  document.getElementById('cards-screen').classList.add('active');
  
  renderGrid(topic);
}

/**
 * Render a 5x5 grid dynamically. 
 * If your JSON contains fewer than 25 items, it auto-repeats or fills to ensure a 5x5 environment.
 */
function renderGrid(topic) {
  const gridContainer = document.getElementById('flashcards-grid');
  gridContainer.innerHTML = ''; // Clear prior elements
  
  const questionsList = currentData[topic] || [];
  
  // Build exactly 25 items
  for (let i = 1; i <= 25; i++) {
    // If your JSON array has fewer than 25 questions, reuse them sequentially with modulo mapping
    const contentIndex = (i - 1) % questionsList.length;
    const itemData = questionsList[contentIndex] || { question: "Placeholder Question", answer: "Placeholder Answer" };
    
    // Create card wrappers
    const cardItem = document.createElement('div');
    cardItem.className = 'card-item';
    cardItem.id = `card-${i}`;
    
    cardItem.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <div class="card-number">${i}</div>
        </div>
        <div class="card-back">
          <div class="question-text">${itemData.question}</div>
          <div class="answer-box">${itemData.answer}</div>
        </div>
      </div>
    `;
    
    // Set step-by-step sequential action framework per card click
    cardItem.addEventListener('click', function() {
      handleCardClick(cardItem);
    });
    
    gridContainer.appendChild(cardItem);
  }
}

/**
 * Sequence state tracking:
 * State 0: Unflipped -> Click flips card to reveal Question
 * State 1: Question Visible -> Click reveals Answer block underneath
 * State 2: Answer Visible -> Keeps layout set; student shifts to next item
 */
function handleCardClick(cardElement) {
  // If card is completely fresh/unflipped
  if (!cardElement.classList.contains('flipped')) {
    cardElement.classList.add('flipped');
    flippedCardsCount++;
    document.getElementById('flipped-count').innerText = flippedCardsCount;
    return;
  }
  
  // If card is already flipped to question, but answer isn't out yet
  if (cardElement.classList.contains('flipped') && !cardElement.classList.contains('show-answer')) {
    cardElement.classList.add('show-answer');
    return;
  }
}

/**
 * Return to main hub landing screen
 */
function goBack() {
  document.getElementById('cards-screen').classList.remove('active');
  document.getElementById('topic-screen').classList.add('active');
}
