import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface SyncIndicatorProps {
  pendingCount: number;
  lastSyncTime?: string;
}

const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  pendingCount,
  lastSyncTime,
}) => {
  const hasItems = pendingCount > 0;

  return (
    <View style={[styles.container, hasItems && styles.containerPending]}>
      <View style={styles.row}>
        <Text style={styles.icon}>{hasItems ? '⟳' : '✓'}</Text>
        <View>
          <Text style={[styles.title, hasItems && styles.titlePending]}>
            {hasItems
              ? `${pendingCount} event${
                  pendingCount > 1 ? 's' : ''
                } pending sync`
              : 'All synced'}
          </Text>
          {lastSyncTime && (
            <Text style={styles.subtitle}>Last sync: {lastSyncTime}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.2)',
  },
  containerPending: {
    backgroundColor: 'rgba(255, 107, 0, 0.08)',
    borderColor: 'rgba(255, 107, 0, 0.2)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
    color: '#FF6B00',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00E676',
  },
  titlePending: {
    color: '#FF6B00',
  },
  subtitle: {
    fontSize: 11,
    color: '#8888AA',
    marginTop: 1,
  },
});

export default SyncIndicator;
