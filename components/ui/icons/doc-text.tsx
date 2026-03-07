import { View } from 'react-native';

type Props = { size?: number; color?: string };

const scale = (n: number, s: number) => (n / 24) * s;

/** Document with text lines (notes, empty state). View-based – no SVG. */
export function DocTextIcon({ size = 24, color = 'currentColor' }: Props) {
  const s = size;
  return (
    <View style={{ width: s, height: s }}>
      <View
        style={{
          position: 'absolute',
          left: scale(2, s),
          top: scale(2, s),
          width: scale(16, s),
          height: scale(20, s),
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: scale(1, s),
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(14, s),
          top: scale(2, s),
          width: scale(6, s),
          height: scale(6, s),
          borderLeftWidth: 1.5,
          borderBottomWidth: 1.5,
          borderColor: color,
          borderBottomLeftRadius: scale(1, s),
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(5, s),
          top: scale(9, s),
          width: scale(10, s),
          height: scale(1.5, s),
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(5, s),
          top: scale(13, s),
          width: scale(10, s),
          height: scale(1.5, s),
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: scale(5, s),
          top: scale(17, s),
          width: scale(6, s),
          height: scale(1.5, s),
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
}
