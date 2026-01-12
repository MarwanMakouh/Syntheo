import { useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

export function Toast({ visible, message, type = 'success', duration = 3000, onHide }: ToastProps) {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        // Fade out
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <MaterialIcons name="check-circle" size={24} color={Colors.success} />;
      case 'error':
        return <MaterialIcons name="error" size={24} color={Colors.danger} />;
      case 'warning':
        return <MaterialIcons name="warning" size={24} color={Colors.warning} />;
      case 'info':
        return <MaterialIcons name="info" size={24} color={Colors.info} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.successBackground;
      case 'error':
        return Colors.dangerBackground;
      case 'warning':
        return Colors.warningBackground;
      case 'info':
        return Colors.infoBackground;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'error':
        return Colors.danger;
      case 'warning':
        return Colors.warning;
      case 'info':
        return Colors.info;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          backgroundColor: getBackgroundColor(),
          borderLeftColor: getBorderColor(),
        }
      ]}
    >
      <View style={styles.content}>
        {getIcon()}
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    ...Platform.select({
      web: {
        top: 20,
        right: 20,
        maxWidth: 400,
      },
      default: {
        top: 60,
        left: Spacing.lg,
        right: Spacing.lg,
      },
    }),
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  message: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
});
