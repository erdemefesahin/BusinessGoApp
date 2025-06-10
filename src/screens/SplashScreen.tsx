import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    // Simple fade in animation for text
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Wait a bit then finish
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 1500);
    });
  }, []);

  return (    <LinearGradient
      colors={['#8B4513', '#CD853F', '#DEB887']}
      style={styles.container}>      <View style={styles.content}>
        <Animated.View
          style={{
            opacity: opacityAnim,
          }}>          <Text style={styles.title}>RestaurantGO</Text>
          <Text style={styles.subtitle}>Discover Amazing Restaurants!</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});

export default SplashScreen;
