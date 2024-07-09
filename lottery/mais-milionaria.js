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
        `contest #${contestCount}: error clicking element ${selector}:`,
        error
      );
    }
  }

  async function clickNumberButtons(numberIds) {
    try {
      let numberPosition = 1;
      for (const id of numberIds) {
        await clickElement(`#n${id}`);
        console.log(
          `contest #${contestCount}: picked number at position ${numberPosition++}`
        );
      }
      console.warn(`contest #${contestCount}: finished selecting numbers`);
    } catch (error) {
      console.error(
        `contest #${contestCount}: error in clickNumberButtons:`,
        error
      );
    }
  }

  async function clickCloverButtons(cloverIds) {
    try {
      let cloverPosition = 1;
      for (const id of cloverIds) {
        await clickElement(`#trevo${id}`);
        console.log(
          `contest #${contestCount}: picked clover at position ${cloverPosition++}`
        );
      }
      console.warn(`contest #${contestCount}: finished selecting clovers`);
    } catch (error) {
      console.error(
        `contest #${contestCount}: error in clickCloverButtons:`,
        error
      );
    }
  }

  async function addToCart() {
    await clickElement("#colocarnocarrinho");
    console.warn(`contest #${contestCount}: added to cart`);
  }

  async function proceedToPayment() {
    await clickElement("#irparapagamento");
    await clickElement("#confirma");
    console.warn("payment required");
  }

  async function processContest(contest) {
    await clickNumberButtons(contest.numbers);
    await clickCloverButtons(contest.clovers);
    await addToCart();
    await sleep(getRandomSleepTime(777, 1777));
  }

  function getContestFromInput(contestCombinationInput) {
    if (contestCombinationInput.length === 0) {
      return null;
    }
    const [numbersString, cloversString] = contestCombinationInput.split(" ");
    const numbers = numbersString
      .split(",")
      .map((num) => parseInt(num.trim(), 10));
    const clovers = cloversString
      .split(",")
      .map((clover) => parseInt(clover.trim(), 10));
    return { numbers: numbers, clovers: clovers };
  }

  async function runContestsFromInput() {
    let input = prompt(
      "Enter combinations (e.g., 1,2,3,4,5,6 1,2;7,8,9,10,11,12 3,4):"
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
    console.warn("all contests processed");
  }

  let contestCount = 1;
  const defaultInput =
    "1,2,3,4,5,6 1,2" +
    ";" +
    "7,8,9,10,11,12 3,4" +
    ";" +
    "13,14,15,16,17,18 5,6" +
    ";" +
    "13,14,15,16,17,18 1,6" +
    ";" +
    "13,14,15,16,17,18 2,6";

  (async function () {
    await runContestsFromInput();
    await proceedToPayment();
  })();
})();
