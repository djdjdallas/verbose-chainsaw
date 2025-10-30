/**
 * Personalization 3 - Life changes question (multi-select)
 * @module app/onboarding/personalization-3
 */

import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { trackEvent, AnalyticsEvents } from '../../services/analytics';

export default function Personalization3Screen() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    trackEvent(AnalyticsEvents.ONBOARDING_SCREEN_VIEWED, {
      screen: 'personalization-3',
      step: 5
    });
  }, []);

  const options = [
    { id: 'moved', label: 'Moved to a new state', emoji: '🏠' },
    { id: 'job', label: 'Changed jobs', emoji: '💼' },
    { id: 'bank', label: 'Switched banks', emoji: '🏦' },
    { id: 'old-accounts', label: 'Had old accounts I forgot about', emoji: '🔐' },
    { id: 'none', label: 'None of these apply', emoji: '❌' },
  ];

  const toggleOption = (id) => {
    if (id === 'none') {
      setSelected(['none']);
    } else {
      setSelected((prev) => {
        const filtered = prev.filter((item) => item !== 'none');
        if (prev.includes(id)) {
          return filtered.filter((item) => item !== id);
        }
        return [...filtered, id];
      });
    }
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      trackEvent('Personalization Answer', {
        question: 'life-changes',
        answers: selected
      });
      router.push('/onboarding/value-demo');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '70%' }]} />
        </View>

        {/* Question */}
        <Text style={styles.headline}>
          Any major life changes{'\n'}recently?
        </Text>
        <Text style={styles.subheadline}>
          These situations often leave money behind. Select all that apply.
        </Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => toggleOption(option.id)}
              style={({ pressed }) => [
                styles.option,
                selected.includes(option.id) && styles.optionSelected,
                pressed && styles.optionPressed
              ]}
            >
              <View style={styles.optionContent}>
                <Text style={styles.emoji}>{option.emoji}</Text>
                <Text style={[
                  styles.optionText,
                  selected.includes(option.id) && styles.optionTextSelected
                ]}>
                  {option.label}
                </Text>
              </View>
              {selected.includes(option.id) && (
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
          disabled={selected.length === 0}
          variant={selected.length > 0 ? 'primary' : 'disabled'}
          style={styles.button}
        />

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          {[...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i <= 4 && styles.stepDotActive
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
  optionsContainer: {
    gap: 12,
    marginBottom: 32,
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
  emoji: {
    fontSize: 32,
    marginRight: 16,
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
