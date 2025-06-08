# Emergency Recovery Commands for System UI Crash
# Copy and paste these commands one by one into PowerShell

# Step 1: Navigate to project folder
cd "C:\Users\er-ef\Desktop\BusinessGoApp"

# Step 2: Set environment variables
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"

# Step 3: Try quick System UI fix first
Write-Host "Attempting quick System UI recovery..." -ForegroundColor Yellow
adb shell input keyevent KEYCODE_HOME
adb shell am force-stop com.android.systemui
adb shell am start com.android.systemui/.SystemUIService

# Wait 5 seconds and check
Start-Sleep -Seconds 5
adb devices

# Step 4: If quick fix doesn't work, restart emulator
Write-Host "If above didn't work, killing emulator processes..." -ForegroundColor Yellow
Get-Process -Name "*emulator*" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "*qemu*" -ErrorAction SilentlyContinue | Stop-Process -Force

# Step 5: Restart ADB
adb kill-server
Start-Sleep -Seconds 2
adb start-server

# Step 6: Start fresh emulator (this will take 60-90 seconds)
Write-Host "Starting fresh emulator..." -ForegroundColor Green
Start-Process -FilePath "emulator" -ArgumentList "@Pixel_7_Pro_API_34", "-no-snapshot-load", "-wipe-data"

# Step 7: Wait for emulator to boot (run this after emulator window appears)
Write-Host "Waiting for emulator to boot..." -ForegroundColor Yellow
do {
    Start-Sleep -Seconds 5
    $devices = adb devices
    Write-Host "Checking emulator status..."
    $devices
} while (-not ($devices -match "emulator-\d+\s+device"))

Write-Host "Emulator is ready!" -ForegroundColor Green

# Step 8: Deploy the app
Write-Host "Starting deployment..." -ForegroundColor Green
npx react-native start --reset-cache &
Start-Sleep -Seconds 10
npx react-native run-android
