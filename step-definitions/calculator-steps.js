const expect = require("chai").expect;

var webdriver = require("selenium-webdriver");
var By = webdriver.By;
var utils = require("../utils/index");

module.exports = function () {
  this.Given(/^Open chrome browser and start application$/, function () {
    return driver.get(
      "https://www.online-calculator.com/full-screen-calculator/"
    );
  });
  this.When(
    /^I enter following values and press = button$/,
    function (dataTable) {
      const testCase = dataTable.raw();
      const strValue1 = testCase[0][1];
      const strValue2 = testCase[1][1];
      const strOperator = testCase[2][1];
      driver.findElement(By.id("fullframe")).then((result) => {
        driver.switchTo().frame(result);
        const canvasElement = driver.findElement(By.id("canvas"));
        const clickButton = (coordinates) =>
          driver
            .actions()
            .mouseMove(canvasElement, coordinates)
            .click()
            .perform();
        utils.handleInput(strValue1, clickButton);
        utils.handleInput(strOperator, clickButton);
        utils.handleInput(strValue2, clickButton);
        utils.handleInput("=", clickButton);
      });
      driver.switchTo().defaultContent();
    }
  );
  this.Then(/^I should be able to see$/, function (table) {
    return utils
      .getResultCalculator()
      .then(({ calculatorResultRaw, screenCapture }) => {
        const isErrorValue = "Error" === calculatorResultRaw.trim();
        const calculatorResult = isErrorValue
          ? calculatorResultRaw.trim()
          : calculatorResultRaw
              .replace(/o/g, "0")
              .replace(/[^(0-9+oO.\-e)]/g, "");
        const expectValue = table.raw()[0][1];
        const isScenarioFail = calculatorResult != expectValue;
        if (isScenarioFail) {
          const captureImageName = new Date().getTime();
          utils.createImageFile(captureImageName, screenCapture);
        }
        expect(expectValue).to.equal(calculatorResult);
      });
  });
};
