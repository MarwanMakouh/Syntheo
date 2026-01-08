import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadows, BorderRadius, FontSize, FontWeight } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { login as loginApi } from '@/Services/usersApi';

export default function LoginScreen() {
  const router = useRouter();
  const { setCurrentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Clear previous error
    setError('');

    // Validate inputs
    if (!email.trim()) {
      setError('Vul uw e-mailadres in');
      return;
    }

    if (!password) {
      setError('Vul uw wachtwoord in');
      return;
    }

    try {
      setIsLoading(true);

      // Call login API
      const user = await loginApi(email.trim(), password);

      // Set current user in context
      setCurrentUser(user);

      // Check if this is first login - redirect to change password
      if (user.first_login) {
        router.replace('/change-password');
        return;
      }

      // Navigate based on user role
      const role = user.role.toLowerCase();

      if (role.includes('beheerder') || role.includes('admin')) {
        router.replace('/admin/dashboard-home');
      } else if (role.includes('hoofdverpleegster') || role.includes('hoofd')) {
        router.replace('/dashboard');
      } else if (role.includes('keuken')) {
        router.replace('/(kitchen-tabs)/allergieen');
      } else if (role.includes('verpleegster') || role.includes('verpleger')) {
        router.replace('/(tabs)/bewoners');
      } else {
        // Default fallback
        router.replace('/(tabs)/bewoners');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login mislukt. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/syntheo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welkom bij Syntheo</Text>
          <Text style={styles.subtitle}>Meld u aan om verder te gaan</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mailadres</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="email" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="uw.email@syntheo.nl"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Wachtwoord</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Voer uw wachtwoord in"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={20} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.textOnPrimary} />
            ) : (
              <>
                <MaterialIcons name="login" size={20} color={Colors.textOnPrimary} />
                <Text style={styles.loginButtonText}>Aanmelden</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    ...Platform.select({
      web: {
        maxWidth: 500,
        marginHorizontal: 'auto',
        width: '100%',
      },
    }),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  logo: {
    width: 200,
    height: 80,
  },
  header: {
    marginBottom: Spacing['3xl'],
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: Spacing.xl,
  },
  inputContainer: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? Spacing.lg : Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  eyeIcon: {
    padding: Spacing.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.alertBackground,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.alertBorder,
  },
  errorText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    ...Shadows.button,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
