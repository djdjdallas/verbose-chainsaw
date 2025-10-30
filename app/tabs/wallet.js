/**
 * Wallet screen - Track claims and money status
 * @module app/tabs/wallet
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import Card from '../../components/Card';
import { trackScreen } from '../../services/analytics';
import { getMoneyFound } from '../../services/supabase';

export default function WalletScreen() {
  const router = useRouter();
  const { state } = useApp();
  const [money, setMoney] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unclaimed, claimed, received

  useEffect(() => {
    trackScreen('Wallet');
    loadMoney();
  }, []);

  const loadMoney = async () => {
    if (!state.user) return;

    const { data } = await getMoneyFound(state.user.id);
    if (data) {
      setMoney(data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMoney();
    setRefreshing(false);
  };

  const filteredMoney = money.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const stats = money.reduce((acc, item) => {
    const amount = item.amount_numeric || 0;
    acc.total += amount;
    if (item.status === 'unclaimed') acc.unclaimed += amount;
    if (item.status === 'claimed') acc.claimed += amount;
    if (item.status === 'received') acc.received += (item.received_amount || 0);
    acc.count[item.status] = (acc.count[item.status] || 0) + 1;
    return acc;
  }, { total: 0, unclaimed: 0, claimed: 0, received: 0, count: {} });

  const filters = [
    { id: 'all', label: 'All', count: money.length },
    { id: 'unclaimed', label: 'Unclaimed', count: stats.count.unclaimed || 0 },
    { id: 'claimed', label: 'Claimed', count: stats.count.claimed || 0 },
    { id: 'received', label: 'Received', count: stats.count.received || 0 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'unclaimed':
        return '#F59E0B';
      case 'claimed':
        return '#3B82F6';
      case 'received':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'unclaimed':
        return '⏳';
      case 'claimed':
        return '📝';
      case 'received':
        return '✅';
      default:
        return '📄';
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
      {/* Header Stats */}
      <Card style={styles.statsCard}>
        <Text style={styles.statsLabel}>Total Tracked</Text>
        <Text style={styles.statsAmount}>${stats.total.toFixed(2)}</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>${stats.unclaimed.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Unclaimed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#3B82F6' }]}>
              ${stats.claimed.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Claimed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>
              ${stats.received.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Received</Text>
          </View>
        </View>
      </Card>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={[
              styles.filterChip,
              filter === f.id && styles.filterChipActive
            ]}
          >
            <Text style={[
              styles.filterText,
              filter === f.id && styles.filterTextActive
            ]}>
              {f.label} {f.count > 0 && `(${f.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Money List */}
      {filteredMoney.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>💼</Text>
          <Text style={styles.emptyTitle}>No money here yet</Text>
          <Text style={styles.emptyText}>
            Start searching to find unclaimed money and track your claims
          </Text>
        </Card>
      ) : (
        <View style={styles.moneyList}>
          {filteredMoney.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/money-detail/${item.id}`)}
            >
              <Card style={styles.moneyCard}>
                <View style={styles.moneyHeader}>
                  <View style={styles.statusIcon}>
                    <Text style={styles.statusEmoji}>
                      {getStatusIcon(item.status)}
                    </Text>
                  </View>
                  <View style={styles.moneyInfo}>
                    <Text style={styles.moneyCompany}>{item.company_name}</Text>
                    <Text style={styles.moneyDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View style={styles.moneyMeta}>
                      <Text style={styles.moneyType}>
                        {item.source_type.replace('_', ' ')}
                      </Text>
                      <Text style={styles.moneyDate}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.moneyFooter}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusColor(item.status)}15` }
                  ]}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(item.status) }
                    ]} />
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(item.status) }
                    ]}>
                      {item.status}
                    </Text>
                  </View>
                  <Text style={styles.moneyAmount}>{item.amount}</Text>
                </View>

                {item.status === 'received' && item.received_amount && (
                  <View style={styles.receivedBanner}>
                    <Text style={styles.receivedText}>
                      ✅ Received ${item.received_amount.toFixed(2)}
                    </Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Help Card */}
      <Card style={styles.helpCard}>
        <Text style={styles.helpTitle}>💡 Track Your Money</Text>
        <Text style={styles.helpText}>
          • <Text style={styles.helpBold}>Unclaimed</Text>: Found but not filed yet{'\n'}
          • <Text style={styles.helpBold}>Claimed</Text>: Filed and awaiting payment{'\n'}
          • <Text style={styles.helpBold}>Received</Text>: Money in your account
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
  },
  statsCard: {
    padding: 24,
    marginBottom: 20,
  },
  statsLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  statsAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: 'white',
  },
  moneyList: {
    gap: 12,
    marginBottom: 20,
  },
  moneyCard: {
    padding: 16,
  },
  moneyHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusEmoji: {
    fontSize: 20,
  },
  moneyInfo: {
    flex: 1,
  },
  moneyCompany: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  moneyDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  moneyMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  moneyType: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  moneyDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  moneyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  moneyAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  receivedBanner: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  receivedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
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
  helpCard: {
    padding: 20,
    backgroundColor: '#EFF6FF',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 24,
  },
  helpBold: {
    fontWeight: '600',
  },
});
