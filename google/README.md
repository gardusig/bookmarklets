# Auto Player

## Description
The Auto Player is a JavaScript bookmarklet designed to automate audio playback on web pages, particularly useful for websites like Google Translate where audio playback for original and translated texts is involved. The script controls the playback of audio, monitors its progress, and navigates through pages automatically. It adds control buttons to the page that allow the user to choose between playing the original or translated audio, as well as stopping the script at any time.

## How It Works

### 1. **Button Creation and User Control**
The script dynamically creates three buttons on the web page for user interaction:
- **Play Original:** Starts playing the original (source) audio from the page.
- **Play Translated:** Starts playing the translated audio.
- **Stop Script:** Stops the script entirely, halting all automated actions.

### 2. **User Input and Action Listening**
- Once the buttons are created, the script listens for user input:
  - Clicking **Play Original** will select and repeatedly play the original audio on the page.
  - Clicking **Play Translated** will select and repeatedly play the translated audio.
  - Clicking **Stop Script** stops all automation immediately.

### 3. **Element Detection and Action Execution**
- **Element Detection:** The script continuously searches for specific page elements using predefined CSS selectors to control audio playback (`Listen to source text`, `Listen to translation`, and `Stop listening` buttons) and the `Next` button to move to the next page when audio finishes.
- **Action Execution:**
  - The script waits until the user selects which audio to play.
  - It then checks if the audio is playing and waits for it to stop, with adjustable intervals for monitoring the playback duration.
  - If the stop condition or the next button appears, the script will attempt to click these elements to either stop the playback or move to the next page.

### 4. **Audio Playback and Page Navigation**
- **Playback Monitoring:** The script monitors the audio playback state by checking if the "Stop listening" button is present on the page, which indicates that the audio is playing.
- **Next Page Navigation:** Once the audio playback is complete or if the next button is present, the script will click the next button to navigate to the following page and restart the audio playback process.

### 5. **Script Termination**
- The user can manually stop the script by clicking the "Stop Script" button, which sets a stop flag. If the flag is set while audio is playing, the script will try to stop the playback before terminating.

## Script Execution
To execute the script, copy the bookmarklet code provided at the end of the JavaScript file, save it as a bookmark in your browser, and click the bookmark when you're on a compatible webpage.

### Notes
- Ensure that the webpage contains the audio buttons with the specific aria-labels mentioned in the script. If the button selectors do not match, the script will not function correctly.
- The script relies on a simple, time-based approach to monitor playback status and uses a polling mechanism to interact with webpage elements.

## Summary
This bookmarklet provides an automated way to handle audio playback for language content, allowing for repetitive and hands-free interaction with web-based audio players. It is particularly useful for users who need to frequently play and listen to both original and translated text audio, streamlining the process with minimal manual intervention.
