import React, {createRef, useContext, useEffect, useState} from 'react';
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
import {fetchNotifications} from '../../controllers/Notifications/NotificationHandler';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
export const dropdownModal = createRef();

const Dropdown = ({navigation}) => {
  const {state} = useContext(GlobalContext);
  const [notifications, setNotifications] = useState(state.user.notifications);

  useEffect(() => {
    fetchNotifications().then((fetchedNotifications) => {
      if (fetchedNotifications !== notifications)
        setNotifications(fetchedNotifications);
    });
  }, []);

  return (
    <Modal
      ref={dropdownModal}
      style={styles.dropdown}
      position={'top'}
      entry={'top'}
      animationDuration={300}
      backdropPressToClose={true}
      swipeToClose={false}
      useNativeDriver={true}
      coverScreen={true}
      backdropOpacity={0}
      backButtonClose={true}>
      <View style={styles.notifications}>
        <View style={styles.header}>
          <Text style={styles.heading}>Notifications</Text>
        </View>
        <NotificationList notifications={notifications} />
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

const NotificationDropdown = (props) => (
  <>
    <TouchableWithoutFeedback
      onPress={() => dropdownModal.current?.open()}
      style={styles.container}>
      <NotificationBell height="90%" />
    </TouchableWithoutFeedback>
    <Dropdown navigation={props.navigation} />
  </>
);

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
