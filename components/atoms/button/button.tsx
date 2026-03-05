import type { GetProps } from 'tamagui';
import { Button as TamaguiButton } from 'tamagui';

type ButtonProps = GetProps<typeof TamaguiButton>;

export function Button(props: ButtonProps) {
  return <TamaguiButton size="$3" chromeless={false} {...props} />;
}
