import React from 'react';
import { Platform } from 'react-native';
import { NotificationSectionWeb } from '@/components/notifications/NotificationSectionWeb';
import { NotificationSectionNative } from '@/components/notifications/NotificationSectionNative';

export const NotificationSection = React.memo(function NotificationSection() {
  const isWeb = Platform.OS === 'web';

  return isWeb ? <NotificationSectionWeb /> : <NotificationSectionNative />;
});
