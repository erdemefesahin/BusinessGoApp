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

### Running the App

#### Using Android Automation Tools

We've created powerful automation scripts to simplify Android development:

```powershell
# All-in-one development toolkit
.\android-dev.ps1 run

# Quick start script
.\launch-android.ps1

# Troubleshooting tool
.\troubleshoot-android.ps1
```

See [ANDROID_WORKFLOW.md](./ANDROID_WORKFLOW.md) for comprehensive documentation.

#### Manual Method

1. Start Metro
```sh
npm start
```

2. Run on Android
```sh
npm run android
```

3. Run on iOS
```sh
npm run ios
```

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
