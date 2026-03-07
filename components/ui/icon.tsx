import {
  CalendarIcon,
  DocTextIcon,
  NotesIcon,
  TemplateIcon,
} from '@/components/ui/icons';

export const iconNames = [
  'doc.text',
  'doc.text.fill',
  'notes',
  'template',
  'calendar',
] as const;

export type IconName = (typeof iconNames)[number];

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

/** Local View-based icons – no font, SVG, or network required. */
export function Icon({ name, size = 24, color = 'currentColor' }: IconProps) {
  const common = { size, color };
  switch (name) {
    case 'doc.text':
    case 'doc.text.fill':
      return <DocTextIcon {...common} />;
    case 'notes':
      return <NotesIcon {...common} />;
    case 'template':
      return <TemplateIcon {...common} />;
    case 'calendar':
      return <CalendarIcon {...common} />;
    default:
      return <DocTextIcon {...common} />;
  }
}
