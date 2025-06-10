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
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Background image fade animations
  const backgroundFade1 = useRef(new Animated.Value(1)).current;
  const backgroundFade2 = useRef(new Animated.Value(0)).current;
  const backgroundFade3 = useRef(new Animated.Value(0)).current;
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
    }).start();    // Continuous rotation for logo
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing animation for accent
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Background image fade transitions
    const fadeTransition = () => {
      Animated.sequence([
        // Fade to second background
        Animated.timing(backgroundFade1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundFade2, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        // Hold for 3 seconds
        Animated.delay(3000),
        // Fade to third background
        Animated.timing(backgroundFade2, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundFade3, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        // Hold for 3 seconds
        Animated.delay(3000),
        // Fade back to first background
        Animated.timing(backgroundFade3, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundFade1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        // Hold for 3 seconds
        Animated.delay(3000),
      ]).start(() => fadeTransition()); // Loop the transition
    };    // Start background transitions after initial animations
    setTimeout(() => fadeTransition(), 2000);
  }, [fadeAnim, slideUpAnim, scaleAnim, rotateAnim, pulseAnim, backgroundFade1, backgroundFade2, backgroundFade3]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        {/* Animated Background Gradient with Business Imagery */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}>
          {/* Full Screen Business Background Images */}        <Animated.View style={[styles.fullScreenBackground1, { opacity: backgroundFade1 }]}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200' }}
            style={styles.fullScreenBackgroundImage}
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View style={[styles.fullScreenBackground2, { opacity: backgroundFade2 }]}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg?auto=compress&cs=tinysrgb&w=1200' }}
            style={styles.fullScreenBackgroundImage}
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View style={[styles.fullScreenBackground3, { opacity: backgroundFade3 }]}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1200' }}
            style={styles.fullScreenBackgroundImage}
            resizeMode="cover"
          />
        </Animated.View>
        
        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />          {/* Content Container */}
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
            {/* Text Section */}
          <View style={styles.textSection}>
            <Text style={styles.appName}>RestaurantGO</Text>
            <Text style={styles.tagline}>Discover Amazing Restaurants</Text>
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
            </View>            {/* Social Login Options */}
            <View style={styles.socialLoginContainer}>              <TouchableOpacity 
                style={[styles.socialButton, styles.googleButton]}
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Google login pressed');
                }}>
                <View style={styles.googleTextContainer}>
                  <Text style={[styles.socialButtonText, { color: '#4285F4' }]}>G</Text>
                  <Text style={[styles.socialButtonText, { color: '#EA4335' }]}>o</Text>
                  <Text style={[styles.socialButtonText, { color: '#FBBC05' }]}>o</Text>
                  <Text style={[styles.socialButtonText, { color: '#4285F4' }]}>g</Text>
                  <Text style={[styles.socialButtonText, { color: '#34A853' }]}>l</Text>
                  <Text style={[styles.socialButtonText, { color: '#EA4335' }]}>e</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, styles.facebookButton]}
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Facebook login pressed');
                }}>
                <Text style={[styles.socialButtonText, { color: '#fff' }]}>Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, styles.appleButton]}
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Apple login pressed');
                }}>
                <Text style={[styles.socialButtonText, { color: '#fff' }]}>Apple</Text>
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
  },  logoRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    top: -10,
    left: -10,
  },
  logoRing2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    top: -20,
    left: -20,
  },logoText: {
    fontSize: 50,
    color: '#fff',
  },  logoAccent: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  accentText: {
    fontSize: 16,
    color: '#fff',
  },  textSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },  appName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    letterSpacing: 2,
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
  },  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 0,
  },socialButton: {
    width: 90,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },  appleButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 2,
  },  googleButton: {
    backgroundColor: '#ffffff',
    borderColor: '#dadce0',
    borderWidth: 2,
  },
  facebookButton: {
    backgroundColor: 'rgba(24, 119, 242, 0.9)',
    borderColor: 'rgba(24, 119, 242, 0.8)',
    borderWidth: 2,
  },  socialButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  googleTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },socialIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },  appleIcon: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  googleIcon: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4285F4',
    textAlign: 'center',
    textShadowColor: 'rgba(66, 133, 244, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },  facebookIcon: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  // Enhanced Logo Containers
  googleLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },  googleLogo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4285F4',
    textAlign: 'center',
    fontFamily: 'System',
    textShadowColor: 'rgba(66, 133, 244, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  // Enhanced Google Logo
  googleLogoMulticolor: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLogoBlue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4285F4',
    textAlign: 'center',
    fontFamily: 'System',
  },
  googleColorAccents: {
    position: 'absolute',
    top: 0,
    right: -2,
    flexDirection: 'row',
  },
  googleRedAccent: {
    width: 2,
    height: 8,
    backgroundColor: '#EA4335',
    marginRight: 1,
  },
  googleYellowAccent: {
    width: 2,
    height: 6,
    backgroundColor: '#FBBC05',
    marginRight: 1,
  },
  googleGreenAccent: {
    width: 2,
    height: 8,
    backgroundColor: '#34A853',
  },
  facebookLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },  facebookLogo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'System',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  facebookLogoAuth: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  appleLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },  appleLogo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  appleLogoAuth: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },guestButton: {
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
  },  activeDot: {
    backgroundColor: '#fff',
    width: 24,
    borderRadius: 12,
  },  // Full Screen Business Backgrounds
  fullScreenBackground1: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenBackground2: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenBackground3: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  backgroundTextOverlay: {
    position: 'absolute',
    top: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
  },backgroundOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  restaurantImage: {
    width: width * 0.7,
    height: height * 0.4,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  imageOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 15,
    padding: 20,
    marginTop: -80,
    width: width * 0.6,
  },
  largeBusinessIcon: {
    fontSize: 120,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    marginBottom: 20,
  },
  backgroundTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    marginBottom: 10,
  },
  backgroundSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    maxWidth: width * 0.8,
    lineHeight: 24,
  },
});

export default WelcomeScreen;
