import {Post} from '../../api/http';
import AsyncStorage from '@react-native-community/async-storage';

// TODO: Create state variables for notifications, separate from the user state
const getUserFromAsyncStorage = async () => {
  const user = JSON.parse(await AsyncStorage.getItem('user'));
  const token = await AsyncStorage.getItem('jwt');
  return {user, token};
};

export const fetchNotifications = (setNotifications = null) => {
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
          if (setNotifications) setNotifications(data.notifications);
          resolve(data.notifications);
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
