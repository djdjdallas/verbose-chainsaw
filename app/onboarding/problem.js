/**
 * Problem agitation screen
 * @module app/onboarding/problem
 */

import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { trackEvent, AnalyticsEvents } from '../../services/analytics';

export default function ProblemScreen() {
  const router = useRouter();
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    trackEvent(AnalyticsEvents.ONBOARDING_SCREEN_VIEWED, {
      screen: 'problem',
      step: 2
    });

    // Animate counter
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 500) {
          clearInterval(interval);
          return 500;
        }
        return prev + 10;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    router.push('/onboarding/personalization-1');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.headline}>
          While You Wait,{'\n'}They Profit
        </Text>

        {/* Counter Animation */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>Money They're Earning</Text>
          <Text style={styles.counter}>${counter}</Text>
          <Text style={styles.counterSubtext}>Per Day on YOUR Money</Text>
        </View>

        {/* Money List */}
        <Text style={styles.listTitle}>
          Right now, companies are earning interest on:
        </Text>

        <View style={styles.list}>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>
              <Text style={styles.moneyAmount}>$127</Text> from that data breach settlement
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>
              <Text style={styles.moneyAmount}>$89</Text> from overcharged insurance
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>
              <Text style={styles.moneyAmount}>$342</Text> in unclaimed tax refunds
            </Text>
          </View>
        </View>

        {/* Warning */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Every day you wait = more money they keep
          </Text>
        </View>

        {/* CTA Button */}
        <Button
          title="Stop Losing Money →"
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
                i <= 1 && styles.progressDotActive
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
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 32,
    lineHeight: 40,
  },
  counterContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  counterLabel: {
    fontSize: 14,
    color: '#7F1D1D',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  counter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  counterSubtext: {
    fontSize: 12,
    color: '#991B1B',
    textAlign: 'center',
  },
  listTitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 16,
  },
  list: {
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 18,
    color: '#EF4444',
    marginRight: 8,
  },
  listText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
    lineHeight: 24,
  },
  moneyAmount: {
    fontWeight: 'bold',
    color: '#EF4444',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    width: '100%',
    marginBottom: 32,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: '#3B82F6',
  },
});