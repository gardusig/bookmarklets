# Auto Player

## Description
This script is a JavaScript bookmarklet designed to automate the process of playing audio on a web page, monitoring the player's status, and navigating to the next page when necessary. It provides buttons to control the script, including the ability to stop it, and to choose between playing original or translated audio.

## How It Works
1. **Button Creation:** The script creates three buttons on the web page:
   - **Stop Script:** Stops the script when clicked.
   - **Play Original:** Selects and plays the original audio.
   - **Play Translated:** Selects and plays the translated audio.

2. **Element Selection and Interaction:**
   - The script waits for the user to click either the "Play Original" or "Play Translated" button to select which audio to play.
   - It continuously checks if the audio is playing and waits until it stops.
   - If the audio stops, it checks whether the character count on the page has reached its limit (e.g., "5,000 / 5,000").
   - If the character count limit is reached, it navigates to the next page and repeats the process.

3. **Script Control:**
   - The user can stop the script at any time by clicking the "Stop Script" button.
   - The script will attempt to stop the audio if it's playing when the script is stopped.
