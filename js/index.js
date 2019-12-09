const suits = ['hearts', 'spades', 'diamonds', 'clubs']; // add all card suits instead of one
const cardsWrapper = document.querySelector('.cards-wrapper');
const buttonsWrapper = document.querySelector('.btn-wrapper'); // add buttons component

function createCards() {
  const cards = [];
  // Create an array with objects containing the value and the suit of each card
  // change for loop so it renders all suits of cards instead of one
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
    const positionFromLeft = i * 30; //change 15 to 30 so each card suit can be seen (make spacing between cards wider)
    const cardElement = document.createElement('div');
    cardElement.setAttribute('data-value', card.index); // change card.value to card.index so card can be ordered or shuffled based on index
    cardElement.classList.add('card', `${card.suit}-${card.value}`);
    cardElement.style.left = `${positionFromLeft}px`;
    cardsWrapper.append(cardElement);
  });
}

// my solution code starts here

// create button function (the same for all 3 buttons)
function addButton(text, action) {
  const button = document.createElement('button');
  button.addEventListener('click', action);
  button.textContent = text;
  button.className = 'btn btn-lg btn-secondary ml-3'; // bootstrap styling
  buttonsWrapper.appendChild(button); // add button as a last child element to the buttonsWrapper component
}

//start cards folding animation 
function startTransition(finishListener) {
  const cards = Array.from(cardsWrapper.children); // create array of all cards
  const lastCard = cards[cards.length - 1];
  cards.forEach((card) => { card.style.left = '0px'; }); // move all cards to the right of the screen
  lastCard.addEventListener('transitionend', finishListener); // apend event listener to call the function when event has happened
}

//function to mix cards and unfold them back in the line
function finishTransition(listener, reorder) {
  const cards = Array.from(cardsWrapper.children); 
  const lastCard = cards[cards.length - 1];
  lastCard.removeEventListener('transitionend', listener); //stop cards from endlessly shuffling

  // create array of objects each for one specific card with name and value(index) info
  const cardsData = cards.map((card) => ( 
    {
      name: card.className,
      dataValue: parseInt(card.getAttribute('data-value'), 10), // string to integer
    }
  ));
  reorder(cardsData); //placeholder for shuffle/sort elements of cardsData
  cardsData.forEach((data, i) => {
    const card = cardsWrapper.children[i];
    const positionFromLeft = i * 30;
    card.style.left = `${positionFromLeft}px`; // move cards to the right sight of screen animation - unfold them in line
    card.className = data.name; // apply shuffled/sorted cardsData object's name to the className (so it can be displayed on the screen)
    card.setAttribute('data-value', data.dataValue); // apply shuffled cardsData object's dataValue so it could be sorted back with Magic
  });
}

// shuffle cards function 
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

//second part of cards shuffle process
function finishMixCards() {
  finishTransition(finishMixCards, shuffle);
}

//first part of cards shuffle process
function startMixCards() {
  startTransition(finishMixCards);
}

//second part of cards sorting process
function finishMagic() {
  finishTransition(finishMagic, (cardsData) => {
    cardsData.sort((a, b) => a.dataValue - b.dataValue); // sort all of the cards in order from min to max based on the data value - their individual number
  });
}

// first part of cards sorting process
function startMagic() {
  startTransition(finishMagic);
}

//function to hide/show cards contents
function showHide() {
  cardsWrapper.classList.toggle('hidden');
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
