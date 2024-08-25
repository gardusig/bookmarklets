from util import create_driver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

sheet_data_list = [
    {
        "link": "https://loja.smash.gifts/resgatar/0LLluqMIZcLdZwwUoZ6U",
        "password": "588285",
    },
    {
        "link": "https://loja.smash.gifts/resgatar/0ayzLvwmuhdHhsmbiADz",
        "password": "792534",
    },
]


def handle_gift_card(driver, sheet_data):
    driver.get(sheet_data["link"])
    try:
        # Wait for the element to be located and interact with it
        input_element = WebDriverWait(driver, 30).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "body > flutter-view > flt-text-editing-host > input")
            )
        )
        if not input_element:
            raise Exception(
                f"Failed to find password input for link: {sheet_data['link']}")
        input_element.send_keys(sheet_data["password"])
        time.sleep(10)  # Sleep for 10 seconds
    except Exception as e:
        print(f"Error handling gift card for link: {sheet_data['link']}", e)
    return "codeString"


def main():
    driver = create_driver()
    print("Created driver")
    try:
        for sheet_data in sheet_data_list:
            code = handle_gift_card(driver, sheet_data)
            print(
                f"Finished processing gift card for {sheet_data['link']}, code: {code}")
    finally:
        driver.quit()
        print("Quitted driver")


if __name__ == "__main__":
    main()
