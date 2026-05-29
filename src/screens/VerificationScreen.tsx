import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Text as SvgText,
} from 'react-native-svg';

const {width, height} = Dimensions.get('window');
const CAMERA_HEIGHT = height * 0.5;

type Props = {
  navigation: StackNavigationProp<any>;
};

const VerificationScreen: React.FC<Props> = ({navigation}) => {
  const [phase, setPhase] = useState<'scanning' | 'granted' | 'denied'>(
    'scanning',
  );
  const [confidence, setConfidence] = useState(0);
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  const resultFade = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0.5)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scanning animation
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Simulate verification
    let counter = 0;
    const confInterval = setInterval(() => {
      counter += 2;
      setConfidence(Math.min(counter, 94.2));
      if (counter >= 94.2) {
        clearInterval(confInterval);
      }
    }, 50);

    // Show result after 3 seconds
    const timer = setTimeout(() => {
      setPhase('granted');
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(resultScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(resultFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => {
      clearInterval(confInterval);
      clearTimeout(timer);
    };
  }, [scanAnim, pulseAnim, overlayAnim, resultScale, resultFade]);

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 200],
  });

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
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={styles.offlineBadge}>
          <View style={styles.offlineDot} />
          <Text style={styles.offlineTextBadge}>Offline</Text>
        </View>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraView}>
          <Svg
            width={width - 32}
            height={CAMERA_HEIGHT}
            viewBox={`0 0 ${width - 32} ${CAMERA_HEIGHT}`}>
            <Defs>
              <LinearGradient id="camBg" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#1a1a2e" />
                <Stop offset="0.5" stopColor="#16162a" />
                <Stop offset="1" stopColor="#0f0f1e" />
              </LinearGradient>
              <LinearGradient id="faceFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#2a2a3e" />
                <Stop offset="1" stopColor="#1e1e32" />
              </LinearGradient>
            </Defs>

            <Rect
              x="0"
              y="0"
              width={width - 32}
              height={CAMERA_HEIGHT}
              fill="url(#camBg)"
              rx="16"
            />

            {/* Face silhouette */}
            <G
              transform={`translate(${(width - 32) / 2}, ${
                CAMERA_HEIGHT / 2 - 15
              })`}>
              <Circle
                cx="0"
                cy="-10"
                r="50"
                fill="url(#faceFill)"
                stroke="#3a3a4e"
                strokeWidth="1"
              />
              <Path
                d="M-35 35 Q-55 50 -70 75 L70 75 Q55 50 35 35"
                fill="url(#faceFill)"
                stroke="#3a3a4e"
                strokeWidth="1"
              />
              <Circle cx="-16" cy="-16" r="4.5" fill="#3d3d55" />
              <Circle cx="16" cy="-16" r="4.5" fill="#3d3d55" />
              <Circle cx="-16" cy="-16" r="2" fill="#4a4a66" />
              <Circle cx="16" cy="-16" r="2" fill="#4a4a66" />
              <Path
                d="M-4 -3 L0 8 L4 -3"
                fill="none"
                stroke="#3a3a4e"
                strokeWidth="1"
              />
              <Path
                d="M-10 14 Q0 21 10 14"
                fill="none"
                stroke="#3a3a4e"
                strokeWidth="1.5"
              />
            </G>

            {/* Bounding box - green when scanning, bright green when granted */}
            <G
              transform={`translate(${(width - 32) / 2 - 68}, ${
                CAMERA_HEIGHT / 2 - 95
              })`}>
              <Path
                d="M0 18 L0 0 L18 0"
                fill="none"
                stroke={phase === 'granted' ? '#00E676' : '#00E676'}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <Path
                d="M118 0 L136 0 L136 18"
                fill="none"
                stroke={phase === 'granted' ? '#00E676' : '#00E676'}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <Path
                d="M0 142 L0 160 L18 160"
                fill="none"
                stroke={phase === 'granted' ? '#00E676' : '#00E676'}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <Path
                d="M118 160 L136 160 L136 142"
                fill="none"
                stroke={phase === 'granted' ? '#00E676' : '#00E676'}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </G>

            {/* Feature points */}
            {phase === 'scanning' && (
              <G
                transform={`translate(${(width - 32) / 2}, ${
                  CAMERA_HEIGHT / 2 - 15
                })`}>
                {[
                  [-16, -16],
                  [16, -16],
                  [0, 0],
                  [-10, 14],
                  [10, 14],
                  [-22, -5],
                  [22, -5],
                  [0, -25],
                ].map(([x, y], i) => (
                  <Circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#FF6B00"
                    opacity="0.8"
                  />
                ))}
              </G>
            )}

            {/* Camera info */}
            <SvgText x="16" y="24" fill="#555566" fontSize="10">
              VERIFY • 1080p • 30fps
            </SvgText>
            <SvgText x="16" y={CAMERA_HEIGHT - 12} fill="#555566" fontSize="10">
              Processing on device...
            </SvgText>
          </Svg>

          {/* Scan line */}
          {phase === 'scanning' && (
            <Animated.View
              style={[
                styles.scanLine,
                {transform: [{translateY: scanTranslateY}], opacity: 0.5},
              ]}
            />
          )}
        </View>

        {/* Result Overlay */}
        {phase === 'granted' && (
          <Animated.View
            style={[
              styles.resultOverlay,
              {
                opacity: overlayAnim,
              },
            ]}>
            <Animated.View
              style={[
                styles.resultContent,
                {
                  opacity: resultFade,
                  transform: [{scale: resultScale}],
                },
              ]}>
              <View style={styles.resultIconContainer}>
                <View style={styles.resultIcon}>
                  <Text style={styles.resultCheckmark}>✓</Text>
                </View>
              </View>
              <Text style={styles.resultTitle}>ACCESS GRANTED</Text>
              <Text style={styles.resultName}>Rajesh Kumar</Text>
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>Confidence</Text>
                <Text style={styles.confidenceValue}>94.2%</Text>
              </View>
              <View style={styles.resultDetailsRow}>
                <View style={styles.resultDetailItem}>
                  <Text style={styles.resultDetailLabel}>Liveness</Text>
                  <Text style={styles.resultDetailValueGreen}>Passed</Text>
                </View>
                <View style={styles.resultDivider} />
                <View style={styles.resultDetailItem}>
                  <Text style={styles.resultDetailLabel}>Latency</Text>
                  <Text style={styles.resultDetailValue}>180ms</Text>
                </View>
                <View style={styles.resultDivider} />
                <View style={styles.resultDetailItem}>
                  <Text style={styles.resultDetailLabel}>Mode</Text>
                  <Text style={styles.resultDetailValue}>Offline</Text>
                </View>
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        {phase === 'scanning' ? (
          <>
            {/* Real-time metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>45ms</Text>
                <Text style={styles.metricLabel}>Detection</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>120ms</Text>
                <Text style={styles.metricLabel}>Embedding</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{confidence.toFixed(1)}%</Text>
                <Text style={styles.metricLabel}>Confidence</Text>
              </View>
            </View>

            <View style={styles.scanningIndicator}>
              <Animated.View
                style={[styles.scanDot, {transform: [{scale: pulseAnim}]}]}
              />
              <Text style={styles.scanningText}>Scanning face...</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.resultTimestamp}>
              <Text style={styles.timestampText}>
                Verified at {new Date().toLocaleTimeString()}
              </Text>
              <View style={styles.syncedBadge}>
                <Text style={styles.syncedText}>⟳ Queued for sync</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.verifyAgainBtn}
              onPress={() => {
                setPhase('scanning');
                setConfidence(0);
              }}
              activeOpacity={0.8}>
              <Text style={styles.verifyAgainText}>Verify Another</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </>
        )}
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
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
  offlineTextBadge: {
    fontSize: 11,
    color: '#00E676',
    fontWeight: '600',
  },
  cameraContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cameraView: {
    height: CAMERA_HEIGHT,
    backgroundColor: '#12121e',
    borderRadius: 16,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 55,
    right: 55,
    height: 2,
    backgroundColor: '#FF6B00',
    top: CAMERA_HEIGHT / 2 - 80,
    shadowColor: '#FF6B00',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 20, 0, 0.85)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContent: {
    alignItems: 'center',
    padding: 24,
  },
  resultIconContainer: {
    marginBottom: 16,
  },
  resultIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 230, 118, 0.2)',
    borderWidth: 3,
    borderColor: '#00E676',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCheckmark: {
    fontSize: 36,
    color: '#00E676',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00E676',
    letterSpacing: 3,
    marginBottom: 8,
  },
  resultName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#8888AA',
    marginRight: 8,
  },
  confidenceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#00E676',
  },
  resultDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  resultDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  resultDetailLabel: {
    fontSize: 11,
    color: '#8888AA',
    marginBottom: 2,
  },
  resultDetailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultDetailValueGreen: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00E676',
  },
  resultDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  bottomPanel: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF6B00',
  },
  metricLabel: {
    fontSize: 11,
    color: '#8888AA',
    marginTop: 2,
  },
  scanningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  scanDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B00',
    marginRight: 10,
  },
  scanningText: {
    fontSize: 15,
    color: '#8888AA',
    fontWeight: '500',
  },
  resultTimestamp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timestampText: {
    fontSize: 13,
    color: '#8888AA',
  },
  syncedBadge: {
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  syncedText: {
    fontSize: 11,
    color: '#FF6B00',
    fontWeight: '600',
  },
  verifyAgainBtn: {
    backgroundColor: '#FF6B00',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  verifyAgainText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  doneBtn: {
    backgroundColor: '#1A1A2E',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  doneText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8888AA',
  },
});

export default VerificationScreen;
