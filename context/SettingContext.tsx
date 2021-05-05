import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Settings } from "react-native";

export const SettingContext = React.createContext<SettingContextType | null>(
  null
);

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = React.useState<Setting[]>([
    {
      id: 0,
      scout_id: 0,
      name: "Haptic Feedback",
      state: true,
    },
  ]);

  const saveSettings = (setting: Setting) => {
    //implement later
  };

  const updateSettings = (id: number, state: boolean, scout_id?: number) => {
    settings.filter((setting: Setting) => {
      if (setting.id === id) {
        setting.state = state;
        setting.scout_id = scout_id;
        setSettings([...settings]);
      }
    });
  };

  const getSettingState = (name: string) => {
    for (let i = 0; i < settings.length; i++) {
      if (settings[i].name === name) return settings[i].state;
    }
    return false;
  };

  useEffect(() => {
    const storeData = async (scoutId: number) => {
      try {
        await AsyncStorage.setItem("@scout_id", scoutId.toString());
      } catch (e) {
        // saving error
      }
    };
    storeData(settings[0].id);
  }, []);

  return (
    <SettingContext.Provider
      value={{ settings, saveSettings, updateSettings, getSettingState }}
    >
      {children}
    </SettingContext.Provider>
  );
};
export default SettingsProvider;
