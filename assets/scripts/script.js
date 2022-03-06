$(document).ready(function(){  
  initialElementHiding();
  checkWindowHeight();
  initialAnimation();
  $(".clickable").attr("tabindex", "0");
});

/* TO DO:
    - STYLING OF ELEMENTS (START WITH INPUT AND BUTTON)
    - RESPONSIVE STYLING
    - INSERT DESCRIPTIONS FOR ALL FUNCTIONS IN JS FILE
*/

// Sounds section begins here
const sndThemeSong = new Audio("assets/audio/theme.mp3");
const sndStageReady = new Audio("assets/audio/stage-ready.mp3");
const sndStageCountdown = new Audio("assets/audio/stage-countdown.mp3");
const sndTimerActive = new Audio("assets/audio/timer-active.mp3");
const sndPlayerAnswer = new Audio("assets/audio/enter-answer.mp3");
const sndWrongAnswer = new Audio("assets/audio/incorrect-answer.mp3");
const sndRightAnswer = new Audio("assets/audio/correct-answer.mp3");
const sndGameCompleted = new Audio("assets/audio/game-completed.mp3");
// Sounds section ends here

// Game object starts here
var game = {
  status: "incomplete",
  display: "",
  stage: 0,
  timer: {sec: 5, mSec: "000"},
  clock: 3,
  redSquares: 0,
  greenSquares: 0,
  currentSounds: []
};
// Game object ends here

// Constant variables, used in multiple functions, begin here
const textArea = $("#bottom-text-container");
const gridArea = $("#squares-container");
const singleSquareHTML = `<div class="square"></div>`;
// Constant variables, used in multiple functions, end here

// Functions begin here
function checkWindowHeight() {
  if ($(window).width() < 769 && $(window).height() <= 500 && $(window).width() > $(window).height()) {
    $("#game-area-container").hide();
    $("#bottom-text-container").hide();
    $("#game-rotate-container").show();
    game.display = "hidden";

  } else {
    $("#game-area-container").show();
    $("#bottom-text-container").show();
    $("#game-rotate-container").hide();
    game.display = "active";
  }
};

/**
 * Removes the class "hidden" from selected elements and hides those elements.
 * The purpose of this is for JavaScript to take over the element hiding from CSS.
 * See the Bugs section of the README file for an explanation on why this method has been used.
 */
function initialElementHiding() {
  $("#help-icon").hide().removeClass("hidden");
  $("#instructions-container").hide().removeClass("hidden");
  $("#game-rotate-container").hide().removeClass("hidden");
  $("#timer").hide().removeClass("hidden");
  $("#restart").hide().removeClass("hidden");
  $("#exit").hide().removeClass("hidden");
  $("#continue").hide().removeClass("hidden");
  $("#stage-number").hide().removeClass("hidden");
  $("#replay").hide().removeClass("hidden");
};

/**
 * Shuffles an array which is passed as the argument, then returns the shuffled array 
 */
// Array shuffling function method taken from https://www.geeksforgeeks.org/how-to-shuffle-an-array-using-javascript/
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
  game.currentSounds = [sndThemeSong];
  let animation = setInterval(function () {
    console.log("initial animation iteration run");
    let squaresArray = $(".square");
    shuffleArray(squaresArray);
    for(let i = 0; i < 4; i++) {
      $(squaresArray[i]).addClass("red-square");
    }
    if (game.stage !== 0) {
      $(squaresArray).removeClass("red-square");
      clearInterval(animation);
    }
    setTimeout(() =>{
      $(squaresArray).removeClass("red-square");
    }, 400);
  }, 800);
};

function soundSwitch(newSound) {
  let fromSound = game.currentSounds[0];
  fromSound.pause();
  fromSound.currentTime = 0;
  game.currentSounds = [newSound];
  soundHandler();
}

/**
 * Runs when the player clicks "Play Game", which begins Stage 1 of the game and calls another function
 * to revise the text below the grid
 */
function startGame() {
  console.log("startGame() running - player clicked 'Play Game'");
  soundSwitch(sndStageReady);
  game.stage = 1;
  textAreaRevision();
  gridDisplayUpdate();
  stageBegin();
  $("#help-icon").show();
};

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
  $("#timer").html(timerText(game.timer.sec, game.timer.mSec));
  gridArea.children().addClass("gray-square");
  $(gridArea).append(`
    <div id="player-start-input">
      <p>Count the RED squares</p>
      <button id="go" class="clickable">GO!</button>
    </div>`);
  soundSwitch(sndStageReady);
  $("#go").focus().on("click", function () {
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
  $("#go").remove();
  $("#player-start-input > p").empty();
  $("#player-start-input > p").attr("id", "center-nums").html(`${game.clock}`);
  let count = setInterval(function () {
    if (game.display === "active") { //Ensures the timer only reduces when the game area is visible
      game.clock -= 1;
      $("#center-nums").empty();
      $("#center-nums").html(`${game.clock}`);
      console.log("time logged");
      if (game.clock < 1) {
        clearInterval(count);
        stageInPlay();
      };
    }
  }, 1000);
  soundSwitch(sndStageCountdown);
};

/**
 * Resets the game's redSquares and greenSquares values to 0,
 * removes the grid overlay and the gray colors of the squares,
 * then calls the stageSetup function
 */
function stageInPlay() {
  game.redSquares = 0;
  game.greenSquares = 0;
  console.log("Game in play");
  $("#player-start-input").remove();
  gridArea.children().removeClass("gray-square");
  console.log("stageInPlay finished");
  stageSetup();
};

/**
 * Calculates the number of red and/or green squares for the current stage.
 * Assigns random values to the game keys redSquares and, when applicable, greenSquares
 */
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

  /**
    * Calculates the number of red squares for the current stage.
    * Assigns a random value to the redSquares game key.
    */
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

  /**
    * Calculates the number of green squares for the current stage.
    * Assigns a random value to the greenSquares game key.
    */
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
  console.log("stageSetup finished");
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
 * Runs when the player has successfully passed the final stage.
 * Applies DOM changes to signify that the game has been completed.
 */
function gameCompleted() {
  game.status = "completed";
  $("#player-start-input").empty().html("CONGRATULATIONS!<br>You beat the game!");
  $("#timer").hide();
  $("#exit").show();
  $("#stage-number").hide();
  $("#replay").show();
  finalAnimation();
};

/**
 * Displays an animation if the player completes the final stage
 */
function finalAnimation() {
  soundSwitch(sndGameCompleted);
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
Returns the layout and values of the game timer when the correct arguments are provided 
*/
function timerText(sec, mSec) { 
  return `
    <div>
      &nbsp;Time Remaining:&nbsp;
    </div>
    <div>
    ${sec}.${mSec}&nbsp;
    </div>
  `
};

/**
 * Begins the countdown of the in-play time limit.
 */
function stageTimer() {
  soundSwitch(sndTimerActive);
  let decrease = setInterval(function () {
    if (game.display === "active") { //Ensures the timer only reduces when the game area is visible
      if (parseInt(game.timer.mSec) > 0) {
        game.timer.mSec -= 5;
        $("#timer").html(timerText(game.timer.sec, parseInt(game.timer.mSec).toString().padStart(3, "0")));
      } else {
        game.timer.mSec = 995;
        game.timer.sec -= 1;
        $("#timer").html(timerText(game.timer.sec, parseInt(game.timer.mSec).toString().padStart(3, "0")));
      };
      if (game.timer.sec == 0 && parseInt(game.timer.mSec) == 0) {
        clearInterval(decrease);
        $("#timer").html(`&nbsp;Time's Up!&nbsp;`);
        stageEnd();
      };
    }
  }, 5);
};

/**
 * Displays an area for the player to input their answer for each stage.
 */
function stageEnd() {
  console.log("stage ended");
  soundSwitch(sndPlayerAnswer);
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
};

function playerCorrect() {
  soundSwitch(sndRightAnswer);
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
  soundSwitch(sndWrongAnswer);
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
  soundSwitch(sndThemeSong);
  game = {
    status: "incomplete",
    display: "",
    stage: 0,
    timer: {
      sec: 5,
      mSec: "000"
    },
    clock: 3,
    redSquares: 0,
    greenSquares: 0,
    currentSounds: [sndThemeSong]
  };  
  checkWindowHeight();
  gridArea.empty();
  for (let i = 0; i < 16; i++) {
    gridArea.append(singleSquareHTML);
  };
  gridArea.children().addClass("square-grid-4x4");
  initialAnimation();
  textAreaRevision();
};

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

function soundHandler() {
  if ($("#mute-toggle").is(":checked")) {
    $("#mute-toggle-label").html("<i class='fas fa-volume-mute clickable'></i>")
    $(".clickable").attr("tabindex", "0");
    for (let i = 0; i < game.currentSounds.length; i++) {
      game.currentSounds[i].pause();
    }
  } else {
    $("#mute-toggle-label").html("<i class='fas fa-volume-up clickable'></i>");
    $(".clickable").attr("tabindex", "0");
    for (let i = 0; i < game.currentSounds.length; i++) {
      game.currentSounds[i].play();
    }
  };
};
// Functions end here

// Event handlers begin here
/** Enables sndStageReady to be looped (i.e. replayed once the sound ends) */
$(sndStageReady).on("ended", function () {
  this.currentTime = 0;
  soundHandler();
})

/** Enables sndThemeSong to be looped (i.e. replayed once the sound ends) */
$(sndThemeSong).on("ended", function () {
  this.currentTime = 0;
  soundHandler();
})

/**
 * Provides visual feedback to the user that the page title is not clickable
 * when the in-stage timer is counting down
 */
$("#page-title").on("mouseenter", (function () {
  if (game.timer.sec < 5) {
    $(this).removeClass("clickable").addClass("unclickable");
  } else {
    $(this).removeClass("unclickable").addClass("clickable");
  };
}));

/**
 * Allows the user to confirm if they want to reset the game when they click
 * on the page title (which takes them back to the inital page).
 * This prevents accidental loss of game progress.
 */
$("#page-title").on("click", function () {
  if (game.stage != 0 && game.timer.sec == 5) {
    if (confirm("Are you sure you want to exit the game? You will lose all your progress.") == true) {
      returnToInitial();
    };
  };
});

/** Starts the game when the user clicks "Play Game" */
$("#start").on("click", function() {
  startGame();
});

/** Returns to the initial page when the user clicks "Restart" */
$("#restart").on("click", function() {
  returnToInitial();
  startGame();
});

/** Returns to the initial page when the user clicks "Exit" */
$("#exit").on("click", function() {
  returnToInitial();
});

/** Progresses to the next stage when the user clicks "Click Here to Continue" */
$("#continue").on("click", function() {
  nextStage();
  $(".square").removeClass("green-square");
});

/** Returns to the initial page and automatically starts a new game when the user clicks "Play Again" */
$("#replay").on("click", function() {
  returnToInitial();
  startGame();
});

/** Hides some elements of the DOM and displays the game instructions when the user clicks "How to Play" */
$("#how-to").on("click", function() {
  $("#squares-container").hide();
  $("#bottom-text-container").hide();
  $("#help-exit").hide();
  $("#instructions-container").fadeTo(400, 1, function() {
    $(this).show();
  });
});

/** Hides some elements of the DOM and displays the game instructions when the user clicks the "?" icon */
$("#help-icon").on("click", function() {
  $("#squares-container").hide();
  $("#bottom-text-container").hide();
  $("#help-exit").show();
  $("#instructions-container").fadeTo(400, 1, function() {
    $(this).show();
  });
});

/** Hides the game instructions and restores the game elements of the DOM when the user clicks "Return to Game" */
$("#help-close").on("click", function() {
  $("#instructions-container").hide();
  $("#squares-container").fadeTo(400, 1, function() {
    $(this).show();
  });
  $("#bottom-text-container").fadeTo(400, 1, function() {
    $(this).show();
  });
});

/** Hides the game instructions and returns to the initial page display when the user clicks "Return to Game" */
$("#help-exit").on("click", function () {
  if (game.stage != 0) {
    if (confirm("Are you sure you want to exit the game? You will lose all your progress.") == true) {
      $("#instructions-container").hide();
      $("#squares-container").fadeTo(400, 1, function () {
        $(this).show();
      });
      $("#bottom-text-container").fadeTo(400, 1, function () {
        $(this).show();
      });
      returnToInitial();
    };
  } else {
    $("#instructions-container").hide();
    $("#squares-container").fadeTo(400, 1, function () {
      $(this).show();
    });
    $("#bottom-text-container").fadeTo(400, 1, function () {
      $(this).show();
    });
  };
});

/** Simulates a mouse click when the user clicks the "enter" or "space" keyboard keys*/
$(document).on("keyup", function (event) {
  if ($(":focus").attr("id") !== "go") {
    if (event.which === 13 || event.which === 32) {
      $(":focus").click();
    };
  };
});

/** Calls the soundHandler function when the user clicks the "mute-toggle" checkbox */
$("#mute-toggle").on("click", function () {
  soundHandler();
});

/** Simulates a mouse click of the "mute-toggle" checkbox when the user clicks the "mute-toggle-label" icon */
$("#mute-toggle-label").on("click", function () {
  $("#mute-toggle").click();
});

/** Calls the checkWindowHeight function when the window is resized */
$(window).on("resize", function() {
    checkWindowHeight();
});
//Event handlers end here

module.exports = { game, initialAnimation, startGame, textAreaRevision, gridDisplayUpdate, nextStage };
