const images = [
    'IMG/1.gif',
    'IMG/2.webp',
    'IMG/3.webp',
    'IMG/4.jpeg',
    'IMG/5.jpeg',
    'IMG/6.jpeg',
    'IMG/7.jpeg',
    'IMG/8.jpeg'
];

const cards = [...images, ...images]; // Duplicate for pairs
let flippedCards = [];
let matchedPairs = 0;
let timeLeft = 60;
let timerInterval;
const totalPairs = cards.length / 2;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    shuffle(cards).forEach((img, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = img;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${IMG}" alt="Card">
                </div>
                <div class="card-back">
                    <img src="https://castserr.cl/wp-content/uploads/2024/03/JUJUTSU-v1-1_1-301x301.png" alt="Back">
                </div>
            </div>
        `;
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        flippedCards.push(card);
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === totalPairs) {
            endGame(true);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function endGame(won) {
    clearInterval(timerInterval);
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    modalImage.src = won ? 'img/ganaste.gif' : 'img/perdiste.gif';
    modal.style.display = 'flex';
}

function resetGame() {
    timeLeft = 60;
    matchedPairs = 0;
    flippedCards = [];
    document.getElementById('time').textContent = timeLeft;
    document.getElementById('modal').style.display = 'none';
    createBoard();
    startTimer();
}

document.getElementById('restart-btn').addEventListener('click', resetGame);

// Initialize game
createBoard();
startTimer();
