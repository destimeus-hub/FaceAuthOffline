import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
const {width} = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<any>;
};

const DashboardScreen: React.FC<Props> = ({navigation}) => {
  const menuItems = [
    {
      title: 'Enroll Face',
      subtitle: 'Register a new identity',
      icon: '👤',
      color: '#FF6B00',
      screen: 'Enrollment',
    },
    {
      title: 'Verify Identity',
      subtitle: 'Check against enrolled faces',
      icon: '🔍',
      color: '#00E676',
      screen: 'Verification',
    },
    {
      title: 'Auth Log',
      subtitle: '10 events • 3 pending sync',
      icon: '📋',
      color: '#448AFF',
      screen: 'AuthLog',
    },
    {
      title: 'Benchmarks',
      subtitle: '180ms total pipeline',
      icon: '⚡',
      color: '#FFD600',
      screen: 'Benchmark',
    },
    {
      title: 'Architecture',
      subtitle: 'System design overview',
      icon: '🏗️',
      color: '#E040FB',
      screen: 'Architecture',
    },
    {
      title: 'Settings',
      subtitle: 'Configuration & data',
      icon: '⚙️',
      color: '#8888AA',
      screen: 'Settings',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>FaceAuth</Text>
            <Text style={styles.greetingAccent}>Offline</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.offlineBadge}>
              <View style={styles.offlineDot} />
              <Text style={styles.offlineText}>Offline Mode Active</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>10</Text>
            <Text style={styles.statLabel}>Verifications</Text>
          </View>
          <View
            style={[styles.statCard, {borderColor: 'rgba(255, 107, 0, 0.3)'}]}>
            <Text style={[styles.statValue, {color: '#FF6B00'}]}>3</Text>
            <Text style={styles.statLabel}>Pending Sync</Text>
          </View>
        </View>

        {/* Sync Indicator */}
        <View style={styles.syncCard}>
          <View style={styles.syncRow}>
            <View style={styles.syncLeft}>
              <Text style={styles.syncIcon}>⟳</Text>
              <View>
                <Text style={styles.syncTitle}>3 events pending sync</Text>
                <Text style={styles.syncSub}>Will sync when online</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.syncBtn}>
              <Text style={styles.syncBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Last Verification */}
        <View style={styles.lastVerifyCard}>
          <Text style={styles.lastVerifyTitle}>Last Verification</Text>
          <View style={styles.lastVerifyContent}>
            <View style={styles.lastVerifyAvatar}>
              <Text style={styles.lastVerifyInitials}>DV</Text>
            </View>
            <View style={styles.lastVerifyInfo}>
              <Text style={styles.lastVerifyName}>Deepika Verma</Text>
              <Text style={styles.lastVerifyTime}>30 min ago</Text>
            </View>
            <View style={styles.lastVerifyResult}>
              <Text style={styles.lastVerifyConfidence}>90.8%</Text>
              <View style={styles.lastVerifyBadge}>
                <Text style={styles.lastVerifyBadgeText}>✓ Granted</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Grid */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.menuIconContainer,
                  {backgroundColor: item.color + '15'},
                ]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              <View
                style={[styles.menuAccent, {backgroundColor: item.color}]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Pipeline Performance */}
        <View style={styles.pipelineCard}>
          <Text style={styles.pipelineTitle}>Pipeline Performance</Text>
          <View style={styles.pipelineRow}>
            <View style={styles.pipelineItem}>
              <Text style={[styles.pipelineValue, {color: '#448AFF'}]}>
                45ms
              </Text>
              <Text style={styles.pipelineLabel}>Detect</Text>
            </View>
            <Text style={styles.pipelineArrow}>→</Text>
            <View style={styles.pipelineItem}>
              <Text style={[styles.pipelineValue, {color: '#FF6B00'}]}>
                120ms
              </Text>
              <Text style={styles.pipelineLabel}>Embed</Text>
            </View>
            <Text style={styles.pipelineArrow}>→</Text>
            <View style={styles.pipelineItem}>
              <Text style={[styles.pipelineValue, {color: '#00E676'}]}>
                35ms
              </Text>
              <Text style={styles.pipelineLabel}>Liveness</Text>
            </View>
            <Text style={styles.pipelineArrow}>=</Text>
            <View style={styles.pipelineItem}>
              <Text style={[styles.pipelineValue, {color: '#FF6B00'}]}>
                180ms
              </Text>
              <Text style={styles.pipelineLabel}>Total</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>NHAI Hackathon 7.0 • v1.0.0</Text>
        <View style={{height: 20}} />
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  greetingAccent: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B00',
    marginTop: -6,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  offlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00E676',
    marginRight: 6,
  },
  offlineText: {
    fontSize: 12,
    color: '#00E676',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: '#8888AA',
    marginTop: 2,
  },
  syncCard: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(255, 107, 0, 0.08)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.2)',
    marginBottom: 12,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncIcon: {
    fontSize: 20,
    color: '#FF6B00',
    marginRight: 12,
  },
  syncTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B00',
  },
  syncSub: {
    fontSize: 11,
    color: '#8888AA',
  },
  syncBtn: {
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  syncBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B00',
  },
  lastVerifyCard: {
    marginHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2D2D44',
    marginBottom: 20,
  },
  lastVerifyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8888AA',
    marginBottom: 10,
  },
  lastVerifyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastVerifyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2D2D44',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lastVerifyInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lastVerifyInfo: {
    flex: 1,
  },
  lastVerifyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lastVerifyTime: {
    fontSize: 12,
    color: '#8888AA',
  },
  lastVerifyResult: {
    alignItems: 'flex-end',
  },
  lastVerifyConfidence: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00E676',
  },
  lastVerifyBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  lastVerifyBadgeText: {
    fontSize: 10,
    color: '#00E676',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555566',
    letterSpacing: 2,
    marginLeft: 20,
    marginBottom: 10,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  menuCard: {
    width: (width - 40) / 2,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
    position: 'relative',
    overflow: 'hidden',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#8888AA',
  },
  menuAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 3,
    borderBottomLeftRadius: 3,
  },
  pipelineCard: {
    marginHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
    marginBottom: 16,
  },
  pipelineTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8888AA',
    marginBottom: 12,
    textAlign: 'center',
  },
  pipelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipelineItem: {
    alignItems: 'center',
  },
  pipelineValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  pipelineLabel: {
    fontSize: 10,
    color: '#8888AA',
    marginTop: 1,
  },
  pipelineArrow: {
    fontSize: 14,
    color: '#555566',
    marginHorizontal: 6,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#555566',
    letterSpacing: 1,
    marginBottom: 8,
  },
});

export default DashboardScreen;
