$(document).ready(function(){  
  initialAnimation();
  initialElementHiding();
//ALL FINISHED CODE TO GO IN HERE ONCE TESTS PASSED
//APART FROM SOME (NEED TO THINK ABOUT THIS - EG MAY BE EVENT LISTENERS)
});

/* TO DO:
    - CREATE TOOLTIP FOR HOVERING OVER HELP ICON
    - STYLING OF ELEMENTS (START WITH INPUT AND BUTTON)
    - INSTRUCTIONS FOR HOW TO PLAY GAME
    - FINAL WINNING ANIMATION AND OTHER DOM CHANGES
    - RESPONSIVE STYLING
    - INSERT DESCRIPTIONS FOR ALL FUNCTIONS IN JS FILE
    - TRY HAVING THE INITIALLY HIDDEN ELEMENTS HIDDEN BY CSS RATHER THAN JS AS SOMETIMES THEY'LL SHOW FOR A SHORT TIME ON PAGE LOAD
    - CONSIDER ADDING GAME SOUNDS IF THERE'S TIME - RESEARCH NEEDED FOR OPEN SOURCES
*/

let game = {
  status: "incomplete",
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

function initialElementHiding() {
  $("#help-icon").hide().removeClass("hidden");
  $("#timer").hide().removeClass("hidden");
  $("#restart").hide().removeClass("hidden");
  $("#exit").hide().removeClass("hidden");
  $("#continue").hide().removeClass("hidden");
  $("#stage-number").hide().removeClass("hidden");
  $("#replay").hide().removeClass("hidden");
}

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
  $("#help-icon").show();
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
    gameCompleted();
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
        <button id="go" class="clickable">GO!</button>
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
  let stageDifficulty = game.stage;
  if (game.stage <= 14) {
    setRedSquares();
    if (game.stage >= 10) {
      setGreenSquares();
    };
    stageApplyColoredSquares();
    stageTimer();
  } else {
    gameCompleted();
  };

  function setRedSquares() {
    var stageRedSquareOptions = [];
    var minRedSquares;
    var maxRedSquares;
    switch (game.stage) {
      case 1:
      case 2:
      case 3:
        minRedSquares = Math.min(Math.round(stageDifficulty * 2.5), 25);
        maxRedSquares = Math.min(Math.round(stageDifficulty * 4), 30);
        break;
      default:
        minRedSquares = Math.min(Math.round(stageDifficulty * 3), 25);
        maxRedSquares = Math.min(Math.round(stageDifficulty * 4.5), 30);
    }
    for (let i = minRedSquares; i <= maxRedSquares; i++) {
      stageRedSquareOptions.push(i);
    };
    shuffleArray(stageRedSquareOptions);
    game.redSquares = stageRedSquareOptions[0];
  };

  function setGreenSquares() {
    var stageGreenSquareOptions = [];
    let minGreenSquares = Math.round(stageDifficulty * 6);
    let maxGreenSquares = Math.round(stageDifficulty * 6.5);
    for (let i = minGreenSquares; i <= maxGreenSquares; i++) {
      stageGreenSquareOptions.push(i);
    };
    shuffleArray(stageGreenSquareOptions);
    game.greenSquares = stageGreenSquareOptions[0];
  };
};

/**
 * Runs when the player has successfully passed the final stage.
 * Applies DOM changes to signify that the game has been completed.
 */
function gameCompleted() {
  game.status = "completed";
  $("#player-start-input").empty().html("GONGRATULATIONS!<br>You beat the game!");
  $("#timer").hide();
  $("#exit").show();
  $("#stage-number").hide();
  $("#replay").show();
  finalAnimation();
};

function finalAnimation() {
  let squaresArray = $(".square");
  squaresArray.addClass("green-square");
  let animation = setInterval(function () {
    squaresArray.fadeTo(500, 0.1, function () {});
    squaresArray.fadeTo(500, 1, function () {});
    if (game.status !== "completed") {
      $(squaresArray).removeClass("green-square");
      clearInterval(animation);
    };
  });
};

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
      $("#timer").html(`&nbsp;Time's Up!&nbsp;`);
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
    if (document.getElementById("player-answer").value == "") {
      window.alert("Please input a numeric answer.");
    } else {
      checkAnswer();
    }
  });
  $("#player-answer").focus();
  $("#player-answer").on("keydown", function (event) {
    if (event.key === "Enter") {
      if (document.getElementById("player-answer").value == "") {
        window.alert("Please input a numeric answer.");
      } else {
        checkAnswer();
      };
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
  if (game.stage < 14) {
    squaresArray.removeClass("gray-square red-square").addClass("green-square");
    $("#player-start-input").empty().html("You got it right!")
    $("#timer").hide();
    $("#continue").show();
  } else if (game.stage = 14) {
    gameCompleted();
  } else {    
    console.log("Error in playerCorrect function");
    window.alert("An error has occured. The game will now exit.");
    returnToInitial();
  };
};

function playerIncorrect() {
  console.log("Player answered incorrectly!");
  squaresArray.removeClass("gray-square").addClass("red-square");
  $("#player-start-input").empty().html(`You got it wrong!<br>You reached<br>Stage ${game.stage}`)
  $("#timer").hide();
  $("#stage-number").hide();
  $("#restart").show();
  $("#exit").show();
};


/**
 * Changes the IDs of the paragraphs in the textArea and changes their inner HTML
 * to the either:
 *  - the text viewed when the game is in play; or
 *  - the intial values if the player has decided to return to the landing screen.
 */
function textAreaRevision() {  
  $("#player-start-input").remove();
  if (game.stage == 1) {
    $("#start").hide();
    $("#how-to").hide();
    $("#restart").hide();
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
    $("#restart").hide();
    $("#exit").hide();
    $("#stage-number").hide();
    $("#replay").hide();
    console.log("textAreaRevision() - text reset to initial values");
  };
};

/**
 * Resets the screen to the initial layout when the user chooses to exit the game.
 */
function returnToInitial() {
  game = {
    status: "incomplete",
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
  switch (game.stage) {   
    case 1:
      gridArea.empty();
      for (let i = 0; i < (4 * 4); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-4x4");
      break;  
    case 2:
      gridArea.empty();
      for (let i = 0; i < (5 * 5); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-5x5");
      break;
    case 3:
      gridArea.empty();
      for (let i = 0; i < (6 * 6); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-6x6");
      break;  
    case 4:
      gridArea.empty();
      for (let i = 0; i < (7 * 7); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-7x7");
      break;
    case 5:
      gridArea.empty();
      for (let i = 0; i < (8 * 8); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-8x8")
      break;  
    case 6:
      gridArea.empty();
      for (let i = 0; i < (9 * 9); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-9x9");
      break;
    case 7:
      gridArea.empty();
      for (let i = 0; i < (10 * 10); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-10x10");
      break;  
    case 8:
      gridArea.empty();
      for (let i = 0; i < (11 * 11); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-11x11");
      break;
    case 9:
      gridArea.empty();
      for (let i = 0; i < (12 * 12); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-12x12");
      break;
    case 10:
      gridArea.empty();
      for (let i = 0; i < (13 * 13); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-13x13");
      break;
    case 11:
      gridArea.empty();
      for (let i = 0; i < (14 * 14); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-14x14");
      break;
    case 12:
      gridArea.empty();
      for (let i = 0; i < (16 * 16); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-16x16");
      break;
    case 13:
      gridArea.empty();
      for (let i = 0; i < (18 * 18); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-18x18");
      break;
    case 14:
      gridArea.empty();
      for (let i = 0; i < (20 * 20); i++) {
        gridArea.append(singleSquareHTML);
      };
      gridArea.children().addClass("square-grid-20x20");
      break;
    default:
      console.log("Error in gridDisplayUpdate() function");
      window.alert("An error has occured. The game will now exit.");
      returnToInitial();
  };
};


//Event Handlers
$("#page-title").on("mouseenter", (function () {
    if (game.timer.sec < 5) {
      $(this).removeClass("clickable").addClass("unclickable");
    } else {
      $(this).removeClass("unclickable").addClass("clickable");
    };
  }));

$("#page-title").on("click", function () {
  if (game.stage != 0 && game.timer.sec == 5) {
    if (confirm("Are you sure you want to exit the game? You will lose all your progress.") == true) {
      window.location = "./index.html";
    };
  };
});

$("#start").on("click", function() {
  startGame();
});

$("#restart").on("click", function() {
  returnToInitial();
  startGame();
});

$("#exit").on("click", function() {
  returnToInitial();
});

$("#continue").on("click", function() {
  nextStage();
  $(".square").removeClass("green-square");
});

$("#replay").on("click", function() {
  returnToInitial();
  startGame();
});

$("#how-to").on("click", function() {
  //Game instructions/help
});

$("#help-icon").on("click", function() {
  //Game instructions/help
});



module.exports = { game, initialAnimation, startGame, textAreaRevision, gridDisplayUpdate, nextStage }; //variables/functions to go here to export to test file, separated by commas
