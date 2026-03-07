import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_DEFAULT_REMINDER_TIME = '@adat/defaultReminderTime';
const DEFAULT_REINDER_TIME = '09:00';

export function useDefaultReminderTime() {
  const [value, setValueState] = useState<string>(DEFAULT_REINDER_TIME);
  const [loaded, setLoaded] = useState(false);

  const setValue = useCallback(async (time: string) => {
    const trimmed = time.trim() || DEFAULT_REINDER_TIME;
    setValueState(trimmed);
    await AsyncStorage.setItem(KEY_DEFAULT_REMINDER_TIME, trimmed);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(KEY_DEFAULT_REMINDER_TIME).then((stored) => {
      if (stored != null) setValueState(stored);
      setLoaded(true);
    });
  }, []);

  return { defaultReminderTime: value, setDefaultReminderTime: setValue, loaded };
}
