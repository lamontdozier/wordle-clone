// Import Wordlist
import { words } from './wordlist.js';

// Guesses variables
const numberOfGuesses = 6;
let remainingGuesses = numberOfGuesses;
let currentGuess = [];
let nextLetter = 0;
let correctGuess = words[Math.floor(Math.random() * words.length)];

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('opening-modal');
    const closeModalButton = document.getElementById('close-modal');
    const container = document.getElementById('container');

    // Show modal on page load
    setTimeout(() => {
        modal.classList.add('show');
    }, 100); // Slight delay to ensure the CSS transition works

    // Handle close modal button click
    closeModalButton.addEventListener('click', () => {
        const modalContent = document.getElementById('modal-content');

        // Slide modal content out
        modalContent.style.transform = 'translateY(100vh)';

        // Fade out modal and remove blur
        setTimeout(() => {
            modal.classList.add('hide');
            container.classList.add('show');
        }, 1000); // Wait for the modal content to finish sliding out
    });
});

// Game Board setup
const gameBoard = () => {
    let board = document.getElementById('game-board');
    for (let i = 0; i < numberOfGuesses; i++) {
        let row = document.createElement('div');
        row.className = 'guess';
        for (let j = 0; j < 5; j++) {
            let box = document.createElement('div');
            box.className = 'tile';
            row.appendChild(box);
        }
        board.appendChild(row);
    }
};
gameBoard();

// Keyboard interaction
document.addEventListener('keyup', (e) => {
    if (remainingGuesses === 0) {
        return;
    }
    let keyPress = String(e.key);
    if (keyPress === 'Backspace' && nextLetter !== 0) {
        deleteLetter();
        return;
    }
    if (keyPress === 'Enter') {
        checkGuess();
        return;
    }
    let foundLetter = keyPress.match(/[a-z]/gi);
    if (!foundLetter || foundLetter.length > 1) {
        return;
    } else {
        addLetter(keyPress);
    }
});

const addLetter = (keyPress) => {
    if (nextLetter === 5) {
        return;
    }
    keyPress = keyPress.toLowerCase();

    let row = document.getElementsByClassName("guess")[6 - remainingGuesses];
    let box = row.children[nextLetter];
    box.textContent = keyPress;
    currentGuess.push(keyPress);
    nextLetter += 1;
};

function deleteLetter() {
    let row = document.getElementsByClassName("guess")[6 - remainingGuesses];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    currentGuess.pop();
    nextLetter -= 1;
}

document.getElementById("keyboard").addEventListener("click", (event) => {
    const target = event.target;

    if (!target.classList.contains("key")) {
        return;
    }
    let key = target.textContent;

    if (key === "Del") {
        key = "Backspace";
    }

    document.dispatchEvent(new KeyboardEvent("keyup", { 'key': key }));
});

// Game functionality
function checkGuess() {
    let row = document.getElementsByClassName("guess")[6 - remainingGuesses];
    let usedLetters = {};

    currentGuess.forEach((letter, index) => {
        setTimeout(() => {
            let box = row.children[index];
            let isInWord = correctGuess.includes(letter);
            let isCorrectPosition = letter === correctGuess[index];

            if (isCorrectPosition) {
                box.style.backgroundColor = 'Green';
                updateKeyboard(letter, 'Green');
            } else if (isInWord) {
                box.style.backgroundColor = 'GoldenRod';
                updateKeyboard(letter, 'GoldenRod');
            } else {
                box.style.backgroundColor = 'DimGray';
                updateKeyboard(letter, 'DimGray');
            }
        }, index * 300); // Staggered feedback
    });

    setTimeout(() => {
        if (currentGuess.join('') === correctGuess) {
            showModal("Congratulations! You Win!");
        } else if (remainingGuesses <= 1) {
            showModal(`Better Luck Next Time! The correct word was: "${correctGuess}"`);
        }
        remainingGuesses--;
        currentGuess = [];
        nextLetter = 0;
    }, 5 * 300);
}

function updateKeyboard(letter, color) {
    const key = document.getElementById(letter.toUpperCase());
    if (key) {
        key.style.backgroundColor = color;
    }
}

function showModal(message) {
    const closingModal = document.getElementById('closing-modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;

    closingModal.classList.add('show');
    setTimeout(() => {
        closingModal.style.transform = 'translateY(0)';
    }, 100);
}

document.getElementById('closing-modal').addEventListener('click', () => {
    const closingModal = document.getElementById('closing-modal');
    closingModal.style.transform = 'translateY(100vh)';
    setTimeout(() => {
        closingModal.classList.remove('show');
    }, 1000);
});

// Reset the game
document.getElementById('play-again').addEventListener('click', () => {
    window.location.reload();
});
