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
 * Render an exact 4x4 grid (16 items total)
 */
function renderGrid(topic) {
  const gridContainer = document.getElementById('flashcards-grid');
  gridContainer.innerHTML = ''; // Reset UI view
  
  const questionsList = currentData[topic] || [];
  
  // Restricted loop explicitly looking for 16 indexes
  for (let i = 1; i <= 16; i++) {
    // If JSON array has fewer than 16 elements, fallback modulo math gracefully repeats them
    const contentIndex = (i - 1) % questionsList.length;
    const itemData = questionsList[contentIndex] || { question: "Sample Question", answer: "Sample Answer" };
    
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
    
    // Multi-phase mouse interaction capture setup
    cardItem.addEventListener('click', function() {
      handleCardClick(cardItem);
    });
    
    gridContainer.appendChild(cardItem);
  }
}

/**
 * Sequential click tracking logic
 */
function handleCardClick(cardElement) {
  // Phase 1: Unflipped to Flipped (Reveals Question)
  if (!cardElement.classList.contains('flipped')) {
    cardElement.classList.add('flipped');
    flippedCardsCount++;
    document.getElementById('flipped-count').innerText = flippedCardsCount;
    return;
  }
  
  // Phase 2: Flipped to Show-Answer (Appends Answer panel underneath question)
  if (cardElement.classList.contains('flipped') && !cardElement.classList.contains('show-answer')) {
    cardElement.classList.add('show-answer');
    return;
  }
}

/**
 * Return back to main hub screen
 */
function goBack() {
  document.getElementById('cards-screen').classList.remove('active');
  document.getElementById('topic-screen').classList.add('active');
}
