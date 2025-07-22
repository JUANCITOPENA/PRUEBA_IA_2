document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const gameBoard = document.getElementById('game-board');
    const timerElement = document.getElementById('timer');
    const modal = document.getElementById('end-game-modal');
    const modalImage = document.getElementById('end-game-image');
    const restartButton = document.getElementById('restart-button');

    // --- CONFIGURACIÓN Y ESTADO DEL JUEGO ---
    const cardImages = [
        'img/1.gif', 'img/2.webp', 'img/3.webp', 'img/4.jpeg',
        'img/5.jpeg', 'img/6.jpeg', 'img/7.jpeg', 'img/8.jpeg'
    ];
    const TOTAL_PAIRS = cardImages.length;
    const GAME_TIME = 60; // segundos

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;
    let timerInterval = null;
    let timeLeft = GAME_TIME;

    // --- FUNCIONES DEL JUEGO ---

    // 1. Barajar las cartas
    function shuffle(array) {
        array.sort(() => 0.5 - Math.random());
    }

    // 2. Crear y renderizar el tablero
    function createBoard() {
        gameBoard.innerHTML = '';
        const gameCards = [...cardImages, ...cardImages]; // Duplicar para tener pares
        shuffle(gameCards);

        gameCards.forEach(imageSrc => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = imageSrc;

            card.innerHTML = `
                <div class="card-face card-front">
                    <img src="${imageSrc}" alt="Personaje de Jujutsu Kaisen">
                </div>
                <div class="card-face card-back"></div>
            `;

            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    // 3. Lógica al hacer clic en una carta
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return; // Evitar doble clic en la misma carta

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true; // Bloquear el tablero durante la verificación
        checkForMatch();
    }

    // 4. Verificar si las dos cartas volteadas coinciden
    function checkForMatch() {
        const isMatch = firstCard.dataset.image === secondCard.dataset.image;
        isMatch ? disableCards() : unflipCards();
    }

    // 5. Si coinciden, desactivarlas
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        matchedPairs++;
        resetBoard();

        if (matchedPairs === TOTAL_PAIRS) {
            winGame();
        }
    }

    // 6. Si no coinciden, voltearlas de nuevo
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1200); // Pausa para que el jugador vea la segunda carta
    }

    // 7. Resetear las variables de turno
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    // 8. Iniciar y manejar el temporizador
    function startTimer() {
        timeLeft = GAME_TIME;
        timerElement.textContent = timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                loseGame();
            }
        }, 1000);
    }

    // 9. Lógica de victoria
    function winGame() {
        clearInterval(timerInterval);
        setTimeout(() => {
            modalImage.src = 'img/ganaste.gif';
            modalImage.alt = 'Ganaste';
            modal.style.display = 'flex';
        }, 500); // Pequeña espera para saborear la victoria
    }

    // 10. Lógica de derrota
    function loseGame() {
        clearInterval(timerInterval);
        lockBoard = true; // Bloquear el tablero completamente
        modalImage.src = 'img/perdiste.gif';
        modalImage.alt = 'Perdiste';
        modal.style.display = 'flex';
    }

    // 11. Función para iniciar/reiniciar el juego
    function startGame() {
        // Resetear estado
        matchedPairs = 0;
        lockBoard = false;
        if (timerInterval) clearInterval(timerInterval);
        modal.style.display = 'none';

        createBoard();
        startTimer();
    }

    // --- EVENT LISTENERS ---
    restartButton.addEventListener('click', startGame);

    // --- INICIAR EL JUEGO AL CARGAR LA PÁGINA ---
    startGame();
});