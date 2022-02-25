/**
 * @jest-environment jsdom
 */

global.window = window
global.$ = require("jquery");

const { hostname } = require("os");
const { game, initialAnimation, startGame, textAreaRevision, gridDisplayUpdate, nextStage } = require("../script"); //imports the things from the JS file

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe("JS files linking correctly", () => {
  test("game contains stage key", () => {
    expect("stage" in game).toBe(true);
  });
});

describe("Clicking 'Play Game' stops the initial animation and alters the text below the game area", () => {
  test("random squares are no longer being highlighted in red", () => {
    document.getElementById("start").click();
    let allSquares = document.getElementsByClassName("square");
    let squaresClassList = [];
    Array.from(allSquares).forEach(function (key) {
      squaresClassList.push(key.classList);
    })
    expect(JSON.stringify(squaresClassList)).not.toContain("red-square");
  });

  test("the text below the game area has been changed once 'Play Game' is clicked", () => {
    document.getElementById("start").addEventListener("click", function () {
      let lowerParas = document.getElementById("bottom-text-container").children;
      expect(lowerParas[0].innerHTML).not.toContain("Play Game");
      expect(lowerParas[0].innerHTML).toContain("Time Remaining");
      expect(lowerParas[1].innerHTML).not.toContain("How to Play");
      expect(lowerParas[1].innerHTML).toContain("Stage");
    });
  });

  


  
})