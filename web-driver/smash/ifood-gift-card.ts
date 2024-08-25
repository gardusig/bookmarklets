import { By, Key, until, WebDriver } from "selenium-webdriver";
import { createDriver } from "../util/web-driver";

type SheetData = {
  link: string;
  password: string;
};

const sheetDataList: SheetData[] = [
  {
    link: "https://loja.smash.gifts/resgatar/0LLluqMIZcLdZwwUoZ6U",
    password: "588285",
  },
  {
    link: "https://loja.smash.gifts/resgatar/0ayzLvwmuhdHhsmbiADz",
    password: "792534",
  },
];

async function handleGiftCard(
  driver: WebDriver,
  sheetData: SheetData
): Promise<string> {
  await driver.get(sheetData.link);
  try {
    const inputElement = await driver.wait(
      until.elementLocated(
        By.css("body > flutter-view > flt-text-editing-host > input")
      ),
      30000
    );
    if (!inputElement) {
      throw new Error(
        `Failed to find password input for link: ${sheetData.link}`
      );
    }
    await inputElement.sendKeys(sheetData.password);
    await inputElement.sendKeys(Key.TAB);
    const openGiftButton = await driver.switchTo().activeElement();
    await openGiftButton.click();
    console.log('Clicked on the "Open Gift" button');
    await driver.sleep(10 * 1000);
  } catch (error) {
    console.error(
      `Error handling gift card for link: ${sheetData.link}`,
      error
    );
  }
  return "codeString";
}

(async function () {
  const driver = createDriver();
  console.log("created driver");
  try {
    for (const sheetData of sheetDataList) {
      const code = await handleGiftCard(driver, sheetData);
      console.log(
        `Finished processing gift card for ${sheetData.link}, code: ${code}`
      );
    }
  } finally {
    await driver.quit();
    console.log("quitted driver");
  }
})();
