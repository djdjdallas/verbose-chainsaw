/**
 * Search screen - Search for all money sources
 * @module app/tabs/search
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { trackScreen } from '../../services/analytics';
import ApiService from '../../services/api';

export default function SearchScreen() {
  const router = useRouter();
  const { state } = useApp();
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    trackScreen('Search');
  }, []);

  const searchTypes = [
    { id: 'class_action', name: 'Class Actions', icon: '⚖️', desc: 'Settlements & lawsuits' },
    { id: 'unclaimed_property', name: 'Unclaimed Property', icon: '🏦', desc: 'Banks, utilities, employers' },
    { id: 'tax_refunds', name: 'Tax Refunds', icon: '🎯', desc: 'IRS & state returns' },
    { id: 'email_scan', name: 'Email Scan', icon: '📧', desc: 'Scan receipts for settlements' },
  ];

  const toggleSearchType = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSearchAll = async () => {
    setSearching(true);
    try {
      const response = await ApiService.searchAll(state.user?.id);
      setSearchResults(response.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSelected = async () => {
    if (selectedTypes.length === 0) return;

    setSearching(true);
    try {
      // In real app, call specific APIs based on selected types
      const promises = selectedTypes.map(async (type) => {
        if (type === 'class_action') {
          return await ApiService.searchClassActions(state.user?.id);
        } else if (type === 'unclaimed_property') {
          return await ApiService.searchUnclaimedProperty(state.user?.id);
        }
        // Add other types as needed
        return { results: [] };
      });

      const results = await Promise.all(promises);
      const allResults = results.flatMap((r) => r.results || []);
      setSearchResults(allResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.title}>Search for Money</Text>
      <Text style={styles.subtitle}>
        Select sources to search or search everything at once
      </Text>

      {/* Search Types */}
      <View style={styles.typesContainer}>
        {searchTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            onPress={() => toggleSearchType(type.id)}
            style={[
              styles.typeCard,
              selectedTypes.includes(type.id) && styles.typeCardSelected
            ]}
          >
            <View style={styles.typeHeader}>
              <Text style={styles.typeIcon}>{type.icon}</Text>
              {selectedTypes.includes(type.id) && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedCheck}>✓</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.typeName,
              selectedTypes.includes(type.id) && styles.typeNameSelected
            ]}>
              {type.name}
            </Text>
            <Text style={styles.typeDesc}>{type.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title={searching ? 'Searching...' : 'Search All Sources'}
          onPress={handleSearchAll}
          disabled={searching}
          loading={searching}
          style={styles.primaryButton}
        />

        {selectedTypes.length > 0 && (
          <Button
            title={`Search Selected (${selectedTypes.length})`}
            onPress={handleSearchSelected}
            disabled={searching}
            variant="secondary"
            style={styles.secondaryButton}
          />
        )}
      </View>

      {/* Searching State */}
      {searching && (
        <Card style={styles.searchingCard}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.searchingText}>Scanning databases...</Text>
          <Text style={styles.searchingSubtext}>This may take 30-60 seconds</Text>
        </Card>
      )}

      {/* Results */}
      {searchResults.length > 0 && !searching && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            Found {searchResults.length} opportunities
          </Text>
          {searchResults.map((result, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/money-detail/${result.id}`)}
            >
              <Card style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultCompany}>{result.company_name}</Text>
                    <Text style={styles.resultDesc} numberOfLines={2}>
                      {result.description}
                    </Text>
                  </View>
                  <Text style={styles.resultAmount}>{result.amount}</Text>
                </View>
                <View style={styles.resultFooter}>
                  <Text style={styles.resultType}>{result.source_type}</Text>
                  <Text style={styles.resultCta}>View Details →</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && !searching && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Ready to Search</Text>
          <Text style={styles.emptyText}>
            Select sources above or search everything to find your unclaimed money
          </Text>
        </Card>
      )}

      {/* Info Section */}
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 How it works</Text>
        <View style={styles.infoList}>
          <Text style={styles.infoItem}>• We search 50+ databases nationwide</Text>
          <Text style={styles.infoItem}>• Results are personalized to your profile</Text>
          <Text style={styles.infoItem}>• New sources added weekly</Text>
          <Text style={styles.infoItem}>• 100% secure & private</Text>
        </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  typeCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  typeCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  typeIcon: {
    fontSize: 32,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheck: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  typeNameSelected: {
    color: '#3B82F6',
  },
  typeDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  searchingCard: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 24,
  },
  searchingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  searchingSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultsContainer: {
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  resultCard: {
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultInfo: {
    flex: 1,
    marginRight: 12,
  },
  resultCompany: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resultDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultType: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  resultCta: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 24,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoCard: {
    padding: 20,
    backgroundColor: '#EFF6FF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: '#4B5563',
  },
});
