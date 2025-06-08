import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';

const { width, height } = Dimensions.get('window');

// Particle component for background effect
const Particle: React.FC<{ style: any }> = ({ style }) => {
  return <View style={[styles.particle, style]} />;
};

const WelcomeScreen = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const shineAnim = useRef(new Animated.Value(-width)).current;
  // Generate random particles
  const particles = Array(15)
    .fill(0)
    .map((_, i) => {
      const size = Math.random() * 6 + 3;
      const opacity = Math.random() * 0.5 + 0.1;
      return {
        key: i,
        size,
        opacity,
        left: Math.random() * width,
        top: Math.random() * height,
        duration: Math.random() * 3000 + 2000,
      };
    });
    
  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start();
    
    // Continuous floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Subtle pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Shine effect animation
    const animateShine = () => {
      shineAnim.setValue(-width);
      Animated.timing(shineAnim, {
        toValue: width * 2,
        duration: 2500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        // Wait before repeating the animation
        setTimeout(animateShine, 3000);
      });
    };
      // Start shine animation with a delay
    setTimeout(animateShine, 1000);
  }, [fadeAnim, floatAnim, scaleAnim, shineAnim]);
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}>
      {/* Background pattern */}
      <View style={styles.patternContainer}>
        <Icon name="map" style={styles.patternIcon} />
      </View>
      
      {/* Particles for background effect */}
      {particles.map((particle) => (
        <Particle
          key={particle.key}
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            opacity: particle.opacity,
          }}
        />
      ))}

      {/* Animated logo container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}>        {/* Logo circle */}
        <View style={styles.logo}>
          <Icon name="building" style={styles.logoText} />
        </View>
        <Text style={styles.appName}>Business GO</Text>
        <Text style={styles.tagline}>İşletmenizi geliştirin!</Text>
      </Animated.View>

    {/* Start button with gradient and animation */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}>        <View style={styles.startButton}>
          <LinearGradient
            colors={['#F99F00', '#DB3069']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}>
            {/* Shine effect overlay */}
            <Animated.View
              style={[
                styles.shine,
                {
                  transform: [{ translateX: shineAnim }],
                }
              ]}
            />
            <TouchableOpacity 
              style={styles.touchableArea}
              activeOpacity={0.7}
              onPress={() => {
                // Button press animation
                Animated.sequence([
                  Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 100,
                    useNativeDriver: true,
                  }),
                  Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 100,
                    useNativeDriver: true,
                  }),
                  Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true,
                  })
                ]).start();
                
                console.log('Start button pressed');
              }}>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>Maceraya Başla</Text>
                <Icon name="arrow-right" style={styles.buttonIcon} />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 10,
  },
  startButton: {
    width: width * 0.8,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: height * 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },  buttonTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginRight: 10,
  },
  buttonIcon: {
    color: '#fff',
    fontSize: 16,
  },particle: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 50,
  },  shine: {
    position: 'absolute',
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ skewX: '-20deg' }],
    zIndex: 10,
  },
  patternContainer: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.05,
    overflow: 'hidden',
    zIndex: 1,
  },  patternIcon: {
    position: 'absolute',
    fontSize: 300,
    color: '#fff',
    top: height / 3,
    left: width / 4,
  },
  touchableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WelcomeScreen;
