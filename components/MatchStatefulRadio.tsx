import { Radio, RadioGroup } from "@ui-kitten/components";
import React, { FC, useState } from "react";
import { useData } from "../context/DataContext";

type Props = {
  options: string[];
  values: any[];
  dataTitle: string;
};

const MatchStatefulRadio: FC<Props> = ({ options, values, dataTitle }) => {
  const { data, changeData } = useData();
  const [value, setValue] = useState(
    data ? (data[dataTitle] ? data[dataTitle] : values[0]) : values[0]
  );
  const [selectedIndex, setSelectedIndex] = useState(
    values.indexOf(
      data ? (data[dataTitle] ? data[dataTitle] : values[0]) : values[0]
    )
  );
  const handleChange = (index: number) => {
    setValue(values[index]);
    setSelectedIndex(index);
    let dataCopy = { ...data };
    dataCopy[dataTitle] = values[index];
    changeData(dataCopy);
  };
  return (
    <RadioGroup
      onChange={handleChange}
      selectedIndex={selectedIndex}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {options.map((option) => (
        <Radio key={option}>{option}</Radio>
      ))}
    </RadioGroup>
  );
};

export default MatchStatefulRadio;
