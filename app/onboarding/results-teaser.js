/**
 * Results Teaser - Show potential total and tease more sources
 * @module app/onboarding/results-teaser
 */

import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import Button from '../../components/Button';
import { trackEvent, AnalyticsEvents } from '../../services/analytics';

export default function ResultsTeaserScreen() {
  const router = useRouter();

  useEffect(() => {
    trackEvent(AnalyticsEvents.ONBOARDING_SCREEN_VIEWED, {
      screen: 'results-teaser',
      step: 8
    });
  }, []);

  const confirmedSources = [
    { icon: '✓', name: 'Email Settlements', amount: '$239', status: 'confirmed' },
  ];

  const potentialSources = [
    { icon: '🏦', name: 'Unclaimed Property', amount: '$340-680', status: 'locked' },
    { icon: '💼', name: 'Previous Employers', amount: '$215-450', status: 'locked' },
    { icon: '🏠', name: 'Utility Deposits', amount: '$156-320', status: 'locked' },
    { icon: '💳', name: 'Overcharged Bills', amount: '$89-180', status: 'locked' },
    { icon: '🎯', name: 'Tax Refunds', amount: '$420-890', status: 'locked' },
    { icon: '📱', name: 'Unused Subscriptions', amount: '$67-120/mo', status: 'locked' },
  ];

  const handleContinue = () => {
    trackEvent('Results Teaser Viewed', {
      confirmedAmount: 239,
      potentialMin: 1287,
      potentialMax: 2640
    });
    router.push('/onboarding/paywall');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '90%' }]} />
        </View>

        {/* Confirmed Amount */}
        <View style={styles.confirmedContainer}>
          <Text style={styles.confirmedLabel}>Confirmed</Text>
          <Text style={styles.confirmedAmount}>$239</Text>
          <Text style={styles.confirmedSubtext}>Ready to claim now</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          But wait, there's more...
        </Text>
        <Text style={styles.subheadline}>
          Based on your profile, we estimate you have:
        </Text>

        {/* Potential Total */}
        <View style={styles.potentialContainer}>
          <Text style={styles.potentialLabel}>Estimated Total</Text>
          <Text style={styles.potentialAmount}>$1,526 - $2,879</Text>
          <Text style={styles.potentialSubtext}>In additional unclaimed money</Text>
        </View>

        {/* Confirmed Sources */}
        <Text style={styles.sectionTitle}>✓ Confirmed</Text>
        <View style={styles.sourcesContainer}>
          {confirmedSources.map((source, index) => (
            <View key={index} style={styles.confirmedSource}>
              <View style={styles.confirmedIcon}>
                <Text style={styles.confirmedIconText}>{source.icon}</Text>
              </View>
              <View style={styles.sourceContent}>
                <Text style={styles.sourceName}>{source.name}</Text>
              </View>
              <Text style={styles.confirmedSourceAmount}>{source.amount}</Text>
            </View>
          ))}
        </View>

        {/* Locked Sources */}
        <Text style={styles.sectionTitle}>🔒 Unlock to Search</Text>
        <View style={styles.sourcesContainer}>
          {potentialSources.map((source, index) => (
            <View key={index} style={styles.lockedSource}>
              <View style={styles.lockedIconContainer}>
                <Text style={styles.sourceEmoji}>{source.icon}</Text>
                <View style={styles.lockBadge}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              </View>
              <View style={styles.sourceContent}>
                <Text style={styles.lockedSourceName}>{source.name}</Text>
              </View>
              <Text style={styles.lockedSourceAmount}>{source.amount}</Text>
            </View>
          ))}
        </View>

        {/* Trust Banner */}
        <View style={styles.trustBanner}>
          <Text style={styles.trustText}>
            💰 Average user finds <Text style={styles.trustHighlight}>$1,847</Text>
          </Text>
        </View>

        {/* CTA */}
        <Button
          title="Unlock All Results →"
          onPress={handleContinue}
          style={styles.button}
        />

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          {[...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i <= 7 && styles.stepDotActive
              ]}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  confirmedContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  confirmedLabel: {
    fontSize: 14,
    color: '#047857',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  confirmedAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  confirmedSubtext: {
    fontSize: 14,
    color: '#059669',
  },
  headline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  potentialContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  potentialLabel: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  potentialAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 4,
  },
  potentialSubtext: {
    fontSize: 13,
    color: '#B45309',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  sourcesContainer: {
    gap: 10,
    marginBottom: 24,
  },
  confirmedSource: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  confirmedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  confirmedIconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sourceContent: {
    flex: 1,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  confirmedSourceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  lockedSource: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    opacity: 0.8,
  },
  lockedIconContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    marginRight: 12,
  },
  sourceEmoji: {
    fontSize: 28,
  },
  lockBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 10,
  },
  lockedSourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  lockedSourceAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  trustBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  trustText: {
    fontSize: 16,
    color: '#1E40AF',
    textAlign: 'center',
  },
  trustHighlight: {
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  button: {
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  stepDotActive: {
    backgroundColor: '#3B82F6',
  },
});
