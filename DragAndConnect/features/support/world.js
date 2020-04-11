// features/support/world.js
const { setWorldConstructor } = require("cucumber");
const { Builder, By, Key, until } = require("selenium-webdriver");
const chromedriver = require("chromedriver");

class CustomWorld {
  constructor() {
    this.driverPromise = this.init();
  }

  async init() {
    const driver = await new Builder().forBrowser("chrome").build();
    await driver.get("file:///" + __dirname + "/../../slide12/index.html");

    return driver;
  }

  async connectActivities(correctness) {
    const driver = await this.driverPromise;
    if (correctness) {
    } else {
    }
  }

  async getResultPhrase() {
    const driver = await this.driverPromise;
    const elem = await driver.findElement(By.id("result"));
    return elem.getText();
  }
}

setWorldConstructor(CustomWorld);
