import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { getFocusedTasksPayload, getNoteWidgetPayload } from '@/lib/widget-data-store';

import { FocusedTasksAndroidWidget } from './FocusedTasksAndroidWidget';
import { NoteAndroidWidget } from './NoteAndroidWidget';

const WIDGET_NAMES = {
  FocusedTasks: 'FocusedTasks',
  Note: 'Note',
} as const;

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  const { widgetName } = props.widgetInfo;

  const render = () => {
    if (widgetName === WIDGET_NAMES.FocusedTasks) {
      const payload = getFocusedTasksPayload();
      props.renderWidget(<FocusedTasksAndroidWidget tasks={payload.tasks} />);
    } else if (widgetName === WIDGET_NAMES.Note) {
      const payload = getNoteWidgetPayload();
      props.renderWidget(<NoteAndroidWidget note={payload} />);
    }
  };

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
    case 'WIDGET_CLICK':
      render();
      break;
    case 'WIDGET_DELETED':
      break;
    default:
      break;
  }
}
