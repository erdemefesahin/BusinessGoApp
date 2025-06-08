# Business GO App - Android Setup Guide

This guide explains how to set up your development environment for running the Business GO App on Android.

## Prerequisites

1. **Node.js**: Version 18 or later
   - Download from [https://nodejs.org/](https://nodejs.org/)

2. **Java Development Kit (JDK)**: Version 11 or later
   - Download from [https://adoptium.net/](https://adoptium.net/)

3. **Android Studio**
   - Download from [https://developer.android.com/studio](https://developer.android.com/studio)
   - Required components:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device (Emulator)

## Manual Environment Setup

### Step 1: Set up JAVA_HOME

1. Find your JDK installation path (usually in `C:\Program Files\Java\jdk-version` or inside Android Studio)
2. Set JAVA_HOME environment variable:
   ```powershell
   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\path\to\jdk', 'Machine')
   ```
3. Add Java to your PATH:
   ```powershell
   [System.Environment]::SetEnvironmentVariable('PATH', "$env:PATH;$env:JAVA_HOME\bin", 'Machine')
   ```

### Step 2: Set up ANDROID_HOME

1. Find your Android SDK installation path (usually in `%LOCALAPPDATA%\Android\Sdk` or `C:\Program Files\Android\android-sdk`)
2. Set ANDROID_HOME environment variable:
   ```powershell
   [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\path\to\android\sdk', 'Machine')
   ```
3. Add Android tools to your PATH:
   ```powershell
   [System.Environment]::SetEnvironmentVariable('PATH', "$env:PATH;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin;$env:ANDROID_HOME\emulator", 'Machine')
   ```

### Step 3: Create an Android Virtual Device (AVD)

1. Open Android Studio
2. Click "Tools" > "AVD Manager"
3. Click "Create Virtual Device"
4. Select a device definition (e.g., Pixel 6)
5. Select a system image (e.g., API 33)
6. Finish the AVD creation

## Automatic Setup & Launch

We've provided two PowerShell scripts to simplify the setup and launch process:

1. **launch-android.ps1**: Automatically sets up the environment and launches the app
   ```powershell
   .\launch-android.ps1
   ```

2. **troubleshoot-android.ps1**: Diagnoses common issues and provides solutions
   ```powershell
   .\troubleshoot-android.ps1
   ```

### What the Launch Script Does

The `launch-android.ps1` script automatically:

1. Finds and sets the correct Java installation path
2. Sets up Android SDK paths
3. Cleans Gradle cache to prevent build issues
4. Launches your Android emulator
5. Starts Metro bundler
6. Builds and runs the React Native app on Android

## Manual App Launch

If you prefer to run commands manually, follow these steps:

1. Start an Android emulator:
   ```powershell
   emulator -avd <emulator_name>
   ```

2. Start Metro bundler:
   ```powershell
   npx react-native start
   ```

3. In another terminal, build and install the app:
   ```powershell
   npx react-native run-android
   ```

## Troubleshooting

If you encounter any issues:

1. Run the troubleshooting script:
   ```powershell
   .\troubleshoot-android.ps1
   ```

2. Clean the Gradle cache:
   ```powershell
   cd android
   .\gradlew clean
   ```

3. Reset Metro bundler cache:
   ```powershell
   npx react-native start --reset-cache
   ```

4. Make sure ADB can see your device:
   ```powershell
   adb devices
   ```

5. Check for available emulators:
   ```powershell
   emulator -list-avds
   ```

## Common Errors and Solutions

### Build Failed with Error Code 1

Clean the project:
```powershell
cd android
.\gradlew clean
cd ..
npx react-native run-android
```

### Unable to Load Script

Reset Metro cache:
```powershell
npx react-native start --reset-cache
```

### SDK Location Not Found

Ensure ANDROID_HOME is properly set or create a `local.properties` file in the android directory:
```
sdk.dir=C:\\path\\to\\Android\\Sdk
```

### Device Not Found

Check ADB connection:
```powershell
adb devices
```

If no devices are listed, restart ADB:
```powershell
adb kill-server
adb start-server
```

## Additional Resources

- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Android Developer Documentation](https://developer.android.com/docs)
- [Android Studio User Guide](https://developer.android.com/studio/intro)
