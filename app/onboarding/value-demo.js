/**
 * Value Demo - Show what we'll find
 * @module app/onboarding/value-demo
 */

import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import Button from '../../components/Button';
import { trackEvent, AnalyticsEvents } from '../../services/analytics';

export default function ValueDemoScreen() {
  const router = useRouter();

  useEffect(() => {
    trackEvent(AnalyticsEvents.ONBOARDING_SCREEN_VIEWED, {
      screen: 'value-demo',
      step: 6
    });
  }, []);

  const moneySources = [
    { icon: '📧', title: 'Email Receipts', desc: 'Class action settlements', amount: '$127' },
    { icon: '🏦', title: 'Old Bank Accounts', desc: 'Unclaimed deposits', amount: '$340' },
    { icon: '💳', title: 'Overcharged Bills', desc: 'Hidden refunds', amount: '$89' },
    { icon: '🏢', title: 'Previous Employers', desc: 'Unclaimed paychecks', amount: '$215' },
    { icon: '🏠', title: 'Property & Utilities', desc: 'Forgotten deposits', amount: '$156' },
    { icon: '🎯', title: 'Tax Refunds', desc: 'Unclaimed returns', amount: '$420' },
  ];

  const handleContinue = () => {
    trackEvent('Value Demo Completed');
    router.push('/onboarding/quick-scan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '80%' }]} />
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          Here's what we'll{'\n'}search for you
        </Text>
        <Text style={styles.subheadline}>
          Most people have money in 3-7 places
        </Text>

        {/* Money Sources Grid */}
        <View style={styles.sourcesContainer}>
          {moneySources.map((source, index) => (
            <View key={index} style={styles.sourceCard}>
              <View style={styles.sourceIcon}>
                <Text style={styles.iconText}>{source.icon}</Text>
              </View>
              <View style={styles.sourceContent}>
                <Text style={styles.sourceTitle}>{source.title}</Text>
                <Text style={styles.sourceDesc}>{source.desc}</Text>
              </View>
              <Text style={styles.sourceAmount}>{source.amount}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Average Found</Text>
          <Text style={styles.totalAmount}>$1,347</Text>
          <Text style={styles.totalSubtext}>Per person in 2024</Text>
        </View>

        {/* CTA */}
        <Button
          title="Let's Find Your Money →"
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
                i <= 5 && styles.stepDotActive
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
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 40,
  },
  subheadline: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 24,
  },
  sourcesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  sourceContent: {
    flex: 1,
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  sourceDesc: {
    fontSize: 13,
    color: '#6B7280',
  },
  sourceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  totalContainer: {
    backgroundColor: '#10B98110',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#10B98130',
  },
  totalLabel: {
    fontSize: 14,
    color: '#047857',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  totalSubtext: {
    fontSize: 14,
    color: '#059669',
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
