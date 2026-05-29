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
  Line,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Text as SvgText,
} from 'react-native-svg';

const {width, height} = Dimensions.get('window');
const CAMERA_HEIGHT = height * 0.55;

type Props = {
  navigation: StackNavigationProp<any>;
};

const EnrollmentScreen: React.FC<Props> = ({navigation}) => {
  const [step, setStep] = useState(0); // 0: position, 1: blink, 2: headTurn, 3: processing, 4: complete
  const [progress, setProgress] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const boxScale = useRef(new Animated.Value(0.95)).current;

  const stepLabels = [
    'Position your face in the frame',
    'Please blink naturally',
    'Slowly turn your head left',
    'Processing enrollment...',
    'Enrollment Complete!',
  ];

  useEffect(() => {
    // Pulse animation for bounding box
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Scan line animation
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();

    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Box breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(boxScale, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(boxScale, {
          toValue: 0.98,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Auto-advance steps for demo
    const timers = [
      setTimeout(() => {
        setStep(1);
        setProgress(25);
      }, 3000),
      setTimeout(() => {
        setStep(2);
        setProgress(50);
      }, 6000),
      setTimeout(() => {
        setStep(3);
        setProgress(75);
      }, 9000),
      setTimeout(() => {
        setStep(4);
        setProgress(100);
      }, 11000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [pulseAnim, scanAnim, fadeAnim, boxScale]);

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 200],
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
        <Text style={styles.headerTitle}>Face Enrollment</Text>
        <View style={styles.offlineBadge}>
          <View style={styles.offlineDot} />
          <Text style={styles.offlineText}>Offline</Text>
        </View>
      </View>

      {/* Camera View (simulated) */}
      <Animated.View style={[styles.cameraContainer, {opacity: fadeAnim}]}>
        {/* Dark camera background with noise texture simulation */}
        <View style={styles.cameraView}>
          {/* Simulated face silhouette */}
          <Svg
            width={width - 32}
            height={CAMERA_HEIGHT}
            viewBox={`0 0 ${width - 32} ${CAMERA_HEIGHT}`}>
            <Defs>
              <LinearGradient id="cameraGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#1a1a2e" />
                <Stop offset="0.5" stopColor="#16162a" />
                <Stop offset="1" stopColor="#0f0f1e" />
              </LinearGradient>
              <LinearGradient id="faceGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#2a2a3e" />
                <Stop offset="1" stopColor="#1e1e32" />
              </LinearGradient>
            </Defs>

            {/* Camera background */}
            <Rect
              x="0"
              y="0"
              width={width - 32}
              height={CAMERA_HEIGHT}
              fill="url(#cameraGrad)"
              rx="16"
            />

            {/* Face oval silhouette */}
            <G
              transform={`translate(${(width - 32) / 2}, ${
                CAMERA_HEIGHT / 2 - 20
              })`}>
              {/* Head shape */}
              <Circle
                cx="0"
                cy="-10"
                r="55"
                fill="url(#faceGrad)"
                stroke="#3a3a4e"
                strokeWidth="1"
              />
              {/* Neck/shoulders hint */}
              <Path
                d="M-40 40 Q-60 55 -80 80 L80 80 Q60 55 40 40"
                fill="url(#faceGrad)"
                stroke="#3a3a4e"
                strokeWidth="1"
              />
              {/* Eyes */}
              <Circle cx="-18" cy="-18" r="5" fill="#3d3d55" />
              <Circle cx="18" cy="-18" r="5" fill="#3d3d55" />
              <Circle cx="-18" cy="-18" r="2" fill="#4a4a66" />
              <Circle cx="18" cy="-18" r="2" fill="#4a4a66" />
              {/* Nose */}
              <Path
                d="M-4 -5 L0 8 L4 -5"
                fill="none"
                stroke="#3a3a4e"
                strokeWidth="1"
              />
              {/* Mouth */}
              <Path
                d="M-12 15 Q0 22 12 15"
                fill="none"
                stroke="#3a3a4e"
                strokeWidth="1.5"
              />
            </G>

            {/* GREEN BOUNDING BOX - Corner bracket style */}
            <G
              transform={`translate(${(width - 32) / 2 - 75}, ${
                CAMERA_HEIGHT / 2 - 105
              })`}>
              {/* Top-left corner */}
              <Path
                d="M0 20 L0 0 L20 0"
                fill="none"
                stroke="#00E676"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Top-right corner */}
              <Path
                d="M130 0 L150 0 L150 20"
                fill="none"
                stroke="#00E676"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Bottom-left corner */}
              <Path
                d="M0 150 L0 170 L20 170"
                fill="none"
                stroke="#00E676"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Bottom-right corner */}
              <Path
                d="M130 170 L150 170 L150 150"
                fill="none"
                stroke="#00E676"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Face alignment guides */}
              <Line
                x1="75"
                y1="0"
                x2="75"
                y2="5"
                stroke="#00E676"
                strokeWidth="1"
                opacity="0.5"
              />
              <Line
                x1="75"
                y1="165"
                x2="75"
                y2="170"
                stroke="#00E676"
                strokeWidth="1"
                opacity="0.5"
              />
              <Line
                x1="0"
                y1="85"
                x2="5"
                y2="85"
                stroke="#00E676"
                strokeWidth="1"
                opacity="0.5"
              />
              <Line
                x1="145"
                y1="85"
                x2="150"
                y2="85"
                stroke="#00E676"
                strokeWidth="1"
                opacity="0.5"
              />

              {/* Center crosshair */}
              <Circle
                cx="75"
                cy="85"
                r="3"
                fill="none"
                stroke="#00E676"
                strokeWidth="1"
                opacity="0.4"
              />
            </G>

            {/* Detection label */}
            <G
              transform={`translate(${(width - 32) / 2 - 75}, ${
                CAMERA_HEIGHT / 2 - 115
              })`}>
              <Rect
                x="0"
                y="0"
                width="95"
                height="18"
                rx="4"
                fill="rgba(0, 230, 118, 0.2)"
              />
              <SvgText
                x="8"
                y="13"
                fill="#00E676"
                fontSize="10"
                fontWeight="600">
                Face Detected
              </SvgText>
            </G>

            {/* Confidence indicator */}
            <G
              transform={`translate(${(width - 32) / 2 + 40}, ${
                CAMERA_HEIGHT / 2 + 65
              })`}>
              <Rect
                x="0"
                y="0"
                width="65"
                height="18"
                rx="4"
                fill="rgba(255, 107, 0, 0.2)"
              />
              <SvgText
                x="8"
                y="13"
                fill="#FF6B00"
                fontSize="10"
                fontWeight="600">
                94.2%
              </SvgText>
            </G>

            {/* Camera metadata overlay */}
            <SvgText x="16" y="24" fill="#555566" fontSize="10">
              CAM_FRONT • 1080p • 30fps
            </SvgText>
            <SvgText x={width - 32 - 90} y="24" fill="#555566" fontSize="10">
              ISO 800 • f/2.0
            </SvgText>

            {/* Timestamp */}
            <SvgText x="16" y={CAMERA_HEIGHT - 12} fill="#555566" fontSize="10">
              2026-05-29 13:15:42
            </SvgText>
          </Svg>

          {/* Animated scan line */}
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [{translateY: scanTranslateY}],
                opacity: step < 3 ? 0.6 : 0,
              },
            ]}
          />
        </View>
      </Animated.View>

      {/* Step Progress */}
      <View style={styles.stepContainer}>
        <View style={styles.stepsRow}>
          {['Position', 'Blink', 'Head Turn', 'Process'].map((label, i) => (
            <View key={i} style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  step > i && styles.stepDotComplete,
                  step === i && styles.stepDotActive,
                ]}>
                {step > i ? (
                  <Text style={styles.stepCheck}>✓</Text>
                ) : (
                  <Text style={styles.stepNumber}>{i + 1}</Text>
                )}
              </View>
              <Text
                style={[styles.stepLabel, step >= i && styles.stepLabelActive]}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, {width: `${progress}%`}]} />
        </View>

        {/* Instruction */}
        <View style={styles.instructionCard}>
          {step === 4 ? (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.successCheck}>✓</Text>
              </View>
              <Text style={styles.successText}>Enrollment Successful</Text>
              <Text style={styles.successSub}>
                Face data stored securely on device
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.instructionEmoji}>
                {step === 0
                  ? '📷'
                  : step === 1
                  ? '👁️'
                  : step === 2
                  ? '↩️'
                  : '⚙️'}
              </Text>
              <Text style={styles.instructionText}>{stepLabels[step]}</Text>
              {step === 1 && (
                <View style={styles.livenessIndicator}>
                  <View style={styles.eyeContainer}>
                    <Text style={styles.eyeText}>👁️ Blink Detected</Text>
                    <View style={styles.livenessCheck}>
                      <Text style={styles.livenessCheckText}>✓</Text>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        {/* Action Buttons */}
        {step === 4 ? (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <Text style={styles.doneButtonText}>Continue to Dashboard</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.hintRow}>
            <View style={styles.hintDot} />
            <Text style={styles.hintText}>
              Hold device at arm's length in good lighting
            </Text>
          </View>
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
  offlineText: {
    fontSize: 11,
    color: '#00E676',
    fontWeight: '600',
  },
  cameraContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cameraView: {
    height: CAMERA_HEIGHT,
    backgroundColor: '#12121e',
    borderRadius: 16,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 60,
    right: 60,
    height: 2,
    backgroundColor: '#00E676',
    top: CAMERA_HEIGHT / 2 - 100,
    shadowColor: '#00E676',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1A1A2E',
    borderWidth: 2,
    borderColor: '#2D2D44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotActive: {
    borderColor: '#FF6B00',
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
  },
  stepDotComplete: {
    borderColor: '#00E676',
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  stepNumber: {
    fontSize: 12,
    color: '#8888AA',
    fontWeight: '600',
  },
  stepCheck: {
    fontSize: 14,
    color: '#00E676',
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 10,
    color: '#555566',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: '#8888AA',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#1A1A2E',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 2,
  },
  instructionCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D2D44',
    alignItems: 'center',
  },
  instructionEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  livenessIndicator: {
    marginTop: 12,
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderRadius: 12,
    padding: 12,
    width: '100%',
  },
  eyeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyeText: {
    fontSize: 14,
    color: '#00E676',
    fontWeight: '500',
  },
  livenessCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00E676',
    alignItems: 'center',
    justifyContent: 'center',
  },
  livenessCheckText: {
    fontSize: 14,
    color: '#0A0A0F',
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    borderWidth: 2,
    borderColor: '#00E676',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successCheck: {
    fontSize: 28,
    color: '#00E676',
  },
  successText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00E676',
  },
  successSub: {
    fontSize: 13,
    color: '#8888AA',
    marginTop: 4,
  },
  doneButton: {
    backgroundColor: '#FF6B00',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  hintDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B00',
    marginRight: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#8888AA',
  },
});

export default EnrollmentScreen;
