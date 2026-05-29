import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface OfflineBadgeProps {
  compact?: boolean;
}

const OfflineBadge: React.FC<OfflineBadgeProps> = ({compact = false}) => {
  return (
    <View style={[styles.badge, compact && styles.badgeCompact]}>
      <View style={styles.dot} />
      <Text style={[styles.text, compact && styles.textCompact]}>
        {compact ? 'Offline' : 'Offline Mode Active'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeCompact: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00E676',
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    color: '#00E676',
    fontWeight: '600',
  },
  textCompact: {
    fontSize: 11,
  },
});

export default OfflineBadge;
