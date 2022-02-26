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
  timer: 5000,
  clock: 3,
  redSquares: 0
}

let textArea = $("#bottom-text-container");
let gridArea = $("#squares-container");
let singleSquareHTML = `<div class="square"></div>`;

$("#timer").hide();
$("#stage-number").hide();

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

  let animation = setInterval(function () {
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
  gridArea.children().addClass("gray-square");
  $(gridArea).append(`
    <div id="player-start-input">
      <p>Count the RED squares
        <br>
        <button id="go">GO!</button>
      </p>
    </div>`);
    $("#go").on("click", function() {
      console.log("'GO' CLICKED")
      countdown();
    });
}

/**
 * Counts down in 1s increments and inserts the numbers 3, 2 and 1 into the game area
 * prior to the stage being in-play.
 */
function countdown() {
  console.log("countdown() called")
  $("#player-start-input > p").empty();
  $("#player-start-input > p").attr("id", "center-nums").html(`${game.clock}`);
  let count = setInterval (function () {  
    game.clock -= 1;    
    $("#center-nums").empty();
    $("#center-nums").html(`${game.clock}`);
    console.log("time logged");
    if (game.clock < 1) {
      clearInterval(count);      
      stageInPlay();
    }
  }, 1000)
}

function stageInPlay() {
  game.redSquares = 0;
  console.log("Game in play");
  $("#player-start-input").remove();
  gridArea.children().removeClass("gray-square");
  setSquares();// code to highlight certain number of squares - new f probably best
}

function setSquares() {
  if (game.stage < 13) {
    switch (game.stage) {
      case 1:
      case 2:
        //set number of red squares
      case 3:
      case 4:
        //set number of red squares
      case 5:
      case 6:
        //set number of red squares
      case 7:
      case 8:
        //set number of red squares
      case 9:
      case 10:
        //set number of red and green squares
      case 11:
      case 12:
        //set number of red and green squares
    }
    timerStart(); // to start the timer.
  } else {
    //Code when game is completed, i.e. player completed stage 12
  }
}

/**
 * Decreases the timer value in the game for display below the grid.
 */
function timerStart() {
  //Decrease game.timer in real-time
  //when game.timer is 0, call stageEnd()
}

/**
 * Displays an area for the player to input their answer for each stage.
 */
function stageEnd() {
  //insert input for player
}

/**
 * Checks the player's inputted answer against the correct answer stored in
 * the redSquares key of game.
 */
function checkAnswer() {
  //compare answer to game.redSquares
  //if correct, display "you got it correct" and insert button to call stageBegin() to proceed
    // else display "you got it wrong" and insert button to call startGame() to restart
}

/**
 * Changes the IDs of the paragraphs in the textArea and changes their inner HTML
 * to the either:
 *  - the text viewed when the game is in play; or
 *  - the intial values if the player has decided to return to the landing screen.
 * INCOMPLETE - TIMER VARIABLE TO BE ADDED
 */
function textAreaRevision() {
  if (game.stage == 1) {
    $("#start").hide();
    $("#how-to").hide();
    $("#timer").show();
    $("#timer").html(`&nbsp;Time Remaining: ${game.timer}&nbsp;`); // TIMER AMOUNT NEEDS TO BE INSERTED HERE
    $("#stage-number").show();
    $("#stage-number").html(`&nbsp;Stage ${game.stage}&nbsp;`);   
    console.log("textAreaRevision() - text below grid revised");
  } else {
    $("#start").show();
    $("#how-to").show();
    $("#timer").hide();
    $("#stage-number").hide();
    console.log("textAreaRevision() - text reset to initial values");
  }
}

/**
 * Resets the screen to the initial layout when the user chooses to exit the game.
 * NOT YET TESTED
 */
function returnToInitial() {
  game.stage = 0;
  game.clock = 3;
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
