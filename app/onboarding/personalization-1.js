/**
 * Personalization 1 - Subscriptions question
 * @module app/onboarding/personalization-1
 */

import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { trackEvent, AnalyticsEvents } from '../../services/analytics';

export default function Personalization1Screen() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    trackEvent(AnalyticsEvents.ONBOARDING_SCREEN_VIEWED, {
      screen: 'personalization-1',
      step: 3
    });
  }, []);

  const options = [
    { id: 'yes', label: 'Yes, I have subscriptions', emoji: '📱', color: '#10B981' },
    { id: 'maybe', label: 'Not sure', emoji: '🤔', color: '#F59E0B' },
    { id: 'no', label: 'No subscriptions', emoji: '🚫', color: '#6B7280' },
  ];

  const handleContinue = () => {
    if (selected) {
      trackEvent('Personalization Answer', {
        question: 'subscriptions',
        answer: selected
      });
      router.push('/onboarding/personalization-2');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '30%' }]} />
        </View>

        {/* Question */}
        <Text style={styles.headline}>
          Do you have any{'\n'}active subscriptions?
        </Text>
        <Text style={styles.subheadline}>
          This helps us find forgotten subscriptions and unused services
        </Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => setSelected(option.id)}
              style={({ pressed }) => [
                styles.option,
                selected === option.id && styles.optionSelected,
                pressed && styles.optionPressed
              ]}
            >
              <View style={styles.optionContent}>
                <View style={[styles.emojiContainer, { backgroundColor: `${option.color}15` }]}>
                  <Text style={styles.emoji}>{option.emoji}</Text>
                </View>
                <Text style={[
                  styles.optionText,
                  selected === option.id && styles.optionTextSelected
                ]}>
                  {option.label}
                </Text>
              </View>
              {selected === option.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Continue button */}
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selected}
          variant={selected ? 'primary' : 'disabled'}
          style={styles.button}
        />

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          {[...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i <= 2 && styles.stepDotActive
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
    marginBottom: 40,
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
    gap: 12,
  },
  option: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 24,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  optionTextSelected: {
    color: '#3B82F6',
  },
  checkmark: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
