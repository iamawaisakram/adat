import { config } from "@tamagui/config/v2";
import { createTamagui } from "tamagui";

const tamaguiConfig = createTamagui(config);

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  // Empty extend is intentional for Tamagui type augmentation (component prop inference).
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- module augmentation
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default tamaguiConfig;
