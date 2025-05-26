const dictionary = [`earth`, `plane`, `crane`, `audio`];

const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill(``)),
  currentRow: 0,
  currentCol: 0,
};

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

// creates a single box for one letter each.
function drawBox(container, row, col, letter = "") {
  const box = document.createElement("div");
  box.className = "box";
  box.id = `box${row}${col}`;
  box.textContent = letter;
  container.appendChild(box);
  return box;
}

function drawGrid(container) {
  const grid = document.createElement("div");
  grid.className = "grid";

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function getCurrentWord() {
  return state.grid[state.currentRow].join("");
}

// checks if the word guessed is a valid word 

function isWordValid(word) {
  return dictionary.includes(word.toLowerCase());
}

function revealWord(guess) {
  const row = state.currentRow;

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;

    if (letter === state.secret[i]) {
      box.classList.add("right"); // correct letter in correct positing

    } else if (state.secret.includes(letter)) {
      box.classList.add("wrong"); // letter exists but in wrong position 
    } else {
      box.classList.add("empty"); // letter dosent exist at all
    }
  }

  const isWinner = state.secret === guess;
  const isLastRow = state.currentRow === 5;

  if (isWinner) {
    alert(`Congratulations!`);
    state.currentRow = 6;
  } else if (isLastRow) {
    alert(`Better luck next time! The word was ${state.secret}`);
    state.currentRow = 6;
  } else {
    state.currentRow++;
    state.currentCol = 0;
  }
}

function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
  if (state.currentCol === 5) return;
  state.grid[state.currentRow][state.currentCol] = letter.toLowerCase();
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol === 0) return;
  state.currentCol--;
  state.grid[state.currentRow][state.currentCol] = "";
}

function startup() {
  const game = document.getElementById("game");
  drawGrid(game);
  registerKeyboardEvents();
  updateGrid();
  console.log(state.secret);
}

startup();

function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    if (state.currentRow >= 6) return;

    const key = e.key;

    if (key === "Enter") {
      if (state.currentCol === 5) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
          revealWord(word);
        } else {
          alert("Not a valid word.");
          state.grid[state.currentRow] = Array(5).fill("");
          state.currentCol = 0;
        }
      }
    }

    if (key === "Backspace") {
      removeLetter();
    }

    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}
