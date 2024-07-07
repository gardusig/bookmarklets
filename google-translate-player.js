javascript: (function () {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function clickPlayStopButton(playButtonSelector) {
    const playButton = document.querySelector(playButtonSelector);
    if (playButton) {
      playButton.click();
      console.warn("Clicked play button");
    } else {
      console.error("Play button not found");
    }
  }

  function isPlayerPlaying(playButtonSelector) {
    const playButton = document.querySelector(playButtonSelector);
    if (!playButton) {
      console.error("Play button not found");
      return false;
    }
    const playButtonState = playButton.getAttribute(playButtonStateAttr);
    console.log(`Play button state: ${playButtonState}`);
    return playButtonState === stopListeningValue;
  }

  function shouldMoveToNextPage() {
    const charCountElement = document.querySelector(charCountSelector);
    if (!charCountElement) {
      console.error("Character count element not found");
      return false;
    }
    const charCountText = charCountElement.textContent.trim();
    console.log(`Character count text: ${charCountText}`);
    return charCountText === "5,000 / 5,000";
  }

  async function moveToNextPage() {
    console.log("Moving to next page...");
    document.querySelector(nextButtonSelector).click();
    console.warn("Moved to next page");
  }

  async function waitForPlayerToStop(playButtonSelector) {
    let totalWaitTime = 0;
    let sleepTime = 3000;
    let attempts = 0;
    while (isPlayerPlaying(playButtonSelector) && !stopFlag) {
      attempts++;
      console.log(
        `[attempt #${attempts}] Total wait time: ${totalWaitTime}. Sleeping for ${
          sleepTime / 1000
        } seconds...`
      );
      totalWaitTime += sleepTime;
      await sleep(sleepTime);
      if (totalWaitTime > 5 * 60 * 1000) {
        sleepTime = 500;
      }
    }
  }

  function createButton(text, top, right) {
    const button = document.createElement("button");
    button.innerText = text;
    button.style.position = "fixed";
    button.style.top = top;
    button.style.right = right;
    button.style.zIndex = "1000";
    document.body.appendChild(button);
    return button;
  }

  function waitForPlayButtonSelection() {
    return new Promise((resolve) => {
      playOriginalButton.addEventListener("click", () => {
        console.warn("Play Original button clicked");
        resolve(playButtonOriginalSelector);
      });
      playTranslatedButton.addEventListener("click", () => {
        console.warn("Play Translated button clicked");
        resolve(playButtonTranslatedSelector);
      });
    });
  }

  const nextButtonSelector =
    "#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.ef1twd > div > div.vG0hre > button:nth-child(2)";
  const playButtonOriginalSelector =
    "#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.dHeVVb.UnxENd > div.FFpbKc > div > div.r375lc > div > div.m0Qfkd > span > button";
  const playButtonTranslatedSelector =
    "#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.sciAJc > div > div.usGWQd > div > div.VO9ucd > div.aJIq1d > div.m0Qfkd > span > button";
  const playButtonStateAttr = "aria-label";
  const stopListeningValue = "Stop listening";
  const charCountSelector =
    "#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.dHeVVb.UnxENd.rBs9Gd > div.FFpbKc > div > span";

  let stopFlag = false;
  let playButtonSelector = playButtonOriginalSelector;

  const stopButton = createButton("Stop Script", "10px", "10px");
  const playOriginalButton = createButton("Play Original", "50px", "10px");
  const playTranslatedButton = createButton("Play Translated", "90px", "10px");

  stopButton.addEventListener("click", async () => {
    stopFlag = true;
    console.warn("Stop button clicked");
    await clickPlayStopButton(playButtonSelector);
  });

  (async function () {
    const selectedPlayButtonSelector = await waitForPlayButtonSelection();
    playButtonSelector = selectedPlayButtonSelector;
    await waitForPlayerToStop(playButtonSelector);
    while (true) {
      await clickPlayStopButton(playButtonSelector);
      await sleep(3000);
      await waitForPlayerToStop(playButtonSelector);
      if (stopFlag) {
        console.warn("Script stopped by user");
        break;
      }
      if (!shouldMoveToNextPage()) {
        break;
      }
      await moveToNextPage();
      await sleep(3000);
    }
    console.warn("Finished playing");
    stopButton.remove();
    playOriginalButton.remove();
    playTranslatedButton.remove();
  })();
})();
