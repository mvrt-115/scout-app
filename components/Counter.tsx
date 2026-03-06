import { Button, Input, Layout, Text } from "@ui-kitten/components";
import React, { FC } from "react";
import { Alert, StyleSheet, View } from "react-native";

interface Props {
  name: string | undefined;
  onChange: (newVal: number) => void | undefined;
  value: number;
  rating: boolean;
  //   haptic: boolean;
}

const Counter: FC<Props> = ({ name, onChange, value, rating }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          style={[styles.neg, styles.button]}
          onPressIn={() => {
            onChange(value - 1);
            // haptic &&
            //   Haptics.notificationAsync(
            //     Haptics.NotificationFeedbackType.Warning
            //   );
          }}
          appearance="outline"
          disabled={value <= (rating ? 1 : 0)}
        >
          -
        </Button>
        <View
          style={{
            height: "100%",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            paddingVertical: 6,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#dde",
          }}
        >
          <Text
            category="s1"
            style={{
              fontSize: 14,
            }}
            adjustsFontSizeToFit={true}
          >{`${name}: `}</Text>
          <Input
            keyboardType="number-pad"
            value={`${value}`}
            style={{
              borderColor: "#dde",
              borderWidth: 1,
              padding: 6,
              paddingHorizontal: 10,
              borderRadius: 3,
              // fontSize: 30
            }}
            onChangeText={(value) => {
              let newVal : number = parseInt(value);
              if(newVal || newVal===0) {
                onChange(Math.min(Math.max(newVal, rating ? 1 : 0), rating ? 5 : 1000));
              }
            }}
          />
        </View>
        <Button
          style={[styles.button, styles.pos]}
          onPressIn={() => {
            onChange(value + 1);
          }}
          appearance="outline"
          disabled={rating && value >= 5}
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
  button: {
    // fontSize: 10
    height: "100%",
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
    alignItems: "center",
    height: 55,
    marginTop: 20,
  },
});

export default Counter;
