/**
 * Welcome screen - Emotional hook
 * @module app/onboarding/welcome
 */

import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import Button from '../../components/Button';
import { trackEvent, AnalyticsEvents } from '../../services/analytics';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    trackEvent(AnalyticsEvents.ONBOARDING_STARTED);
    trackEvent(AnalyticsEvents.ONBOARDING_SCREEN_VIEWED, {
      screen: 'welcome',
      step: 1
    });
  }, []);

  const handleContinue = () => {
    trackEvent(AnalyticsEvents.ONBOARDING_SCREEN_VIEWED, {
      screen: 'welcome',
      action: 'continue'
    });
    router.push('/onboarding/problem');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Text style={styles.moneyEmoji}>💰</Text>
        </View>

        {/* Headline - Emotional Hook */}
        <Text style={styles.headline}>
          Companies Owe You{'\n'}
          <Text style={styles.highlight}>$1,847</Text>
        </Text>

        {/* Subheadline */}
        <Text style={styles.subheadline}>
          The average American has unclaimed money from 7 different sources
        </Text>

        {/* Social Proof */}
        <View style={styles.socialProof}>
          <Text style={styles.socialProofText}>
            💰 $247M found for users in 2024
          </Text>
        </View>

        {/* CTA Button */}
        <Button
          title="Find My Money →"
          onPress={handleContinue}
          style={styles.button}
        />

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {[...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i === 0 && styles.progressDotActive
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#10B98120',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  moneyEmoji: {
    fontSize: 60,
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 40,
  },
  highlight: {
    color: '#10B981',
    fontSize: 40,
  },
  subheadline: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  socialProof: {
    backgroundColor: '#3B82F610',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
  },
  socialProofText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginBottom: 32,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: '#3B82F6',
    width: 24,
  },
});