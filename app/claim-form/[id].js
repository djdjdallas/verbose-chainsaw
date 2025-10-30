/**
 * Claim Form screen - AI-powered auto-fill claim form
 * @module app/claim-form/[id]
 */

import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { trackScreen } from '../../services/analytics';
import ApiService from '../../services/api';

export default function ClaimFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { state } = useApp();
  const [loading, setLoading] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    ssn: '',
    accountNumber: '',
  });

  useEffect(() => {
    trackScreen('Claim Form', { money_id: id });
    // Auto-fill from profile if available
    if (state.profile) {
      setFormData((prev) => ({
        ...prev,
        firstName: state.profile.first_name || '',
        lastName: state.profile.last_name || '',
        email: state.user?.email || '',
      }));
    }
  }, [id]);

  const handleAutoFill = async () => {
    setAutoFilling(true);
    try {
      // Call API to auto-fill form
      const response = await ApiService.autoFillForm(id, state.user.id);
      if (response.formData) {
        setFormData(response.formData);
        Alert.alert('Success', 'Form auto-filled successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to auto-fill form. Please fill manually.');
    } finally {
      setAutoFilling(false);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const required = ['firstName', 'lastName', 'email'];
    const missing = required.filter((field) => !formData[field]);

    if (missing.length > 0) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // Generate PDF and submit claim
      const response = await ApiService.submitClaim(id, formData);
      Alert.alert(
        'Claim Submitted!',
        'Your claim has been submitted. We\'ll track the status and notify you of updates.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/tabs/wallet'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Card style={styles.headerCard}>
        <Text style={styles.title}>Claim Form</Text>
        <Text style={styles.subtitle}>
          Fill out the information below. We'll handle the rest.
        </Text>
        <Button
          title={autoFilling ? 'Auto-filling...' : '✨ AI Auto-Fill'}
          onPress={handleAutoFill}
          disabled={autoFilling}
          loading={autoFilling}
          variant="secondary"
          style={styles.autoFillButton}
        />
      </Card>

      {/* Personal Information */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(value) => updateField('firstName', value)}
            placeholder="John"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(value) => updateField('lastName', value)}
            placeholder="Doe"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            placeholder="john@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(value) => updateField('phone', value)}
            placeholder="(555) 123-4567"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
        </View>
      </Card>

      {/* Address Information */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Address</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(value) => updateField('address', value)}
            placeholder="123 Main St"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(value) => updateField('city', value)}
            placeholder="San Francisco"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, styles.inputHalf]}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={formData.state}
              onChangeText={(value) => updateField('state', value)}
              placeholder="CA"
              placeholderTextColor="#9CA3AF"
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>

          <View style={[styles.inputGroup, styles.inputHalf]}>
            <Text style={styles.label}>ZIP Code</Text>
            <TextInput
              style={styles.input}
              value={formData.zip}
              onChangeText={(value) => updateField('zip', value)}
              placeholder="94102"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
        </View>
      </Card>

      {/* Additional Information */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Additional Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last 4 of SSN</Text>
          <TextInput
            style={styles.input}
            value={formData.ssn}
            onChangeText={(value) => updateField('ssn', value)}
            placeholder="1234"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />
          <Text style={styles.helpText}>Required for verification</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Number (if applicable)</Text>
          <TextInput
            style={styles.input}
            value={formData.accountNumber}
            onChangeText={(value) => updateField('accountNumber', value)}
            placeholder="Optional"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </Card>

      {/* Security Notice */}
      <Card style={styles.securityCard}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Your information is encrypted and secure. We never share your data with third parties.
        </Text>
      </Card>

      {/* Submit Button */}
      <Button
        title={loading ? 'Submitting...' : 'Submit Claim →'}
        onPress={handleSubmit}
        disabled={loading}
        loading={loading}
        style={styles.submitButton}
      />

      {/* Help Text */}
      <Text style={styles.footerText}>
        By submitting, you authorize us to file this claim on your behalf.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 16,
  },
  autoFillButton: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  sectionCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#EFF6FF',
  },
  securityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  securityText: {
    fontSize: 13,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
