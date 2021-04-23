import messaging from '@react-native-firebase/messaging';
import {navigationRef} from '../../Navigation/Navigation';
import {fetchNotifications} from './NotificationHandler';

export default NotificationListener = (setNotifications) => {
  // Handler to control push notification interaction
  messaging().onNotificationOpenedApp((remoteMessage) => {
    const type = remoteMessage.data.type;
    if (type && type === 'booking-60') {
      navigationRef.current?.navigate('Bookings');
    } else if (type && (type === 'booking-15' || type === 'booking-missed')) {
      navigationRef.current?.navigate('SingleBooking', {
        booking: remoteMessage.data.booking,
        archived: remoteMessage.data.archived,
      });
    } else {
      navigationRef.current?.navigate('Home');
    }
  });

  messaging().getInitialNotification((remoteMessage) => {
    console.log('Backround ran');
  });

  // Global message handler
  messaging().onMessage(async (remoteMessage) => {
    fetchNotifications(setNotifications);
  });
};
