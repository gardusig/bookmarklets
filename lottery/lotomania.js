javascript: (function () {
  let contestCount = 1;
  const defaultInput =
    "00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49" +
    ";" +
    "50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99" +
    ";" +
    "00,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99" +
    ";" +
    "01,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99" +
    ";" +
    "02,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99" +
    ";" +
    "03,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99" +
    ";" +
    "04,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99" +
    ";" +
    "00,02,04,06,08,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98" +
    ";" +
    "01,03,05,07,09,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99";

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

  async function runContestsFromInput(input = null) {
    if (!input) {
      input =
        prompt(
          "Enter combinations (e.g., 00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49;50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99):"
        ) || defaultInput;
    }
    const contestCombinations = input.split(";");
    for (const contestCombinationInput of contestCombinations) {
      const contest = getContestFromInput(contestCombinationInput);
      if (contest !== null) {
        await processContest(contest);
        contestCount++;
      }
    }
    console.warn("All contests processed");
  }

  (async function () {
    await runContestsFromInput();
    await proceedToPayment();
  })();
})();
