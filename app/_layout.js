/**
 * Root Layout - Main app entry point
 * @module app/_layout
 */

import { Stack } from 'expo-router';
import { AppProvider } from '../contexts/AppContext';
import { useEffect } from 'react';
import { initAnalytics } from '../services/analytics';
import { initRevenueCat } from '../services/revenuecat';

export default function RootLayout() {
  useEffect(() => {
    // Initialize services
    initAnalytics();
    initRevenueCat();
  }, []);

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen
          name="money-detail/[id]"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Money Details'
          }}
        />
        <Stack.Screen
          name="claim-form/[id]"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Claim Form'
          }}
        />
      </Stack>
    </AppProvider>
  );
}