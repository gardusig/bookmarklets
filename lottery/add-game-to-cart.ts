interface GameChoice {
  buttonPrefix: string;
  requiredNumbers: number;
  minNumber: number;
  maxNumber: number;
  zeroPad?: boolean;
}

interface GameConfig {
  keywords: string[];
  choices: GameChoice[];
}

const gameConfigs: Record<string, GameConfig> = {
  megasena: {
    keywords: ["Mega"],
    choices: [
      {
        buttonPrefix: "#n",
        requiredNumbers: 6,
        minNumber: 1,
        maxNumber: 60,
        zeroPad: true,
      },
    ],
  },
  quina: {
    keywords: ["Quina"],
    choices: [
      {
        buttonPrefix: "#n",
        requiredNumbers: 5,
        minNumber: 1,
        maxNumber: 80,
        zeroPad: true,
      },
    ],
  },
  "+milionaria": {
    keywords: ["Mais Milionaria"],
    choices: [
      {
        buttonPrefix: "#n",
        requiredNumbers: 6,
        minNumber: 1,
        maxNumber: 50,
      },
      {
        buttonPrefix: "#trevo",
        requiredNumbers: 2,
        minNumber: 1,
        maxNumber: 6,
      },
    ],
  },
  "dupla-sena": {
    keywords: ["Dupla"],
    choices: [
      {
        buttonPrefix: "#n",
        requiredNumbers: 6,
        minNumber: 1,
        maxNumber: 50,
        zeroPad: true,
      },
    ],
  },
  lotomania: {
    keywords: ["Loto-mania"],
    choices: [
      {
        buttonPrefix: "#n",
        requiredNumbers: 50,
        minNumber: 0,
        maxNumber: 99,
        zeroPad: true,
      },
    ],
  },
  lotofacil: {
    keywords: ["Loto"],
    choices: [
      {
        buttonPrefix: "#n",
        requiredNumbers: 15,
        minNumber: 1,
        maxNumber: 25,
        zeroPad: true,
      },
    ],
  },
};

const SLEEP_MIN = 750;
const SLEEP_MAX = 1250;
const RANDOM_SLEEP_MIN = 777;
const RANDOM_SLEEP_MAX = 1777;
const WAIT_FOR_ELEMENT_INTERVAL_MS = 100;
const WAIT_FOR_ELEMENT_TIMEOUT_MS = 10000;

const CART_BUTTON_SELECTOR = "#colocarnocarrinho";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomSleepTime(min = SLEEP_MIN, max = SLEEP_MAX): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function waitForElement(selector: string): Promise<Element> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(checkInterval);
        resolve(element);
      } else if (Date.now() - start >= WAIT_FOR_ELEMENT_TIMEOUT_MS) {
        clearInterval(checkInterval);
        reject(
          new Error(
            `Element with selector "${selector}" not found within ${WAIT_FOR_ELEMENT_TIMEOUT_MS} ms`
          )
        );
      }
    }, WAIT_FOR_ELEMENT_INTERVAL_MS);
  });
}

async function clickElement(selector: string): Promise<void> {
  try {
    const element = await waitForElement(selector);
    (element as HTMLElement).click();
    await sleep(getRandomSleepTime());
  } catch (error) {
    console.error(`Error clicking element ${selector}:`, error);
  }
}

async function clickButtonList(buttonList: string[]): Promise<void> {
  try {
    for (let i = 0; i < buttonList.length; i++) {
      await clickElement(buttonList[i]);
      console.log(`Picked number at position ${i + 1}`);
    }
    console.warn(`Finished picking numbers`);
  } catch (error) {
    console.error(`Error in clickButtonList:`, error);
  }
}

async function addToCart(): Promise<void> {
  try {
    await clickElement(CART_BUTTON_SELECTOR);
    console.warn(`Added to cart`);
    await sleep(getRandomSleepTime(RANDOM_SLEEP_MIN, RANDOM_SLEEP_MAX));
  } catch (error) {
    console.error(`Error adding to cart:`, error);
  }
}

function getNumberFromInput(
  input: string,
  gameConfig: GameChoice
): number | null {
  const parsedNumber = parseInt(input.trim(), 10);
  if (
    isNaN(parsedNumber) ||
    parsedNumber < gameConfig.minNumber ||
    parsedNumber > gameConfig.maxNumber
  ) {
    console.error(
      `Please enter a valid number between ${gameConfig.minNumber} and ${gameConfig.maxNumber}.`
    );
    return null;
  }
  return parsedNumber;
}

function readGames(choices: GameChoice[]): string[] {
  const buttonList: string[] = [];
  for (const gameConfig of choices) {
    for (let i = 0; i < gameConfig.requiredNumbers; i++) {
      const input = prompt(
        `Enter value at position ${buttonList.length + 1} (between ${
          gameConfig.minNumber
        } and ${gameConfig.maxNumber}), or leave empty to finish:`
      );
      if (input === null || input.trim() === "") {
        break;
      }
      const element = getNumberFromInput(input, gameConfig);
      if (element !== null) {
        let formattedNumber = element.toString();
        if (gameConfig.zeroPad && formattedNumber.length < 2) {
          formattedNumber = "0" + formattedNumber;
        }
        const buttonElement = `${gameConfig.buttonPrefix}${formattedNumber}`;
        buttonList.push(buttonElement);
        console.warn(`Added number at position ${buttonList.length}`);
      }
    }
  }
  return buttonList;
}

function findGameConfigAndGetInput(): string[] | null {
  const metaTag = document.querySelector("meta[name='keywords']");
  const keywords = metaTag
    ? metaTag.getAttribute("content")?.split(", ") || []
    : [];
  for (const [gameType, gameConfig] of Object.entries(gameConfigs)) {
    if (gameConfig.keywords.some((keyword) => keywords.includes(keyword))) {
      console.log(`Game type identified: ${gameType}`);
      return readGames(gameConfig.choices);
    }
  }
  console.error("Game type not found or error while getting it");
  return null;
}

(async function () {
  const buttonList = findGameConfigAndGetInput();
  if (buttonList) {
    await clickButtonList(buttonList);
    await addToCart();
  }
})();
