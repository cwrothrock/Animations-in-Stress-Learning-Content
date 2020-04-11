// features/support/steps.js
const { Given, When, Then, After } = require("cucumber");
const { expect } = require("chai");

const { sleep } = require("./util");

After(async function () {
  return this.driver.quit();
});

Given("I am on slide {int}", async function (slideNum) {
  await this.init(slideNum);
});

When("I connect all activities to answers {string}", async function (
  correctness
) {
  await this.connectActivities(correctness === "correctly");
});

Then("I should see {string}", async function (phrase) {
  const resultText = await this.getResultPhrase();
  expect(resultText).to.eql(phrase);
});

Then("I should not see the notification after {int} seconds", async function (
  time
) {
  await sleep(time * 2000 + 10);
  const resultText = await this.getResultPhrase();
  expect(resultText).to.eql("");
});
