/**
 * Money source card component
 * @module components/MoneySourceCard
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from './Card';

export default function MoneySourceCard({
  icon,
  title,
  description,
  amount,
  status,
  onPress,
  style,
}) {
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

  const getStatusBg = (status) => {
    switch (status) {
      case 'unclaimed':
        return '#FEF3C7';
      case 'claimed':
        return '#DBEAFE';
      case 'received':
        return '#D1FAE5';
      default:
        return '#F3F4F6';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, style]}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          {status && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusBg(status) },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(status) },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(status) },
                ]}
              >
                {status}
              </Text>
            </View>
          )}
          <Text style={styles.amount}>{amount}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
});
