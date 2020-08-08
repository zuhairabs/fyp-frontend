import React, {useState, useEffect, lazy, Suspense, useContext} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import {NotificationLoadingEffect} from '../Cards/NotificationCard/NotificationCard';
const NotificationCard = lazy(() =>
  import('../Cards/NotificationCard/NotificationCard'),
);
import NotificationBell from './svg/notifications.svg';

import {GlobalContext} from '../../providers/GlobalContext';
import {COLORS, textStyles} from '../../styles/styles';

const Dropdown = ({navigation}) => {
  const {state} = useContext(GlobalContext);

  const [notifications, setNotifications] = useState(
    state.user.notifications ? state.user.notifications : [],
  );
  const [loading, setLoading] = useState(true);

  const loadNotificationsFromAsyncStorage = async () => {
    return (storedNotifications = JSON.parse(await AsyncStorage.getItem('user'))
      .notifications);
  };

  useEffect(() => {
    setLoading(false);
    if (notifications === []) {
      loadNotificationsFromAsyncStorage().then((storedNotifications) => {
        if (storedNotifications && storedNotifications !== [])
          setNotifications(storedNotifications);
        setLoading(false);
      });
    }
  }, [notifications]);

  return (
    <View style={styles.dropdown}>
      <View style={styles.notifications}>
        <View style={styles.header}>
          <Text style={styles.heading}>Notifications</Text>
        </View>
        {loading && (
          <ScrollView style={{height: '85%'}}>
            {Array.from({length: 5}, (_, k) => {
              return <NotificationLoadingEffect key={k} />;
            })}
          </ScrollView>
        )}
        {!loading && notifications.length === 0 ? (
          <View
            style={{
              height: '80%',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}>
            <Text
              style={{color: COLORS.SECONDARY, ...textStyles.paragraphMedium}}>
              No new notifications
            </Text>
          </View>
        ) : (
          <ScrollView style={{height: '85%'}}>
            {notifications.map((notification) => {
              return (
                <Suspense fallback={<NotificationLoadingEffect />}>
                  <NotificationCard
                    key={notification._id}
                    notification={notification}
                    navigation={navigation}
                  />
                </Suspense>
              );
            })}
          </ScrollView>
        )}
        <TouchableOpacity
          style={styles.footer}
          onPress={() => navigation.navigate('NotificationsFull')}>
          <Text style={{...textStyles.paragraphMedium}}>View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NotificationDropdown = (props) => {
  const [expand, setExpand] = useState(false);

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          setExpand(!expand);
        }}
        style={styles.container}>
        <NotificationBell height="90%" />
      </TouchableWithoutFeedback>
      {expand && <Dropdown navigation={props.navigation} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dropdown: {
    height: Math.floor(Dimensions.get('window').height / 1.5),
    width: Math.floor(Dimensions.get('window').width) - 40,

    backgroundColor: COLORS.WHITE,
    elevation: 5,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    right: 0,
    top: 55,
    borderRadius: 15,
    paddingBottom: 20,

    zIndex: 10,
    position: 'absolute',
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
  },
});

export default NotificationDropdown;
