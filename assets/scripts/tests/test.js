/**
 * @jest-environment jsdom
 */

 const { hostname } = require("os");
 const { game } = require("../script"); //imports the things from the JS file
 
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