javascript: (function () {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForElement(selector, interval = 1000, timeout = 30000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(checkInterval);
          resolve(element);
        } else if (Date.now() - start >= timeout) {
          clearInterval(checkInterval);
          reject(
            new Error(
              `Element with selector "${selector}" not found within ${timeout} ms`
            )
          );
        }
      }, interval);
    });
  }

  async function clickPlayStopButton(playButtonSelector) {
    try {
      const playButton = await waitForElement(playButtonSelector);
      playButton.click();
      console.warn("Clicked play button");
    } catch (error) {
      console.error("Error clicking play/stop button:", error);
    }
  }

  async function isPlayerPlaying(playButtonSelector) {
    try {
      const playButton = await waitForElement(playButtonSelector);
      const playButtonState = playButton.getAttribute(playButtonStateAttr);
      console.log(`Play button state: ${playButtonState}`);
      return playButtonState === stopListeningValue;
    } catch (error) {
      console.error("Error checking play/stop button state:", error);
      return false;
    }
  }

  async function shouldMoveToNextPage() {
    try {
      const charCountElement = await waitForElement(charCountSelector);
      const charCountText = charCountElement.textContent.trim();
      console.log(`Character count text: ${charCountText}`);
      return charCountText === "5,000 / 5,000";
    } catch (error) {
      console.error("Error checking character count:", error);
      return false;
    }
  }

  async function moveToNextPage() {
    try {
      const nextButton = await waitForElement(nextButtonSelector);
      nextButton.click();
      console.warn("Moved to next page");
    } catch (error) {
      console.error("Error moving to next page:", error);
    }
  }

  async function waitForPlayerToStop(playButtonSelector) {
    let totalWaitTime = 0;
    let sleepTime = 3000;
    let attempts = 0;
    while ((await isPlayerPlaying(playButtonSelector)) && !stopFlag) {
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
  let playButtonSelector = undefined;

  const stopButton = createButton("Stop Script", "10px", "10px");
  const playOriginalButton = createButton("Play Original", "50px", "10px");
  const playTranslatedButton = createButton("Play Translated", "90px", "10px");

  stopButton.addEventListener("click", async () => {
    stopFlag = true;
    console.warn("Script stopped by user");
  });

  (async function () {
    playButtonSelector = await waitForPlayButtonSelection();
    await waitForPlayerToStop(playButtonSelector);
    while (!stopFlag) {
      await clickPlayStopButton(playButtonSelector);
      await waitForPlayerToStop(playButtonSelector);
      if (stopFlag) {
        await clickPlayStopButton(playButtonSelector);
        break;
      }
      if (!(await shouldMoveToNextPage())) {
        break;
      }
      await moveToNextPage();
    }
    console.warn("Finished playing");
    stopButton.remove();
    playOriginalButton.remove();
    playTranslatedButton.remove();
  })();
})();
