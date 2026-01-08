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
import { Colors, Spacing, Typography, Shadows, BorderRadius, FontSize, FontWeight, API_BASE_URL } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    // Clear previous error
    setError('');

    // Validate inputs
    if (!oldPassword.trim()) {
      setError('Vul uw huidige wachtwoord in');
      return;
    }

    if (!newPassword.trim()) {
      setError('Vul uw nieuwe wachtwoord in');
      return;
    }

    if (newPassword.trim().length < 6) {
      setError('Nieuw wachtwoord moet minimaal 6 tekens bevatten');
      return;
    }

    if (!confirmPassword.trim()) {
      setError('Bevestig uw nieuwe wachtwoord');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Nieuwe wachtwoorden komen niet overeen');
      return;
    }

    if (oldPassword === newPassword) {
      setError('Nieuw wachtwoord moet verschillen van het huidige wachtwoord');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          user_id: currentUser?.user_id,
          old_password: oldPassword.trim(),
          new_password: newPassword.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Wachtwoord wijzigen mislukt');
      }

      // Update user in context to set first_login to false
      if (currentUser) {
        setCurrentUser({ ...currentUser, first_login: false });
      }

      // Navigate based on user role
      const role = currentUser?.role.toLowerCase() || '';
      if (role.includes('beheerder') || role.includes('admin')) {
        router.replace('/admin/dashboard-home');
      } else if (role.includes('hoofdverpleegster') || role.includes('hoofd')) {
        router.replace('/dashboard');
      } else if (role.includes('keuken')) {
        router.replace('/(kitchen-tabs)/allergieen');
      } else if (role.includes('verpleegster') || role.includes('verpleger')) {
        router.replace('/(tabs)/bewoners');
      } else {
        router.replace('/(tabs)/bewoners');
      }
    } catch (err) {
      console.error('Change password error:', err);
      setError(err instanceof Error ? err.message : 'Wachtwoord wijzigen mislukt. Probeer het opnieuw.');
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
          <MaterialIcons name="lock-reset" size={64} color={Colors.primary} />
          <Text style={styles.title}>Wachtwoord Wijzigen</Text>
          <Text style={styles.subtitle}>
            Dit is uw eerste keer inloggen. Wijzig uw wachtwoord om door te gaan.
          </Text>
        </View>

        {/* Change Password Form */}
        <View style={styles.form}>
          {/* Old Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Huidig Wachtwoord</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Voer uw huidige wachtwoord in"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showOldPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowOldPassword(!showOldPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <MaterialIcons
                  name={showOldPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nieuw Wachtwoord</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Minimaal 6 tekens"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <MaterialIcons
                  name={showNewPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bevestig Nieuw Wachtwoord</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Herhaal nieuw wachtwoord"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <MaterialIcons
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'}
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

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleChangePassword}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.textOnPrimary} />
            ) : (
              <>
                <MaterialIcons name="check" size={20} color={Colors.textOnPrimary} />
                <Text style={styles.submitButtonText}>Wachtwoord Wijzigen</Text>
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
    marginBottom: Spacing['2xl'],
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
    marginTop: Spacing.md,
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
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    ...Shadows.button,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
