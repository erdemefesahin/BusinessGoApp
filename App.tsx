/**
 * Restaurant GO App
 * A gamified restaurant discovery application with Pokemon GO style
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';

// Import our screens
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate any initial data loading if needed
  useEffect(() => {
    // You can add any app initialization logic here
    // such as loading user data, checking authentication, etc.
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {isLoading ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <WelcomeScreen />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
