import React, { FC } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTheme } from '../contexts/ThemeContext';

interface FastCounterProps {
  name: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

const ACCENT = '#6366F1'; // Unified indigo

const FastCounter: FC<FastCounterProps> = ({ name, value, onChange, min = 0, max = 9999 }) => {
  const { colors } = useTheme();
  
  const adjust = (delta: number) => {
    const next = value + delta;
    if (next >= min && next <= max) onChange(next);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{name}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.btnDec]} onPress={() => adjust(-1)}>
          <Text style={styles.btnText}>-1</Text>
        </TouchableOpacity>
        <View style={styles.valueBox}>
          <Text style={styles.valueText}>{value}</Text>
        </View>
        <TouchableOpacity style={[styles.btn, styles.btnInc]} onPress={() => adjust(1)}>
          <Text style={styles.btnText}>+1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnInc]} onPress={() => adjust(5)}>
          <Text style={styles.btnText}>+5</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 14, paddingHorizontal: 10 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 48,
    alignItems: 'center',
  },
  btnDec: { backgroundColor: '#4B5563' },
  btnInc: { backgroundColor: ACCENT },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  valueBox: {
    borderWidth: 2,
    borderColor: ACCENT,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  valueText: { fontSize: 24, fontWeight: '900', color: ACCENT },
});

export default FastCounter;
