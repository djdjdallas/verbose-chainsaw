/**
 * Dashboard screen - Main app screen
 * @module app/tabs/index
 */

import { View, Text, ScrollView, RefreshControl, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { getMoneyFound, getUserProfile } from '../../services/supabase';
import { trackScreen } from '../../services/analytics';
import ApiService from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

// Warm up the browser for faster OAuth
WebBrowser.maybeCompleteAuthSession();

export default function Dashboard() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { toastSuccess, toastError, toastInfo } = useToast();
  const [money, setMoney] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [checkingGmail, setCheckingGmail] = useState(true);
  const [stats, setStats] = useState({
    totalFound: 0,
    totalClaimed: 0,
    totalReceived: 0,
  });

  useEffect(() => {
    trackScreen('Dashboard');
    loadMoney();
    checkGmailConnection();

    // Listen for deep link callback from Gmail OAuth
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription?.remove();
    };
  }, []);

  // Check if Gmail is already connected
  const checkGmailConnection = async () => {
    if (!state.user) {
      setCheckingGmail(false);
      return;
    }

    try {
      const { data: profile } = await getUserProfile(state.user.id);
      if (profile) {
        setGmailConnected(profile.gmail_connected || false);
      }
    } catch (error) {
      console.error('Error checking Gmail connection:', error);
    } finally {
      setCheckingGmail(false);
    }
  };

  // Handle deep link callback from OAuth
  const handleDeepLink = ({ url }) => {
    if (url.includes('gmail-connected')) {
      const urlObj = new URL(url);
      const success = urlObj.searchParams.get('success');

      if (success === 'true') {
        setGmailConnected(true);
        toastSuccess('Gmail connected successfully! You can now scan your emails.', 4000);
        loadMoney(); // Reload in case any opportunities were found during connection
      }
    }
  };

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
    await checkGmailConnection();
    setRefreshing(false);
  };

  // Connect Gmail via OAuth
  const handleConnectGmail = async () => {
    if (!state.user) {
      toastInfo('Please sign up to connect your Gmail!');
      router.push('/auth/sign-up');
      return;
    }

    try {
      toastInfo('Opening Gmail connection...');

      // Get the OAuth URL from backend
      const response = await ApiService.getGmailAuthUrl();

      if (response.authUrl) {
        // Open OAuth URL in browser
        const result = await WebBrowser.openAuthSessionAsync(
          response.authUrl,
          'foundmoney://gmail-connected'
        );

        // Handle result
        if (result.type === 'success') {
          // The deep link listener will handle the success callback
          console.log('Gmail OAuth completed');
        } else if (result.type === 'cancel') {
          toastInfo('Gmail connection cancelled');
        }
      }
    } catch (error) {
      console.error('Gmail connection error:', error);
      toastError('Failed to connect Gmail. Please try again.');
    }
  };

  // Scan email (only available if Gmail is connected)
  const handleScanEmail = async () => {
    if (!state.user) {
      toastInfo('Please sign up to scan your email for money opportunities!');
      router.push('/auth/sign-up');
      return;
    }

    if (!gmailConnected) {
      toastInfo('Please connect Gmail first');
      return;
    }

    setSearching(true);
    try {
      const result = await ApiService.scanGmail(state.user.id);
      console.log('Gmail scan completed:', result);

      await loadMoney();

      if (result.opportunitiesFound > 0) {
        toastSuccess(`Found ${result.opportunitiesFound} opportunities in ${result.emailsScanned} emails!`, 4000);
      } else {
        toastInfo(`Scanned ${result.emailsScanned} emails. No new opportunities found.`);
      }
    } catch (error) {
      console.error('Email scan error:', error);
      toastError(error.message || 'Failed to scan Gmail. Please try reconnecting.', 4000);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchAll = async () => {
    setSearching(true);

    try {
      // Run search (works with or without auth using mock data)
      const result = await ApiService.searchAll(state.user?.id || 'demo');
      console.log('Search completed:', result);

      // If user is authenticated, reload from database
      if (state.user) {
        await loadMoney();
      } else {
        // For demo users, show mock results directly
        if (result.results) {
          const mockMoney = [
            ...result.results.classActions.map(ca => ({
              id: ca.id,
              company_name: ca.company,
              description: ca.title,
              amount: ca.estimatedPayout,
              source_type: 'class_action',
              status: 'unclaimed'
            })),
            ...result.results.unclaimedProperty.map((up, i) => ({
              id: `up-${i}`,
              company_name: up.reportedBy,
              description: `${up.type} - ${up.state}`,
              amount: up.amount,
              source_type: 'unclaimed_property',
              status: 'unclaimed'
            }))
          ];
          setMoney(mockMoney);
          calculateStats(mockMoney.map(m => ({
            ...m,
            amount_numeric: parseFloat(m.amount.replace(/[^0-9.]/g, '')) || 0
          })));
        }
      }

      // Show success message
      if (result.results && result.results.totalFound > 0) {
        const message = `Found ${result.results.totalFound} opportunities worth $${result.results.estimatedValue.toFixed(2)}!`;
        toastSuccess(message, 5000);
        if (!state.user) {
          setTimeout(() => toastInfo('Sign up to save these results!', 4000), 5500);
        }
      } else {
        toastInfo('Search completed. No new opportunities found at this time.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toastError('Search failed. Please try again later.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
        {/* Conditionally show Connect Gmail or Scan Email */}
        {!gmailConnected ? (
          <TouchableOpacity
            style={[styles.actionCard, checkingGmail && styles.actionCardDisabled]}
            onPress={handleConnectGmail}
            disabled={checkingGmail}
          >
            <Text style={styles.actionEmoji}>{checkingGmail ? '⏳' : '🔗'}</Text>
            <Text style={styles.actionText}>
              {checkingGmail ? 'Checking...' : 'Connect Gmail'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionCard, searching && styles.actionCardDisabled]}
            onPress={handleScanEmail}
            disabled={searching}
          >
            <Text style={styles.actionEmoji}>{searching ? '⏳' : '📧'}</Text>
            <Text style={styles.actionText}>Scan Email</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionCard, searching && styles.actionCardDisabled]}
          onPress={handleSearchAll}
          disabled={searching}
        >
          <Text style={styles.actionEmoji}>{searching ? '⏳' : '🔍'}</Text>
          <Text style={styles.actionText}>{searching ? 'Searching...' : 'Search All'}</Text>
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
            title={searching ? "Searching..." : "Start Searching"}
            onPress={handleSearchAll}
            loading={searching}
            disabled={searching}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
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
  actionCardDisabled: {
    opacity: 0.6,
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