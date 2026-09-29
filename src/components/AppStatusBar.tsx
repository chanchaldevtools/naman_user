import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {AppColors} from '../theme/colors';

const AppStatusBar = () => {
  if (Platform.OS === 'android' && (StatusBar as any).setBackgroundColor) {
    (StatusBar as any).setBackgroundColor(AppColors.themeColor);
  }
  return <StatusBar barStyle="light-content" />;
};

export default AppStatusBar;
