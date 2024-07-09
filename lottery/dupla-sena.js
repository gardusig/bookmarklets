javascript: (function () {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForElement(selector, interval = 1000, timeout = 30000) {
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

  async function clickNumberButtons(numberIds) {
    for (const id of numberIds) {
      clickNumberButton(id);
    }
  }

  async function clickNumberButton(id) {
    try {
      const numberButton = await waitForElement(`#n${id}`);
      numberButton.click();
      console.warn(`Clicked button for number: ${id}`);
      await sleep(500);
    } catch (error) {
      console.error(`Error clicking button for number ${id}:`, error);
    }
  }

  async function addToCart() {
    try {
      const addToCartButton = await waitForElement("#colocarnocarrinho");
      addToCartButton.click();
      console.warn("Clicked 'Add to Cart' button");
    } catch (error) {
      console.error("Error clicking 'Add to Cart' button:", error);
    }
  }

  const numberIds = ["01", "02", "03", "04", "05", "06"];

  (async function () {
    await clickNumberButtons(numberIds);
    console.warn("Finished selecting numbers");
    await addToCart();
  })();
})();
