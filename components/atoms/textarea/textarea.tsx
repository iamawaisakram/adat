import type { GetProps } from 'tamagui';
import { Input } from 'tamagui';

type TextAreaProps = GetProps<typeof Input>;

export function TextArea(props: TextAreaProps) {
  return <Input size="$3" multiline numberOfLines={4} {...props} />;
}
