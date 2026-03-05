import type { GetProps } from 'tamagui';
import { Input as TamaguiInput } from 'tamagui';

type InputProps = GetProps<typeof TamaguiInput>;

export function Input(props: InputProps) {
  return <TamaguiInput size="$3" {...props} />;
}
