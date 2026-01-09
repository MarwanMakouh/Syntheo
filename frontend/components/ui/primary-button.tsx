import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  label, 
  onPress, 
  disabled = false,
  loading = false,
  icon,
  style,
  variant = 'primary',
}) => {
  const getButtonStyle = () => {
    if (disabled) return styles.buttonDisabled;
    switch (variant) {
      case 'secondary':
        return styles.buttonSecondary;
      case 'danger':
        return styles.buttonDanger;
      default:
        return styles.buttonPrimary;
    }
  };

  const getTextStyle = () => {
    if (disabled) return styles.textDisabled;
    if (variant === 'secondary') return styles.textSecondary;
    return styles.textPrimary;
  };

  return (
    <TouchableOpacity 
      style={[styles.button, getButtonStyle(), style]} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? Colors.textSecondary : Colors.textOnPrimary} />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.buttonSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonDanger: {
    backgroundColor: Colors.error,
  },
  buttonDisabled: {
    backgroundColor: Colors.buttonDisabled,
  },
  textPrimary: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  textSecondary: {
    color: Colors.buttonSecondaryText,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  textDisabled: {
    color: Colors.textDisabled,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
