const squares = document.querySelectorAll("td");
const skipButton = document.querySelector("#skip");
const restartButton = document.querySelector("#restart");
const message = document.querySelector("#message");

const INF = 100000;
const MAX_DEPTH = 6;
const winStates = [
    [0, 1, 2],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
    [2, 4, 6],
];

let gameOver;
let board;

/* Sets all variables to initial values */
function init() {
    for (let i = 0; i < squares.length; i++) {
        squares[i].classList.remove("selected", "blue", "yellow");
    }
    gameOver = false;
    board = ["", "", "", "", "", "", "", "", ""];
    message.innerText = "your turn";
    updateDisplay(board);
}

/* Logic for human move */
function humanMove(context) {
    if (!gameOver) {
        context.innerText = "X";
        context.classList.add("blue");

        for (let i = 0; i < squares.length; i++)
            board[i] = squares[i].innerText;
        gameOver = updateMessage(evaluate(board), false);
    }
}

/* Logic for AI move */
function aiMove() {
    if (!gameOver) {
        board = minimax(board, MAX_DEPTH, false);
        updateDisplay(board);
        gameOver = updateMessage(evaluate(board), true);
    }
}

/* Updates Win/Lose/Draw message and returns true if game is over */
function updateMessage(eval, isHumanNext) {
    switch (eval) {
        case -10:
            message.innerText = "you lose";
            markWinState(board);
            return true;
        case 10:
            message.innerText = "you win";
            markWinState(board);
            return true;
        case 0:
            message.innerText = "it's a draw";
            return true;
        default:
            message.innerText = isHumanNext ? "your turn" : "";
            return false;
    }
}

/* Marks the win state for human or AI on the board */
function markWinState(board) {
    for (let i = 0; i < winStates.length; i++) {
        let state = winStates[i];
        if (
            board[state[0]] === board[state[1]] &&
            board[state[0]] === board[state[2]] &&
            board[state[0]] !== ""
        ) {
            squares[state[0]].classList.add("selected");
            squares[state[1]].classList.add("selected");
            squares[state[2]].classList.add("selected");
            return;
        }
    }
}

/* Updates contents of the game board */
function updateDisplay(board) {
    squares.forEach((val, i) => {
        val.innerText = board[i];
        if (board[i] === "O") {
            squares[i].classList.add("yellow");
        }
    });
}

/* Returns a score for current state of the board */
function evaluate(board) {
    for (let i = 0; i < winStates.length; i++) {
        let state = winStates[i];
        if (
            board[state[0]] === board[state[1]] &&
            board[state[0]] === board[state[2]] &&
            board[state[0]] !== ""
        ) {
            return board[state[0]] === "X" ? 10 : -10;
        }
    }
    return noMoves(board) ? 0 : -1;
}

/* Returns true is no more moves can be made */
function noMoves(board) {
    return board.indexOf("") === -1;
}

/* Generates next states given current state and player */
function generateStates(board, isHuman) {
    let states = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            let newState = board.slice();
            newState[i] = isHuman ? "X" : "O";
            states.push(newState);
        }
    }
    return states;
}

/* Recursive algorithm that returns the best state */
function minimax(board, depth, isHuman) {
    let res = evaluate(board);
    if (depth === 0 || res !== -1) return res;

    let nextStates = generateStates(board, isHuman);
    let bestState = nextStates[0];

    let bestEval = isHuman ? -INF : INF;
    for (let i = 0; i < nextStates.length; i++) {
        let eval = minimax(nextStates[i], depth - 1, !isHuman);

        if ((isHuman && eval > bestEval) || (!isHuman && eval < bestEval)) {
            bestEval = eval;
            bestState = nextStates[i];
        }
    }
    return depth === MAX_DEPTH ? bestState : bestEval;
}

/* Calls the human and AI move functions when board is clicked */
for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", function () {
        if (this.innerText === "") {
            humanMove(this);
            setTimeout(aiMove, 500);
        }
    });
}

skipButton.addEventListener("click", aiMove);
restartButton.addEventListener("click", init);

init();
