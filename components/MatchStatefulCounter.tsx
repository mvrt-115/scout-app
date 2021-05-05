import React, { FC, useState } from "react";
import { useData } from "../context/DataContext";
import Counter from "./Counter";

type CounterProps = {
  dataTitle: string;
  haptic: boolean;
  name: string;
};

const MatchStatefulCounter: FC<CounterProps> = ({
  dataTitle,
  haptic,
  name,
}) => {
  const { data, changeData } = useData();
  const [value, setValue] = useState<number>(
    data ? (data[dataTitle] ? data[dataTitle] : 0) : 0
  );

  const handleChange = (value: number) => {
    setValue(value);

    let dataCopy = { ...data };
    dataCopy[dataTitle] = value;
    changeData(dataCopy);
  };
  return (
    <Counter
      value={value}
      onChange={(val) => handleChange(val)}
      name={name}
      haptic={haptic}
    />
  );
};

export default MatchStatefulCounter;
