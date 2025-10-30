/**
 * Onboarding layout
 * @module app/onboarding/_layout
 */

import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="problem" />
      <Stack.Screen name="personalization-1" />
      <Stack.Screen name="personalization-2" />
      <Stack.Screen name="personalization-3" />
      <Stack.Screen name="value-demo" />
      <Stack.Screen name="quick-scan" />
      <Stack.Screen name="results-teaser" />
      <Stack.Screen name="paywall" />
    </Stack>
  );
}