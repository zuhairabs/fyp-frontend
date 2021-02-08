/**
 * @format
 */

import {
  AppRegistry,
  ToastAndroid,
  DeviceEventEmitter,
  AsyncStorage,
  Linking,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import {fetchNotifications} from './controllers/Notifications/NotificationHandler';
import {callNotification} from './controllers/Notifications/pushNotification';
import IncomingCall from 'react-native-incoming-call';
import PushNotification from 'react-native-push-notification';
import uri from 'urijs';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  fetchNotifications();

  try {
    const data = remoteMessage.data;

    if (typeof data.type != 'undefined' && data.type == 'call') {
      const url = 'com-shopout-user://notification';
      const isSupported = Linking.canOpenURL(url);
      if (!isSupported) {
        throw new Error("Can't handle url: " + url);
      } else {
        const deepLinkUrlNotificaionUrl = new uri(url);
        deepLinkUrlNotificaionUrl.addSearch(data);
        console.log('deepLinkUrlNotificaionUrl ->', deepLinkUrlNotificaionUrl);
        Linking.openURL(deepLinkUrlNotificaionUrl.toString());
      }
    } else {
      await AsyncStorage.setItem('notificationData', JSON.stringify(data));
    }
  } catch (error) {
    console.log(error);
  }

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
  DeviceEventEmitter.addListener('answerCall', async (payload) => {
    console.log('answerCall -> ', payload);
    const callPlayload = JSON.stringify(payload);
    await AsyncStorage.setItem('callDetails', callPlayload);
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
