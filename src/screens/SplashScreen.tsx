import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import Svg, {
  Path,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const {width, height} = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<any>;
};

const SplashScreen: React.FC<Props> = ({navigation}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const badgeFade = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Pulsing glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Main animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(badgeFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start(() => {
      navigation.replace('Onboarding');
    });
  }, [navigation, fadeAnim, scaleAnim, progressAnim, badgeFade, glowAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />

      {/* Background gradient circles */}
      <Animated.View style={[styles.bgCircle1, {opacity: glowAnim}]} />
      <Animated.View style={[styles.bgCircle2, {opacity: glowAnim}]} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        {/* NHAI Shield Logo */}
        <View style={styles.shieldContainer}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Defs>
              <LinearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FF6B00" />
                <Stop offset="1" stopColor="#FF8533" />
              </LinearGradient>
              <LinearGradient id="innerGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#1A1A2E" />
                <Stop offset="1" stopColor="#0A0A0F" />
              </LinearGradient>
            </Defs>
            {/* Shield shape */}
            <Path
              d="M60 8 L105 28 L105 60 C105 88 60 112 60 112 C60 112 15 88 15 60 L15 28 Z"
              fill="url(#shieldGrad)"
              stroke="#FF6B00"
              strokeWidth="2"
            />
            <Path
              d="M60 18 L95 35 L95 58 C95 82 60 102 60 102 C60 102 25 82 25 58 L25 35 Z"
              fill="url(#innerGrad)"
            />
            {/* Face scan icon */}
            <Rect x="40" y="40" width="8" height="3" rx="1" fill="#FF6B00" />
            <Rect x="40" y="40" width="3" height="8" rx="1" fill="#FF6B00" />
            <Rect x="72" y="40" width="8" height="3" rx="1" fill="#FF6B00" />
            <Rect x="77" y="40" width="3" height="8" rx="1" fill="#FF6B00" />
            <Rect x="40" y="77" width="8" height="3" rx="1" fill="#FF6B00" />
            <Rect x="40" y="72" width="3" height="8" rx="1" fill="#FF6B00" />
            <Rect x="72" y="77" width="8" height="3" rx="1" fill="#FF6B00" />
            <Rect x="77" y="72" width="3" height="8" rx="1" fill="#FF6B00" />
            {/* Face circle */}
            <Circle
              cx="60"
              cy="55"
              r="10"
              fill="none"
              stroke="#FF6B00"
              strokeWidth="2"
              strokeDasharray="4,3"
            />
            <Circle cx="60" cy="55" r="4" fill="#FF6B00" opacity="0.5" />
            {/* Scan line */}
            <Rect
              x="42"
              y="65"
              width="36"
              height="2"
              rx="1"
              fill="#FF6B00"
              opacity="0.8"
            />
          </Svg>
        </View>

        <Text style={styles.appName}>FaceAuth</Text>
        <Text style={styles.appNameAccent}>Offline</Text>
        <View style={styles.divider} />
        <Text style={styles.nhaiText}>NATIONAL HIGHWAYS</Text>
        <Text style={styles.nhaiText}>AUTHORITY OF INDIA</Text>
        <Text style={styles.tagline}>Secure • Offline • Real-time</Text>
      </Animated.View>

      {/* Offline Badge */}
      <Animated.View style={[styles.offlineBadge, {opacity: badgeFade}]}>
        <View style={styles.offlineDot} />
        <Text style={styles.offlineText}>Offline Mode Active</Text>
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, {width: progressWidth}]} />
        </View>
        <Text style={styles.loadingText}>Initializing secure modules...</Text>
      </View>

      {/* Version */}
      <Text style={styles.version}>v1.0.0 • NHAI Hackathon 7.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FF6B00',
    opacity: 0.05,
    top: height * 0.15,
    left: -50,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF6B00',
    opacity: 0.03,
    bottom: height * 0.2,
    right: -30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  shieldContainer: {
    marginBottom: 24,
    shadowColor: '#FF6B00',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  appNameAccent: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FF6B00',
    letterSpacing: 2,
    marginTop: -8,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#FF6B00',
    marginVertical: 16,
    borderRadius: 2,
  },
  nhaiText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8888AA',
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#8888AA',
    marginTop: 12,
    letterSpacing: 2,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 32,
  },
  offlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676',
    marginRight: 8,
  },
  offlineText: {
    fontSize: 13,
    color: '#00E676',
    fontWeight: '600',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.7,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: '#1A1A2E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 12,
    color: '#8888AA',
    marginTop: 8,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 11,
    color: '#555566',
    letterSpacing: 1,
  },
});

export default SplashScreen;
