import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Switch,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<any>;
};

const SettingsScreen: React.FC<Props> = ({navigation}) => {
  const [livenessEnabled, setLivenessEnabled] = React.useState(true);
  const [autoSync, setAutoSync] = React.useState(true);
  const [hapticFeedback, setHapticFeedback] = React.useState(true);
  const [highAccuracy, setHighAccuracy] = React.useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = React.useState(85);

  const thresholdOptions = [80, 85, 90, 95];

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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Offline Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusLeft}>
              <View style={styles.statusDot} />
              <View>
                <Text style={styles.statusTitle}>Offline Mode Active</Text>
                <Text style={styles.statusSub}>All processing on-device</Text>
              </View>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Secure</Text>
            </View>
          </View>
          <View style={styles.statusStats}>
            <View style={styles.statusStatItem}>
              <Text style={styles.statusStatValue}>3</Text>
              <Text style={styles.statusStatLabel}>Pending Sync</Text>
            </View>
            <View style={styles.statusStatDivider} />
            <View style={styles.statusStatItem}>
              <Text style={styles.statusStatValue}>10</Text>
              <Text style={styles.statusStatLabel}>Total Events</Text>
            </View>
            <View style={styles.statusStatDivider} />
            <View style={styles.statusStatItem}>
              <Text style={styles.statusStatValue}>2</Text>
              <Text style={styles.statusStatLabel}>Enrolled</Text>
            </View>
          </View>
        </View>

        {/* Recognition Settings */}
        <Text style={styles.sectionTitle}>RECOGNITION</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Confidence Threshold</Text>
              <Text style={styles.settingDesc}>
                Minimum match confidence for access
              </Text>
            </View>
          </View>
          <View style={styles.thresholdRow}>
            {thresholdOptions.map(val => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.thresholdBtn,
                  confidenceThreshold === val && styles.thresholdBtnActive,
                ]}
                onPress={() => setConfidenceThreshold(val)}>
                <Text
                  style={[
                    styles.thresholdText,
                    confidenceThreshold === val && styles.thresholdTextActive,
                  ]}>
                  {val}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>High Accuracy Mode</Text>
              <Text style={styles.settingDesc}>
                Uses larger model (~250ms latency)
              </Text>
            </View>
            <Switch
              value={highAccuracy}
              onValueChange={setHighAccuracy}
              trackColor={{false: '#2D2D44', true: 'rgba(255, 107, 0, 0.4)'}}
              thumbColor={highAccuracy ? '#FF6B00' : '#555566'}
            />
          </View>
        </View>

        {/* Liveness Settings */}
        <Text style={styles.sectionTitle}>LIVENESS DETECTION</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Liveness Detection</Text>
              <Text style={styles.settingDesc}>
                Require anti-spoofing checks
              </Text>
            </View>
            <Switch
              value={livenessEnabled}
              onValueChange={setLivenessEnabled}
              trackColor={{false: '#2D2D44', true: 'rgba(255, 107, 0, 0.4)'}}
              thumbColor={livenessEnabled ? '#FF6B00' : '#555566'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Challenges</Text>
              <Text style={styles.settingDesc}>Active liveness prompts</Text>
            </View>
          </View>
          <View style={styles.challengeRow}>
            <View style={styles.challengeItem}>
              <View
                style={[styles.challengeDot, {backgroundColor: '#00E676'}]}
              />
              <Text style={styles.challengeText}>Blink Detection</Text>
            </View>
            <View style={styles.challengeItem}>
              <View
                style={[styles.challengeDot, {backgroundColor: '#00E676'}]}
              />
              <Text style={styles.challengeText}>Head Turn</Text>
            </View>
            <View style={styles.challengeItem}>
              <View
                style={[styles.challengeDot, {backgroundColor: '#00E676'}]}
              />
              <Text style={styles.challengeText}>Anti-Spoof CNN</Text>
            </View>
          </View>
        </View>

        {/* Sync Settings */}
        <Text style={styles.sectionTitle}>DATA & SYNC</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto Sync</Text>
              <Text style={styles.settingDesc}>
                Sync when connectivity is available
              </Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{false: '#2D2D44', true: 'rgba(255, 107, 0, 0.4)'}}
              thumbColor={autoSync ? '#FF6B00' : '#555566'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
              <Text style={styles.settingDesc}>Vibrate on auth result</Text>
            </View>
            <Switch
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              trackColor={{false: '#2D2D44', true: 'rgba(255, 107, 0, 0.4)'}}
              thumbColor={hapticFeedback ? '#FF6B00' : '#555566'}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Storage Usage</Text>
              <Text style={styles.settingDesc}>
                12.4 MB of face data on device
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, {color: '#FF1744'}]}>
                Clear All Data
              </Text>
              <Text style={styles.settingDesc}>
                Remove all enrolled faces and logs
              </Text>
            </View>
            <Text style={[styles.chevron, {color: '#FF1744'}]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Model Info */}
        <Text style={styles.sectionTitle}>MODEL INFORMATION</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.modelRow}>
            <Text style={styles.modelLabel}>Face Detection</Text>
            <Text style={styles.modelValue}>MTCNN v2 (0.5 MB)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.modelRow}>
            <Text style={styles.modelLabel}>Face Embedding</Text>
            <Text style={styles.modelValue}>MobileFaceNet v2 (1.2 MB)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.modelRow}>
            <Text style={styles.modelLabel}>Anti-Spoof</Text>
            <Text style={styles.modelValue}>CNN v3 (2.1 MB)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.modelRow}>
            <Text style={styles.modelLabel}>Runtime</Text>
            <Text style={styles.modelValue}>TFLite + ONNX</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.modelRow}>
            <Text style={styles.modelLabel}>Accelerator</Text>
            <Text style={styles.modelValue}>GPU Delegate</Text>
          </View>
        </View>

        {/* App Info */}
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.modelRow}>
            <Text style={styles.modelLabel}>Version</Text>
            <Text style={styles.modelValue}>1.0.0 (Build 42)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.modelRow}>
            <Text style={styles.modelLabel}>Device</Text>
            <Text style={styles.modelValue}>Android 14</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.modelRow}>
            <Text style={styles.modelLabel}>Hackathon</Text>
            <Text style={[styles.modelValue, {color: '#FF6B00'}]}>
              NHAI 7.0
            </Text>
          </View>
        </View>

        <View style={{height: 40}} />
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
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    marginHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.2)',
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00E676',
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00E676',
  },
  statusSub: {
    fontSize: 12,
    color: '#8888AA',
  },
  statusBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    color: '#00E676',
    fontWeight: '600',
  },
  statusStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 12,
  },
  statusStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusStatLabel: {
    fontSize: 10,
    color: '#8888AA',
    marginTop: 2,
  },
  statusStatDivider: {
    width: 1,
    backgroundColor: '#2D2D44',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555566',
    letterSpacing: 2,
    marginLeft: 20,
    marginBottom: 8,
    marginTop: 4,
  },
  settingsGroup: {
    marginHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#2D2D44',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingDesc: {
    fontSize: 12,
    color: '#8888AA',
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: '#555566',
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: '#2D2D44',
    marginHorizontal: 14,
  },
  thresholdRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 8,
  },
  thresholdBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#0A0A0F',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  thresholdBtnActive: {
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
    borderColor: '#FF6B00',
  },
  thresholdText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8888AA',
  },
  thresholdTextActive: {
    color: '#FF6B00',
  },
  challengeRow: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  challengeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  challengeText: {
    fontSize: 13,
    color: '#CCCCDD',
  },
  modelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modelLabel: {
    fontSize: 14,
    color: '#8888AA',
  },
  modelValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default SettingsScreen;
