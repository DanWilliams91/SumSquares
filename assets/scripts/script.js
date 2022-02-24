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
  stage: 0
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
    let squaresArray = $(".square");
    shuffleArray(squaresArray);
    $(squaresArray[0]).addClass("red-square");
    $(squaresArray[7]).addClass("red-square");
    $(squaresArray[15]).addClass("red-square");
    setTimeout(() => {
      $(squaresArray[0]).removeClass("red-square");
      $(squaresArray[7]).removeClass("red-square");
      $(squaresArray[15]).removeClass("red-square");
    }, 800);
    $("#start").on("click", function() {
      console.log("red squares cleared");
      $(squaresArray[0]).removeClass("red-square");
      $(squaresArray[7]).removeClass("red-square");
      $(squaresArray[15]).removeClass("red-square");
      clearInterval(animation);
    });
  }, 800);
};

function startGame() {
  console.log("startGame() running - player clicked 'Play Game'");
  game.stage = 1;
  textAreaRevision();
  gridDisplayUpdate();
}


/**
 * Changes the IDs of the paragraphs in the textArea and changes their inner HTML
 * to the text viewed when the game is in play.
 * INCOMPLETE
 */
function textAreaRevision() {
  console.log("textAreaRevision() - text below grid revised");
  if (game.stage == 1) {
    $("#start").attr("id", "timer");
    $("#timer").html(`Time Remaining: 5.00`) // TIMER AMOUNT NEEDS TO BE INSERTED HERE
    $("#how-to").attr("id", "stage-number");
    $("#stage-number").html(`Stage ${game.stage}`)
  }
}

/**
 * Checks the current game stage and adds squares to the grid according to the stage
 * INCOMPLETE - NEED TO CHECK CORRECT AMOUNT ADDED
 * MAY ALSO NEED CHANGING TO INCLUDE AN OPTION FOR A NEW GAME TO START:
 *  GRID WILL NEED TO RETURN TO NORMAL
 */
function gridDisplayUpdate() {
  console.log("gridDisplayUpdate() - stage checked and squares added if needed");
  game.stage = 3; //REMOVE AFTER TESTING
  switch(game.stage) { //INSERTED BY GERRY - USE THIS INSTEAD OF IF STATEMENTS WHEN THERE'S MORE THAN 3
    case 3:
      console.log('Switch Statement');
      break;
    default:
      console.log('default');
  }
  
  if (game.stage > 2 && game.stage <= 4) {
    for (let i = 0; i < 20; i++) {
      console.log(i);
      gridArea.append(singleSquareHTML);
    };    
    gridArea.children().removeClass("square-grid-4x4").addClass("square-grid-6x6");
  } else if (game.stage > 4 && game.stage <= 7) {
    for (let i = 0; i < 28; i++) {
      gridArea.append(singleSquareHTML);
    };    
    gridArea.children().removeClass("square-grid-6x6").addClass("square-grid-8x8")
  } else if (game.stage > 7 && game.stage <= 9) {
    for (let i = 0; i < 36; i++) {
      gridArea.append(singleSquareHTML);
    };    
    gridArea.children().removeClass("square-grid-8x8").addClass("square-grid-10x10");
  } else if (game.stage > 9) {
    for (let i = 0; i < 44; i++) {
      gridArea.append(singleSquareHTML);
    };
    gridArea.children().removeClass("square-grid-10x10").addClass("square-grid-12x12");
  }
}





$("#start").on("click", function() {
  startGame();
});

$("#how-to").on("click", function() {
  
});



module.exports = { game, initialAnimation, startGame, textAreaRevision, gridDisplayUpdate }; //variables/functions to go here to export to test file, separated by commas
