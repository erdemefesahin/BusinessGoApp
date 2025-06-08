# System UI Crash Recovery Guide

## Problem: "System UI isn't responding" on Android Emulator

This is a common Android emulator issue that can be resolved with these steps:

### Immediate Recovery Steps

1. **Quick Fix (Try First):**
   ```powershell
   cd "C:\Users\er-ef\Desktop\BusinessGoApp"
   adb shell input keyevent KEYCODE_HOME
   adb shell am force-stop com.android.systemui
   adb shell am start com.android.systemui/.SystemUIService
   ```

2. **If Quick Fix Fails - Restart Emulator:**
   ```powershell
   # Kill emulator
   taskkill /f /im "qemu-system-*"
   taskkill /f /im "emulator*"
   
   # Restart ADB
   adb kill-server
   adb start-server
   
   # Start fresh emulator
   emulator @Pixel_7_Pro_API_34 -no-snapshot-load
   ```

### Complete Recovery and Deployment

1. **Run the Robust Deployment Script:**
   ```powershell
   cd "C:\Users\er-ef\Desktop\BusinessGoApp"
   PowerShell -ExecutionPolicy Bypass -File ".\deploy-android-robust.ps1" -ForceRestart -CleanBuild
   ```

2. **Manual Step-by-Step Recovery:**

   **Step 1: Environment Setup**
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
   $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
   ```

   **Step 2: Kill All Android Processes**
   ```powershell
   Get-Process -Name "*emulator*" -ErrorAction SilentlyContinue | Stop-Process -Force
   Get-Process -Name "*qemu*" -ErrorAction SilentlyContinue | Stop-Process -Force
   adb kill-server
   ```

   **Step 3: Clean Build Cache**
   ```powershell
   # Clean Gradle
   Remove-Item -Path "android\.gradle" -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path "android\app\build" -Recurse -Force -ErrorAction SilentlyContinue
   
   # Clean React Native
   npx react-native clean
   ```

   **Step 4: Start Fresh Emulator**
   ```powershell
   adb start-server
   emulator @Pixel_7_Pro_API_34 -no-snapshot-load -wipe-data
   ```

   **Step 5: Wait for Boot (in another terminal)**
   ```powershell
   # Wait until you see "device" status
   adb devices
   
   # Wait for full boot
   adb shell getprop sys.boot_completed
   # Should return "1"
   ```

   **Step 6: Deploy App**
   ```powershell
   # Start Metro (in background)
   Start-Process -FilePath "npx" -ArgumentList "react-native", "start", "--reset-cache"
   
   # Wait 10 seconds then build
   npx react-native run-android
   ```

### Prevention Tips

1. **Use Cold Boot Always:**
   - Always start emulator with `-no-snapshot-load`
   - Avoid quick boot, use cold boot

2. **Increase Emulator Resources:**
   - RAM: 4GB minimum
   - VM Heap: 512MB
   - Storage: 8GB minimum

3. **Regular Cleanup:**
   - Wipe emulator data weekly
   - Clear Gradle cache regularly

### Troubleshooting Commands

```powershell
# Check emulator status
adb devices

# Check if System UI is running
adb shell dumpsys activity activities | findstr SystemUI

# Force restart System UI
adb shell am force-stop com.android.systemui
adb shell am start com.android.systemui/.SystemUIService

# Check memory usage
adb shell cat /proc/meminfo

# Reboot emulator
adb reboot

# Check Android version
adb shell getprop ro.build.version.release

# Test touch responsiveness
adb shell input tap 500 500
```

### VS Code Integration

You can also run the deployment from VS Code:

1. Open Command Palette (Ctrl+Shift+P)
2. Type "Tasks: Run Task"
3. Select "Android: Complete Deployment"

Or use the robust script:
1. Open terminal in VS Code
2. Run: `.\deploy-android-robust.ps1 -ForceRestart -CleanBuild`

### Common Error Messages and Solutions

| Error | Solution |
|-------|----------|
| "System UI isn't responding" | Restart emulator with `-wipe-data` |
| "JAVA_HOME not set" | Set to Android Studio JBR path |
| "SDK not found" | Set ANDROID_HOME correctly |
| "Emulator not found" | Start emulator manually first |
| "Metro bundler failed" | Kill Node processes and restart |
| "Gradle daemon failed" | Clear Gradle cache |

### Quick Recovery Commands (Copy-Paste Ready)

```powershell
# Complete recovery sequence
cd "C:\Users\er-ef\Desktop\BusinessGoApp"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
Get-Process -Name "*emulator*" -ErrorAction SilentlyContinue | Stop-Process -Force
adb kill-server
adb start-server
emulator @Pixel_7_Pro_API_34 -no-snapshot-load -wipe-data &
# Wait 60 seconds for boot, then:
npx react-native start --reset-cache &
# Wait 10 seconds, then:
npx react-native run-android
```
