// --- Example data (replace with your real questions/answers) ---
// You want 25 cards per topic (5x5).
// Each card: { question: "...", answer: "..." }
const TOPICS = {
  "science-community": [
    { question: "Name one facility for fun in a park.", answer: "Playground / swings / slides." },
    { question: "What is one benefit of community gardens?", answer: "They grow fresh food and bring people together." },
    { question: "Name one waste item you should recycle.", answer: "Paper / plastic bottle / cardboard." },
    { question: "Why do we need clean water?", answer: "For drinking and keeping people healthy." },
    { question: "What do plants need to grow?", answer: "Sunlight, water, and air (carbon dioxide)." },
    { question: "Name one renewable energy source.", answer: "Solar power / wind power." },
    { question: "How can you reduce litter?", answer: "Use a bin and carry a reusable bag/bottle." },
    { question: "What is a habitat?", answer: "A place where living things live and survive." },
    { question: "Name one way to save electricity at home.", answer: "Turn off lights when not in use." },
    { question: "Why should we wash our hands?", answer: "To remove germs and prevent illness." },

    // --- Add up to 25 ---
    { question: "What is weather?", answer: "Conditions like rain, wind, and temperature at a place." },
    { question: "What is the difference between solid and liquid?", answer: "Solids keep their shape; liquids flow." },
    { question: "Name one example of a force.", answer: "Push or pull." },
    { question: "What do we call the process plants use to make food?", answer: "Photosynthesis." },
    { question: "Why are recycling bins important?", answer: "They help reuse materials and reduce waste." },
    { question: "Name one way to keep a neighborhood safe.", answer: "Follow rules and look out for others." },
    { question: "How do trees help the environment?", answer: "They provide oxygen and shade." },
    { question: "What is a community?", answer: "A group of people living in the same area." },
    { question: "Name one way to protect animals.", answer: "Keep habitats clean and don’t harm them." },
    { question: "What does 'healthy' mean?", answer: "Feeling well and having energy." },
    { question: "What is erosion?", answer: "The wearing away of land by wind or water." },
    { question: "Name one example of a simple machine.", answer: "Lever / wheel and axle." },
    { question: "What is measurement used for?", answer: "To find size, length, weight, or time." },
    { question: "What is pollution?", answer: "Harmful substances entering air, water, or land." },
    { question: "How can you stay active?", answer: "Walk, run, or play sports daily." }
  ],

  "history": [
    // Fill 25 entries here as well
    ...Array.from({ length: 25 }, (_, i) => ({
      question: `History Q${i + 1}: Example question?`,
      answer: `History A${i + 1}: Example answer.`
    }))
  ],

  "geography": [
    // Fill 25 entries here as well
    ...Array.from({ length: 25 }, (_, i) => ({
      question: `Geography Q${i + 1}: Example question?`,
      answer: `Geography A${i + 1}: Example answer.`
    }))
  ]
};

// --- DOM ---
const topicSelect = document.getElementById("topicSelect");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const statusText = document.getElementById("statusText");
const mainArea = document.getElementById("mainArea");
const cardGrid = document.getElementById("cardGrid");

// --- Config ---
const TOTAL_CARDS = 25; // 5x5

// --- State per card: 0 => number only, 1 => show question, 2 => show answer ---
function createCardElement(cardIndex, cardData) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.index = String(cardIndex);

  const btn = document.createElement("button");
  btn.className = "cardBtn";
  btn.type = "button";

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const badge = document.createElement("div");
  badge.className = "badge";
  badge.textContent = String(cardIndex + 1);

  const content = document.createElement("div");
  content.className = "card-content";

  const questionEl = document.createElement("div");
  questionEl.className = "question";
  questionEl.textContent = cardData.question;

  const answerEl = document.createElement("div");
  answerEl.className = "answer";
  answerEl.textContent = cardData.answer;

  // initial state
  // number only => hide question/answer
  questionEl.style.display = "none";
  answerEl.style.display = "none";

  content.appendChild(questionEl);
  content.appendChild(answerEl);

  inner.appendChild(badge);
  inner.appendChild(content);
  btn.appendChild(inner);
  card.appendChild(btn);

  // Click logic: number -> question -> answer (and stays)
  let state = 0;
  btn.addEventListener("click", () => {
    state = Math.min(2, state + 1);

    if (state === 1) {
      questionEl.style.display = "block";
      answerEl.style.display = "none";
    } else if (state === 2) {
      questionEl.style.display = "block";
      answerEl.style.display = "block";
    }
  });

  return card;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function start() {
  const topicKey = topicSelect.value;
  if (!topicKey) return;

  const cards = TOPICS[topicKey];

  if (!cards || cards.length < TOTAL_CARDS) {
    alert(`Topic "${topicKey}" needs at least ${TOTAL_CARDS} cards.`);
    return;
  }

  // pick exactly 25, then shuffle so the layout is mixed
  const selected = shuffle(cards).slice(0, TOTAL_CARDS);

  // Clear and render
  cardGrid.innerHTML = "";
  selected.forEach((cardData, i) => {
    cardGrid.appendChild(createCardElement(i, cardData));
  });

  mainArea.hidden = false;
  resetBtn.style.display = "inline-block";
  statusText.textContent = "Tap any card: number → question → answer.";
}

function resetView() {
  cardGrid.innerHTML = "";
  mainArea.hidden = true;
  resetBtn.style.display = "none";
  statusText.textContent = "Select a topic to begin.";
}

startBtn.addEventListener("click", start);
resetBtn.addEventListener("click", resetView);
