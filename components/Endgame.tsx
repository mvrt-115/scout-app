import React, { FC, useRef, useState, useEffect } from "react";
import Header from "./Header";
import { usePostGame, usePreGame } from "../Stores";
import BottomSheet from "@gorhom/bottom-sheet";
import QRCodeBottomSheet from "./QRCode";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, Toggle, Input, Radio, RadioGroup } from "@ui-kitten/components";
import { useTheme } from "../contexts/ThemeContext";
import DualRangeSlider from "./DualRangeSlider";
import FastCounter from "./FastCounter";
import CycleTimer from "./CycleTimer";

interface EndGameProps {
  navigation: any;
  fields: any[];
}

const EndGame: FC<EndGameProps> = ({ navigation, fields }) => {
  const sheetRef = useRef<BottomSheet>(null);
  const teams = usePreGame((state) => state.teams);
  const alliance = usePreGame((state) => state.alliance);
  const regional = usePreGame((state) => state.regional);
  const setPostGameFields = usePostGame((state) => state.setPostGameFields);
  const { colors } = useTheme();

  // Dynamic state: one value per field
  const [values, setValues] = useState<any[]>([]);
  // Separate cycles state for timer fields
  const [cyclesMap, setCyclesMap] = useState<Record<number, number[]>>({});

  // Initialize default values when fields load
  useEffect(() => {
    if (fields && fields.length > 0 && values.length === 0) {
      const defaults = fields.map((f: any) => {
        if (f.type === 'boolean') return false;
        if (f.type === 'counter') return 0;
        if (f.type === 'slider') return `${f.min || 0}-${Math.round(((f.max || 100) - (f.min || 0)) / 4)}`;
        if (f.type === 'radio') return f.options?.[0] || '';
        if (f.type === 'selection') return f.options?.[0] || '';
        if (f.type === 'timer') return 0;
        if (f.type === 'rating') return 0;
        return '';
      });
      setValues(defaults);
    }
  }, [fields]);

  // Push values to store whenever they change
  useEffect(() => {
    if (values.length > 0) {
      setPostGameFields(values);
    }
  }, [values]);

  const updateValue = (index: number, val: any) => {
    setValues(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const renderField = (field: any, index: number) => {
    const val = values[index];
    if (val === undefined) return null;

    switch (field.type) {
      case 'boolean':
        return (
          <View key={index} style={[s.card, { backgroundColor: colors.surface }]}>
            <Toggle checked={!!val} onChange={(v: boolean) => updateValue(index, v)}>
              {field.name}
            </Toggle>
          </View>
        );

      case 'counter':
        return (
          <FastCounter
            key={index}
            name={field.name}
            value={val || 0}
            onChange={(v: number) => updateValue(index, v)}
            max={99}
          />
        );

      case 'slider': {
        const parts = (val + '').split('-');
        const low = parseInt(parts[0]) || field.min || 0;
        const high = parseInt(parts[1]) || low;
        return (
          <DualRangeSlider
            key={index}
            name={field.name}
            min={field.min || 0}
            max={field.max || 100}
            step={5}
            lowValue={low}
            highValue={high}
            onLowChange={(v: number) => updateValue(index, `${v}-${high}`)}
            onHighChange={(v: number) => updateValue(index, `${low}-${v}`)}
          />
        );
      }

      case 'radio':
        return (
          <View key={index} style={[s.card, { backgroundColor: colors.surface }]}>
            <Text style={[s.sectionTitle, { color: colors.text }]}>{field.name}</Text>
            <RadioGroup
              selectedIndex={field.options?.indexOf(val) ?? 0}
              onChange={(i: number) => updateValue(index, field.options[i])}
              style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}
            >
              {(field.options || []).map((opt: string, i: number) => (
                <Radio key={i}>{opt}</Radio>
              ))}
            </RadioGroup>
          </View>
        );

      case 'selection':
        return (
          <View key={index} style={[s.card, { backgroundColor: colors.surface }]}>
            <Text style={[s.sectionTitle, { color: colors.text }]}>{field.name}</Text>
            <RadioGroup
              selectedIndex={field.options?.indexOf(val) ?? 0}
              onChange={(i: number) => updateValue(index, field.options[i])}
            >
              {(field.options || []).map((opt: string, i: number) => (
                <Radio key={i}>{opt}</Radio>
              ))}
            </RadioGroup>
          </View>
        );

      case 'text':
        return (
          <View key={index} style={[s.card, { backgroundColor: colors.surface }]}>
            <Text style={[s.sectionTitle, { color: colors.text }]}>{field.name}</Text>
            <Input
              multiline
              textStyle={{ minHeight: 80 }}
              placeholder={`Enter ${field.name}...`}
              value={val || ''}
              onChangeText={(v: string) => updateValue(index, v)}
            />
          </View>
        );

      case 'rating':
        return (
          <FastCounter
            key={index}
            name={field.name}
            value={val || 0}
            onChange={(v: number) => updateValue(index, v)}
            max={5}
          />
        );


      case 'timer': {
        const cycles = cyclesMap[index] || [];
        return (
          <View key={index}>
            <CycleTimer
              name={field.name}
              cycles={cycles}
              showLap={false}
              onAddCycle={(t: number) => {
                const newCycles = [...cycles, t];
                setCyclesMap(prev => ({ ...prev, [index]: newCycles }));
                const newAvg = (newCycles.reduce((a, b) => a + b, 0) / newCycles.length).toFixed(1);
                updateValue(index, newAvg);
              }}
              onReset={() => {
                setCyclesMap(prev => ({ ...prev, [index]: [] }));
                updateValue(index, '0');
              }}
            />
          </View>
        );
      }

      default:
        return (
          <View key={index} style={[s.card, { backgroundColor: colors.surface }]}>
            <Text style={[s.sectionTitle, { color: colors.text }]}>{field.name}</Text>
            <Input
              placeholder={`Enter ${field.name}...`}
              value={val + ''}
              onChangeText={(v: string) => updateValue(index, v)}
            />
          </View>
        );
    }
  };

  return (
    <>
      <Header
        matchInfo={{ teams, alliance, regional }}
        title={"END GAME (30s)"}
        toggleQRCode={() => sheetRef.current?.snapToIndex(1)}
        navigation={navigation}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 16, paddingTop: 12 }}
        style={{ backgroundColor: colors.background }}
      >
        {fields && fields.map((field: any, index: number) => renderField(field, index))}
      </ScrollView>
      <QRCodeBottomSheet sheetRef={sheetRef} navigation={navigation} />
    </>
  );
};

const s = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
});

export default EndGame;