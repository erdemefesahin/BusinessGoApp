# Business GO App

A gamified business application with Pokemon GO style design. This app helps business owners track and grow their business in a fun, engaging way.

## Features

- Modern UI with Pokemon GO-inspired design
- Gradient backgrounds and animated components
- Gamification with XP, levels, and achievements
- Business task management with rewards
- Animated splash and welcome screens

## Project Structure

```
src/
  ├── components/        # Reusable UI components
  ├── hooks/             # Custom React hooks
  ├── navigation/        # Navigation types and configurations
  ├── screens/           # App screens
  ├── services/          # API and backend services
  ├── theme/             # Theme configuration and styling
  ├── types/             # TypeScript type definitions
  └── utils/             # Helper functions and utilities
```

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native environment set up
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Clone the repo
```sh
git clone https://github.com/yourusername/BusinessGoApp.git
cd BusinessGoApp
```

2. Install dependencies
```sh
npm install
```

## Development Toolkits

### Android Deployment (Recommended)

For a complete Android deployment experience, use our comprehensive deployment script:

```sh
# Deploy to emulator (default)
.\deploy-android-simple.ps1

# Deploy to physical device
.\deploy-android-simple.ps1 -Target device
```

For more information about deployment options and troubleshooting, see [ANDROID_DEPLOYMENT.md](./ANDROID_DEPLOYMENT.md).

### Quick Start (Alternative)

The easiest way to start development is using our user-friendly launcher:

```
.\dev.bat
```

This provides an interactive menu to select your platform and development tasks.

### Android Development

```powershell
# All-in-one development toolkit
.\android-dev.ps1 [command] [options]

# Quick commands:
.\android-dev.ps1 run        # Run on emulator
.\android-dev.ps1 device     # Run on physical device
.\android-dev.ps1 build      # Build the app
.\android-dev.ps1 clean      # Clean project
```

See [ANDROID_WORKFLOW.md](./ANDROID_WORKFLOW.md) for comprehensive documentation on Android development.

### iOS Development

```powershell
# All-in-one iOS development toolkit
.\ios-dev.ps1 [command] [options]

# Quick commands:
.\ios-dev.ps1 run        # Run on simulator
.\ios-dev.ps1 device     # Run on physical device
.\ios-dev.ps1 pods       # Update CocoaPods
.\ios-dev.ps1 build      # Build the app
```

See [IOS_WORKFLOW.md](./IOS_WORKFLOW.md) for comprehensive documentation on iOS development.

### Manual Method

If you prefer not to use the automation scripts:

```sh
# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

For a complete overview of all development workflows, see [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md).

## Development

The app uses TypeScript for type safety and follows a component-based architecture. The main screens are:

1. **SplashScreen**: Initial loading screen with animations
2. **WelcomeScreen**: Pokemon GO-style welcome screen with gradients and animations
3. (Future) **DashboardScreen**: Main hub for business activities
4. (Future) **TasksScreen**: Gamified task management
5. (Future) **AchievementsScreen**: Business achievements and rewards

## Dependencies

- react-native
- react-native-linear-gradient
- react-native-reanimated
- react-native-vector-icons

## Project Status

This project is in active development. Current focus:

- Implementing core UI components
- Setting up navigation
- Developing gamification features

## License

This project is licensed under the MIT License
