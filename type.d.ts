interface Setting {
  id: number;
  scout_id: number;
  name: string;
  state: boolean;
}

type SettingContextType = {
  settings: Setting[];
  saveSettings: (setting: Setting) => void;
  updateSettings: (id: number, state: boolean, scout_id: number) => void;
  getSettingState: (name: string) => boolean;
};
