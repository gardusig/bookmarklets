import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

const chromeDriverPath = "/Users/gardusig/tool/chromedriver";

const chromiumPath =
  "/Users/gardusig/tool/chrome/mac_arm-113.0.5672.63/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";

export function createDriver(): WebDriver {
  const options = new chrome.Options();
  options.setChromeBinaryPath(chromiumPath);
  options.addArguments("--disable-extensions", "--start-maximized");
  return new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(new chrome.ServiceBuilder(chromeDriverPath))
    .build();
}
