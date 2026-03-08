import { Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { createWidget, WidgetBase } from 'expo-widgets';

import type { NoteWidgetItem } from '@/lib/widget-payload';

type NoteWidgetProps = {
  note: NoteWidgetItem | null;
};

const NoteWidget = (props: WidgetBase<NoteWidgetProps>) => {
  'widget';
  const { note } = props;

  if (!note) {
    return (
      <VStack>
        <Text
          modifiers={[
            font({ weight: 'bold', size: 14 }),
            foregroundStyle('#000000'),
          ]}>
          Note
        </Text>
        <Text modifiers={[font({ size: 12 }), foregroundStyle('#666666')]}>
          No note selected. Pick one in Settings → Widgets.
        </Text>
      </VStack>
    );
  }

  const taskList = (note.tasks ?? []).slice(0, 6);

  return (
    <VStack>
      <Text
        modifiers={[
          font({ weight: 'bold', size: 14 }),
          foregroundStyle('#000000'),
        ]}>
        {note.title || 'Note'}
      </Text>
      {note.contentSnippet ? (
        <Text modifiers={[font({ size: 11 }), foregroundStyle('#444444')]}>
          {note.contentSnippet}
        </Text>
      ) : null}
      {taskList.length > 0 ? (
        taskList.map((t) => (
          <Text
            key={t.taskId}
            modifiers={[
              font({ size: 12 }),
              foregroundStyle(t.completed ? '#888888' : '#000000'),
            ]}>
            {t.completed ? '✓ ' : '○ '}
            {t.title || 'Task'}
          </Text>
        ))
      ) : null}
    </VStack>
  );
};

export default createWidget('NoteWidget', NoteWidget);
