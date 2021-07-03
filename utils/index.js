var OCRAD = require("../utils/ocrad");

const xColumn1 = 75;
const yRow1 = 669;
const xColumn2 = 184;
const yRow2 = 558;
const xColumn3 = 301;
const yRow3 = 447;
const xColumn4 = 413;
const yRow4 = 333;
const xColumn5 = 518;
const yRow5 = 222;
const ButtonsCoordinates = {
  0: {
    x: xColumn1,
    y: yRow1,
  },
  1: {
    x: xColumn1,
    y: yRow2,
  },
  4: {
    x: xColumn1,
    y: yRow3,
  },
  7: {
    x: xColumn1,
    y: yRow4,
  },
  8: {
    x: xColumn2,
    y: yRow4,
  },
  5: {
    x: xColumn2,
    y: yRow3,
  },
  2: {
    x: xColumn2,
    y: yRow2,
  },
  ".": {
    x: xColumn2,
    y: yRow1,
  },
  3: {
    x: xColumn3,
    y: yRow2,
  },
  6: {
    x: xColumn3,
    y: yRow3,
  },
  9: {
    x: xColumn3,
    y: yRow4,
  },
  "+/-": {
    x: xColumn3,
    y: yRow1,
  },
  "/": {
    x: xColumn4,
    y: yRow4,
  },
  "*": {
    x: xColumn4,
    y: yRow3,
  },
  "-": {
    x: xColumn4,
    y: yRow2,
  },
  "+": {
    x: xColumn4,
    y: yRow1,
  },
  "=": {
    x: xColumn5,
    y: yRow1,
  },
  "%": {
    x: xColumn5,
    y: yRow3,
  },
  c: {
    x: xColumn5,
    y: yRow5,
  },
};

const utils = {
  getResultCalculator: function () {
    return new Promise(function (resolve, reject) {
      driver.switchTo().frame("fullframe");
      webElement = driver.findElement(By.id("canvas"));
      var base64Data = "";
      var location = {};
      var bulk = [];
      driver
        .then((_) => {
          webElement.getLocation().then((e) => {
            location.x = e.x;
            location.y = e.y;
          });
          webElement.getSize().then((e) => {
            location.height = e.height;
            location.width = e.width;
          });
          driver
            .manage()
            .window()
            .getSize()
            .then((e) => {
              location.browserHeight = e.height;
              location.broserWidth = e.width;
            });
        })
        .then((_) => {
          webElement.takeScreenshot().then((data) => {
            base64Data = data.replace(/^data:image\/png;base64,/, "");
          });
        })
        .then((_) => {
          driver.executeScript(
            () => {
              var image = new Image();
              var location = arguments[0];
              const base64Data = "data:image/png;base64," + arguments[1];
              image.src = base64Data;
              image.onload = function () {
                const imageCropHeight = location.height - 580;
                const imageCropWidth = location.width - 50;
                var canvas = document.createElement("canvas");
                canvas.height = imageCropHeight;
                canvas.width = imageCropWidth;
                canvas.style.height = imageCropHeight + "px";
                canvas.style.width = imageCropWidth + "px";
                var ctx = canvas.getContext("2d");
                ctx.drawImage(image, -15, -28);
                window.resultCalculatorCanvas = ctx.getImageData(
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );
                window.canvasData = base64Data;
                window.temp = [];
              };
            },
            location,
            base64Data
          );
        })
        .then((_) => {
          driver
            .executeScript(() => {
              var resultCalculatorCanvas = window.resultCalculatorCanvas;
              var screenCapture = window.canvasData;
              window.resultCalculatorCanvas = "";
              window.canvasData = "";
              return { resultCalculatorCanvas, screenCapture };
            })
            .then((data) => {
              const { resultCalculatorCanvas, screenCapture } = data;
              resolve({
                calculatorResultRaw: OCRAD(resultCalculatorCanvas),
                screenCapture,
              });
            });
        });
    });
  },
  createImageFile: function (fileName, imageBase64Data) {
    const fs = require("fs");
    const imageData = imageBase64Data.replace(/^data:image\/png;base64,/, "");
    const imagePath = "./reports/" + fileName + ".tiff";
    fs.writeFileSync(imagePath, imageData, "base64");
  },
  handleInput: function (contentRaw, handleClickButtonByCoordinates) {
    const contentNumber = +contentRaw;
    const isNegativeNumber = !isNaN(contentNumber) && contentNumber < 0;
    let content = isNegativeNumber
      ? contentRaw.substr(1, contentRaw.length)
      : contentRaw;
    content.split("").map((key) => {
      handleClickButtonByCoordinates(ButtonsCoordinates[key]);
    });
    if (isNegativeNumber) {
      handleClickButtonByCoordinates(ButtonsCoordinates["+/-"]);
    }
  },
};

module.exports = {
  ...utils,
};
