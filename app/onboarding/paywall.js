/**
 * Paywall screen - Optimized for conversion
 * @module app/onboarding/paywall
 */

import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { trackEvent, AnalyticsEvents } from '../../services/analytics';
import { useApp } from '../../contexts/AppContext';

export default function PaywallScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading, setLoading] = useState(false);

  // Mock found amount - in real app, this would come from the scan
  const foundAmount = '$1,847.32';

  useEffect(() => {
    trackEvent(AnalyticsEvents.PAYWALL_VIEWED, {
      screen: 'paywall',
      step: 10,
      foundAmount
    });
  }, []);

  const handleStartTrial = async () => {
    setLoading(true);
    trackEvent(AnalyticsEvents.TRIAL_STARTED, {
      plan: selectedPlan,
      foundAmount
    });

    // In real app, this would initiate RevenueCat purchase
    // For now, simulate success
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_ONBOARDING' });
      dispatch({ type: 'SET_SUBSCRIPTION', payload: { isActive: true, tier: selectedPlan } });
      router.replace('/tabs');
    }, 1500);
  };

  const handleSkip = () => {
    trackEvent('Paywall Skipped', { foundAmount });
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    router.replace('/tabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with found amount */}
        <View style={styles.header}>
          <Text style={styles.foundLabel}>We Found</Text>
          <Text style={styles.foundAmount}>{foundAmount}</Text>
          <Text style={styles.foundSubtext}>Ready to claim!</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          Unlock Your {foundAmount} Today
        </Text>
        <Text style={styles.subheadline}>
          Plus new money found weekly
        </Text>

        {/* Pricing Options */}
        <View style={styles.pricingContainer}>
          <TouchableOpacity
            style={[
              styles.pricingOption,
              selectedPlan === 'yearly' && styles.pricingOptionSelected
            ]}
            onPress={() => setSelectedPlan('yearly')}
            activeOpacity={0.7}
          >
            <View style={styles.pricingBadge}>
              <Text style={styles.badgeText}>BEST VALUE - 58% Savings</Text>
            </View>
            <Text style={styles.planTitle}>Annual</Text>
            <Text style={styles.planPrice}>$79.99/year</Text>
            <Text style={styles.planSubtext}>($6.67/month)</Text>
            {selectedPlan === 'yearly' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pricingOption,
              selectedPlan === 'monthly' && styles.pricingOptionSelected
            ]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.7}
          >
            <Text style={styles.planTitle}>Monthly</Text>
            <Text style={styles.planPrice}>$9.99/month</Text>
            <Text style={styles.planSubtext}>($119.88/year)</Text>
            {selectedPlan === 'monthly' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefit}>
            <Text style={styles.benefitCheck}>✓</Text>
            <Text style={styles.benefitText}>Instant access to your {foundAmount}</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitCheck}>✓</Text>
            <Text style={styles.benefitText}>Weekly scans for new money</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitCheck}>✓</Text>
            <Text style={styles.benefitText}>AI-powered claim filing</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitCheck}>✓</Text>
            <Text style={styles.benefitText}>Priority support</Text>
          </View>
        </View>

        {/* Trust Elements */}
        <View style={styles.trustContainer}>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>🔒</Text>
            <Text style={styles.trustText}>Cancel anytime</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>💰</Text>
            <Text style={styles.trustText}>7-day free trial</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>⭐</Text>
            <Text style={styles.trustText}>4.8 rating (127K users)</Text>
          </View>
        </View>

        {/* CTA Button */}
        <Button
          title="Start Free Trial →"
          onPress={handleStartTrial}
          loading={loading}
          style={styles.ctaButton}
        />

        {/* Fine Print */}
        <Text style={styles.finePrint}>
          After 7 days, automatically renews at {selectedPlan === 'yearly' ? '$79.99/year' : '$9.99/month'}.
          {'\n'}Cancel anytime in settings.
        </Text>

        {/* Skip Link */}
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipLink}>Maybe later</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  foundLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  foundAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  foundSubtext: {
    fontSize: 16,
    color: '#6B7280',
  },
  headline: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  pricingContainer: {
    gap: 16,
    marginBottom: 32,
  },
  pricingOption: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  pricingOptionSelected: {
    borderColor: '#10B981',
    backgroundColor: '#10B98108',
  },
  pricingBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  planSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontWeight: 'bold',
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitCheck: {
    fontSize: 20,
    color: '#10B981',
    marginRight: 12,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
  },
  trustContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  trustItem: {
    alignItems: 'center',
  },
  trustIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  trustText: {
    fontSize: 12,
    color: '#6B7280',
  },
  ctaButton: {
    marginBottom: 16,
  },
  finePrint: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  skipLink: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});