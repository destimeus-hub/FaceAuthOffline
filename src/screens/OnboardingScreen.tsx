import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
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

const {width} = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<any>;
};

const pages = [
  {
    title: 'Face Recognition',
    subtitle: 'On-Device AI',
    description:
      'Advanced facial recognition powered by MobileFaceNet. All processing happens locally — no internet required.',
    icon: 'face',
    color: '#FF6B00',
  },
  {
    title: 'Liveness Detection',
    subtitle: 'Anti-Spoofing',
    description:
      'Multi-factor liveness verification with blink detection, head turn tracking, and deep learning anti-spoof.',
    icon: 'liveness',
    color: '#00E676',
  },
  {
    title: 'Offline First',
    subtitle: 'Always Available',
    description:
      'Works in remote highway locations with zero connectivity. Syncs automatically when back online.',
    icon: 'offline',
    color: '#448AFF',
  },
];

const OnboardingScreen: React.FC<Props> = ({navigation}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        scrollRef.current?.scrollTo({x: nextPage * width, animated: true});
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      navigation.replace('Main');
    }
  };

  const handleSkip = () => {
    navigation.replace('Main');
  };

  const renderIcon = (type: string, color: string) => {
    switch (type) {
      case 'face':
        return (
          <Svg width={160} height={160} viewBox="0 0 160 160">
            <Defs>
              <LinearGradient id="faceGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity="0.2" />
                <Stop offset="1" stopColor={color} stopOpacity="0.05" />
              </LinearGradient>
            </Defs>
            <Circle
              cx="80"
              cy="80"
              r="70"
              fill="url(#faceGrad)"
              stroke={color}
              strokeWidth="2"
              strokeDasharray="8,4"
            />
            <Circle
              cx="80"
              cy="72"
              r="28"
              fill="none"
              stroke={color}
              strokeWidth="2.5"
            />
            <Circle cx="70" cy="66" r="3" fill={color} />
            <Circle cx="90" cy="66" r="3" fill={color} />
            <Path
              d="M72 80 Q80 88 88 80"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Scan corners */}
            <Path
              d="M35 45 L35 35 L45 35"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Path
              d="M115 35 L125 35 L125 45"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Path
              d="M35 115 L35 125 L45 125"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Path
              d="M125 115 L125 125 L115 125"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Scan line */}
            <Rect
              x="40"
              y="95"
              width="80"
              height="2"
              rx="1"
              fill={color}
              opacity="0.6"
            />
          </Svg>
        );
      case 'liveness':
        return (
          <Svg width={160} height={160} viewBox="0 0 160 160">
            <Defs>
              <LinearGradient id="liveGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity="0.2" />
                <Stop offset="1" stopColor={color} stopOpacity="0.05" />
              </LinearGradient>
            </Defs>
            <Circle
              cx="80"
              cy="80"
              r="70"
              fill="url(#liveGrad)"
              stroke={color}
              strokeWidth="2"
              strokeDasharray="8,4"
            />
            {/* Eye */}
            <Path
              d="M45 72 Q80 48 115 72 Q80 96 45 72 Z"
              fill="none"
              stroke={color}
              strokeWidth="2.5"
            />
            <Circle
              cx="80"
              cy="72"
              r="14"
              fill="none"
              stroke={color}
              strokeWidth="2"
            />
            <Circle cx="80" cy="72" r="6" fill={color} />
            {/* Blink lines */}
            <Path
              d="M52 80 L52 88"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <Path
              d="M64 84 L64 92"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <Path
              d="M96 84 L96 92"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <Path
              d="M108 80 L108 88"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Check */}
            <Circle cx="115" cy="115" r="18" fill={color} opacity="0.2" />
            <Path
              d="M107 115 L113 121 L125 109"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'offline':
        return (
          <Svg width={160} height={160} viewBox="0 0 160 160">
            <Defs>
              <LinearGradient id="offGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity="0.2" />
                <Stop offset="1" stopColor={color} stopOpacity="0.05" />
              </LinearGradient>
            </Defs>
            <Circle
              cx="80"
              cy="80"
              r="70"
              fill="url(#offGrad)"
              stroke={color}
              strokeWidth="2"
              strokeDasharray="8,4"
            />
            {/* Database icon */}
            <Path
              d="M50 55 Q80 40 110 55 L110 105 Q80 120 50 105 Z"
              fill="none"
              stroke={color}
              strokeWidth="2.5"
            />
            <Path
              d="M50 55 Q80 70 110 55"
              fill="none"
              stroke={color}
              strokeWidth="2"
            />
            <Path
              d="M50 72 Q80 87 110 72"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              opacity="0.5"
            />
            <Path
              d="M50 89 Q80 104 110 89"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              opacity="0.5"
            />
            {/* Wifi off icon */}
            <Path
              d="M30 35 L45 50"
              stroke="#FF1744"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <Path
              d="M45 35 L30 50"
              stroke="#FF1744"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Sync arrows */}
            <Path
              d="M120 90 A20 20 0 0 1 130 110"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M130 110 L126 104 L133 106"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />

      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}>
        {pages.map((page, index) => (
          <View key={index} style={styles.page}>
            <View style={styles.iconContainer}>
              {renderIcon(page.icon, page.color)}
            </View>
            <Text style={[styles.subtitle, {color: page.color}]}>
              {page.subtitle}
            </Text>
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.description}>{page.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentPage === index && styles.dotActive,
              currentPage === index && {backgroundColor: pages[index].color},
            ]}
          />
        ))}
      </View>

      {/* Features row */}
      <View style={styles.featuresRow}>
        <View style={styles.featureItem}>
          <Text style={styles.featureValue}>{'<'}180ms</Text>
          <Text style={styles.featureLabel}>Total Latency</Text>
        </View>
        <View style={styles.featureDivider} />
        <View style={styles.featureItem}>
          <Text style={styles.featureValue}>99.2%</Text>
          <Text style={styles.featureLabel}>Accuracy</Text>
        </View>
        <View style={styles.featureDivider} />
        <View style={styles.featureItem}>
          <Text style={styles.featureValue}>100%</Text>
          <Text style={styles.featureLabel}>Offline</Text>
        </View>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={[styles.ctaButton, {backgroundColor: pages[currentPage].color}]}
        onPress={handleNext}
        activeOpacity={0.8}>
        <Text style={styles.ctaText}>
          {currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  skipBtn: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 15,
    color: '#8888AA',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  iconContainer: {
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#8888AA',
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D2D44',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  featureLabel: {
    fontSize: 11,
    color: '#8888AA',
    marginTop: 2,
    letterSpacing: 1,
  },
  featureDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#2D2D44',
  },
  ctaButton: {
    marginHorizontal: 24,
    marginBottom: 40,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

export default OnboardingScreen;
