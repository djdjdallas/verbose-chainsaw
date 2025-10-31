/**
 * Root Layout - Main app entry point
 * @module app/_layout
 */

import { Stack } from 'expo-router';
import { AppProvider } from '../contexts/AppContext';
import { ToastProvider } from '../contexts/ToastContext';
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
      <ToastProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="tabs" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen
            name="money-detail/[id]"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="claim-form/[id]"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
      </ToastProvider>
    </AppProvider>
  );
}