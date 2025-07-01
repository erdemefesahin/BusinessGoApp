import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const opacityAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    // Animated logo entrance
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Wait then finish
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 1800);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#7BB3F0', '#FFFFFF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              }
            ]}>
            
            {/* App Logo */}
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>🚀</Text>
            </View>
            
            <Text style={styles.title}>BusinessGo</Text>
            <Text style={styles.subtitle}>Grow Your Business, One Challenge at a Time</Text>
            
            {/* Loading indicator */}
            <View style={styles.loadingContainer}>
              <View style={styles.loadingBar}>
                <Animated.View 
                  style={[
                    styles.loadingProgress,
                    { opacity: opacityAnim }
                  ]} 
                />
              </View>
              <Text style={styles.loadingText}>Loading your business journey...</Text>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#546E7A',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 24,
    fontWeight: '500',
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loadingBar: {
    width: 200,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 15,
  },
  loadingProgress: {
    width: '70%',
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 14,
    color: '#546E7A',
    fontWeight: '500',
  },
});

export default SplashScreen;
