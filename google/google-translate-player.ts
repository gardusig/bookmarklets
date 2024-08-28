import { clickButton, isElementPresent } from "../util/page-interaction";
import { createButton } from "../util/ui";

type Buttons = {
  playOriginalButton: HTMLButtonElement;
  playTranslatedButton: HTMLButtonElement;
  stopButton: HTMLButtonElement;
};

const playButtonOriginalSelector: string = `button[aria-label="Listen to source text"]`;
const playButtonTranslatedSelector: string = `button[aria-label="Listen to translation"]`;
const stopListeningButtonSelector: string = `button[aria-label="Stop listening"]`;
const nextPageButtonSelector: string = `button[aria-label="Next"]`;
const nextPageSpanSelector: string = `span[aria-label="5,000 of 5,000 characters used"]`;

let stopFlag: boolean = false;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPlayerToFinishPlaying(
  maxWaitTime = 10 * 60 * 1000, // 10 minutes
  shortSleepThreshold = 5 * 60 * 1000, // 5 minutes
  initialSleepTime = 3 * 1000, // 3 seconds
  shortSleepTime = 500 // 500 ms
): Promise<void> {
  let sleepTime = initialSleepTime;
  for (
    let totalWaitTime = 0;
    isElementPresent(stopListeningButtonSelector) &&
    !stopFlag &&
    totalWaitTime < maxWaitTime;
    totalWaitTime += sleepTime
  ) {
    console.log(`Listening for: ${totalWaitTime / 1000} seconds`);
    if (totalWaitTime > shortSleepThreshold) {
      sleepTime = shortSleepTime;
    }
    await sleep(sleepTime);
  }
}

function resetButtonColors(buttons: Buttons) {
  buttons.playOriginalButton.style.backgroundColor = "";
  buttons.playTranslatedButton.style.backgroundColor = "";
  buttons.stopButton.style.backgroundColor = "";
}

function createButtons(): Buttons {
  return {
    playOriginalButton: createButton("Play Original", "50px", "10px"),
    playTranslatedButton: createButton("Play Translated", "90px", "10px"),
    stopButton: createButton("Stop Script", "10px", "10px"),
  };
}

function listenToLanguageUserSelection(buttons: Buttons): Promise<string> {
  buttons.stopButton.addEventListener("click", async () => {
    resetButtonColors(buttons);
    buttons.stopButton.style.backgroundColor = "red";
    stopFlag = true;
    console.warn("Script stopped by user");
  });
  return new Promise((resolve) => {
    buttons.playOriginalButton.addEventListener("click", () => {
      resetButtonColors(buttons);
      buttons.playOriginalButton.style.backgroundColor = "green";
      console.warn("Play Original button clicked");
      resolve(playButtonOriginalSelector);
    });
    buttons.playTranslatedButton.addEventListener("click", () => {
      resetButtonColors(buttons);
      buttons.playTranslatedButton.style.backgroundColor = "green";
      console.warn("Play Translated button clicked");
      resolve(playButtonTranslatedSelector);
    });
  });
}

function removeButtons(buttons: Buttons) {
  buttons.stopButton.remove();
  buttons.playOriginalButton.remove();
  buttons.playTranslatedButton.remove();
}

async function main() {
  const buttons = createButtons();
  const playButtonSelector = await listenToLanguageUserSelection(buttons);
  while (!stopFlag) {
    if ((await clickButton(playButtonSelector)) === false) {
      break;
    }
    await waitForPlayerToFinishPlaying();
    if (isElementPresent(nextPageSpanSelector) === false) {
      break;
    }
    if ((await clickButton(nextPageButtonSelector)) === false) {
      break;
    }
  }
  await clickButton(stopListeningButtonSelector);
  removeButtons(buttons);
}

javascript: (function () {
  (async function () {
    await main();
  })();
})();
