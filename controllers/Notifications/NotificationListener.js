import messaging from '@react-native-firebase/messaging';
import {navigationRef} from '../../Navigation/Navigation';
import {fetchNotifications} from './NotificationHandler';

export default NotificationListener = (setNotifications) => {
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
        searched: false,
      });
  });

  // Global message handler
  messaging().onMessage(async (_) => {
    fetchNotifications().then(() => setNotifications());
  });
};