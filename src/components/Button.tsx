import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts, spacing, shadows } from '../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradient?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  gradient = false,
}) => {
  // Determine button styles based on type and size
  const getButtonStyle = () => {
    let buttonStyle: StyleProp<ViewStyle> = {
      ...styles.button,
      ...styles[`${size}Button`],
      ...shadows.medium,
    };

    if (type === 'outline') {
      buttonStyle = {
        ...buttonStyle,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
      };
    } else if (!gradient) {
      buttonStyle = {
        ...buttonStyle,
        backgroundColor: type === 'primary' ? colors.primary : colors.secondary,
      };
    }

    if (disabled) {
      buttonStyle = {
        ...buttonStyle,
        opacity: 0.6,
      };
    }

    return buttonStyle;
  };

  // Determine text color based on button type
  const getTextStyle = () => {
    let textColorStyle: TextStyle = {
      ...styles.text,
      ...styles[`${size}Text`],
    };

    if (type === 'outline') {
      textColorStyle = {
        ...textColorStyle,
        color: colors.primary,
      };
    }

    return textColorStyle;
  };

  // Render a gradient button if gradient is true
  const renderContent = () => {
    const content = (
      <>
        {loading ? (
          <ActivityIndicator color={type === 'outline' ? colors.primary : colors.white} size="small" />
        ) : (
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        )}
      </>
    );

    if (gradient && type !== 'outline') {
      return (
        <LinearGradient
          colors={
            type === 'primary'
              ? [colors.primaryLight, colors.primaryDark]
              : [colors.secondary, colors.secondaryDark]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientContainer}
        >
          {content}
        </LinearGradient>
      );
    }

    return content;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  smallButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minWidth: 80,
  },
  mediumButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minWidth: 120,
  },
  largeButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minWidth: 160,
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    ...fonts.bold,
  },
  smallText: {
    fontSize: fonts.sizes.sm,
  },
  mediumText: {
    fontSize: fonts.sizes.md,
  },
  largeText: {
    fontSize: fonts.sizes.lg,
  },
  gradientContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
});

export default Button;
