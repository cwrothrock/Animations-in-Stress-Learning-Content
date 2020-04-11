// features/support/world.js
const { setWorldConstructor } = require("cucumber");
const { Builder, By, Key, until } = require("selenium-webdriver");
const chromedriver = require("chromedriver");

class browserBuild {
  constructor() {}

  async init(slideNum) {
    const driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();
    await driver.get(`file:///${__dirname}/../../slide${slideNum}/index.html`);

    this.driver = driver;
    this.config = require(`../fixtures/slide${slideNum}`);
  }

  async connectActivities(correctness) {
    const driver = this.driver;
    const canvas = await driver.findElement(By.id("canvas"));
    const canvasRect = await canvas.getRect();
    const actions = driver.actions();

    for (let box of this.config.boxesLeft) {
      if (!correctness) {
        box.answer = (box.answer + 1) % this.config.boxesLeft.length;
      }

      const answerBox = this.config.boxesRight[box.answer];
      actions
        .move({
          duration: 1,
          origin: canvas,
          x: -canvasRect.width / 2 + box.x,
          y: -canvasRect.height / 2 + box.y,
        })
        .press()
        .move({
          duration: 1,
          origin: canvas,
          x: -canvasRect.width / 2 + answerBox.x,
          y: -canvasRect.height / 2 + answerBox.y,
        })
        .release();
    }

    return actions.perform();
  }

  async getResultPhrase() {
    const driver = this.driver;
    const elem = await driver.findElement(By.id("result"));
    return elem.getText();
  }
}

setWorldConstructor(browserBuild);
