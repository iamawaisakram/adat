import { Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { createWidget, WidgetBase } from 'expo-widgets';

import type { FocusedTaskItem } from '@/lib/widget-payload';

type FocusedTasksWidgetProps = {
  tasks: FocusedTaskItem[];
};

const FocusedTasksWidget = (props: WidgetBase<FocusedTasksWidgetProps>) => {
  'widget';
  const { tasks } = props;
  const list = tasks ?? [];
  const displayList = list.slice(0, 8);

  return (
    <VStack>
      <Text
        modifiers={[
          font({ weight: 'bold', size: 14 }),
          foregroundStyle('#000000'),
        ]}>
        Focused tasks
      </Text>
      {displayList.length === 0 ? (
        <Text modifiers={[font({ size: 12 }), foregroundStyle('#666666')]}>
          No tasks. Add tasks in the app.
        </Text>
      ) : (
        displayList.map((t) => (
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
      )}
    </VStack>
  );
};

export default createWidget('FocusedTasksWidget', FocusedTasksWidget);
