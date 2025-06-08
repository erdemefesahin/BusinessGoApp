import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequential animations for a smooth entrance
    Animated.sequence([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Scale up logo
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // Slide up button
    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 1200,
      delay: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    // Continuous rotation for logo
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim, slideUpAnim, scaleAnim, rotateAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Animated Background Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}>
        
        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
        
        {/* Content Container */}
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          
          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoSection,
              {
                transform: [
                  { scale: scaleAnim },
                  {
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Text style={styles.logoText}>🚀</Text>
              </View>
              <View style={styles.logoRing} />
            </View>
          </Animated.View>
          
          {/* Text Section */}
          <View style={styles.textSection}>
            <Text style={styles.appName}>BusinessGO</Text>
            <Text style={styles.tagline}>Empowering your business success</Text>
            <Text style={styles.subtitle}>
              Transform your ideas into profitable ventures
            </Text>
          </View>
            {/* Button Section */}
          <Animated.View
            style={[
              styles.buttonSection,
              {
                transform: [{ translateY: slideUpAnim }],
              },
            ]}>
            
            {/* Register Button */}
            <TouchableOpacity
              style={styles.registerButton}
              activeOpacity={0.8}
              onPress={() => {
                console.log('Welcome screen - Register button pressed');
              }}>
              <LinearGradient
                colors={['#ff6b6b', '#ff8e53']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Create Account</Text>
                <View style={styles.buttonArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            {/* Login Button */}
            <TouchableOpacity 
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={() => {
                console.log('Welcome screen - Login button pressed');
              }}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
            
            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>
            
            {/* Social Login Options */}
            <View style={styles.socialLoginContainer}>
              <TouchableOpacity 
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Google login pressed');
                }}>
                <Text style={styles.socialIcon}>G</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Facebook login pressed');
                }}>
                <Text style={styles.socialIcon}>f</Text>
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Apple login pressed');
                }}>
                <Text style={styles.socialIcon}>🍎</Text>
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>
            
            {/* Guest Access */}
            <TouchableOpacity 
              style={styles.guestButton}
              activeOpacity={0.8}
              onPress={() => {
                console.log('Guest access pressed');
              }}>
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
            
          </Animated.View>
          
        </Animated.View>
        
        {/* Bottom Indicator */}
        <View style={styles.bottomIndicator}>
          <View style={styles.indicatorDot} />
          <View style={[styles.indicatorDot, styles.activeDot]} />
          <View style={styles.indicatorDot} />
        </View>
        
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    width: width,
    height: height,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: height * 0.1,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: height * 0.3,
    left: -75,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: height * 0.5,
    right: width * 0.1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  logoSection: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  logoRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    top: -10,
    left: -10,
  },
  logoText: {
    fontSize: 50,
    color: '#fff',
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  tagline: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },  buttonSection: {
    alignItems: 'center',
    width: '100%',
  },
  registerButton: {
    width: width * 0.8,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  loginButton: {
    width: width * 0.8,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButton: {
    width: width * 0.8,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginHorizontal: 15,
    fontWeight: '500',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  socialButton: {
    width: 80,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  socialText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  guestButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 10,
  },
  guestButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
    borderRadius: 12,
  },
});

export default WelcomeScreen;
