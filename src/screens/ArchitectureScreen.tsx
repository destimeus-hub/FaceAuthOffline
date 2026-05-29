import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import Svg, {
  Rect,
  Text as SvgText,
  Line,
  Defs,
  LinearGradient,
  Stop,
  G,
  Path,
} from 'react-native-svg';

const {width} = Dimensions.get('window');
const SVG_WIDTH = width - 32;
const SVG_HEIGHT = 680;

type Props = {
  navigation: StackNavigationProp<any>;
};

const ArchitectureScreen: React.FC<Props> = ({navigation}) => {
  const layers = [
    {
      title: 'Application Layer',
      subtitle: 'React Native 0.73 + TypeScript',
      color: '#FF6B00',
      items: [
        'Splash',
        'Enrollment',
        'Verification',
        'Auth Log',
        'Settings',
        'Benchmark',
      ],
    },
    {
      title: 'Detection Pipeline',
      subtitle: 'On-Device AI Processing',
      color: '#448AFF',
      items: [
        'Face Detection\n(MTCNN)',
        'Alignment\n& Crop',
        'Embedding\n(MobileFaceNet)',
        'Feature\nMatching',
      ],
    },
    {
      title: 'Liveness Pipeline',
      subtitle: 'Anti-Spoofing Verification',
      color: '#00E676',
      items: [
        'Blink\nDetection',
        'Head Turn\nTracking',
        'Anti-Spoof\nCNN',
        'Score\nFusion',
      ],
    },
    {
      title: 'Storage Layer',
      subtitle: 'On-Device Persistence',
      color: '#FFD600',
      items: [
        'SQLite\n(Auth Events)',
        'SQLite\n(Users)',
        'MMKV\n(Settings)',
        'MMKV\n(Cache)',
      ],
    },
    {
      title: 'Sync Layer',
      subtitle: 'Offline-First Architecture',
      color: '#E040FB',
      items: [
        'Offline\nQueue',
        'Connectivity\nCheck',
        'Push to\nServer',
        'Purge\nSynced',
      ],
    },
  ];

  const techStack = [
    {name: 'React Native', version: '0.73', color: '#61DAFB'},
    {name: 'TFLite', version: '2.14', color: '#FF6F00'},
    {name: 'ONNX Runtime', version: '1.16', color: '#005CED'},
    {name: 'SQLite', version: '3.x', color: '#003B57'},
    {name: 'MMKV', version: '2.x', color: '#00E676'},
    {name: 'Zustand', version: '4.x', color: '#443322'},
  ];

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
        <Text style={styles.headerTitle}>Architecture</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Architecture Diagram */}
        <View style={styles.diagramContainer}>
          <Svg
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
            <Defs>
              <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#12121e" />
                <Stop offset="1" stopColor="#0A0A0F" />
              </LinearGradient>
            </Defs>

            {/* Background */}
            <Rect
              x="0"
              y="0"
              width={SVG_WIDTH}
              height={SVG_HEIGHT}
              fill="url(#bgGrad)"
              rx="16"
            />

            {/* Title */}
            <SvgText
              x={SVG_WIDTH / 2}
              y="30"
              textAnchor="middle"
              fill="#FF6B00"
              fontSize="14"
              fontWeight="700">
              FaceAuth Offline — System Architecture
            </SvgText>
            <SvgText
              x={SVG_WIDTH / 2}
              y="46"
              textAnchor="middle"
              fill="#555566"
              fontSize="10">
              NHAI Hackathon 7.0 • Offline-First Design
            </SvgText>

            {/* Layers */}
            {layers.map((layer, layerIndex) => {
              const layerY = 60 + layerIndex * 122;
              const itemWidth = (SVG_WIDTH - 60) / layer.items.length;

              return (
                <G key={layerIndex}>
                  {/* Layer background */}
                  <Rect
                    x="12"
                    y={layerY}
                    width={SVG_WIDTH - 24}
                    height={108}
                    rx="10"
                    fill="rgba(255,255,255,0.02)"
                    stroke={layer.color}
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />

                  {/* Layer title */}
                  <SvgText
                    x="22"
                    y={layerY + 18}
                    fill={layer.color}
                    fontSize="11"
                    fontWeight="700">
                    {layer.title}
                  </SvgText>
                  <SvgText x="22" y={layerY + 30} fill="#555566" fontSize="8">
                    {layer.subtitle}
                  </SvgText>

                  {/* Items */}
                  {layer.items.map((item, itemIndex) => {
                    const itemX = 22 + itemIndex * itemWidth;
                    const iW = itemWidth - 8;

                    return (
                      <G key={itemIndex}>
                        <Rect
                          x={itemX}
                          y={layerY + 38}
                          width={iW}
                          height={58}
                          rx="8"
                          fill="rgba(255,255,255,0.03)"
                          stroke={layer.color}
                          strokeWidth="0.8"
                          strokeOpacity="0.4"
                        />
                        {item.split('\n').map((line, lineIndex) => (
                          <SvgText
                            key={lineIndex}
                            x={itemX + iW / 2}
                            y={layerY + 62 + lineIndex * 14}
                            textAnchor="middle"
                            fill="#CCCCDD"
                            fontSize="9"
                            fontWeight={lineIndex === 0 ? '600' : '400'}>
                            {line}
                          </SvgText>
                        ))}

                        {/* Arrow between items */}
                        {itemIndex < layer.items.length - 1 && (
                          <G>
                            <Line
                              x1={itemX + iW + 1}
                              y1={layerY + 67}
                              x2={itemX + iW + 7}
                              y2={layerY + 67}
                              stroke={layer.color}
                              strokeWidth="1.5"
                              strokeOpacity="0.6"
                            />
                            <Path
                              d={`M${itemX + iW + 5} ${layerY + 64} L${
                                itemX + iW + 8
                              } ${layerY + 67} L${itemX + iW + 5} ${
                                layerY + 70
                              }`}
                              fill="none"
                              stroke={layer.color}
                              strokeWidth="1.5"
                              strokeOpacity="0.6"
                            />
                          </G>
                        )}
                      </G>
                    );
                  })}

                  {/* Vertical arrows between layers */}
                  {layerIndex < layers.length - 1 && (
                    <G>
                      <Line
                        x1={SVG_WIDTH / 2}
                        y1={layerY + 108}
                        x2={SVG_WIDTH / 2}
                        y2={layerY + 122}
                        stroke="#555566"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                      />
                      <Path
                        d={`M${SVG_WIDTH / 2 - 4} ${layerY + 118} L${
                          SVG_WIDTH / 2
                        } ${layerY + 122} L${SVG_WIDTH / 2 + 4} ${
                          layerY + 118
                        }`}
                        fill="none"
                        stroke="#555566"
                        strokeWidth="1"
                      />
                    </G>
                  )}
                </G>
              );
            })}
          </Svg>
        </View>

        {/* Tech Stack Badges */}
        <Text style={styles.sectionTitle}>TECHNOLOGY STACK</Text>
        <View style={styles.techGrid}>
          {techStack.map((tech, i) => (
            <View
              key={i}
              style={[styles.techBadge, {borderColor: tech.color + '40'}]}>
              <View style={[styles.techDot, {backgroundColor: tech.color}]} />
              <View>
                <Text style={styles.techName}>{tech.name}</Text>
                <Text style={styles.techVersion}>v{tech.version}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Key Features */}
        <Text style={styles.sectionTitle}>KEY FEATURES</Text>
        <View style={styles.featuresCard}>
          {[
            {
              icon: '🔒',
              title: 'On-Device Processing',
              desc: 'Zero data leaves the device',
            },
            {
              icon: '⚡',
              title: 'Sub-200ms Latency',
              desc: 'Real-time face verification',
            },
            {
              icon: '📡',
              title: 'Offline-First',
              desc: 'Works without any connectivity',
            },
            {
              icon: '🛡️',
              title: 'Anti-Spoofing',
              desc: 'Multi-factor liveness detection',
            },
          ].map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
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
  diagramContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
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
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  techBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  techDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  techName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  techVersion: {
    fontSize: 10,
    color: '#8888AA',
  },
  featuresCard: {
    marginHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D44',
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  featureDesc: {
    fontSize: 12,
    color: '#8888AA',
  },
});

export default ArchitectureScreen;
