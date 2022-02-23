/**
 * @jest-environment jsdom
 */

global.window = window
global.$ = require('jquery');

const { hostname } = require("os");
const { game, initialAnimation } = require("../script"); //imports the things from the JS file

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe("JS files linking correctly", () => {
  test("test", () => {
    expect("stage" in game).toBe(true);
  });
});

describe("Animation loading correctly on page load", () => {
  test("test", () => {
    document.addEventListener('DOMContentLoaded', function () {
      var allSquares = document.getElementsByClassName("square");
      let squaresClassList = [];
      Array.from(allSquares).forEach(function (key) {
        squaresClassList.push(key.classList);
      })
      expect(JSON.stringify(squaresClassList)).toContain("red-square");
    });
  });
});