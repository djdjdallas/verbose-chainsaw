/**
 * Quick Scan - Email scan with animation (Quick Win)
 * @module app/onboarding/quick-scan
 */

import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import { trackEvent, AnalyticsEvents } from '../../services/analytics';

export default function QuickScanScreen() {
  const router = useRouter();
  const [scanState, setScanState] = useState('prompt'); // prompt, scanning, complete
  const [foundItems, setFoundItems] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    trackEvent(AnalyticsEvents.ONBOARDING_SCREEN_VIEWED, {
      screen: 'quick-scan',
      step: 7
    });
  }, []);

  useEffect(() => {
    if (scanState === 'scanning') {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate scanning and finding items
      const items = [
        { name: 'Equifax Data Breach', amount: '$127', delay: 1500 },
        { name: 'Amazon Price Adjustment', amount: '$23', delay: 2500 },
        { name: 'Apple Family Sharing Refund', amount: '$89', delay: 3500 },
      ];

      items.forEach((item, index) => {
        setTimeout(() => {
          setFoundItems((prev) => [...prev, item]);
          if (index === items.length - 1) {
            setTimeout(() => {
              setScanState('complete');
            }, 1000);
          }
        }, item.delay);
      });
    }
  }, [scanState]);

  useEffect(() => {
    if (scanState === 'complete') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [scanState]);

  const handleStartScan = () => {
    trackEvent('Quick Scan Started');
    setScanState('scanning');
  };

  const handleContinue = () => {
    trackEvent('Quick Scan Completed', {
      itemsFound: foundItems.length,
      totalAmount: foundItems.reduce((sum, item) => {
        return sum + parseFloat(item.amount.replace('$', ''));
      }, 0)
    });
    router.push('/onboarding/results-teaser');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '85%' }]} />
        </View>

        {scanState === 'prompt' && (
          <>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📧</Text>
            </View>
            <Text style={styles.headline}>
              Quick Win:{'\n'}Scan Your Email
            </Text>
            <Text style={styles.subheadline}>
              We'll check for class action settlements you qualify for (takes 10 seconds)
            </Text>
            <View style={styles.featureList}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🔒</Text>
                <Text style={styles.featureText}>100% secure & private</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>⚡</Text>
                <Text style={styles.featureText}>Results in seconds</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>💰</Text>
                <Text style={styles.featureText}>No payment needed yet</Text>
              </View>
            </View>
            <Button
              title="Scan My Email →"
              onPress={handleStartScan}
              style={styles.button}
            />
          </>
        )}

        {scanState === 'scanning' && (
          <>
            <Animated.View style={[styles.scanningIconContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.scanningIcon}>🔍</Text>
            </Animated.View>
            <Text style={styles.scanningText}>Scanning your emails...</Text>
            <View style={styles.foundItemsContainer}>
              {foundItems.map((item, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.foundItem,
                    {
                      opacity: fadeAnim,
                      transform: [{
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }]
                    }
                  ]}
                >
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                  <View style={styles.foundItemContent}>
                    <Text style={styles.foundItemName}>{item.name}</Text>
                    <Text style={styles.foundItemAmount}>{item.amount}</Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </>
        )}

        {scanState === 'complete' && (
          <Animated.View style={[styles.completeContainer, { opacity: fadeAnim }]}>
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>🎉</Text>
            </View>
            <Text style={styles.completeHeadline}>
              Found $239 in 10 seconds!
            </Text>
            <Text style={styles.completeSubtext}>
              That's just from your email. Let's find the rest...
            </Text>
            <View style={styles.foundSummary}>
              {foundItems.map((item, index) => (
                <View key={index} style={styles.summaryItem}>
                  <Text style={styles.summaryName}>{item.name}</Text>
                  <Text style={styles.summaryAmount}>{item.amount}</Text>
                </View>
              ))}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryTotal}>
                <Text style={styles.summaryTotalLabel}>Total Found</Text>
                <Text style={styles.summaryTotalAmount}>$239</Text>
              </View>
            </View>
            <Button
              title="Continue Search →"
              onPress={handleContinue}
              style={styles.button}
            />
          </Animated.View>
        )}

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          {[...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i <= 6 && styles.stepDotActive
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
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 50,
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 40,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 24,
    textAlign: 'center',
  },
  featureList: {
    marginBottom: 40,
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  scanningIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  scanningIcon: {
    fontSize: 60,
  },
  scanningText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 40,
  },
  foundItemsContainer: {
    gap: 12,
  },
  foundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  checkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  foundItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foundItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  foundItemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 60,
  },
  completeHeadline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  completeSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  foundSummary: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  summaryName: {
    fontSize: 15,
    color: '#4B5563',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summaryTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  button: {
    marginBottom: 16,
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
