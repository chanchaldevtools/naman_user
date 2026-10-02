import {Platform, PermissionsAndroid} from 'react-native';
import {
  getMessaging,
  getToken,
  onMessage,
  requestPermission,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';

let navigationRef: any = null;

export const setNavigationRef = (ref: any) => {
  navigationRef = ref;
  console.log('✅ navigationRef set');
};

type Listener = (data: any) => void;
let listeners: Listener[] = [];

export const onNewMessage = (callback: Listener) => {
  listeners.push(callback);
  console.log('📡 Listener added, total:', listeners.length);

  return () => {
    listeners = listeners.filter(l => l !== callback);
    console.log('🔕 Listener removed, total:', listeners.length);
  };
};

const emitNewMessage = (data: any) => {
  console.log('📢 Emitting new message to', listeners.length, 'listeners');
  listeners.forEach(listener => {
    try {
      listener(data);
    } catch (e) {
      console.error('❌ Listener error:', e);
    }
  });
};

const goToMessage = (data: any) => {
  if (!data) return;
  emitNewMessage(data);

  const params = {
    senderId: String(data.sender_id || ''),
    senderName: data.sender_name || 'Police Station',
    senderType: data.sender_type || 'police',
    notificationMessage: data.message || '',
    notificationMessageId: data.message_id || '',
    notificationCreatedAt: data.created_at || '',
  };

  console.log('🚀 Navigating to Message:', params);

  const tryNavigate = (attempt = 0) => {
    if (navigationRef && navigationRef.isReady && navigationRef.isReady()) {
      const currentRoute = navigationRef.getCurrentRoute?.();
      if (currentRoute?.name === 'Message') {
        console.log('⏭️ Already on Message screen');
        return;
      }
      navigationRef.navigate('Message', params);
      console.log('✅ Navigated');
    } else if (attempt < 20) {
      setTimeout(() => tryNavigate(attempt + 1), 500);
    }
  };

  tryNavigate();
};

export const setupNotifications = () => {
  let unsubscribeForeground: (() => void) | undefined;
  let unsubscribeNotificationPress: (() => void) | undefined;

  const init = async () => {
    try {
      console.log('🔔 Notification setup started...');

      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      }

      const messagingInstance = getMessaging();
      await requestPermission(messagingInstance);
      const token = await getToken(messagingInstance);
      console.log('🔥🔥🔥 FCM TOKEN 🔥🔥🔥');
      console.log(token);
      console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');

      // FOREGROUND — sirf emit, tray me mat dikhao
      unsubscribeForeground = onMessage(
        messagingInstance,
        async remoteMessage => {
          console.log('📩 FOREGROUND FCM');
          console.log('   data:', JSON.stringify(remoteMessage.data, null, 2));
          if (remoteMessage?.data) {
            emitNewMessage(remoteMessage.data);
          }
        },
      );

      // Foreground notification tap
      unsubscribeNotificationPress = notifee.onForegroundEvent(
        ({type, detail}) => {
          if (type === EventType.PRESS) {
            console.log('🔔 FOREGROUND TAP');
            goToMessage(detail.notification?.data);
          }
        },
      );

      // Background notification tap
      notifee.onBackgroundEvent(async ({type, detail}) => {
        if (type === EventType.PRESS) {
          console.log('🔔 BACKGROUND TAP');
          goToMessage(detail.notification?.data);
        }
      });

      // App opened from background
      onNotificationOpenedApp(messagingInstance, remoteMessage => {
        console.log('🚀 APP OPENED FROM BACKGROUND');
        goToMessage(remoteMessage.data);
      });

      // App opened from killed
      const initialNotification = await getInitialNotification(
        messagingInstance,
      );
      if (initialNotification) {
        console.log('🚀 KILLED STATE');
        setTimeout(() => goToMessage(initialNotification.data), 1500);
      }

      console.log('✅ Notification setup completed');
    } catch (error) {
      console.error('❌ Notification Setup Error:', error);
    }
  };

  init();

  return () => {
    if (unsubscribeForeground) unsubscribeForeground();
    if (unsubscribeNotificationPress) unsubscribeNotificationPress();
  };
};