import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'large' 
}: LoadingSpinnerProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator 
        size={size} 
        color={primaryColor} 
        style={styles.spinner}
      />
      <Text style={[styles.message, { color: textColor }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});
