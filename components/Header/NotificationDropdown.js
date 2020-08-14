import React, {createRef, useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';

import NotificationList from './NotificationList';
import NotificationBell from './svg/notifications.svg';
import {COLORS, textStyles} from '../../styles/styles';
import {GlobalContext} from '../../providers/GlobalContext';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
export const dropdownModal = createRef();

// const Dropdown = ({navigation}) => {
//   const {state} = useContext(GlobalContext);

//   const [notifications, setNotifications] = useState(
//     state.user.notifications ? state.user.notifications : [],
//   );
//   const [loading, setLoading] = useState(true);

//   const loadNotificationsFromAsyncStorage = async () => {
//     return (storedNotifications = JSON.parse(await AsyncStorage.getItem('user'))
//       .notifications);
//   };

//   useEffect(() => {
//     setLoading(false);
//     if (notifications === []) {
//       loadNotificationsFromAsyncStorage().then((storedNotifications) => {
//         if (storedNotifications && storedNotifications !== [])
//           setNotifications(storedNotifications);
//         setLoading(false);
//       });
//     }
//   }, [notifications]);

//   return (
//     <View style={styles.dropdown}>
//       <View style={styles.notifications}>
//         <View style={styles.header}>
//           <Text style={styles.heading}>Notifications</Text>
//         </View>
//         {loading && (
//           <ScrollView style={{height: '85%'}}>
//             {Array.from({length: 5}, (_, k) => {
//               return <NotificationLoadingEffect key={k} />;
//             })}
//           </ScrollView>
//         )}
//         {!loading && notifications.length === 0 ? (
//           <View
//             style={{
//               height: '80%',
//               justifyContent: 'center',
//               alignItems: 'center',
//               padding: 20,
//             }}>
//             <Text
//               style={{
//                 color: COLORS.SECONDARY,
//                 ...textStyles.paragraphMedium,
//               }}>
//               No new notifications
//             </Text>
//           </View>
//         ) : (
//           <ScrollView style={{height: '85%'}}>
//             {notifications.map((notification) => {
//               return (
//                 <Suspense fallback={<NotificationLoadingEffect />}>
//                   <NotificationCard
//                     key={notification._id}
//                     notification={notification}
//                     navigation={navigation}
//                   />
//                 </Suspense>
//               );
//             })}
//           </ScrollView>
//         )}
//         <TouchableOpacity
//           style={styles.footer}
//           onPress={() => navigation.navigate('NotificationsFull')}>
//           <Text style={{...textStyles.paragraphMedium}}>View All</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

const Dropdown = ({navigation}) => {
  const {state} = useContext(GlobalContext);

  return (
    <Modal
      ref={dropdownModal}
      style={styles.dropdown}
      position={'top'}
      backdropPressToClose={true}
      swipeToClose={false}
      animationDuration={0}
      useNativeDriver={true}
      coverScreen={true}
      backdropOpacity={0}
      backButtonClose={true}>
      <View style={styles.notifications}>
        <View style={styles.header}>
          <Text style={styles.heading}>Notifications</Text>
        </View>
        {state.user.notifications && (
          <NotificationList
            navigation={navigation}
            notifications={state.user.notifications}
          />
        )}
        <View>
          <TouchableOpacity
            style={styles.footer}
            onPress={() => {
              dropdownModal.current?.close();
              navigation.navigate('NotificationsFull');
            }}>
            <Text style={{...textStyles.paragraphMedium}}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const NotificationDropdown = (props) => {
  const toggleModalState = async () => {
    if (dropdownModal.current?.isOpen) dropdownModal.current?.close();
    else dropdownModal.current?.open();
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => toggleModalState()}
        style={styles.container}>
        <NotificationBell height="90%" />
      </TouchableWithoutFeedback>
      <Dropdown navigation={props.navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dropdown: {
    height: Math.floor(WINDOW_HEIGHT / 1.5),
    width: WINDOW_WIDTH - 40,

    backgroundColor: COLORS.WHITE,
    elevation: 5,
    borderColor: '#E5E5E5',
    borderWidth: 1,

    right: -10,
    top: 70,

    borderRadius: 15,
    paddingBottom: 20,
  },
  notifications: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.SECONDARY_TRANSPARENT,
  },
  heading: {
    ...textStyles.paragraphLarge,
  },
  small: {
    color: COLORS.SECONDARY_TRANSPARENT,
    fontSize: 12,
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.SECONDARY_TRANSPARENT,
    zIndex: 10,
  },
});

export default NotificationDropdown;
