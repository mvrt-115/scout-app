import { Button, Input, Layout, Text } from "@ui-kitten/components";
import React, { FC } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface Props {
  name: string | undefined;
  onChange: (newVal: number) => void | undefined;
  value: number;
  rating: boolean;
  //   haptic: boolean;
}

const wrapTextByWord = (text: string, maxCharsPerLine: number) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";

  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join("\n");
};

const Counter: FC<Props> = ({ name, onChange, value, rating }) => {
  const { colors } = useTheme();
  const minValue = rating ? 1 : 0;
  const maxValue = rating ? 5 : 1000;
  const clampValue = (nextValue: number) => Math.min(Math.max(nextValue, minValue), maxValue);
  const wrappedName = wrapTextByWord(name ?? "", 25);
  const lineCount = Math.max(1, wrappedName.split("\n").length);
  const rowHeight = Math.max(55, 24 + lineCount * 22);

  return (
    <View style={styles.container}>
      <View style={[styles.buttonContainer, { minHeight: rowHeight }]}>
        <Button
          style={[styles.neg, { height: rowHeight }]}
          onPressIn={() => {
            onChange(clampValue(value - 1));
            // haptic &&
            //   Haptics.notificationAsync(
            //     Haptics.NotificationFeedbackType.Warning
            //   );
          }}
          appearance="outline"
          disabled={value <= minValue}
        >
          -
        </Button>
        <View
          style={{
            minHeight: rowHeight,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            category="s1"
            style={{
              fontSize: 14,
              flexShrink: 1,
              marginRight: 8,
            }}
          >{`${wrappedName}: `}</Text>
          <Input
            keyboardType="number-pad"
            value={`${value}`}
            style={{
              width: 72,
              marginLeft: "auto",
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 3,
            }}
            textStyle={{ textAlign: "center", paddingVertical: 6, paddingHorizontal: 8 }}
            onChangeText={(value) => {
              const newVal: number = parseInt(value, 10);
              if (newVal || newVal === 0) {
                onChange(clampValue(newVal));
              }
            }}
          />
        </View>
        <Button
          style={[styles.pos, { height: rowHeight }]}
          onPressIn={() => {
            onChange(clampValue(value + 1));
          }}
          appearance="outline"
          disabled={value >= maxValue}
        >
          +
        </Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#fffe",
  },
  neg: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  pos: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "stretch",
    minHeight: 55,
    marginTop: 20,
  },
});

export default Counter;
