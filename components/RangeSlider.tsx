import React, { FC, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import Slider from '@react-native-community/slider';

interface RangeSliderProps {
  name: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}

const RangeSlider: FC<RangeSliderProps> = ({ name, value, onChange, options }) => {
  const { colors } = useTheme();

  // Find the index of the current value, default to 0
  const currentIndex = options.indexOf(value);
  const initialValue = currentIndex !== -1 ? currentIndex : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.currentValue, { color: colors.primary }]}>
          {options[initialValue] || value}
        </Text>
      </View>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={options.length - 1}
        step={1}
        value={initialValue}
        onValueChange={(val) => {
          onChange(options[val]);
        }}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
      />
      <View style={styles.labelsContainer}>
        {options.map((opt, index) => (
          <Text
            key={index}
            style={[
              styles.tickLabel,
              { color: index === initialValue ? colors.primary : colors.gray },
            ]}
          >
            {opt}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    padding: 10,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  currentValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: -5,
  },
  tickLabel: {
    fontSize: 12,
  },
});

export default RangeSlider;
