import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/constants';

export default function DietenScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Diëten & Voorkeuren</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
});
