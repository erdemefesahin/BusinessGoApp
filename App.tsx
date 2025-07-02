import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

// Import our screens
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreenNew';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreenGameified';
import BusinessMapScreen from './src/screens/BusinessMapScreen';
import DailyTasksScreen from './src/screens/DailyTasksScreen';
import MyBusinessScreen from './src/screens/MyBusinessScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AvatarCustomizationScreen, { AvatarConfig } from './src/screens/AvatarCustomizationScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

type ScreenType = 'splash' | 'welcome' | 'register' | 'login' | 'main' | 'avatar' | 'map' | 'dailyTasks' | 'myBusiness' | 'leaderboard' | 'analytics' | 'progress' | 'settings';

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [userAvatar, setUserAvatar] = useState<AvatarConfig>({
    face: '😊',
    hairColor: '#8B4513',
    skinColor: '#FFE4B5',
    shirtColor: '#4169E1',
    pantsColor: '#2F4F4F',
    accessory: '',
    gender: 'male',
  });

  const handleSplashFinish = () => {
    setCurrentScreen('welcome');
  };

  const handleNavigateToRegister = () => {
    setCurrentScreen('register');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleLogout = () => {
    setCurrentScreen('welcome');
  };

  const handleCustomizeAvatar = () => {
    setCurrentScreen('avatar');
  };

  const handleBackFromAvatar = () => {
    setCurrentScreen('main');
  };

  const handleSaveAvatar = (avatar: AvatarConfig) => {
    setUserAvatar(avatar);
    setCurrentScreen('main');
  };

  const handleRegister = () => {
    setCurrentScreen('main');
  };

  const handleLogin = () => {
    setCurrentScreen('main');
  };

  const handleGuestLogin = () => {
    setCurrentScreen('main');
  };

  const handleNavigateToMap = () => {
    setCurrentScreen('map');
  };

  const handleBackFromMap = () => {
    setCurrentScreen('main');
  };

  const handleNavigateToDailyTasks = () => {
    setCurrentScreen('dailyTasks');
  };

  const handleBackFromDailyTasks = () => {
    setCurrentScreen('main');
  };

  const handleNavigateToMyBusiness = () => {
    setCurrentScreen('myBusiness');
  };

  const handleBackFromMyBusiness = () => {
    setCurrentScreen('main');
  };

  const handleNavigateToLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  const handleBackFromLeaderboard = () => {
    setCurrentScreen('main');
  };

  const handleNavigateToAnalytics = () => {
    setCurrentScreen('analytics');
  };

  const handleBackFromAnalytics = () => {
    setCurrentScreen('main');
  };

  const handleNavigateToProgress = () => {
    setCurrentScreen('progress');
  };

  const handleBackFromProgress = () => {
    setCurrentScreen('main');
  };

  const handleNavigateToSettings = () => {
    setCurrentScreen('settings');
  };

  const handleBackFromSettings = () => {
    setCurrentScreen('main');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'welcome':
        return (
          <WelcomeScreen 
            onNavigateToRegister={handleNavigateToRegister}
            onNavigateToLogin={handleNavigateToLogin}
            onGuestLogin={handleGuestLogin}
          />
        );
      case 'register':
        return (
          <RegisterScreen 
            onBack={handleBackToWelcome}
            onRegister={handleRegister}
          />
        );
      case 'login':
        return (
          <LoginScreen 
            onBack={handleBackToWelcome}
            onLogin={handleLogin}
            onNavigateToRegister={handleNavigateToRegister}
          />
        );
      case 'main':
        return (
          <ErrorBoundary>
            <HomeScreen 
              onLogout={handleLogout}
              onNavigateToMap={handleNavigateToMap}
              onNavigateToDailyTasks={handleNavigateToDailyTasks}
              onNavigateToMyBusiness={handleNavigateToMyBusiness}
              onNavigateToLeaderboard={handleNavigateToLeaderboard}
              onNavigateToAnalytics={handleNavigateToAnalytics}
              onNavigateToProgress={handleNavigateToProgress}
              onNavigateToSettings={handleNavigateToSettings}
            />
          </ErrorBoundary>
        );
      case 'map':
        return (
          <ErrorBoundary>
            <BusinessMapScreen onBack={handleBackFromMap} />
          </ErrorBoundary>
        );
      case 'dailyTasks':
        return (
          <ErrorBoundary>
            <DailyTasksScreen onBack={handleBackFromDailyTasks} />
          </ErrorBoundary>
        );
      case 'myBusiness':
        return (
          <ErrorBoundary>
            <MyBusinessScreen onBack={handleBackFromMyBusiness} />
          </ErrorBoundary>
        );
      case 'leaderboard':
        return (
          <ErrorBoundary>
            <LeaderboardScreen onBack={handleBackFromLeaderboard} />
          </ErrorBoundary>
        );
      case 'analytics':
        return (
          <ErrorBoundary>
            <AnalyticsScreen onBack={handleBackFromAnalytics} />
          </ErrorBoundary>
        );
      case 'progress':
        return (
          <ErrorBoundary>
            <ProgressScreen onBack={handleBackFromProgress} />
          </ErrorBoundary>
        );
      case 'settings':
        return (
          <ErrorBoundary>
            <SettingsScreen onBack={handleBackFromSettings} />
          </ErrorBoundary>
        );
      case 'avatar':
        return (
          <AvatarCustomizationScreen
            onBack={handleBackFromAvatar}
            onSaveAvatar={handleSaveAvatar}
            currentAvatar={userAvatar}
          />
        );
      default:
        return <WelcomeScreen onNavigateToRegister={handleNavigateToRegister} onNavigateToLogin={handleNavigateToLogin} onGuestLogin={handleGuestLogin} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
