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

function startTransition(finishListener) {
  const cards = Array.from(cardsWrapper.children);
  const lastCard = cards[cards.length - 1];
  cards.forEach((card) => { card.style.left = '0px'; });
  lastCard.addEventListener('transitionend', finishListener);
}

function finishTransition(listener, reorder) {
  const cards = Array.from(cardsWrapper.children);
  const lastCard = cards[cards.length - 1];
  lastCard.removeEventListener('transitionend', listener);

  const cardsData = cards.map((card) => (
    {
      name: card.className,
      dataValue: parseInt(card.getAttribute('data-value'), 10),
    }
  ));
  reorder(cardsData);
  cardsData.forEach((data, i) => {
    const card = cardsWrapper.children[i];
    const positionFromLeft = i * 30;
    card.style.left = `${positionFromLeft}px`;
    card.className = data.name;
    card.setAttribute('data-value', data.dataValue);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function finishMixCards() {
  finishTransition(finishMixCards, shuffle);
}

function startMixCards() {
  startTransition(finishMixCards);
}

function finishMagic() {
  finishTransition(finishMagic, (cardsData) => {
    cardsData.sort((a, b) => a.dataValue - b.dataValue);
  });
}

function startMagic() {
  startTransition(finishMagic);
}

// Function to clear out the initial button and create new buttons to play the game.
function createButtons() {
  const startButton = document.getElementById('start-game');
  buttonsWrapper.removeChild(startButton);
  addButton('Shuffle', startMixCards);
  addButton('Show/Hide', showHide);
  addButton('Magic', startMagic);
}

// Function to start the game by clearing the wrapper, creating
// and appending the buttons and all the cards to the DOM
function startGame() {
  createButtons();
  createCards();
}

document.getElementById('start-game').addEventListener('click', startGame);
