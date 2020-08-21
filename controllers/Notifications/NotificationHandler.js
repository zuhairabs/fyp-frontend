import {Post} from './api/http';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {navigationRef} from '../../Navigation/Navigation';

// TODO: Create state variables for notifications, separate from the user state

const getUserFromAsyncStorage = async () => {
  const user = JSON.parse(await AsyncStorage.getItem('user'));
  const token = await AsyncStorage.getItem('jwt');
  return {user, token};
};

export const notificationListener = (setNotifications) => {
  // Handler to control push notification interaction
  messaging().onNotificationOpenedApp((remoteMessage) => {
    if (remoteMessage.data?.booking)
      navigationRef.current?.navigate('SingleBooking', {
        booking: remoteMessage.data.booking,
        archived: remoteMessage.data.archived,
      });
    else if (remoteMessage.data?.store)
      navigationRef.current?.navigate('Store', {
        store: remoteMessage.data.store,
      });
  });

  // Global message handler
  messaging().onMessage(async (_) => {
    fetchNotifications().then(() => setNotifications());
  });
};

export const fetchNotifications = () => {
  /**
   * This function retrieves the user's notifications from the server
   * It is called twice - once in the foreground handler when the app is in open state
   * and in the background handler when the app is in background or terminated
   * This function is outside the scope of state thus only async storage can be used
   */
  return new Promise((resolve, reject) => {
    getUserFromAsyncStorage().then(({user, token}) => {
      let body = JSON.stringify({
        cred: {
          phone: user.phone,
        },
      });
      Post('user/notifications', body, token)
        .then(async (data) => {
          user.notifications = data.notifications;
          await AsyncStorage.setItem('user', JSON.stringify(user));
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const fetchNotificationsFromStorage = () => {
  const {user, _} = getUserFromAsyncStorage();
  return user.notifications;
};
