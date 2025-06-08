# Business GO App - iOS Workflow Automation

This document provides a detailed guide for using the iOS development automation tools included with Business GO App.

## Overview

The `ios-dev.ps1` script provides a comprehensive toolkit for iOS development of Business GO App. It simplifies the setup, building, and deployment processes while providing troubleshooting capabilities.

## Prerequisites

- macOS (required for most iOS development tasks)
- Xcode installed and configured
- Apple Developer account (for device testing and App Store submissions)
- Node.js and npm

## Basic Usage

```powershell
.\ios-dev.ps1 [command] [options]
```

## Available Commands

| Command | Description |
|---------|-------------|
| `setup` | Configure your iOS development environment |
| `run` | Run the app on an iOS simulator |
| `build` | Build the app without running it |
| `clean` | Clean project caches and build files |
| `pods` | Update CocoaPods dependencies |
| `simulator` | List and start iOS simulators |
| `archive` | Create an archive for App Store submission |
| `device` | Run the app on a connected iOS device |
| `troubleshoot` | Run diagnostics on your environment |
| `help` | Show help information |

## Command Options

| Option | Description |
|--------|-------------|
| `-BuildMode` | Specify 'debug' or 'release' (default: debug) |
| `-ResetCache` | Reset Metro bundler and pod caches |
| `-Simulator` | Specify the simulator to use (e.g. 'iPhone 15 Pro') |
| `-Verbose` | Show detailed information during execution |

## Common Workflows

### First-time Setup

```powershell
# Setup your iOS development environment
.\ios-dev.ps1 setup

# Update CocoaPods dependencies
.\ios-dev.ps1 pods
```

### Daily Development

```powershell
# Run on simulator
.\ios-dev.ps1 run

# Specify a different simulator
.\ios-dev.ps1 run -Simulator "iPhone 14"

# Run on a physical device
.\ios-dev.ps1 device
```

### Building and Cleaning

```powershell
# Clean the project
.\ios-dev.ps1 clean

# Clean and reset all caches
.\ios-dev.ps1 clean -ResetCache

# Build for debugging
.\ios-dev.ps1 build

# Build for release
.\ios-dev.ps1 build -BuildMode release
```

### App Store Submission

```powershell
# Create an archive for App Store submission
.\ios-dev.ps1 archive
```

## Feature Details

### Environment Setup

The `setup` command installs and configures:
- Homebrew (on macOS)
- CocoaPods
- Dependencies via Pod installation

```powershell
.\ios-dev.ps1 setup
```

### CocoaPods Management

The script handles CocoaPods installation and dependency management:

```powershell
# Update pods only
.\ios-dev.ps1 pods
```

### Simulator Management

List and launch iOS simulators:

```powershell
# List available simulators
.\ios-dev.ps1 simulator

# Start a specific simulator
.\ios-dev.ps1 simulator -Simulator "iPad Pro (12.9-inch)"
```

### Build Configuration

Build the app without running it:

```powershell
# Debug build
.\ios-dev.ps1 build

# Release build
.\ios-dev.ps1 build -BuildMode release
```

### Physical Device Testing

Run on connected iOS devices:

```powershell
.\ios-dev.ps1 device
```

### Archive Creation

Create an App Store ready archive:

```powershell
.\ios-dev.ps1 archive
```

This will:
1. Build the app in Release mode
2. Create an Xcode archive
3. Export the archive to an IPA file
4. Prepare it for App Store submission

## Troubleshooting

Run the troubleshooting tool to diagnose common issues:

```powershell
.\ios-dev.ps1 troubleshoot
```

The troubleshooter checks:
- Xcode installation and version
- CocoaPods installation
- Node.js and Watchman setup
- iOS project structure
- Ruby version
- Available iOS simulators

## Windows Development Limitations

When developing on Windows:
- Most iOS-specific commands require macOS
- The script will detect when it's running on Windows and provide guidance
- For iOS development on Windows, consider using a macOS virtual machine or a CI/CD service

## Tips and Best Practices

1. **Always keep pods updated**: Run `.\ios-dev.ps1 pods` after pulling new changes

2. **Clean when switching branches**: Run `.\ios-dev.ps1 clean` when switching between branches

3. **Reset cache for dependency issues**: Use `-ResetCache` when experiencing strange behavior

4. **Test on multiple simulators**: Verify your app works across different iOS devices

5. **Run troubleshoot first**: When facing issues, start with `.\ios-dev.ps1 troubleshoot`

## Common Issues and Solutions

### Pod installation fails
```
Error: Pod installation failed
```
**Solution**: Try running with administrative privileges or updating CocoaPods with `sudo gem install cocoapods`

### Build errors after updating dependencies
```
Error: Build failed with compilation errors
```
**Solution**: Clean the project and reset cache:
```powershell
.\ios-dev.ps1 clean -ResetCache
```

### App crashes on launch
**Solution**: Check Metro bundler logs and try resetting the cache:
```powershell
.\ios-dev.ps1 run -ResetCache
```

### Cannot connect to physical device
**Solution**: Ensure the device is:
1. Unlocked
2. Trusted on your computer
3. Has developer mode enabled

## Further Resources

- [React Native iOS Setup Guide](https://reactnative.dev/docs/environment-setup?platform=ios)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [CocoaPods Getting Started](https://guides.cocoapods.org/using/getting-started.html)
- [iOS Developer Program](https://developer.apple.com/programs/)
