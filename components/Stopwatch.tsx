import { Button, Text } from "@ui-kitten/components";
import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface Props {
  onChange: (index: number, value: any) => void;
  postFields: any[];
  fieldIndex: number;
  name: string;
}

const Stopwatch: React.FC<Props> = ({ onChange, postFields, fieldIndex, name }) => {
  const { colors } = useTheme();
  const [secs, setTime] = useState(postFields[fieldIndex] ? parseFloat(postFields[fieldIndex]) : 0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any = undefined;
    if (isRunning) {
      interval = setInterval(() => {
        let newS = secs + 0.1;
        setTime(newS);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, secs]);

  const handleReset = () => {
    setTime(0);
    onChange(fieldIndex, 0);
  };

  const handleStartStop = () => {
    if(isRunning){
      onChange(fieldIndex, secs);
    }
    setIsRunning(!isRunning);
  };

  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Text category = "h5" style={{ marginVertical: 10, fontWeight: "400", fontSize: 20}}>{name}</Text>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
      }}>
        <Text
          category="h6"
          style={{ marginVertical: 10, fontWeight: "200", fontSize: 20 }}
        >
          {`${secs.toFixed(1)} s`}
        </Text>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {isRunning ? (
            <Button
              onPress={handleStartStop}
              status="danger"
              style={{ margin: "1%" }}
              appearance="outline"
            >
              Stop
            </Button>
          ) : (
            <Button
              onPress={handleStartStop}
              status="success"
              style={{ margin: "1%" }}
              appearance="outline"
            >
              Start
            </Button>
          )}
          <Button
            onPress={handleReset}
            status="warning"
            style={{ margin: "1%" }}
            appearance="outline"
          >
            Reset
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Stopwatch;
