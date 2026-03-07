import { View } from 'react-native';

type Props = { size?: number; color?: string };

const scale = (n: number, s: number) => (n / 24) * s;

/** Gear / settings. View-based – no SVG. */
export function SettingsIcon({ size = 24, color = 'currentColor' }: Props) {
  const s = size;
  const teethStyles = [
    { left: scale(7, s), top: scale(2, s), width: scale(2, s), height: scale(3, s) },
    { left: scale(15, s), top: scale(7, s), width: scale(3, s), height: scale(2, s) },
    { left: scale(7, s), top: scale(19, s), width: scale(2, s), height: scale(3, s) },
    { left: scale(2, s), top: scale(7, s), width: scale(3, s), height: scale(2, s) },
  ] as const;

  return (
    <View style={{ width: s, height: s }}>
      <View
        style={{
          position: 'absolute',
          left: scale(4, s),
          top: scale(4, s),
          width: scale(16, s),
          height: scale(16, s),
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: scale(8, s),
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(8, s),
          top: scale(8, s),
          width: scale(8, s),
          height: scale(8, s),
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: scale(4, s),
        }}
      />
      {teethStyles.map((sty) => (
        <View
          key={`${sty.left}-${sty.top}`}
          style={{
            position: 'absolute',
            ...sty,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      ))}
    </View>
  );
}
