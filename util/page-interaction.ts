export function isElementPresent(selector: string): boolean {
  const element = document.querySelector(selector);
  return element !== null;
}

export async function waitForElement(
  selector: string,
  interval: number = 1000,
  timeout: number = 5000
): Promise<Element> {
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

export async function clickButton(buttonSelector: string): Promise<boolean> {
  try {
    const playButton = (await waitForElement(buttonSelector)) as HTMLElement;
    playButton.click();
    console.warn(`Clicked button: ${buttonSelector}`);
    return true;
  } catch (error) {
    console.error(`Error clicking button: ${buttonSelector}, error: ${error}`);
    return false;
  }
}
