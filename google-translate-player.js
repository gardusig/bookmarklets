javascript: (function () {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function startPlayer() {
    console.log("Starting the player...");
    document.querySelector(playButtonSelector).click();
    console.warn("Clicked play button");
  }

  function isPlayerPlaying() {
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
    console.warn("Moved to page");
  }

  async function waitForPlayerToStop() {
    let totalWaitTime = 0;
    let sleepTime = 3000;
    let attempts = 0;
    while (isPlayerPlaying() && !stopFlag) {
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

  function createStopButton() {
    const button = document.createElement("button");
    button.innerText = "Stop Script";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = "1000";
    document.body.appendChild(button);
    return button;
  }

  const nextButtonSelector =
    "#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.ef1twd > div > div.vG0hre > button:nth-child(2)";
  const playButtonSelector =
    "#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.dHeVVb.UnxENd > div.FFpbKc > div > div.r375lc > div > div.m0Qfkd > span > button";
  const playButtonStateAttr = "aria-label";
  const stopListeningValue = "Stop listening";
  const charCountSelector =
    "#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.dHeVVb.UnxENd.rBs9Gd > div.FFpbKc > div > span";

  let stopFlag = false;

  const stopButton = createStopButton();
  stopButton.addEventListener("click", () => {
    stopFlag = true;
    console.warn("Stop button clicked");
  });

  (async function () {
    await waitForPlayerToStop();
    while (true) {
      await startPlayer();
      await sleep(3000);
      await waitForPlayerToStop();
      if (stopFlag) {
        console.warn("Script stopped by user");
        await startPlayer();
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
  })();
})();
