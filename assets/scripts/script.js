$(document).ready(function(){  
  initialAnimation();
//ALL FINISHED CODE TO GO IN HERE ONCE TESTS PASSED
});

/* JAVASCRIPT STRUCTURE PLAN
  game{object} - this will store the game's state
    game {
      stage - integer (to track which stage the player is on)
    }
      landingPageAnimation() - animates through the squares until the game is started
  startGame() - function (event listener on Play Game text) which will start a new game
  gridDisplayUpdate() - function which adds new squares to the grid according to the stage and updates their classes
  stageBegin() - shows a countdown before the stage starts, then calls stageInPlay
  stageInfo() - updates the timer and stage number below the game area
  stageInPlay() - squares are highlighted and timer countdown begins
  timerStart() - In-play countdown timer begins
  stageEnd() - called when the timer reaches 0. Squares are re-hidden and the player
                is asked to enter their answer.
  checkAnswer() - compares the player's input to the correct answer
  resetPage() - resets the webpage to its initial state
*/

let game = {
  stage: 0,
  timer: 5000
}

let textArea = $("#bottom-text-container");
let gridArea = $("#squares-container");
let singleSquareHTML = `<div class="square"></div>`;

/**
 * Iterates through the existing squares on the page and highlights random
 * ones in red until the game starts.
 */
function initialAnimation() {

  //Array shuffling function method taken from https://www.geeksforgeeks.org/how-to-shuffle-an-array-using-javascript/
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  let animation = setInterval(function () { //the setInterval function is run at specified intervals of 800ms
    console.log("initial animation activated")
    let squaresArray = $(".square");
    shuffleArray(squaresArray);
    $(squaresArray[0]).addClass("red-square");
    $(squaresArray[7]).addClass("red-square");
    $(squaresArray[15]).addClass("red-square");
    setTimeout(() => {
      $(squaresArray[0]).removeClass("red-square");
      $(squaresArray[7]).removeClass("red-square");
      $(squaresArray[15]).removeClass("red-square");
    }, 400)
    if (game.stage !== 0) {
      console.log("red squares cleared");
      $(squaresArray).removeClass("red-square");
      clearInterval(animation);
    }
  }, 400)
}

/**
 * Runs when the player clicks "Play Game", which begins Stage 1 of the game and calls another function
 * to revise the text below the grid
 */
function startGame() {
  console.log("startGame() running - player clicked 'Play Game'");
  game.stage = 1;
  textAreaRevision();
  gridDisplayUpdate();
  stageBegin();
}

function nextStage() {
  game.stage++;
  gridDisplayUpdate();
  stageBegin();  
}

/**
 * Begins the countdown of the in-play time limit.
 * Timer code taken from https://stackoverflow.com/a/31106229
 */
function timerStart() {}

function stageBegin() {
  console.log(`Stage ${game.stage} Started`);
  $(gridArea).append(`
    <div id="player-start-input">
      <p>Ready?
        <br>
        <button id="go">GO!</button>
      </p>
    </div>`);
    $("#go").on("click", function() {
      stageInPlay();
    });
}

function stageInPlay() {
  console.log("Player has clicked GO!");
}

/**
 * Changes the IDs of the paragraphs in the textArea and changes their inner HTML
 * to the either:
 *  - the text viewed when the game is in play; or
 *  - the intial values if the player has decided to return to the initial screen.
 * INCOMPLETE - TIMER VARIABLE TO BE ADDED
 */
function textAreaRevision() {
  if (game.stage == 1) {
    $("#start").attr("id", "timer");
    $("#timer").html(`Time Remaining: ${game.timer}`) // TIMER AMOUNT NEEDS TO BE INSERTED HERE
    $("#how-to").attr("id", "stage-number");
    $("#stage-number").html(`Stage ${game.stage}`)    
    console.log("textAreaRevision() - text below grid revised");
  } else {
    $("#timer").attr("id", "start");
    $("#start").html(`&nbsp; Play Game &nbsp;`)
    $("#stage-number").attr("id", "how-to");
    $("#how-to").html(`&nbsp; How to Play &nbsp;`)
    console.log("textAreaRevision() - text reset to initial values");
  }
}

/**
 * Resets the screen to the initial layout when the user chooses to exit the game.
 */
function returnToInitial() {
  game.stage = 0;
  gridArea.empty();
  for (let i = 0; i < 16; i++) {
    gridArea.append(singleSquareHTML);
  };
  gridArea.children().addClass("square-grid-4x4");
  initialAnimation();
  textAreaRevision();
}

/**
 * Checks the current game stage and adds the relevant number of squares to the grid
 * depending on the current game stage.
 */
function gridDisplayUpdate() {
  switch(game.stage) {   
    case 1:
      gridArea.empty();
      for (let i = 0; i < 16; i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-4x4");
      break;
    case 3:
      gridArea.empty();
      for (let i = 0; i < 36; i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-6x6");
      break;
    case 5:
      gridArea.empty();
      for (let i = 0; i < 64; i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-8x8")
      break;
    case 7:
      gridArea.empty();
      for (let i = 0; i < 100; i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-10x10");
      break;
    case 9:
      gridArea.empty();
      for (let i = 0; i < 144; i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-12x12");
      break;
    case 11:
      gridArea.empty();
      for (let i = 0; i < 400; i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-20x20");
      break;
    default:
      console.log(`grid not updated for stage ${game.stage}`);
  };
};





$("#start").on("click", function() {
  startGame();
});

$("#how-to").on("click", function() {
  
});



module.exports = { game, initialAnimation, startGame, textAreaRevision, gridDisplayUpdate, nextStage }; //variables/functions to go here to export to test file, separated by commas
