# Business GO App - Android Deployment Guide

This guide explains the complete Android deployment workflow for BusinessGoApp, including troubleshooting common issues.

## Overview

The BusinessGoApp Android deployment process involves several steps that have been automated in a single script:

1. Environment setup (Java, Android SDK)
2. Gradle cache cleaning
3. Starting the Android emulator
4. Launching Metro bundler
5. Building and installing the app
6. Launching the app
7. Optional log viewing

## Using the Deployment Script

We've created a comprehensive script `deploy-android.ps1` that handles the complete deployment process.

### Basic Usage

To deploy the app with default settings (debug build on emulator):

```powershell
.\deploy-android-simple.ps1
```

### Script Options

The script accepts several parameters to customize the deployment:

| Option | Description |
|--------|-------------|
| `-Target` | Specify "emulator" or "device" (default: "emulator") |
| `-BuildType` | Specify "debug" or "release" (default: "debug") |
| `-CleanCache` | When specified, cleans Gradle caches (default: true) |
| `-ResetMetroCache` | When specified, resets Metro bundler cache (default: false) |
| `-Verbose` | When specified, shows detailed logs (default: false) |

### Examples

```powershell
# Deploy to a physical device
.\deploy-android-simple.ps1 -Target device

# Build a release version
.\deploy-android-simple.ps1 -BuildType release

# Deploy with clean caches and verbose logging
.\deploy-android-simple.ps1 -CleanCache -Verbose

# Deploy with Metro cache reset (when having JS bundling issues)
.\deploy-android-simple.ps1 -ResetMetroCache
```

### VS Code Integration

For convenience, we've added a VS Code task that runs the deployment script:

1. Press `Ctrl+Shift+P` and select "Tasks: Run Task"
2. Choose "Android: Complete Deployment"

## Troubleshooting Common Issues

The deployment script includes automatic error detection and solutions for common issues:

### Metro Bundler Issues

**Symptoms:**
- "Failed to create bundle" error
- JS compilation errors

**Solutions:**
1. Check your JavaScript code for syntax errors
2. Run with Metro cache reset: `.\deploy-android.ps1 -ResetMetroCache`

### Gradle Build Errors

**Symptoms:**
- "FAILURE: Build failed" message
- Java compilation errors

**Solutions:**
1. Clean project: `.\deploy-android.ps1 -CleanCache`
2. Check `android/build.gradle` and `android/app/build.gradle` for errors
3. Update Gradle in `android/gradle/wrapper/gradle-wrapper.properties`

### Java Compatibility Issues

**Symptoms:**
- "Unable to make field" errors
- Reflection-related errors

**Solutions:**
1. Make sure Java 11 is being used (check JAVA_HOME)
2. Clean project caches: `.\deploy-android.ps1 -CleanCache`

### App Installation Issues

**Symptoms:**
- "Could not install" error
- App crashes immediately after launch

**Solutions:**
1. Close the app if it's already running
2. Uninstall the app manually and try again
3. Check device storage space

## Advanced Deployment Options

For advanced deployment scenarios such as configuring keystore signing, creating Play Store bundles, or deploying to specific device types, refer to:

1. `ANDROID_WORKFLOW.md` - Complete Android workflow automation documentation
2. `ANDROID_SETUP.md` - Initial environment setup and configuration

## Deployment Process Technical Details

The deployment script includes several safeguards and optimizations:

- **Error detection**: The script detects common build and installation errors and provides targeted solutions
- **Auto-recovery**: For certain errors, the script can automatically retry with adjusted settings
- **Environment detection**: Java and Android SDK paths are automatically detected
- **Multi-device support**: Works with both emulators and physical devices
- **Dependency verification**: Ensures all required tools and libraries are available

This comprehensive approach ensures a smoother development experience by handling common issues automatically.
