import { View } from 'react-native';

type Props = { size?: number; color?: string };

const scale = (n: number, s: number) => (n / 24) * s;

/** Stacked documents / template. View-based – no SVG. */
export function TemplateIcon({ size = 24, color = 'currentColor' }: Props) {
  const s = size;
  return (
    <View style={{ width: s, height: s }}>
      <View
        style={{
          position: 'absolute',
          left: scale(6, s),
          top: scale(4, s),
          width: scale(14, s),
          height: scale(18, s),
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: scale(1, s),
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(2, s),
          top: scale(2, s),
          width: scale(14, s),
          height: scale(18, s),
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: scale(1, s),
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(5, s),
          top: scale(6, s),
          width: scale(2, s),
          height: scale(1.5, s),
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(5, s),
          top: scale(10, s),
          width: scale(2, s),
          height: scale(1.5, s),
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(5, s),
          top: scale(14, s),
          width: scale(2, s),
          height: scale(1.5, s),
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
}
