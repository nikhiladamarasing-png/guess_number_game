// --- DOM Elements ---
const numberDisplay = document.getElementById('number-display');
const userInput = document.getElementById('user-input');
const inputForm = document.getElementById('input-form');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const replayButton = document.getElementById('replay-button');
const newGameButton = document.getElementById('new-game-button');
const submitButton = document.getElementById('submit-button');
const messageBox = document.getElementById('message-box');

// --- Game State Variables ---
let score = 0;
let level = 1;
let sequence = [];
let isUserInputEnabled = false;
let timerId = null;

// --- Functions ---

/**
 * Starts a new game, resetting score and level.
 */
function newGame() {
    score = 0;
    level = 1;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    inputForm.classList.remove('hidden');
    replayButton.classList.remove('hidden');
    newGameButton.textContent = 'Start New Game';
    playLevel();
}

/**
 * Plays a single level of the game.
 */
function playLevel() {
    isUserInputEnabled = false;
    userInput.value = '';
    userInput.disabled = true;
    submitButton.disabled = true;

    // Generate a new number sequence based on the current level.
    sequence = generateSequence(level);

    // Display the sequence to the user.
    displaySequence(sequence);
}

/**
 * Generates a random number sequence of a specified length.
 * @param {number} length The length of the sequence to generate.
 * @returns {string} The generated sequence as a string.
 */
function generateSequence(length) {
    let s = '';
    for (let i = 0; i < length; i++) {
        s += Math.floor(Math.random() * 10);
    }
    return s;
}

/**
 * Displays the number sequence on the screen for a limited time.
 * @param {string} seq The sequence to display.
 */
function displaySequence(seq) {
    numberDisplay.textContent = seq;
    numberDisplay.classList.remove('opacity-0');
    numberDisplay.classList.add('opacity-100');

    // Set a timer to hide the numbers.
    const displayTime = level > 5 ? 1000 : 2000; // Shorter time for higher levels
    timerId = setTimeout(() => {
        hideSequence();
    }, displayTime);
}

/**
 * Hides the number sequence and enables user input.
 */
function hideSequence() {
    numberDisplay.textContent = '?';
    numberDisplay.classList.remove('opacity-100');
    numberDisplay.classList.add('opacity-0');

    isUserInputEnabled = true;
    userInput.disabled = false;
    submitButton.disabled = false;
    userInput.focus();
}

/**
 * Checks the user's input against the correct sequence.
 */
function checkAnswer() {
    const userAnswer = userInput.value;
    if (userAnswer === sequence) {
        showMessage("Correct!", "border-green-600");
        score += 10 * level; // Increase score based on level
        scoreDisplay.textContent = score;
        setTimeout(() => {
            nextLevel();
        }, 1500);
    } else {
        showMessage(`Incorrect! The correct sequence was: ${sequence}`, "border-red-600");
        setTimeout(() => {
            endGame();
        }, 1500);
    }
}

/**
 * Advances the game to the next level.
 */
function nextLevel() {
    level++;
    levelDisplay.textContent = level;
    playLevel();
}

/**
 * Ends the game and displays the final score.
 */
function endGame() {
    inputForm.classList.add('hidden');
    numberDisplay.classList.remove('opacity-0');
    numberDisplay.classList.add('opacity-100');
    numberDisplay.textContent = 'Game Over';
    showMessage(`Game Over! Final Score: ${score}`, "border-red-600");
    newGameButton.textContent = 'Play Again';
}

/**
 * Replays the current level without resetting the score.
 * This function was corrected to properly reset the timer and state.
 */
function replayGame() {
    // Clear any pending timers to prevent issues with multiple timeouts.
    clearTimeout(timerId);

    // Reset the visual state of the game
    numberDisplay.classList.add('opacity-100');
    numberDisplay.classList.remove('opacity-0');
    numberDisplay.textContent = '?';
    userInput.value = '';

    // Replay starts the level over, keeping the current level and score.
    playLevel();
}

/**
 * Displays a temporary message box.
 * @param {string} message The message to display.
 * @param {string} colorClass The Tailwind color class for the background.
 */
function showMessage(message, colorClass) {
    messageBox.textContent = message;
    messageBox.className = `message-box bg-gray-800 text-white p-6 rounded-xl shadow-2xl text-center text-xl md:text-2xl border-4 ${colorClass} animate-pulse block`;

    setTimeout(() => {
        messageBox.classList.remove('block');
        messageBox.classList.add('hidden');
    }, 1000);
}

// --- Event Listeners ---
inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isUserInputEnabled) {
        checkAnswer();
    }
});

replayButton.addEventListener('click', replayGame);
newGameButton.addEventListener('click', newGame);

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    newGame();
});