/**
 * @format
 */

import {AppRegistry, ToastAndroid, DeviceEventEmitter} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import {fetchNotifications} from './controllers/Notifications/NotificationHandler';
//import IncomingCall from 'react-native-incoming-call';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  fetchNotifications();
 /* if (remoteMessage?.notification?.title === 'Incoming Call') {
	  console.log('Handle Notification');
    // Display incoming call activity.
    IncomingCall.display(
      'callUUIDv4', // Call UUID v4
      'Quocs', // Username
      'https://avatars3.githubusercontent.com/u/16166195', // Avatar URL
      'Incoming Call', // Info text
      20000 // Timeout for end call after 20s
    );
  } else if (remoteMessage?.notification?.title === 'Missed Call') {
    // Terminate incoming activity. Should be called when call expired.
    IncomingCall.dismiss();
  }
 
  // Listen to headless action events
  DeviceEventEmitter.addListener("endCall", payload => {
    // End call action here
  });
  DeviceEventEmitter.addListener("answerCall", (payload) => {
    console.log('answerCall', payload);
    if (payload.isHeadless) {
      // Called from killed state
      IncomingCall.openAppFromHeadlessMode(payload.uuid);
    } else {
      // Called from background state
      IncomingCall.backToForeground();
    }
  }); */
});

AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => firebaseBackgroundMessage,
);
AppRegistry.registerComponent(appName, () => App);
