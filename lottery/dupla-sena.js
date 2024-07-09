javascript: (function () {
  function sleep(ms) {
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
      console.error(
        `Contest #${contestCount}: error clicking element ${selector}:`,
        error
      );
    }
  }

  async function clickNumberButtons(numberIds) {
    try {
      let numberPosition = 1;
      for (const id of numberIds) {
        const paddedId = id.toString().padStart(2, "0");
        await clickElement(`#n${paddedId}`);
        console.log(
          `Contest #${contestCount}: picked number at position ${numberPosition++}`
        );
      }
      console.warn(`Contest #${contestCount}: finished selecting numbers`);
    } catch (error) {
      console.error(
        `Contest #${contestCount}: error in clickNumberButtons:`,
        error
      );
    }
  }

  async function addToCart() {
    await clickElement("#colocarnocarrinho");
    console.warn(`Contest #${contestCount}: added to cart`);
  }

  async function proceedToPayment() {
    await clickElement("#irparapagamento");
    await clickElement("#confirma");
    console.warn("Payment required");
  }

  async function processContest(contest) {
    await clickNumberButtons(contest.numbers);
    await addToCart();
    await sleep(getRandomSleepTime(777, 1777));
  }

  function getContestFromInput(contestCombinationInput) {
    if (contestCombinationInput.length === 0) {
      return null;
    }
    const numbers = contestCombinationInput
      .split(",")
      .map((num) => parseInt(num.trim(), 10));
    return { numbers: numbers };
  }

  async function runContestsFromInput() {
    let input = prompt(
      "Enter combinations (e.g., 1,2,3,4,5,6;7,8,9,10,11,12):"
    );
    if (!input) {
      input = defaultInput;
    }
    const contestCombinations = [];
    for (const contestCombinationInput of input.split(";")) {
      const contest = getContestFromInput(contestCombinationInput);
      if (contest !== null) {
        contestCombinations.push(contest);
      }
    }
    for (const contest of contestCombinations) {
      await processContest(contest);
      contestCount++;
    }
    console.warn("All contests processed");
  }

  let contestCount = 1;
  const defaultInput =
    "1,2,3,4,5,6" +
    ";" +
    "7,8,9,10,11,12" +
    ";" +
    "13,14,15,16,17,18" +
    ";" +
    "19,20,21,22,23,24" +
    ";" +
    "1,2,3,4,5,7" +
    ";" +
    "7,8,9,10,11,13" +
    ";" +
    "13,14,15,16,17,19" +
    ";" +
    "19,20,21,22,23,25" +
    ";" +
    "1,2,3,4,5,8" +
    ";" +
    "7,8,9,10,11,14" +
    ";" +
    "13,14,15,16,17,20" +
    ";" +
    "19,20,21,22,23,26";

  (async function () {
    await runContestsFromInput();
    await proceedToPayment();
  })();
})();
