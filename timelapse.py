import os
import pyautogui
import time

# Set your base screenshot folder
base_folder = os.path.dirname(os.path.abspath(__file__))

# Set your desired resolution
resolution = (2560, 1440)  # Specify your desired resolution

# Set capture interval in seconds
capture_interval = 5

current_date = time.strftime("%Y-%m-%d")

# Create a daily folder if it doesn't exist
daily_folder = os.path.join(base_folder, current_date)
os.makedirs(daily_folder, exist_ok=True)

try:
    while True:
        timestamp = time.strftime("%Y%m%d%H%M%S")
        screenshot_name = f"screenshot_{timestamp}.png"
        screenshot_path = os.path.join(daily_folder, screenshot_name)

        # Capture the screen within the specified resolution
        myScreenshot = pyautogui.screenshot(region=(0, 0, resolution[0], resolution[1]))

        # Save the screenshot
        myScreenshot.save(screenshot_path)

        print(f"Screenshot saved: {screenshot_path}")

        time.sleep(capture_interval)

except KeyboardInterrupt:
    print("\nScreenshot capture stopped by user.")
except Exception as e:
    print(f"Error capturing screenshot: {e}")
