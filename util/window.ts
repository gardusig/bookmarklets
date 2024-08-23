export async function waitForElement(
  window: Window,
  selector: string,
  interval: number = 1000,
  timeout: number = 30000
): Promise<Element> {
  const start = Date.now();
  console.log(`Waiting for element: ${selector}`);
  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(() => {
      const element = window.document.querySelector(selector);
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
