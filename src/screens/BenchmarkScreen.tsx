import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<any>;
};

type BenchmarkItem = {
  label: string;
  value: number;
  unit: string;
  color: string;
  maxValue: number;
  icon: string;
  description: string;
};

const benchmarks: BenchmarkItem[] = [
  {
    label: 'Face Detection',
    value: 45,
    unit: 'ms',
    color: '#448AFF',
    maxValue: 200,
    icon: '🔍',
    description: 'MTCNN multi-task cascaded CNN',
  },
  {
    label: 'Face Embedding',
    value: 120,
    unit: 'ms',
    color: '#FF6B00',
    maxValue: 200,
    icon: '🧬',
    description: 'MobileFaceNet v2 (128-dim)',
  },
  {
    label: 'Liveness Check',
    value: 35,
    unit: 'ms',
    color: '#00E676',
    maxValue: 200,
    icon: '👁️',
    description: 'Anti-spoof CNN classifier',
  },
  {
    label: 'Total Pipeline',
    value: 180,
    unit: 'ms',
    color: '#FF6B00',
    maxValue: 300,
    icon: '⚡',
    description: 'End-to-end on-device inference',
  },
];

const modelSpecs = [
  {
    name: 'MobileFaceNet v2',
    size: '1.2 MB',
    format: 'TFLite',
    accuracy: '99.2%',
  },
  {name: 'MTCNN Detector', size: '0.5 MB', format: 'TFLite', accuracy: '98.7%'},
  {name: 'Anti-Spoof CNN', size: '2.1 MB', format: 'ONNX', accuracy: '97.8%'},
];

const BenchmarkScreen: React.FC<Props> = ({navigation}) => {
  const barAnims = useRef(benchmarks.map(() => new Animated.Value(0))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    benchmarks.forEach((_, i) => {
      Animated.timing(barAnims[i], {
        toValue: 1,
        duration: 800,
        delay: i * 200,
        useNativeDriver: false,
      }).start();
    });
  }, [fadeAnim, barAnims]);

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
        <Text style={styles.headerTitle}>Benchmarks</Text>
        <View style={styles.gpuBadge}>
          <Text style={styles.gpuText}>GPU Accel</Text>
        </View>
      </View>

      <Animated.ScrollView
        style={[styles.scrollView, {opacity: fadeAnim}]}
        showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Pipeline Performance</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>180</Text>
              <Text style={styles.summaryUnit}>ms</Text>
              <Text style={styles.summaryLabel}>Total Latency</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>5.5</Text>
              <Text style={styles.summaryUnit}>fps</Text>
              <Text style={styles.summaryLabel}>Throughput</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>3.8</Text>
              <Text style={styles.summaryUnit}>MB</Text>
              <Text style={styles.summaryLabel}>Model Size</Text>
            </View>
          </View>
        </View>

        {/* Pipeline Breakdown */}
        <Text style={styles.sectionTitle}>PIPELINE BREAKDOWN</Text>
        {benchmarks.map((item, index) => {
          const barWidth = barAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', `${(item.value / item.maxValue) * 100}%`],
          });

          return (
            <View key={index} style={styles.benchCard}>
              <View style={styles.benchHeader}>
                <View style={styles.benchLeft}>
                  <Text style={styles.benchIcon}>{item.icon}</Text>
                  <View>
                    <Text style={styles.benchLabel}>{item.label}</Text>
                    <Text style={styles.benchDesc}>{item.description}</Text>
                  </View>
                </View>
                <View style={styles.benchRight}>
                  <Text style={[styles.benchValue, {color: item.color}]}>
                    {item.value}
                  </Text>
                  <Text style={styles.benchUnit}>{item.unit}</Text>
                </View>
              </View>
              <View style={styles.benchBarTrack}>
                <Animated.View
                  style={[
                    styles.benchBar,
                    {
                      width: barWidth,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
              {index === benchmarks.length - 1 && (
                <View style={styles.pipelineBreakdown}>
                  <Text style={styles.breakdownText}>
                    Detection (45ms) + Embedding (120ms) + Liveness (35ms) =
                    180ms*
                  </Text>
                  <Text style={styles.breakdownNote}>
                    *Includes 20ms overhead for frame preprocessing
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Model Specifications */}
        <Text style={styles.sectionTitle}>MODEL SPECIFICATIONS</Text>
        <View style={styles.modelsCard}>
          <View style={styles.modelHeader}>
            <Text style={styles.modelHeaderText}>Model</Text>
            <Text style={styles.modelHeaderText}>Size</Text>
            <Text style={styles.modelHeaderText}>Format</Text>
            <Text style={styles.modelHeaderText}>Accuracy</Text>
          </View>
          {modelSpecs.map((model, index) => (
            <View key={index}>
              {index > 0 && <View style={styles.modelDivider} />}
              <View style={styles.modelRow}>
                <Text style={styles.modelName}>{model.name}</Text>
                <Text style={styles.modelDetail}>{model.size}</Text>
                <View style={styles.formatBadge}>
                  <Text style={styles.formatText}>{model.format}</Text>
                </View>
                <Text style={[styles.modelDetail, {color: '#00E676'}]}>
                  {model.accuracy}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Hardware Info */}
        <Text style={styles.sectionTitle}>HARDWARE ACCELERATION</Text>
        <View style={styles.hwCard}>
          <View style={styles.hwRow}>
            <Text style={styles.hwLabel}>Inference Engine</Text>
            <Text style={styles.hwValue}>TFLite 2.14 + ONNX Runtime 1.16</Text>
          </View>
          <View style={styles.hwDivider} />
          <View style={styles.hwRow}>
            <Text style={styles.hwLabel}>GPU Delegate</Text>
            <View style={styles.hwActiveBadge}>
              <View style={styles.hwActiveDot} />
              <Text style={styles.hwActiveText}>Active</Text>
            </View>
          </View>
          <View style={styles.hwDivider} />
          <View style={styles.hwRow}>
            <Text style={styles.hwLabel}>NNAPI</Text>
            <View style={styles.hwActiveBadge}>
              <View style={styles.hwActiveDot} />
              <Text style={styles.hwActiveText}>Available</Text>
            </View>
          </View>
          <View style={styles.hwDivider} />
          <View style={styles.hwRow}>
            <Text style={styles.hwLabel}>Quantization</Text>
            <Text style={styles.hwValue}>INT8 (Dynamic)</Text>
          </View>
          <View style={styles.hwDivider} />
          <View style={styles.hwRow}>
            <Text style={styles.hwLabel}>Memory Usage</Text>
            <Text style={styles.hwValue}>~48 MB Peak</Text>
          </View>
        </View>

        {/* Comparison */}
        <Text style={styles.sectionTitle}>COMPARISON</Text>
        <View style={styles.compareCard}>
          <View style={styles.compareHeader}>
            <Text style={styles.compareHeaderText}>Solution</Text>
            <Text style={styles.compareHeaderText}>Latency</Text>
            <Text style={styles.compareHeaderText}>Offline</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={[styles.compareName, {color: '#FF6B00'}]}>
              FaceAuth (Ours)
            </Text>
            <Text style={[styles.compareValue, {color: '#00E676'}]}>180ms</Text>
            <Text style={[styles.compareValue, {color: '#00E676'}]}>✓</Text>
          </View>
          <View style={styles.compareDivider} />
          <View style={styles.compareRow}>
            <Text style={styles.compareName}>Cloud-based API</Text>
            <Text style={styles.compareValue}>800ms+</Text>
            <Text style={[styles.compareValue, {color: '#FF1744'}]}>✗</Text>
          </View>
          <View style={styles.compareDivider} />
          <View style={styles.compareRow}>
            <Text style={styles.compareName}>On-device (Unopt.)</Text>
            <Text style={styles.compareValue}>450ms</Text>
            <Text style={styles.compareValue}>✓</Text>
          </View>
        </View>

        <View style={{height: 40}} />
      </Animated.ScrollView>
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
  gpuBadge: {
    backgroundColor: 'rgba(68, 138, 255, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(68, 138, 255, 0.3)',
  },
  gpuText: {
    fontSize: 11,
    color: '#448AFF',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    marginHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D2D44',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8888AA',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FF6B00',
  },
  summaryUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8888AA',
    marginTop: -4,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#555566',
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#2D2D44',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555566',
    letterSpacing: 2,
    marginLeft: 20,
    marginBottom: 8,
  },
  benchCard: {
    marginHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
    marginBottom: 8,
  },
  benchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  benchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  benchLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  benchDesc: {
    fontSize: 11,
    color: '#8888AA',
  },
  benchRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  benchValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  benchUnit: {
    fontSize: 14,
    color: '#8888AA',
    marginLeft: 2,
  },
  benchBarTrack: {
    height: 6,
    backgroundColor: '#0A0A0F',
    borderRadius: 3,
    overflow: 'hidden',
  },
  benchBar: {
    height: '100%',
    borderRadius: 3,
  },
  pipelineBreakdown: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 107, 0, 0.05)',
    borderRadius: 8,
  },
  breakdownText: {
    fontSize: 11,
    color: '#8888AA',
  },
  breakdownNote: {
    fontSize: 10,
    color: '#555566',
    marginTop: 2,
    fontStyle: 'italic',
  },
  modelsCard: {
    marginHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2D2D44',
    marginBottom: 20,
  },
  modelHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D44',
  },
  modelHeaderText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: '#555566',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  modelDivider: {
    height: 1,
    backgroundColor: '#2D2D44',
    marginVertical: 6,
  },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  modelName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modelDetail: {
    flex: 1,
    fontSize: 13,
    color: '#8888AA',
    textAlign: 'center',
  },
  formatBadge: {
    flex: 1,
    alignItems: 'center',
  },
  formatText: {
    fontSize: 11,
    color: '#448AFF',
    fontWeight: '600',
    backgroundColor: 'rgba(68, 138, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  hwCard: {
    marginHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#2D2D44',
    marginBottom: 20,
  },
  hwRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  hwLabel: {
    fontSize: 14,
    color: '#8888AA',
  },
  hwValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  hwDivider: {
    height: 1,
    backgroundColor: '#2D2D44',
    marginHorizontal: 14,
  },
  hwActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  hwActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
    marginRight: 6,
  },
  hwActiveText: {
    fontSize: 12,
    color: '#00E676',
    fontWeight: '600',
  },
  compareCard: {
    marginHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2D2D44',
    marginBottom: 20,
  },
  compareHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D44',
  },
  compareHeaderText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: '#555566',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  compareName: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  compareValue: {
    flex: 1,
    fontSize: 13,
    color: '#8888AA',
    textAlign: 'center',
    fontWeight: '600',
  },
  compareDivider: {
    height: 1,
    backgroundColor: '#2D2D44',
    marginVertical: 2,
  },
});

export default BenchmarkScreen;
