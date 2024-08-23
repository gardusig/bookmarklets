import { waitForElement } from "../util/window";

const passwordSelector = "body > flutter-view > flt-text-editing-host > input";

const sheetData = [
  {
    link: "https://loja.smash.gifts/resgatar/0LLluqMIZcLdZwwUoZ6U",
    password: "588285",
  },
  {
    link: "https://loja.smash.gifts/resgatar/0ayzLvwmuhdHhsmbiADz",
    password: "792534",
  },
];

type SheetData = {
  link: string;
  password: string;
};

async function openGiftCardWindow(
  link: string,
  password: string,
  waitInterval: number = 1000,
  elementTimeout: number = 30000
): Promise<string> {
  console.log(`Opening link: ${link}`);
  const newWindow = window.open(link, "_blank");
  if (!newWindow) {
    throw new Error(`Failed to open the new window for link: ${link}`);
  }
  const inputElement = await waitForElement(
    newWindow,
    passwordSelector,
    waitInterval,
    elementTimeout
  );
  if (!inputElement) {
    throw new Error(`Failed to find password selector for link: ${link}`);
  }
  console.log(
    `Password selector found for link: ${link}, password: ${password}`
  );
  return "codeString";
}

javascript: (function () {
  openLinksFromSheet(sheetData);
})();
