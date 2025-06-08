import { useRef } from 'react';
import { Animated, Easing } from 'react-native';

type AnimationConfig = {
  duration?: number;
  easing?: any;
  delay?: number;
  useNativeDriver?: boolean;
};

export const useAnimatedValue = (initialValue: number = 0) => {
  return useRef(new Animated.Value(initialValue)).current;
};

export const useFadeInAnimation = (value: Animated.Value, config?: AnimationConfig) => {
  const fadeIn = () => {
    Animated.timing(value, {
      toValue: 1,
      duration: config?.duration || 500,
      easing: config?.easing || Easing.ease,
      delay: config?.delay || 0,
      useNativeDriver: config?.useNativeDriver !== undefined ? config.useNativeDriver : true,
    }).start();
  };

  return fadeIn;
};

export const usePulseAnimation = (value: Animated.Value, config?: AnimationConfig) => {
  const pulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1.05,
          duration: config?.duration || 1000,
          easing: config?.easing || Easing.inOut(Easing.ease),
          useNativeDriver: config?.useNativeDriver !== undefined ? config.useNativeDriver : true,
        }),
        Animated.timing(value, {
          toValue: 0.95,
          duration: config?.duration || 1000,
          easing: config?.easing || Easing.inOut(Easing.ease),
          useNativeDriver: config?.useNativeDriver !== undefined ? config.useNativeDriver : true,
        }),
      ])
    ).start();
  };

  return pulse;
};
