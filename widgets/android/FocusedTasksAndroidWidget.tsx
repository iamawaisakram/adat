'use no memo';

import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

import type { FocusedTaskItem } from '@/lib/widget-payload';

type Props = {
  tasks: FocusedTaskItem[];
};

export function FocusedTasksAndroidWidget({ tasks }: Props) {
  const list = tasks ?? [];
  const displayList = list.slice(0, 8);

  return (
    <FlexWidget
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'column',
        padding: 12,
        backgroundColor: '#ffffff',
        borderRadius: 16,
      }}
    >
      <TextWidget
        text="Focused tasks"
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: '#000000',
          marginBottom: 8,
        }}
      />
      {displayList.length === 0 ? (
        <TextWidget
          text="No tasks. Add tasks in the app."
          style={{ fontSize: 12, color: '#666666' }}
        />
      ) : (
        displayList.map((t) => (
          <TextWidget
            key={t.taskId}
            text={`${t.completed ? '✓ ' : '○ '}${t.title || 'Task'}`}
            style={{
              fontSize: 12,
              color: t.completed ? '#888888' : '#000000',
              marginBottom: 4,
            }}
          />
        ))
      )}
    </FlexWidget>
  );
}
