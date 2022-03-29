/**
 * @jest-environment jsdom
 */

global.window = window;
global.$ = require("jquery");

const { hostname } = require("os");
const { game, initialAnimation, startGame, textAreaRevision, gridDisplayUpdate, nextStage } = require("../script");

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

describe("Clicking 'Play Game' stops the initial animation", () => {
  test("random squares are no longer being highlighted in red", () => {
    document.getElementById("start").click();
    let allSquares = document.getElementsByClassName("square");
    let squaresClassList = [];
    Array.from(allSquares).forEach(function (key) {
      squaresClassList.push(key.classList);
    });
    expect(JSON.stringify(squaresClassList)).not.toContain("red-square");
  });
});