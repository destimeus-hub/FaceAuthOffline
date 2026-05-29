import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<any>;
};

type AuthEvent = {
  id: string;
  name: string;
  confidence: number;
  timestamp: string;
  timeAgo: string;
  livenessPass: boolean;
  synced: boolean;
};

const seedData: AuthEvent[] = [
  {
    id: '1',
    name: 'Deepika Verma',
    confidence: 90.8,
    timestamp: '29 May 2026, 12:45 PM',
    timeAgo: '30 min ago',
    livenessPass: true,
    synced: true,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    confidence: 96.8,
    timestamp: '28 May 2026, 3:22 PM',
    timeAgo: '1 day ago',
    livenessPass: true,
    synced: true,
  },
  {
    id: '3',
    name: 'Vikram Rao',
    confidence: 95.1,
    timestamp: '28 May 2026, 10:15 AM',
    timeAgo: '1 day ago',
    livenessPass: true,
    synced: true,
  },
  {
    id: '4',
    name: 'Rajesh Kumar',
    confidence: 94.2,
    timestamp: '27 May 2026, 2:30 PM',
    timeAgo: '2 days ago',
    livenessPass: true,
    synced: true,
  },
  {
    id: '5',
    name: 'Kavita Joshi',
    confidence: 92.6,
    timestamp: '27 May 2026, 9:45 AM',
    timeAgo: '2 days ago',
    livenessPass: true,
    synced: true,
  },
  {
    id: '6',
    name: 'Suresh Nair',
    confidence: 96.1,
    timestamp: '26 May 2026, 4:00 PM',
    timeAgo: '3 days ago',
    livenessPass: true,
    synced: false,
  },
  {
    id: '7',
    name: 'Amit Singh',
    confidence: 91.5,
    timestamp: '26 May 2026, 11:30 AM',
    timeAgo: '3 days ago',
    livenessPass: true,
    synced: false,
  },
  {
    id: '8',
    name: 'Neha Gupta',
    confidence: 93.7,
    timestamp: '25 May 2026, 1:15 PM',
    timeAgo: '4 days ago',
    livenessPass: true,
    synced: false,
  },
  {
    id: '9',
    name: 'Sunita Patel',
    confidence: 89.3,
    timestamp: '24 May 2026, 8:45 AM',
    timeAgo: '5 days ago',
    livenessPass: true,
    synced: true,
  },
  {
    id: '10',
    name: 'Arun Mishra',
    confidence: 87.4,
    timestamp: '23 May 2026, 5:00 PM',
    timeAgo: '6 days ago',
    livenessPass: true,
    synced: true,
  },
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('');
};

const AuthLogScreen: React.FC<Props> = ({navigation}) => {
  const [filter, setFilter] = useState<'all' | 'synced' | 'pending'>('all');

  const filteredData = seedData.filter(item => {
    if (filter === 'synced') {
      return item.synced;
    }
    if (filter === 'pending') {
      return !item.synced;
    }
    return true;
  });

  const syncedCount = seedData.filter(e => e.synced).length;
  const pendingCount = seedData.filter(e => !e.synced).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Auth Log</Text>
          <Text style={styles.headerSubtitle}>
            {seedData.length} verification events
          </Text>
        </View>
        <View style={styles.offlineBadge}>
          <View style={styles.offlineDot} />
          <Text style={styles.offlineText}>Offline</Text>
        </View>
      </View>

      {/* Sync Summary */}
      <View style={styles.syncSummary}>
        <View style={styles.syncItem}>
          <Text style={styles.syncValue}>{syncedCount}</Text>
          <Text style={styles.syncLabel}>Synced</Text>
        </View>
        <View style={styles.syncDivider} />
        <View style={styles.syncItem}>
          <Text style={[styles.syncValue, {color: '#FF6B00'}]}>
            {pendingCount}
          </Text>
          <Text style={styles.syncLabel}>Pending</Text>
        </View>
        <View style={styles.syncDivider} />
        <View style={styles.syncItem}>
          <Text style={styles.syncValue}>{seedData.length}</Text>
          <Text style={styles.syncLabel}>Total</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'synced', 'pending'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Auth Events List */}
      <View style={styles.listContainer}>
        {filteredData.map(item => (
          <View key={item.id} style={styles.eventCard}>
            <View style={styles.eventRow}>
              {/* Avatar */}
              <View
                style={[
                  styles.avatar,
                  {backgroundColor: `hsl(${parseInt(item.id) * 36}, 50%, 25%)`},
                ]}>
                <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
              </View>

              {/* Info */}
              <View style={styles.eventInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.eventName}>{item.name}</Text>
                  {item.synced ? (
                    <View style={styles.syncedBadge}>
                      <Text style={styles.syncedBadgeText}>✓ Synced</Text>
                    </View>
                  ) : (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>⟳ Pending</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.eventTimestamp}>{item.timestamp}</Text>

                <View style={styles.eventMetrics}>
                  {/* Confidence bar */}
                  <View style={styles.confContainer}>
                    <Text style={styles.confLabel}>Confidence</Text>
                    <View style={styles.confBarTrack}>
                      <View
                        style={[
                          styles.confBar,
                          {
                            width: `${item.confidence}%`,
                            backgroundColor:
                              item.confidence >= 95
                                ? '#00E676'
                                : item.confidence >= 90
                                ? '#FF6B00'
                                : '#FFD600',
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.confValue,
                        {
                          color:
                            item.confidence >= 95
                              ? '#00E676'
                              : item.confidence >= 90
                              ? '#FF6B00'
                              : '#FFD600',
                        },
                      ]}>
                      {item.confidence}%
                    </Text>
                  </View>

                  {/* Liveness */}
                  <View style={styles.livenessContainer}>
                    <Text style={styles.livenessText}>✓ Liveness Passed</Text>
                    <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8888AA',
    textAlign: 'center',
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  offlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
    marginRight: 5,
  },
  offlineText: {
    fontSize: 11,
    color: '#00E676',
    fontWeight: '600',
  },
  syncSummary: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
    marginBottom: 12,
  },
  syncItem: {
    flex: 1,
    alignItems: 'center',
  },
  syncValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#00E676',
  },
  syncLabel: {
    fontSize: 11,
    color: '#8888AA',
    marginTop: 2,
  },
  syncDivider: {
    width: 1,
    backgroundColor: '#2D2D44',
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterTabActive: {
    backgroundColor: '#FF6B00',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8888AA',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  eventCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  eventRow: {
    flexDirection: 'row',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  eventInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  syncedBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  syncedBadgeText: {
    fontSize: 10,
    color: '#00E676',
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pendingBadgeText: {
    fontSize: 10,
    color: '#FF6B00',
    fontWeight: '600',
  },
  eventTimestamp: {
    fontSize: 12,
    color: '#8888AA',
    marginBottom: 8,
  },
  eventMetrics: {},
  confContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  confLabel: {
    fontSize: 11,
    color: '#555566',
    width: 70,
  },
  confBarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#2D2D44',
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  confBar: {
    height: '100%',
    borderRadius: 2,
  },
  confValue: {
    fontSize: 13,
    fontWeight: '700',
    width: 45,
    textAlign: 'right',
  },
  livenessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livenessText: {
    fontSize: 11,
    color: '#00E676',
    fontWeight: '500',
  },
  timeAgoText: {
    fontSize: 11,
    color: '#555566',
  },
});

export default AuthLogScreen;
