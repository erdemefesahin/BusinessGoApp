# Business GO App - Android Workflow Automation

This document provides a comprehensive guide to using the Android workflow automation tools included with Business GO App.

## Overview of Tools

The project includes three PowerShell scripts to simplify your Android development workflow:

1. **android-dev.ps1** - NEW! All-in-one development toolkit for everyday use
2. **launch-android.ps1** - Quick startup script for running the app
3. **troubleshoot-android.ps1** - Diagnostics and problem-solving

## 1. android-dev.ps1 (New!)

This new comprehensive script provides a complete suite of development tools with a command-based interface. It's designed to handle everything from environment setup to building release bundles.

### Usage

```powershell
.\android-dev.ps1 [command] [options]
```

### Commands

| Command | Description |
|---------|-------------|
| `setup` | Configure your development environment |
| `run` | Run the app on an emulator (default) |
| `device` | Run the app on a connected physical device |
| `build` | Build the app (debug or release) |
| `bundle` | Create a release bundle for Play Store |
| `clean` | Clean project caches and build files |
| `emulator` | List and start Android emulators |
| `logs` | Show device logs |
| `troubleshoot` | Run diagnostics on your environment |
| `help` | Show help information |

### Options

| Option | Description |
|--------|-------------|
| `-BuildType` | Specify 'debug' or 'release' (default: debug) |
| `-ResetCache` | Reset Metro bundler cache |
| `-NoAnimation` | Disable boot animation when starting emulator |
| `-Verbose` | Show detailed information during execution |

### Examples

```powershell
# Run the app on the emulator
.\android-dev.ps1 run

# Build a release version
.\android-dev.ps1 build -BuildType release

# Clean the project
.\android-dev.ps1 clean

# Run on physical device with cache reset
.\android-dev.ps1 device -ResetCache

# Create a bundle for Play Store submission
.\android-dev.ps1 bundle
```

## 2. launch-android.ps1 (Quick Start)

This script is designed for the most common use case: quickly launching the app on an emulator. It automatically:

1. Finds and sets up Java and Android SDK paths
2. Cleans Gradle cache to prevent build issues
3. Launches your Android emulator
4. Starts Metro bundler
5. Builds and runs the app

### Usage

```powershell
.\launch-android.ps1
```

## 3. troubleshoot-android.ps1 (Diagnostics)

This script helps diagnose common React Native Android development issues. It checks:

1. Node.js and npm installations
2. Java installation and JAVA_HOME
3. Android SDK installation and ANDROID_HOME
4. ADB connection and devices
5. Project dependencies
6. Gradle setup

### Usage

```powershell
.\troubleshoot-android.ps1
```

## Common Workflows

### First-time Setup

```powershell
# 1. Setup your environment
.\android-dev.ps1 setup

# 2. Run the app to verify everything works
.\android-dev.ps1 run
```

### Daily Development

```powershell
# Quick start with the emulator
.\android-dev.ps1 run

# Or run on a physical device
.\android-dev.ps1 device
```

### Cleaning and Troubleshooting

```powershell
# Clean the project if you encounter build issues
.\android-dev.ps1 clean

# Then run the app again
.\android-dev.ps1 run

# If problems persist, run the troubleshooter
.\android-dev.ps1 troubleshoot
```

### Release Process

```powershell
# 1. Clean the project
.\android-dev.ps1 clean

# 2. Build a release version to test locally
.\android-dev.ps1 build -BuildType release

# 3. Create a Play Store bundle
.\android-dev.ps1 bundle
```

## Advanced Features

### Keystore Management

When building a release version for the first time, the script will guide you through creating a keystore for signing your app. This keystore will be saved and automatically used for future builds.

### Environment Detection

All scripts automatically detect your Java and Android SDK installations, so you don't need to manually configure environment variables.

### Log Viewing

View filtered app logs with the logs command:

```powershell
.\android-dev.ps1 logs
```

### Multiple Emulator Support

List and launch specific emulators:

```powershell
.\android-dev.ps1 emulator
```

## Troubleshooting Tips

1. **App crashes immediately**
   - Try `.\android-dev.ps1 clean` followed by `.\android-dev.ps1 run -ResetCache`

2. **Metro bundler errors**
   - Check for JavaScript syntax errors in your code
   - Ensure all dependencies are installed (`npm install`)

3. **Cannot find Android SDK**
   - Install Android Studio and the Android SDK
   - Or manually set the `ANDROID_HOME` environment variable

4. **Device not detected**
   - For physical devices, ensure USB debugging is enabled
   - Accept the USB debugging prompt on your device
   - Try a different USB cable or port

5. **Gradle build failures**
   - Run `.\android-dev.ps1 clean` to clear caches
   - Check build.gradle files for errors
   - Check for Java version compatibility issues

For more detailed Android setup information, refer to [ANDROID_SETUP.md](./ANDROID_SETUP.md).
