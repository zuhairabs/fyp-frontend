/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import {fetchNotifications} from './NotificationHandler';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('A new message has arrived for ShopOut', remoteMessage);
  fetchNotifications();
});

AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => firebaseBackgroundMessage,
);
AppRegistry.registerComponent(appName, () => App);
