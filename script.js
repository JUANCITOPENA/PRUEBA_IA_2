document.addEventListener('DOMContentLoaded', () => {
    // Los IDs ahora coinciden con el HTML: 'game-board', 'timer', 'result-modal', etc.
    const gameBoard = document.getElementById('game-board');
    const timerElement = document.getElementById('timer');
    const resultModal = document.getElementById('result-modal');
    const resultImage = document.getElementById('result-image');
    const restartButton = document.getElementById('restart-button');

    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let timeLeft = 60;
    let timer;
    let pairsFound = 0;
    const totalPairs = 8; // Basado en tu array de 8 imágenes

    const cardTypes = [
        { id: '1', ext: 'gif' }, { id: '2', ext: 'webp' },
        { id: '3', ext: 'webp' }, { id: '4', ext: 'jpeg' },
        { id: '5', ext: 'jpeg' }, { id: '6', ext: 'jpeg' },
        { id: '7', ext: 'jpeg' }, { id: '8', ext: 'jpeg' }
    ];

    function createCards() {
        const duplicatedCards = [...cardTypes, ...cardTypes];
        duplicatedCards.sort(() => 0.5 - Math.random()); // Shuffle

        duplicatedCards.forEach((cardType) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = cardType.id;
            card.dataset.ext = cardType.ext;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });

        cards = document.querySelectorAll('.card');
    }

    function flipCard() {
        if (lockBoard || this === firstCard || this.classList.contains('flipped')) return;

        // Lógica de cambio de imagen - ¡Perfecta!
        this.style.backgroundImage = `url('img/${this.dataset.id}.${this.dataset.ext}')`;
        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.id === secondCard.dataset.id;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        // La carta se queda volteada y sin listener. Correcto.
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        pairsFound++;

        if (pairsFound === totalPairs) {
            clearInterval(timer);
            setTimeout(() => showResult('ganaste'), 500);
        }

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            // Se restaura el fondo original. Correcto.
            firstCard.style.backgroundImage = "url('img/back.png')";
            secondCard.style.backgroundImage = "url('img/back.png')";
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function showResult(result) {
        resultImage.src = `img/${result}.gif`;
        resultModal.style.display = 'flex'; // Usar flex para centrar
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timer);
                timerElement.textContent = 0;
                showResult('perdiste');
            } else {
                timerElement.textContent = timeLeft;
            }
        }, 1000);
    }

    function restartGame() {
        clearInterval(timer);
        timeLeft = 60;
        pairsFound = 0;
        timerElement.textContent = timeLeft;
        gameBoard.innerHTML = '';
        createCards();
        startTimer();
        resultModal.style.display = 'none';
    }

    restartButton.addEventListener('click', restartGame);

    // Inicio del juego
    restartGame();
});
