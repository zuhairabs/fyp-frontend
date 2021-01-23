/**
 * @format
 */

import {AppRegistry, ToastAndroid, DeviceEventEmitter} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import {fetchNotifications} from './controllers/Notifications/NotificationHandler';
import {callNotification} from './controllers/Notifications/pushNotification';
import IncomingCall from 'react-native-incoming-call';
import PushNotification from 'react-native-push-notification';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  fetchNotifications();

  if (remoteMessage?.notification?.title === 'Incoming call') {
    console.log('remoteMessage ->', remoteMessage);
    PushNotification.cancelAllLocalNotifications();
    callNotification(
      remoteMessage.data.channelName,
      remoteMessage.data.display_name,
    );
    // Display incoming call activity.
    IncomingCall.display(
      remoteMessage.data.channelName, // Call UUID v4
      remoteMessage.data.display_name, // Username
      'https://e1.pngegg.com/pngimages/929/197/png-clipart-button-ui-system-icons-facetime-video-call-icon.png', // Avatar URL
      'Incoming Video Call', // Info text
      20000, // Timeout for end call after 20s
    );
  } else if (remoteMessage?.notification?.title === 'Missed call') {
    // Terminate incoming activity. Should be called when call expired.
    IncomingCall.dismiss();
  }

  // Listen to headless action events
  DeviceEventEmitter.addListener('endCall', (payload) => {
    IncomingCall.dismiss();
  });
  DeviceEventEmitter.addListener('answerCall', (payload) => {
    console.log('answerCall', payload);
    if (payload.isHeadless) {
      // Called from killed state
      IncomingCall.openAppFromHeadlessMode(payload.uuid);
    } else {
      // Called from background state
      IncomingCall.backToForeground();
    }
  });
});

AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => firebaseBackgroundMessage,
);
AppRegistry.registerComponent(appName, () => App);
