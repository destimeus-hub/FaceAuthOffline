import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface FaceBoundingBoxProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  label?: string;
  confidence?: number;
  animated?: boolean;
}

const FaceBoundingBox: React.FC<FaceBoundingBoxProps> = ({
  x = 0,
  y = 0,
  width = 150,
  height = 170,
  color = '#00E676',
  label = 'Face Detected',
  confidence,
  animated: _animated = true,
}) => {
  const cornerLength = 20;
  const cornerWidth = 3;

  return (
    <View
      style={[
        styles.container,
        {
          left: x,
          top: y,
          width: width,
          height: height,
        },
      ]}>
      {/* Top-left corner */}
      <View style={[styles.corner, styles.topLeft]}>
        <View
          style={[
            styles.cornerH,
            {width: cornerLength, height: cornerWidth, backgroundColor: color},
          ]}
        />
        <View
          style={[
            styles.cornerV,
            {width: cornerWidth, height: cornerLength, backgroundColor: color},
          ]}
        />
      </View>

      {/* Top-right corner */}
      <View style={[styles.corner, styles.topRight]}>
        <View
          style={[
            styles.cornerH,
            {width: cornerLength, height: cornerWidth, backgroundColor: color},
          ]}
        />
        <View
          style={[
            styles.cornerV,
            {width: cornerWidth, height: cornerLength, backgroundColor: color},
          ]}
        />
      </View>

      {/* Bottom-left corner */}
      <View style={[styles.corner, styles.bottomLeft]}>
        <View
          style={[
            styles.cornerH,
            {width: cornerLength, height: cornerWidth, backgroundColor: color},
          ]}
        />
        <View
          style={[
            styles.cornerV,
            {width: cornerWidth, height: cornerLength, backgroundColor: color},
          ]}
        />
      </View>

      {/* Bottom-right corner */}
      <View style={[styles.corner, styles.bottomRight]}>
        <View
          style={[
            styles.cornerH,
            {width: cornerLength, height: cornerWidth, backgroundColor: color},
          ]}
        />
        <View
          style={[
            styles.cornerV,
            {width: cornerWidth, height: cornerLength, backgroundColor: color},
          ]}
        />
      </View>

      {/* Label */}
      {label && (
        <View style={[styles.label, {backgroundColor: color + '33'}]}>
          <Text style={[styles.labelText, {color}]}>{label}</Text>
        </View>
      )}

      {/* Confidence */}
      {confidence !== undefined && (
        <View style={[styles.confidenceBadge, {backgroundColor: color + '33'}]}>
          <Text style={[styles.confidenceText, {color}]}>
            {confidence.toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  corner: {
    position: 'absolute',
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    alignItems: 'flex-end',
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  cornerH: {
    borderRadius: 2,
  },
  cornerV: {
    borderRadius: 2,
    position: 'absolute',
  },
  label: {
    position: 'absolute',
    top: -22,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
  },
  confidenceBadge: {
    position: 'absolute',
    bottom: -22,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default FaceBoundingBox;
