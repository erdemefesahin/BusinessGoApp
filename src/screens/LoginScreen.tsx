import React, { useState, useRef, useEffect } from 'react';
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
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onBack: () => void;
  onLogin: (credentials: any) => void;
  onNavigateToRegister: () => void;
}

const LoginScreen = ({ onBack, onLogin, onNavigateToRegister }: LoginScreenProps) => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  // Background image fade animations
  const backgroundFade1 = useRef(new Animated.Value(1)).current;
  const backgroundFade2 = useRef(new Animated.Value(0)).current;
  const backgroundFade3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 1200,
      delay: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    // Background transitions
    const fadeTransition = () => {
      Animated.sequence([
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
        Animated.delay(3000),
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
        Animated.delay(3000),
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
        Animated.delay(3000),
      ]).start(() => fadeTransition());
    };

    setTimeout(() => fadeTransition(), 2000);
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
    };    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email address is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      console.log('Login pressed with data:', formData);
      onLogin(formData);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}>
        
        {/* Background Images */}
        <Animated.View style={[styles.fullScreenBackground1, { opacity: backgroundFade1 }]}>
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
        <View style={styles.decorativeCircle3} />

        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            
            <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
              
              {/* Header Section */}
              <Animated.View 
                style={[
                  styles.headerSection,
                  { transform: [{ scale: scaleAnim }] }
                ]}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                  <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                  <Text style={styles.title}>Sign In</Text>
                <Text style={styles.subtitle}>Sign in to your RestaurantGO account</Text>
              </Animated.View>

              {/* Form Section */}
              <Animated.View
                style={[
                  styles.formSection,
                  { transform: [{ translateY: slideUpAnim }] }
                ]}>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[styles.textInput, errors.email ? styles.inputError : null]}
                    placeholder="email@example.com"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={formData.email}
                    onChangeText={(text) => updateFormData('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                </View>                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={[styles.textInput, errors.password ? styles.inputError : null]}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={formData.password}
                    onChangeText={(text) => updateFormData('password', text)}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                  {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.loginButton}
                  activeOpacity={0.8}
                  onPress={handleLogin}>
                  <LinearGradient
                    colors={['#ff6b6b', '#ff8e53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Sign In</Text>
                    <View style={styles.buttonArrow}>
                      <Text style={styles.arrowText}>→</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Login Options */}
                <View style={styles.socialContainer}>
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.googleButton]}
                    activeOpacity={0.8}
                    onPress={() => console.log('Google login pressed')}>
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
                    onPress={() => console.log('Facebook login pressed')}>
                    <Text style={[styles.socialButtonText, { color: '#fff' }]}>Facebook</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.appleButton]}
                    activeOpacity={0.8}
                    onPress={() => console.log('Apple login pressed')}>
                    <Text style={[styles.socialButtonText, { color: '#fff' }]}>Apple</Text>
                  </TouchableOpacity>
                </View>                {/* Register Link */}
                <View style={styles.registerLinkContainer}>
                  <Text style={styles.registerLinkText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={onNavigateToRegister}>
                    <Text style={styles.registerLink}>Create Account</Text>
                  </TouchableOpacity>
                </View>

              </Animated.View>
              
            </Animated.View>
            
          </ScrollView>
          
        </KeyboardAvoidingView>
        
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  // Background Images
  fullScreenBackground1: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  fullScreenBackground2: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  fullScreenBackground3: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  fullScreenBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  // Decorative Elements
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
  // Content
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
    justifyContent: 'center',
    minHeight: height * 0.8,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 50,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  // Form
  formSection: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#fff',
  },
  inputError: {
    borderColor: '#ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 10,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  // Buttons
  loginButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonGradient: {
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
  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
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
  // Social Buttons
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  socialButton: {
    width: 90,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderColor: '#dadce0',
  },
  facebookButton: {
    backgroundColor: 'rgba(24, 119, 242, 0.9)',
    borderColor: 'rgba(24, 119, 242, 0.8)',
  },
  appleButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  googleTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Register Link
  registerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  registerLinkText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  registerLink: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
