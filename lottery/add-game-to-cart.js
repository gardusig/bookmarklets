javascript: (function () {
  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function getRandomSleepTime(min = 750, max = 1250) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function waitForElement(selector, interval = 100, timeout = 10000) {
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

  async function clickElement(selector) {
    try {
      const element = await waitForElement(selector);
      element.click();
      await sleep(getRandomSleepTime());
    } catch (error) {
      console.error(`Error clicking element ${selector}:`, error);
    }
  }

  async function clickNumberButtons(numberIds) {
    try {
      let numberPosition = 1;
      for (const id of numberIds) {
        const paddedId = id.toString().padStart(2, "0");
        await clickElement(`#n${paddedId}`);
        console.log(`Picked number at position ${numberPosition++}`);
      }
      console.warn(`Finished selecting numbers`);
    } catch (error) {
      console.error(`Error in clickNumberButtons:`, error);
    }
  }

  async function addToCart() {
    await clickElement("#colocarnocarrinho");
    console.warn(`Added to cart`);
  }

  async function addGameToCart(gameNumbers) {
    if (gameNumbers.length === 0) {
      console.error("No valid numbers entered.");
      return;
    }
    console.log(`Adding game with ${gameNumbers.length} numbers`);
    await clickNumberButtons(gameNumbers);
    await addToCart();
    await sleep(getRandomSleepTime(777, 1777));
  }

  (async function () {
    const gameNumbers = [];
    while (true) {
      const gameNumber = prompt(
        `Enter number at position ${
          gameNumbers.length + 1
        } (e.g., 1 or 2 or 3 or 4 or 5), or leave empty to finish:`
      );
      if (gameNumber === null) {
        break;
      }
      const parsedNumber = parseInt(gameNumber.trim(), 10);
      if (isNaN(parsedNumber) || parsedNumber < 1 || parsedNumber > 99) {
        console.error("Please enter a valid number between 1 and 99.");
        continue;
      }
      gameNumbers.push(parsedNumber);
      console.warn(`Added number at position ${gameNumbers.length}`);
    }
    await addGameToCart(gameNumbers);
  })();
})();
