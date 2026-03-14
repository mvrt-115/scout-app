import React, { FC, useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTheme } from '../contexts/ThemeContext';

interface CycleTimerProps {
  name: string;
  cycles: number[];
  onAddCycle: (seconds: number) => void;
  onReset: () => void;
  showLap?: boolean;
  addCycleOnStop?: boolean;
}

const ACCENT = '#6366F1'; // Unified indigo

const CycleTimer: FC<CycleTimerProps> = ({ 
  name, 
  cycles, 
  onAddCycle, 
  onReset,
  showLap = true,
  addCycleOnStop = true
}) => {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const { colors } = useTheme();

  const start = () => {
    startTimeRef.current = Date.now() - elapsed * 1000;
    intervalRef.current = setInterval(() => {
      setElapsed((Date.now() - startTimeRef.current) / 1000);
    }, 100);
    setRunning(true);
  };

  const lap = () => {
    if (running) {
      onAddCycle(Math.round(elapsed * 10) / 10);
      startTimeRef.current = Date.now();
      setElapsed(0);
    }
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    if (addCycleOnStop && elapsed > 0.3) {
      onAddCycle(Math.round(elapsed * 10) / 10);
    }
    setElapsed(0);
  };

  const avgCycle = cycles.length > 0
    ? (cycles.reduce((a, b) => a + b, 0) / cycles.length).toFixed(1)
    : '--';
  const minCycle = cycles.length > 0 ? Math.min(...cycles).toFixed(1) : '--';
  const maxCycle = cycles.length > 0 ? Math.max(...cycles).toFixed(1) : '--';

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.label, { color: colors.text }]}>{name}</Text>
      <View style={styles.timerDisplay}>
        <Text style={styles.timerText}>{elapsed.toFixed(1)}s</Text>
      </View>
      <View style={styles.btnRow}>
        {!running ? (
          <TouchableOpacity style={[styles.btn, { backgroundColor: ACCENT }]} onPress={start}>
            <Text style={styles.btnText}>▶ START</Text>
          </TouchableOpacity>
        ) : (
          <>
            {showLap && (
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#818CF8' }]} onPress={lap}>
                <Text style={styles.btnText}>⏱ LAP</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#7C3AED' }]} onPress={stop}>
              <Text style={styles.btnText}>⏹ STOP</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#4B5563' }]} onPress={onReset}>
          <Text style={styles.btnText}>↻ CLEAR</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Cycles</Text>
          <Text style={[styles.statVal, { color: colors.text }]}>{cycles.length}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Avg</Text>
          <Text style={[styles.statVal, { color: colors.text }]}>{avgCycle}s</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Min</Text>
          <Text style={[styles.statVal, { color: colors.text }]}>{minCycle}s</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={[styles.statVal, { color: colors.text }]}>{maxCycle}s</Text>
        </View>
      </View>
      {cycles.length > 0 && (
        <View style={styles.cycleList}>
          {cycles.map((c, i) => (
            <View key={i} style={[styles.cycleChip, { backgroundColor: colors.background }]}>
              <Text style={{ color: ACCENT, fontWeight: '600', fontSize: 11 }}>#{i + 1}: {c}s</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, padding: 14, borderRadius: 12 },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  timerDisplay: { alignItems: 'center', paddingVertical: 8 },
  timerText: { fontSize: 36, fontWeight: '900', color: ACCENT, fontVariant: ['tabular-nums'] },
  btnRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 8 },
  btn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  stat: { alignItems: 'center' },
  statLabel: { fontSize: 10, color: '#888', fontWeight: '600' },
  statVal: { fontSize: 16, fontWeight: '800' },
  cycleList: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 6 },
  cycleChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
});

export default CycleTimer;
