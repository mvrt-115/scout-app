import { Toggle } from "@ui-kitten/components";
import React, { useState } from "react";
import { FC } from "react";
import { useData } from "../context/DataContext";

type ToggleProps = {
  dataTitle: string;
  name: string;
};

const MatchStatefulToggle: FC<ToggleProps> = ({ dataTitle, name }) => {
  const { data, changeData } = useData();
  const [value, setValue] = useState<boolean>(
    data ? (data[dataTitle] ? data[dataTitle] : false) : false
  );

  const handleChange = (newVal: boolean) => {
    setValue(newVal);
    let dataCopy = data;
    dataCopy[dataTitle] = newVal;
    changeData(dataCopy);
  };
  return (
    <Toggle checked={value} onChange={handleChange}>
      {name}
    </Toggle>
  );
};

export default MatchStatefulToggle;
