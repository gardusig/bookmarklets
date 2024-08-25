// import { executeTasksInParallel } from "../util/parallel";
import { createNewWindow, waitForElement } from "../util/window";

type SheetData = {
  link: string;
  password: string;
};

const passwordSelector = "body > flutter-view > flt-text-editing-host > input";

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

async function handleGiftCard(sheetData: SheetData): Promise<string> {
  const newWindow = await createNewWindow(sheetData.link);
  try {
    const inputElement = await waitForElement(newWindow, passwordSelector);
    if (!inputElement) {
      throw new Error(
        `Failed to find password selector for link: ${sheetData.link}`
      );
    }
    console.log(
      `Password selector found for link: ${sheetData.link}, password: ${sheetData.password}`
    );
  } catch (error) {
    console.error(error);
  } finally {
    window.focus();
    newWindow.close();
  }
  return "codeString";
}

javascript: (async function () {
  console.log("Starting script...");
  for (const sheetData of sheetDataList) {
    const code = await handleGiftCard(sheetData);
    console.log(
      `finished processing gift card for ${sheetData.link}, code:${code}`
    );
  }
  console.log("Finished script");
})();
