/**
 * Money Detail screen - View details of a specific money opportunity
 * @module app/money-detail/[id]
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { trackScreen } from '../../services/analytics';
import ApiService from '../../services/api';

export default function MoneyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { state } = useApp();
  const [money, setMoney] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackScreen('Money Detail', { money_id: id });
    loadMoneyDetail();
  }, [id]);

  const loadMoneyDetail = async () => {
    // In real app, fetch from Supabase
    // For now, mock data
    setMoney({
      id,
      company_name: 'Equifax Data Breach Settlement',
      description: 'If you had a credit report with Equifax between May 2017 and July 2017, you may be eligible for up to $127.',
      amount: '$127.00',
      amount_numeric: 127,
      source_type: 'class_action',
      status: 'unclaimed',
      deadline: '2025-12-31',
      difficulty: 'easy',
      estimated_time: '5-10 minutes',
      required_documents: [
        'Social Security Number',
        'Proof of identity (Driver\'s License)',
      ],
      claim_url: 'https://example.com/claim',
      details: {
        case_number: 'No. 1:17-md-02800-TWT',
        settlement_amount: '$700M',
        eligible_consumers: '147 million',
      },
      steps: [
        'Visit the settlement website',
        'Enter your information',
        'Upload required documents',
        'Submit your claim',
        'Wait for verification (2-4 weeks)',
      ],
    });
    setLoading(false);
  };

  const handleStartClaim = () => {
    router.push(`/claim-form/${id}`);
  };

  const handleViewWebsite = () => {
    Alert.alert('Open Website', `Would open: ${money.claim_url}`);
  };

  const handleMarkClaimed = async () => {
    // Update status to claimed
    Alert.alert('Success', 'Marked as claimed! We\'ll notify you of updates.');
    router.back();
  };

  if (loading || !money) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <View style={styles.amountContainer}>
          <Text style={styles.label}>Estimated Amount</Text>
          <Text style={styles.amount}>{money.amount}</Text>
        </View>

        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: `${getDifficultyColor(money.difficulty)}15` }]}>
            <Text style={[styles.badgeText, { color: getDifficultyColor(money.difficulty) }]}>
              {money.difficulty.toUpperCase()}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⏱ {money.estimated_time}</Text>
          </View>
        </View>
      </Card>

      {/* Company Info */}
      <Card style={styles.infoCard}>
        <Text style={styles.companyName}>{money.company_name}</Text>
        <Text style={styles.description}>{money.description}</Text>

        {money.deadline && (
          <View style={styles.deadlineContainer}>
            <Text style={styles.deadlineLabel}>⏰ Deadline:</Text>
            <Text style={styles.deadlineDate}>
              {new Date(money.deadline).toLocaleDateString()}
            </Text>
          </View>
        )}
      </Card>

      {/* Settlement Details */}
      {money.details && (
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Settlement Details</Text>
          {Object.entries(money.details).map(([key, value]) => (
            <View key={key} style={styles.detailRow}>
              <Text style={styles.detailKey}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* Required Documents */}
      {money.required_documents && money.required_documents.length > 0 && (
        <Card style={styles.documentsCard}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          {money.required_documents.map((doc, index) => (
            <View key={index} style={styles.documentItem}>
              <Text style={styles.documentBullet}>✓</Text>
              <Text style={styles.documentText}>{doc}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* Claim Steps */}
      {money.steps && money.steps.length > 0 && (
        <Card style={styles.stepsCard}>
          <Text style={styles.sectionTitle}>How to Claim</Text>
          {money.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Start Claim Form →"
          onPress={handleStartClaim}
          style={styles.primaryButton}
        />

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewWebsite}
          >
            <Text style={styles.secondaryButtonText}>🔗 Visit Website</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleMarkClaimed}
          >
            <Text style={styles.secondaryButtonText}>✓ Mark as Claimed</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Help Card */}
      <Card style={styles.helpCard}>
        <Text style={styles.helpTitle}>💡 Need Help?</Text>
        <Text style={styles.helpText}>
          Our AI assistant can auto-fill the claim form for you. Just tap "Start Claim Form" above.
        </Text>
      </Card>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    padding: 24,
    marginBottom: 16,
  },
  amountContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  amount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#10B981',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  infoCard: {
    padding: 20,
    marginBottom: 16,
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
  },
  deadlineLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginRight: 8,
  },
  deadlineDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B45309',
  },
  detailsCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailKey: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  documentsCard: {
    padding: 20,
    marginBottom: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentBullet: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 12,
    fontWeight: 'bold',
  },
  documentText: {
    fontSize: 15,
    color: '#4B5563',
    flex: 1,
  },
  stepsCard: {
    padding: 20,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  stepText: {
    fontSize: 15,
    color: '#4B5563',
    flex: 1,
    lineHeight: 22,
  },
  actions: {
    marginBottom: 16,
  },
  primaryButton: {
    marginBottom: 12,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  helpCard: {
    padding: 20,
    backgroundColor: '#EFF6FF',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});
