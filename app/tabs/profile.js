/**
 * Profile/Settings screen
 * @module app/tabs/profile
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import Card from '../../components/Card';
import { trackScreen } from '../../services/analytics';
import { signOut } from '../../services/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    trackScreen('Profile');
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            dispatch({ type: 'SIGN_OUT' });
            router.replace('/onboarding/welcome');
          },
        },
      ]
    );
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Edit Profile', icon: '👤', action: () => {} },
        { id: 'subscription', label: 'Subscription', icon: '💳', action: () => {} },
        { id: 'payment', label: 'Payment Methods', icon: '💰', action: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          icon: '🔔',
          toggle: true,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'email',
          label: 'Email Notifications',
          icon: '📧',
          toggle: true,
          value: emailNotifications,
          onToggle: setEmailNotifications,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help Center', icon: '❓', action: () => {} },
        { id: 'contact', label: 'Contact Support', icon: '💬', action: () => {} },
        { id: 'feedback', label: 'Send Feedback', icon: '📝', action: () => {} },
      ],
    },
    {
      title: 'Legal',
      items: [
        { id: 'privacy', label: 'Privacy Policy', icon: '🔒', action: () => {} },
        { id: 'terms', label: 'Terms of Service', icon: '📄', action: () => {} },
        { id: 'licenses', label: 'Open Source Licenses', icon: '⚖️', action: () => {} },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Info Card */}
      <Card style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {state.profile?.first_name?.[0] || state.user?.email?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {state.profile?.first_name && state.profile?.last_name
              ? `${state.profile.first_name} ${state.profile.last_name}`
              : 'User'}
          </Text>
          <Text style={styles.userEmail}>{state.user?.email || 'Not signed in'}</Text>
        </View>
        {state.subscription?.isActive && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>✨ Premium</Text>
          </View>
        )}
      </Card>

      {/* Subscription Status */}
      {state.subscription?.isActive ? (
        <Card style={styles.subscriptionCard}>
          <Text style={styles.subscriptionTitle}>Active Subscription</Text>
          <Text style={styles.subscriptionText}>
            {state.subscription.tier === 'yearly' ? 'Annual Plan' : 'Monthly Plan'}
          </Text>
          <TouchableOpacity style={styles.manageButton}>
            <Text style={styles.manageButtonText}>Manage Subscription</Text>
          </TouchableOpacity>
        </Card>
      ) : (
        <Card style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
          <Text style={styles.upgradeText}>
            Unlock unlimited searches and auto-file claims
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => router.push('/onboarding/paywall')}
          >
            <Text style={styles.upgradeButtonText}>View Plans →</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Card style={styles.menuCard}>
            {section.items.map((item, index) => (
              <View key={item.id}>
                {item.toggle ? (
                  <View style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                      <Text style={styles.menuIcon}>{item.icon}</Text>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                      thumbColor={item.value ? '#3B82F6' : '#F3F4F6'}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={item.action}
                  >
                    <View style={styles.menuItemLeft}>
                      <Text style={styles.menuIcon}>{item.icon}</Text>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.menuArrow}>›</Text>
                  </TouchableOpacity>
                )}
                {index < section.items.length - 1 && (
                  <View style={styles.menuDivider} />
                )}
              </View>
            ))}
          </Card>
        </View>
      ))}

      {/* Sign Out Button */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  premiumBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  subscriptionCard: {
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#EFF6FF',
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  subscriptionText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  manageButton: {
    alignSelf: 'flex-start',
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  upgradeCard: {
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#FEF3C7',
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  upgradeText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  menuArrow: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 48,
  },
  signOutButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  version: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
