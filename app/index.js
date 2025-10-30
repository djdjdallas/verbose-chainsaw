/**
 * App entry point - handles initial routing
 * @module app/index
 */

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';

export default function Index() {
  const router = useRouter();
  const { state } = useApp();

  useEffect(() => {
    if (!state.isLoading) {
      // Check if user is authenticated and onboarding is complete
      if (state.user && state.onboardingComplete) {
        router.replace('/tabs');
      } else if (state.user && !state.onboardingComplete) {
        router.replace('/onboarding/welcome');
      } else {
        router.replace('/onboarding/welcome');
      }
    }
  }, [state.isLoading, state.user, state.onboardingComplete]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#10B981" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
});