let targetWord = "";
let currentRow = 0;
const maxGuesses = 6;

fetch('https://raw.githubusercontent.com/guzzdev/wordle/refs/heads/main/words')
    .then(response => response.text())
    .then(data => {
        const words = data.split('\n').map(word => word.trim().toUpperCase());
        targetWord = words[Math.floor(Math.random() * words.length)];
        console.log(`Target word: ${targetWord}`); // For debugging purposes
    });

const inputs = document.querySelectorAll('.guess-input');
const grid = document.getElementById('grid');
const submitButton = document.getElementById('submit-guess');
const resetButton = document.getElementById('reset-game');
const infoMessage = document.getElementById('info-message');

inputs[0].focus();

inputs.forEach((input, index) => {
    input.addEventListener('keydown', (e) => {
        if (e.key === "Backspace" && input.value === '') {
            if (index > 0) inputs[index - 1].focus();
        } else if (e.key === "Enter") {
            handleGuess();
        }
    });
    input.addEventListener('input', (e) => {
        if (input.value.length === 1) {
            if (!/^[a-zA-Z]$/.test(input.value)) {
                input.value = '';
                return;
            }
            if (index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        }
    });
});

submitButton.addEventListener('click', handleGuess);
resetButton.addEventListener('click', resetGame);

function handleGuess() {
    const guess = Array.from(inputs).map(input => input.value.toUpperCase()).join('');

    if (guess.length !== 5) {
        alert("Please enter a 5-letter word.");
        return;
    }

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 5; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = guess[i];

        if (guess[i] === targetWord[i]) {
            cell.classList.add('correct');
        } else if (targetWord.includes(guess[i])) {
            cell.classList.add('present');
        } else {
            cell.classList.add('absent');
        }

        fragment.appendChild(cell);
    }
    grid.appendChild(fragment);

    currentRow++;
    inputs.forEach(input => input.value = '');
    inputs[0].focus();

    if (guess === targetWord) {
        announce("You win!");
        endGame();
    } else if (currentRow === maxGuesses) {
        announce(`You lose! The word was ${targetWord}.`);
        endGame();
    }
}

function announce(message) {
    infoMessage.textContent = message;
    infoMessage.style.display = 'block';
}

function endGame() {
    submitButton.disabled = true;
    inputs.forEach(input => input.disabled = true);
}

function resetGame() {
    targetWord = "";
    currentRow = 0;
    fetch('words')
        .then(response => response.text())
        .then(data => {
            const words = data.split('\n').map(word => word.trim().toUpperCase());
            targetWord = words[Math.floor(Math.random() * words.length)];
            console.log(`New target word: ${targetWord}`); // For debugging purposes
        });

    grid.innerHTML = '';
    inputs.forEach(input => {
        input.value = '';
        input.disabled = false;
    });
    submitButton.disabled = false;
    infoMessage.style.display = 'none';
    inputs[0].focus();
}