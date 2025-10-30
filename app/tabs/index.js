/**
 * Dashboard screen - Main app screen
 * @module app/tabs/index
 */

import { View, Text, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { getMoneyFound } from '../../services/supabase';
import { trackScreen } from '../../services/analytics';
import ApiService from '../../services/api';

export default function Dashboard() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [money, setMoney] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalFound: 0,
    totalClaimed: 0,
    totalReceived: 0,
  });

  useEffect(() => {
    trackScreen('Dashboard');
    loadMoney();
  }, []);

  const loadMoney = async () => {
    if (!state.user) return;

    const { data, error } = await getMoneyFound(state.user.id);
    if (data) {
      setMoney(data);
      calculateStats(data);
      dispatch({ type: 'SET_MONEY_FOUND', payload: data });
    }
  };

  const calculateStats = (moneyData) => {
    const stats = moneyData.reduce((acc, item) => {
      acc.totalFound += item.amount_numeric || 0;
      if (item.status === 'claimed') {
        acc.totalClaimed += item.amount_numeric || 0;
      }
      if (item.status === 'received') {
        acc.totalReceived += item.received_amount || 0;
      }
      return acc;
    }, { totalFound: 0, totalClaimed: 0, totalReceived: 0 });

    setStats(stats);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMoney();
    setRefreshing(false);
  };

  const handleScanEmail = () => {
    router.push('/onboarding/scan');
  };

  const handleSearchAll = async () => {
    // Trigger comprehensive search
    try {
      const result = await ApiService.searchAll(state.user.id);
      await loadMoney();
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Message */}
      <Text style={styles.welcome}>
        Welcome back{state.profile?.first_name ? `, ${state.profile.first_name}` : ''}!
      </Text>
      <Text style={styles.subtitle}>
        {money.length > 0 ? `You have ${money.length} opportunities` : 'Let\'s find your money'}
      </Text>

      {/* Main Stats Card */}
      <Card style={styles.statsCard}>
        <Text style={styles.statsLabel}>Total Found</Text>
        <Text style={styles.statsAmount}>${stats.totalFound.toFixed(2)}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Claimed</Text>
            <Text style={styles.statValue}>${stats.totalClaimed.toFixed(2)}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Received</Text>
            <Text style={styles.statValueGreen}>${stats.totalReceived.toFixed(2)}</Text>
          </View>
        </View>
      </Card>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionCard} onPress={handleScanEmail}>
          <Text style={styles.actionEmoji}>📧</Text>
          <Text style={styles.actionText}>Scan Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={handleSearchAll}>
          <Text style={styles.actionEmoji}>🔍</Text>
          <Text style={styles.actionText}>Search All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/wallet')}>
          <Text style={styles.actionEmoji}>✅</Text>
          <Text style={styles.actionText}>Check Status</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Discoveries */}
      <Text style={styles.sectionTitle}>Recent Discoveries</Text>
      {money.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No money found yet</Text>
          <Text style={styles.emptyText}>
            Start by scanning your email or searching all databases
          </Text>
          <Button
            title="Start Searching"
            onPress={handleSearchAll}
            style={styles.emptyButton}
          />
        </Card>
      ) : (
        money.slice(0, 5).map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/money-detail/${item.id}`)}
          >
            <Card style={styles.moneyCard}>
              <View style={styles.moneyHeader}>
                <View style={styles.moneyInfo}>
                  <Text style={styles.moneyCompany}>{item.company_name}</Text>
                  <Text style={styles.moneyDescription} numberOfLines={1}>
                    {item.description}
                  </Text>
                </View>
                <Text style={styles.moneyAmount}>{item.amount}</Text>
              </View>
              <View style={styles.moneyFooter}>
                <Text style={styles.moneyType}>
                  {item.source_type.replace('_', ' ')}
                </Text>
                <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      )}
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
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  statsCard: {
    marginBottom: 24,
    padding: 24,
  },
  statsLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  statsAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
  },
  statValueGreen: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  moneyCard: {
    marginBottom: 12,
  },
  moneyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  moneyInfo: {
    flex: 1,
    marginRight: 12,
  },
  moneyCompany: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  moneyDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  moneyAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  moneyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moneyType: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  status_unclaimed: {
    backgroundColor: '#FEF3C7',
  },
  status_claimed: {
    backgroundColor: '#DBEAFE',
  },
  status_received: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
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
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
});