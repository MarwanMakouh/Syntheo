import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants';

interface PageHeaderProps {
  title: string;
  actionButton?: {
    label: string;
    onPress: () => void;
    icon?: React.ReactNode;
  };
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, actionButton }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.pageTitle}>{title}</Text>
      {actionButton && (
        <TouchableOpacity style={styles.actionButton} onPress={actionButton.onPress}>
          {actionButton.icon}
          <Text style={styles.actionButtonText}>{actionButton.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    ...Platform.select({
      web: {
        paddingBottom: Spacing.lg,
      },
    }),
  },
  pageTitle: {
    fontSize: FontSize['3xl'], // 28px
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  actionButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
