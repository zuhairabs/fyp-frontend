import React, {useEffect, useContext} from 'react';
import {DeviceEventEmitter, Platform, AsyncStorage} from 'react-native';
import IncomingCall from 'react-native-incoming-call';
import {GlobalContextProvider} from './providers/GlobalContext';
import AppNavigation from './Navigation/Navigation';
import {navigationRef} from './Navigation/Navigation';
import PushNotification from 'react-native-push-notification';
import {missedNotification} from './controllers/Notifications/pushNotification';
import messaging from '@react-native-firebase/messaging';
import {leaveCall} from './screens/RTCVideo/VideoContainer/VideoContainer';

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  onNotification: async function (notification) {
    //if(notification.action === "Leave Call") {
    //leaveCall();
    //navigationRef.current?.navigate('Home');
    //console.log("Left Channel");
    //}

    if (notification.action === 'Accept') {
      console.log('Accepted');
      navigationRef.current?.navigate('RTCVideo', {
        channelName: notification.tag,
      });
      await AsyncStorage.setItem('callDetails', null);
      IncomingCall.dismiss();
    } else {
      console.log('Declined');
      missedNotification();
      IncomingCall.dismiss();
    }
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: true,
});

const App = () => {
  messaging()
    .getToken()
    .then((firebaseToken) => {
      console.log('FCM -> ', firebaseToken);
    });

  useEffect(() => {
    if (Platform.OS === 'android') {
      /**
       * App open from killed state (headless mode)
       */
      const payload = IncomingCall.getExtrasFromHeadlessMode();
      console.log('killed -> launchParameters -> ', payload);

      /**
       * App in foreground / background: listen to call events and determine what to do next
       */
      DeviceEventEmitter.addListener('endCall', (payload) => {
        // End call action here
        PushNotification.cancelAllLocalNotifications();
        missedNotification();
        console.log('Ended');
      });
      DeviceEventEmitter.addListener('answerCall', (payload) => {
        // Start call action here. You probably want to navigate to some CallRoom screen with the payload.uuid.
        PushNotification.cancelAllLocalNotifications();
        navigationRef.current?.navigate('RTCVideo', {
          channelName: payload.uuid,
        });
      });
    }
  }, []);

  console.disableYellowBox = true;
  return (
    <GlobalContextProvider>
      <AppNavigation />
    </GlobalContextProvider>
  );
};

export default App;
