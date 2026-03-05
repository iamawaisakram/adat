import { Stack, Text, useTheme, YStack } from 'tamagui';

import { IconSymbol } from '@/components/ui/icon-symbol';

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: 'doc.text' | 'doc.text.fill';
};

export function EmptyState({
  title,
  description,
  icon = 'doc.text.fill',
}: EmptyStateProps) {
  const theme = useTheme();
  const iconColor = (theme.gray9?.val as string) ?? '#71717a';

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$6"
      gap="$4"
      maxWidth={320}
      alignSelf="center">
      <Stack
        width={120}
        height={120}
        borderRadius={60}
        backgroundColor="$gray3"
        justifyContent="center"
        alignItems="center">
        <IconSymbol
          name={icon}
          size={56}
          color={iconColor}
        />
      </Stack>
      <Text
        fontSize="$6"
        fontWeight="700"
        textAlign="center"
        color="$color">
        {title}
      </Text>
      <Text
        fontSize="$3"
        textAlign="center"
        color="$gray11"
        lineHeight={22}>
        {description}
      </Text>
    </YStack>
  );
}
