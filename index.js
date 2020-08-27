/**
 * @format
 */

import {AppRegistry, ToastAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import {fetchNotifications} from './controllers/Notifications/NotificationHandler';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  fetchNotifications();
});

AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => firebaseBackgroundMessage,
);
AppRegistry.registerComponent(appName, () => App);
