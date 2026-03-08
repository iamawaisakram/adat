// @expo/metro-runtime MUST be first for Fast Refresh
import '@expo/metro-runtime';

import { Platform } from 'react-native';
if (Platform.OS === 'android') {
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  const { widgetTaskHandler } = require('./widgets/android/widget-task-handler');
  registerWidgetTaskHandler(widgetTaskHandler);
}

import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
renderRootComponent(App);
