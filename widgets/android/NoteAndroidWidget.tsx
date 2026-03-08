'use no memo';

import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

import type { NoteWidgetItem } from '@/lib/widget-payload';

type Props = {
  note: NoteWidgetItem | null;
};

export function NoteAndroidWidget({ note }: Props) {
  if (!note) {
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
          text="Note"
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: '#000000',
            marginBottom: 8,
          }}
        />
        <TextWidget
          text="No note selected. Pick one in Settings → Widgets."
          style={{ fontSize: 12, color: '#666666' }}
        />
      </FlexWidget>
    );
  }

  const taskList = (note.tasks ?? []).slice(0, 6);

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
        text={note.title || 'Note'}
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: '#000000',
          marginBottom: 6,
        }}
      />
      {note.contentSnippet ? (
        <TextWidget
          text={note.contentSnippet}
          style={{
            fontSize: 11,
            color: '#444444',
            marginBottom: 8,
          }}
        />
      ) : null}
      {taskList.map((t) => (
        <TextWidget
          key={t.taskId}
          text={`${t.completed ? '✓ ' : '○ '}${t.title || 'Task'}`}
          style={{
            fontSize: 12,
            color: t.completed ? '#888888' : '#000000',
            marginBottom: 4,
          }}
        />
      ))}
    </FlexWidget>
  );
}
