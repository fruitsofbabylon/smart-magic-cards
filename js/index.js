const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
const cardsWrapper = document.querySelector('.cards-wrapper');
const buttonsWrapper = document.querySelector('.btn-wrapper');

function createCards() {
  const cards = [];
  // Create an array with objects containing the value and the suit of each card
  suits.forEach((suit, suitIndex) => {
    for (let i = 1; i <= 13; i += 1) {
      const cardObject = {
        value: i,
        suit,
        index: i + suitIndex * 13,
      };
      cards.push(cardObject);
    }
  });

  // For each dataObject, create a new card and append it to the DOM
  cards.forEach((card, i) => {
    const positionFromLeft = i * 30;
    const cardElement = document.createElement('div');
    cardElement.setAttribute('data-value', card.index);
    cardElement.classList.add('card', `${card.suit}-${card.value}`);
    cardElement.style.left = `${positionFromLeft}px`;
    cardsWrapper.append(cardElement);
  });
}

// Function to clear out the initial button and create new buttons to play the game.
function createButtons() {
  const startButton = document.getElementById('start-game');
  buttonsWrapper.removeChild(startButton);
  addButton('Shuffle', startMixCards);
  addButton('Show/Hide', showHide);
  addButton('Magic', startMagic);
}

function addButton(text, action) {
  const button = document.createElement('button');
  button.addEventListener('click', action);
  button.textContent = text;
  button.className = 'btn btn-lg btn-secondary ml-3';
  buttonsWrapper.appendChild(button);
}

function showHide() {
  cardsWrapper.classList.toggle('hidden');
}

function startMixCards() {
  const cards = Array.from(cardsWrapper.children);
  const lastCard = cards[cards.length - 1];
  cards.forEach((card) => card.style.left = '0px');
  lastCard.addEventListener('transitionend', finishMixCards);
} 

function shuffle(array) {
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function finishMixCards() {
  const cards = Array.from(cardsWrapper.children);
  const lastCard = cards[cards.length - 1];
  lastCard.removeEventListener('transitionend', finishMixCards);

  const cardsData = cards.map((card) => { 
    return { name: card.className, dataValue: card.getAttribute('data-value')};
  });
  shuffle(cardsData);
  cardsData.forEach((data, i) => {
    const card = cardsWrapper.children[i];
    const positionFromLeft = i * 30;
    card.style.left = `${positionFromLeft}px`;
    card.className = data.name;
    card.setAttribute('data-value', data.dataValue);
  });
}

function startMagic() {
  const cards = Array.from(cardsWrapper.children);
  const lastCard = cards[cards.length - 1];
  cards.forEach((card) => card.style.left = '0px');
  lastCard.addEventListener('transitionend', finishMagic);
}

function finishMagic() {
  const cards = Array.from(cardsWrapper.children);
  const lastCard = cards[cards.length - 1];
  lastCard.removeEventListener('transitionend', finishMixCards);

  const cardsData = cards.map((card) => { 
    return { name: card.className, dataValue: parseInt(card.getAttribute('data-value'))};
  });
  cardsData.sort((a, b) => { 
    return a.dataValue - b.dataValue;
  });
  cardsData.forEach((data, i) => {
    const card = cardsWrapper.children[i];
    const positionFromLeft = i * 30;
    card.style.left = `${positionFromLeft}px`;
    card.className = data.name;
    card.setAttribute('data-value', data.dataValue);
  });
}

// Function to start the game by clearing the wrapper, creating
// and appending the buttons and all the cards to the DOM
function startGame() {
  createButtons();
  createCards();
}

document.getElementById('start-game').addEventListener('click', startGame);
