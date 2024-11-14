const targetWord = "APPLE"; // The word to guess
let currentRow = 0;
const maxGuesses = 6;

const inputs = document.querySelectorAll('.guess-input');
inputs.forEach((input, index) => {
    input.addEventListener('keydown', (e) => {
        if (e.key === "Backspace" && input.value === '') {
            if (index > 0) inputs[index - 1].focus();
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

document.getElementById('submit-guess').addEventListener('click', () => {
    const guessInputs = document.querySelectorAll('.guess-input');
    let guess = '';
    guessInputs.forEach(input => {
        guess += input.value.toUpperCase();
    });

    if (guess.length !== 5) {
        alert("Please enter a 5-letter word.");
        return;
    }

    const grid = document.getElementById('grid');
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

        grid.appendChild(cell);
    }

    currentRow++;
    guessInputs.forEach(input => {
        input.value = '';
    });

    if (guess === targetWord) {
        announce("You win!");
        endGame();
    } else if (currentRow === maxGuesses) {
        announce(`You lose! The word was ${targetWord}.`);
        endGame();
    }
});

function announce(message) {
    document.getElementById('info-message').textContent = message;
}

function endGame() {
    document.getElementById('submit-guess').disabled = true;
    inputs.forEach(input => {
        input.disabled = true;
    });
}