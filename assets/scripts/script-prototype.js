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
  stageTimer() - In-play countdown timer begins
  stageEnd() - called when the timer reaches 0. Squares are re-hidden and the player
                is asked to enter their answer.
  checkAnswer() - compares the player's input to the correct answer
  resetPage() - resets the webpage to its initial state
*/

let game = {
  stage: 0,
  timer: {sec: 5, mSec: "000"},
  clock: 3,
  redSquares: 0,
  greenSquares: 0
};

let textArea = $("#bottom-text-container");
let gridArea = $("#squares-container");
// let squaresArray = $(".square");
let singleSquareHTML = `<div class="square"></div>`;

$("#timer").hide();
$("#exit").hide();
$("#continue").hide();
$("#stage-number").hide();

//Array shuffling function method taken from https://www.geeksforgeeks.org/how-to-shuffle-an-array-using-javascript/
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };
  return array;
};

/**
 * Iterates through the existing squares on the page and highlights random
 * ones in red until the game starts.
 */
function initialAnimation() {
  let animation = setInterval(function () {
    console.log("initial animation activated");
    let squaresArray = $(".square");
    shuffleArray(squaresArray);
    for(let i = 0; i < 4; i++) {
      $(squaresArray[i]).addClass("red-square");
    }
    if (game.stage !== 0) {
      console.log("red squares cleared");
      $(squaresArray).removeClass("red-square");
      clearInterval(animation);
    }
    setTimeout(() =>{
      $(squaresArray).removeClass("red-square");
      console.log("squares deleted");
    }, 400);
  }, 800);
};

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
  game.clock = 3;  
  $("#stage-number").html(`&nbsp;Stage ${game.stage}&nbsp;`); 
  $("#player-start-input").remove();
  if (game.stage <= 14) {
    gridDisplayUpdate();
    stageBegin();
  } else {
    console.log("Game completed");
    //Code when game is completed, i.e. player completed stage 12
      //Final animation - flashing squares to congratulate
      //Provide options to return to start page or start a new game
  };
};

function stageBegin() {
  $("#continue").hide();
  $("#timer").show();
  console.log(`Stage ${game.stage} Started`);
  $("#timer").html(`&nbsp;Time Remaining: ${game.timer.sec}.${game.timer.mSec}&nbsp;`);
  gridArea.children().addClass("gray-square");
  $(gridArea).append(`
    <div id="player-start-input">
      <p>Count the RED squares
        <br>
        <button id="go">GO!</button>
      </p>
    </div>`);
  $("#go").on("click", function () {
    console.log("'GO' CLICKED");
    countdown();
  });
};

/**
 * Counts down in 1s increments and inserts the numbers 3, 2 and 1 into the game area
 * prior to the stage being in-play.
 */
function countdown() {
  console.log("countdown() called");
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
    };
  }, 1000);
};

function stageInPlay() {
  game.redSquares = 0;
  game.greenSquares = 0;
  console.log("Game in play");
  $("#player-start-input").remove();
  gridArea.children().removeClass("gray-square");
  stageSetup();
};

function stageSetup() {
  if (game.stage <= 14) {
    setRedSquares();
    if (game.stage == 10 || game.stage == 12 || game.stage == 14) {
      setGreenSquares();
    };
    stageApplyColoredSquares();
    stageTimer();
  } else {
    gameCompleted();
  };

  function setRedSquares() {
      squaresArray = $(".square");
      let stageDifficulty = game.stage;
      var stageRedSquares = [];
      let minRedSquares = Math.min(Math.max(squaresArray.length / 4, Math.round(stageDifficulty * 1.5)), 20); //sets the minimum permitted red squares for the stage
      let maxRedSquares = Math.min(Math.max(squaresArray.length / 4, Math.round(stageDifficulty * 2.5)), 30); //sets the maximum permitted red squares for the stage
      for (let i = minRedSquares; i <= maxRedSquares; i++) {
        stageRedSquares.push(i);
      };
      shuffleArray(stageRedSquares);
      game.redSquares = stageRedSquares[0];
    };

  function setGreenSquares() {
    var stageGreenSquares = [];
    let minGreenSquares = Math.round(game.redSquares * 0.75);
    let maxGreenSquares = Math.round(game.redSquares * 1.25);
    for (let i = minGreenSquares; i <= maxGreenSquares; i++) {
      stageGreenSquares.push(i);
    };
    shuffleArray(stageGreenSquares);
    game.greenSquares = stageGreenSquares[0];
  };
};

/**
 * Runs when the player has successfully passed the final stage.
 * Applies DOM changes to signify that the game has been completed.
 */
function gameCompleted() {};

/**
 * Applies the number of red squares to the grid according to the
 * game.redSquares value.
 */
function stageApplyColoredSquares() {  
  squaresArray = $(".square");
  shuffleArray(squaresArray);
  for (let i = 0; i < game.greenSquares; i++) {
    $(squaresArray[i]).addClass("green-square");
  };  
  shuffleArray(squaresArray);
  for (let i = 0; i < game.redSquares; i++) {
    $(squaresArray[i]).addClass("red-square");
  };
};

/**
 * Begins the countdown of the in-play time limit.
 */
function stageTimer() {
  let decrease = setInterval (function () {
    if (parseInt(game.timer.mSec) > 0) {
      game.timer.mSec -= 5;
      $("#timer").html(`&nbsp;Time Remaining: ${game.timer.sec}.${parseInt(game.timer.mSec).toString().padStart(3, "0")}&nbsp;`);      
    } else {
      game.timer.mSec = 995;
      game.timer.sec -= 1;
      $("#timer").html(`&nbsp;Time Remaining: ${game.timer.sec}.${parseInt(game.timer.mSec).toString().padStart(3, "0")}&nbsp;`);
    };
    if (game.timer.sec == 0 && parseInt(game.timer.mSec) == 0) {
      clearInterval(decrease);
      $("#timer").html(`Time's Up!`);
      stageEnd();
    };
  }, 5);
};

/**
 * Displays an area for the player to input their answer for each stage.
 * NEED TO ENSURE INPUT REQUIRED
 */
function stageEnd() {
  console.log("stage ended");
  game.timer = {sec: 5, mSec: "000"};
  $(".square").removeClass("red-square green-square").addClass("gray-square");
  $(gridArea).append(`
    <div id="player-start-input">
      <p>How many RED squares did you count?
        <input id="player-answer" type="number">
        <button id="player-submit" data-type="submit" required>Check</button>
      </p>
    </div>`);
  $("#player-submit").on("click", function (event) {
    checkAnswer();
  });
  $("#player-answer").focus();
  $("#player-answer").on("keydown", function (event) {
    if (event.key === "Enter") {
      checkAnswer();
    };
  });
};

/**
 * Checks the player's inputted answer against the correct answer stored in
 * the redSquares key of game.
 */
function checkAnswer() {
  console.log("Checking answer...")
  let playerAnswer = parseInt(document.getElementById("player-answer").value);
  if (playerAnswer === game.redSquares) {
    playerCorrect()
  } else {
    playerIncorrect()
  }
} 

function playerCorrect() {
  console.log("Player answered correctly!");
  squaresArray.removeClass("gray-square red-square").addClass("green-square");
  $("#player-start-input").empty().html("You got it right!")
  $("#timer").hide();
  $("#continue").show();
}

function playerIncorrect() {
  console.log("Player answered incorrectly!");
  squaresArray.removeClass("gray-square").addClass("red-square");
  //display "you got it wrong" and insert button to call startGame() to restart
  $("#player-start-input").empty().html("You got it wrong!")
  $("#timer").hide();
  $("#exit").show();
}


/**
 * Changes the IDs of the paragraphs in the textArea and changes their inner HTML
 * to the either:
 *  - the text viewed when the game is in play; or
 *  - the intial values if the player has decided to return to the landing screen.
 */
function textAreaRevision() {
  if (game.stage == 1) {
    $("#start").hide();
    $("#how-to").hide();
    $("#exit").hide();
    $("#timer").show();
    $("#timer").html(`&nbsp;Time Remaining: ${game.timer.sec}.${game.timer.mSec}&nbsp;`);
    $("#stage-number").show();
    $("#stage-number").html(`&nbsp;Stage ${game.stage}&nbsp;`);   
    console.log("textAreaRevision() - text below grid revised");
  } else {
    $("#start").show();
    $("#how-to").show();
    $("#timer").hide();
    $("#exit").hide();
    $("#stage-number").hide();
    console.log("textAreaRevision() - text reset to initial values");
  }
}

/**
 * Resets the screen to the initial layout when the user chooses to exit the game.
 * NOT YET TESTED
 */
function returnToInitial() {
  game = {
    stage: 0,
    timer: {sec: 5, mSec: "000"},
    clock: 3,
    redSquares: 0
  }
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
      for (let i = 0; i < 256; i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-16x16");
      break;
    case 13:
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

$("#exit").on("click", function() {
  returnToInitial();
});

$("#continue").on("click", function() {
  nextStage();
  $(".square").removeClass("green-square");
});

$("#how-to").on("click", function() {
  //Game instructions/help
});

$("#help-icon").on("click", function() {
  //Game instructions/help
});



module.exports = { game, initialAnimation, startGame, textAreaRevision, gridDisplayUpdate, nextStage }; //variables/functions to go here to export to test file, separated by commas
