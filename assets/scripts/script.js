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
  stageBegin() - shows a countdown before the stage starts, then calls stageInPlay
  stageInPlay() - squares are highlighted and timer countdown begins
  stageEnd() - called when the timer reaches 0. Squares are re-hidden and the player
                is asked to enter their answer.
  checkAnswer() - compares the player's input to the correct answer
  resetPage() - resets the webpage to its initial state
*/

let game = {
  stage: 0
}

var textArea = $("#bottom-text-container");

/**
 * Iterates through the existing squares on the page and highlights random
 * ones in red until the game starts.
 */
function initialAnimation() {

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      // Generate random number
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
    $("#start").click(function(event) {
      clearInterval(animation);
    });
  }, 800);
};

function startGame() {
  game.stage++;
  if (game.stage > 2) {
    //add squares
  } else if (game.stage > 4) {
    //add squares
  } else if (game.stage > 7) {
    //add squares
  }
  textArea.empty();
}

$("#start").click(function() {
  startGame();
});

$("#how-to").click(function() {
  
});



module.exports = { game, initialAnimation }; //variables/functions to go here to export to test file, separated by commas