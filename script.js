var squares = document.querySelectorAll(".square");
var playerButton = document.querySelector("#first");
var message = document.querySelector("#message");

const INF = 100000;
const MAX_DEPTH = 6;
const winStates = [
	[0, 1, 2], [0, 4, 8], 
	[0, 3, 6], [1, 4, 7],
	[2, 5, 8], [3, 4, 5],
	[6, 7, 8], [2, 4, 6]];

var gameOver;
var board;

init();
function init(){
	playerButton.classList.add("selected");
	gameOver = false;
	board = ["", "", "", "", "", "", "", "", ""];
	message.textContent	= "";
	updateDisplay(board);
}

for(var i = 0; i < squares.length; i++){
	squares[i].addEventListener("click", function(){
		humanMove(this);
		setTimeout(aiMove, 500);
	});
}

playerButton.addEventListener("click", function(){
	this.classList.toggle("selected");
	aiMove();
});

function humanMove(context){
	if(context.textContent === "" && !gameOver){
		context.textContent = "X";

		for(var i = 0; i < squares.length; i++)
			board[i] = squares[i].textContent;

		gameOver = updateMessage(evaluate(board), false);
	}
}

function aiMove(){
	if(!gameOver){
		board = minimax(board, MAX_DEPTH, false);
		
		updateDisplay(board);
		gameOver = updateMessage(evaluate(board), true);
	}
}

function updateMessage(eval, isHumanNext){
	if(eval === -10){
		message.textContent = "You Lose";
	} else if(eval === 10){
		message.textContent = "You Win";
	} else if (eval === 0){
		message.textContent = "Draw";
	} else {
		message.textContent = isHumanNext?"Your Turn":"";
		return false;
	}
	return true;
}

function updateDisplay(board){
	for(var i = 0; i < squares.length; i++)
		squares[i].textContent = board[i];
}

function evaluate(board){
	for(var i = 0; i < winStates.length; i++){
		var state = winStates[i];
		if(board[state[0]] === board[state[1]] &&
			 board[state[0]] === board[state[2]] &&
			 board[state[0]] !== ""){
			return (board[state[0]] === "X")?10:-10;
		}
	}
	return noMoves(board)?0:-1;
}

function noMoves(board){
	return (board.indexOf("") == -1);
}

function generateStates(board, isHuman){
	var states = [];
	for(var i = 0; i < board.length; i++){
		if(board[i] === ""){
			var newState = board.slice();
			newState[i] = isHuman?"X":"O";
			states.push(newState);
		}
	}
	return states;
}

function minimax(board, depth, isHuman){
	var res = evaluate(board);
	if(depth === 0 || res !== -1)
		return res;

	var nextStates = generateStates(board, isHuman);
	var bestState = nextStates[0];

	var bestEval = isHuman?-INF:INF;
	for(var i = 0; i < nextStates.length; i++){
		var eval = minimax(nextStates[i], depth - 1, !isHuman);

		if((isHuman && (eval > bestEval)) || (!isHuman && (eval < bestEval))){
			bestEval = eval;
			bestState = nextStates[i];
		}
	}
	return (depth === MAX_DEPTH)?bestState:bestEval;
}
