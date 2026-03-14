import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import Slider from '@react-native-community/slider';
import { useTheme } from '../contexts/ThemeContext';

interface DualRangeSliderProps {
  name: string;
  min?: number;
  max?: number;
  step?: number;
  lowValue: number;
  highValue: number;
  onLowChange: (val: number) => void;
  onHighChange: (val: number) => void;
  unit?: string;
}

const DualRangeSlider: FC<DualRangeSliderProps> = ({
  name,
  min = 0,
  max = 200,
  step = 5,
  lowValue,
  highValue,
  onLowChange,
  onHighChange,
  unit = '',
}) => {
  const { colors } = useTheme();
  
  const handleLowChange = (val: number) => {
    if (val <= highValue) onLowChange(val);
    else onLowChange(highValue);
  };

  const handleHighChange = (val: number) => {
    if (val >= lowValue) onHighChange(val);
    else onHighChange(lowValue);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.label, { color: colors.text }]}>{name}</Text>
      <View style={styles.rangeDisplay}>
        <View style={[styles.valueBubble, { borderColor: colors.primary }]}>
          <Text style={[styles.valueText, { color: colors.primary }]}>{lowValue}{unit}</Text>
        </View>
        <Text style={[styles.rangeSep, { color: colors.textSecondary }]}>  —  </Text>
        <View style={[styles.valueBubble, { borderColor: colors.primary }]}>
          <Text style={[styles.valueText, { color: colors.primary }]}>{highValue}{unit}</Text>
        </View>
      </View>
      <View style={styles.sliderWrapper}>
        <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>Low Estimate</Text>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={lowValue}
          onValueChange={handleLowChange}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />
      </View>
      <View style={styles.sliderWrapper}>
        <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>High Estimate</Text>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={highValue}
          onValueChange={handleHighChange}
          minimumTrackTintColor={colors.primary + 'AA'}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />
      </View>
      <Text style={[styles.avgText, { color: colors.textSecondary }]}>
        Avg Estimate: {Math.round((lowValue + highValue) / 2)}{unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, padding: 14, borderRadius: 12 },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  rangeDisplay: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  valueBubble: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 2,
  },
  valueText: { fontSize: 16, fontWeight: '800' },
  rangeSep: { fontSize: 16, fontWeight: '600' },
  sliderWrapper: { marginVertical: 2 },
  sliderLabel: { fontSize: 11, fontWeight: '600', marginLeft: 4 },
  slider: { width: '100%', height: 36 },
  avgText: { textAlign: 'center', fontSize: 12, fontWeight: '600', marginTop: 4 },
});

export default DualRangeSlider;
