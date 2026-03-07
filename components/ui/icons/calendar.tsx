import { View } from 'react-native';

type Props = { size?: number; color?: string };

const scale = (n: number, s: number) => (n / 24) * s;

/** Calendar (schedules). View-based – no SVG. */
export function CalendarIcon({ size = 24, color = 'currentColor' }: Props) {
  const s = size;
  return (
    <View style={{ width: s, height: s }}>
      <View
        style={{
          position: 'absolute',
          left: scale(2, s),
          top: scale(5, s),
          width: scale(20, s),
          height: scale(17, s),
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: scale(2, s),
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(2, s),
          top: scale(5, s),
          width: scale(20, s),
          height: scale(4, s),
          backgroundColor: color,
          borderTopLeftRadius: scale(2, s),
          borderTopRightRadius: scale(2, s),
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(5, s),
          top: scale(2, s),
          width: scale(3, s),
          height: scale(4, s),
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(16, s),
          top: scale(2, s),
          width: scale(3, s),
          height: scale(4, s),
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
}
