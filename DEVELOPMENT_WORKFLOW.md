# Business GO App - Development Workflow

This document serves as the main reference for developing the Business GO App across multiple platforms. It brings together the Android and iOS workflow tools and provides best practices for efficient development.

## Overview

Business GO App uses React Native to deliver a cross-platform experience with native performance. To streamline development, we've created specialized tools for both Android and iOS platforms.

## Development Tools

### Cross-Platform Development

- **React Native**: Core framework
- **TypeScript**: For type safety and better developer experience
- **Metro Bundler**: For JavaScript bundling and serving
- **Visual Studio Code**: Recommended IDE

### Platform-Specific Development

- **Android**: Android Studio, Android SDK, Gradle
- **iOS**: Xcode, CocoaPods, iOS Simulator

## Automation Scripts

We provide specialized automation scripts for each platform:

| Script | Platform | Purpose |
|--------|----------|---------|
| `android-dev.ps1` | Android | Complete Android development toolkit |
| `ios-dev.ps1` | iOS | Complete iOS development toolkit |
| `launch-android.ps1` | Android | Quick start for Android emulator |
| `troubleshoot-android.ps1` | Android | Diagnose Android environment issues |
| `dev.bat` | Both | User-friendly launcher menu |

## Visual Studio Code Integration

We've configured VSCode tasks to make development even easier. Press `Ctrl+Shift+B` to access the task runner, or open the Command Palette (`Ctrl+Shift+P`) and search for "Tasks".

Available tasks include:

- **Android**: Run, Build, Clean, Troubleshoot
- **iOS**: Run, Build, Clean, Update Pods
- **Metro**: Start, Reset Cache

The default build task (`Ctrl+Shift+B`) will run the Android app on an emulator.

## Development Workflow

### 1. Environment Setup

#### First-time Setup

```powershell
# Android setup
.\android-dev.ps1 setup

# iOS setup (requires macOS)
.\ios-dev.ps1 setup
```

This will configure your development environment with all necessary dependencies.

### 2. Daily Development

#### Running on Emulators/Simulators

```powershell
# Android
.\android-dev.ps1 run

# iOS
.\ios-dev.ps1 run
```

#### Running on Physical Devices

```powershell
# Android
.\android-dev.ps1 device

# iOS
.\ios-dev.ps1 device
```

### 3. Building and Testing

#### Building for Debug

```powershell
# Android
.\android-dev.ps1 build

# iOS
.\ios-dev.ps1 build
```

#### Building for Release

```powershell
# Android
.\android-dev.ps1 build -BuildType release

# iOS
.\ios-dev.ps1 build -BuildMode release
```

### 4. Cleaning Projects

When switching branches or experiencing build issues:

```powershell
# Android
.\android-dev.ps1 clean

# iOS
.\ios-dev.ps1 clean

# Deep clean with cache reset
.\android-dev.ps1 clean -ResetCache
.\ios-dev.ps1 clean -ResetCache
```

### 5. Troubleshooting

```powershell
# Android
.\android-dev.ps1 troubleshoot
# or
.\troubleshoot-android.ps1

# iOS
.\ios-dev.ps1 troubleshoot
```

### 6. App Distribution

#### Android

```powershell
# Create bundle for Play Store
.\android-dev.ps1 bundle
```

#### iOS

```powershell
# Create archive for App Store
.\ios-dev.ps1 archive
```

## Cross-Platform Best Practices

1. **Component Isolation**: Keep platform-specific code isolated using platform extensions (`Component.android.tsx` and `Component.ios.tsx`)

2. **Shared Business Logic**: Keep all business logic platform-agnostic

3. **Testing On Both Platforms**: Always test changes on both Android and iOS

4. **Platform-Specific Styling**: Use the platform module for conditional styling:

```typescript
import { Platform } from 'react-native';

const styles = {
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
};
```

5. **Platform-Specific Features**: Use feature detection rather than platform detection when possible

## Workflow Documentation

For detailed platform-specific workflows:

- [Android Development Workflow](./ANDROID_WORKFLOW.md)
- [iOS Development Workflow](./IOS_WORKFLOW.md)
- [Android Setup Guide](./ANDROID_SETUP.md)

## Project Architecture

### Screens

The app follows a screen-based architecture:

1. **SplashScreen**: Initial loading screen
2. **WelcomeScreen**: Main entry point with Pokemon GO style
3. **DashboardScreen**: (Future) Business metrics and overview
4. **TasksScreen**: (Future) Gamified business tasks
5. **AchievementsScreen**: (Future) Business accomplishments

### Components

Reusable components are stored in `src/components/` and follow atomic design principles:

- **Atoms**: Basic building blocks (buttons, inputs, icons)
- **Molecules**: Combinations of atoms (form fields, cards)
- **Organisms**: Complex UI sections (navigation bars, tab views)

### State Management

The app uses React's Context API for state management:

- **AppContext**: Global app state
- **UserContext**: User authentication and profile
- **TaskContext**: Business tasks and progress

## CI/CD Pipeline

(Future implementation)

- GitHub Actions for automated testing
- Fastlane for automated builds and deployments
- CodePush for OTA updates

## Getting Help

If you encounter issues not addressed by our troubleshooting tools:

1. Check the troubleshooting sections in the platform-specific workflow guides
2. Review React Native's [official documentation](https://reactnative.dev/docs/getting-started)
3. Search the [React Native GitHub issues](https://github.com/facebook/react-native/issues)
