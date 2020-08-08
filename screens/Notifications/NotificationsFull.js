import React, {useState, useEffect, lazy, Suspense, useContext} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import StatusBarWhite from '../../components/StatusBar';
import {NotificationLoadingEffect} from '../../components/Cards/NotificationCard/NotificationCard';
const NotificationCard = lazy(() =>
  import('../../components/Cards/NotificationCard/NotificationCard'),
);
import {GlobalContext} from '../../providers/GlobalContext';
import {COLORS} from '../../styles/styles';

const NotificationsFull = (props) => {
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
    <View style={styles.screenContainer}>
      <StatusBarWhite />

      <ScrollView style={styles.container}>
        {loading ? (
          <View style={{height: '85%', marginTop: 20}}>
            {Array.from({length: 10}, (_, k) => {
              return <NotificationLoadingEffect key={k} />;
            })}
          </View>
        ) : (
          <View style={styles.notifications}>
            {notifications.length === 0 ? (
              <View
                style={{
                  ...styles.centerBox,
                  padding: 20,
                }}>
                <Text style={{color: COLORS.SECONDARY}}>
                  No new notifications
                </Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{...styles.centerBox}}>
                {notifications.map((notification, index) => {
                  return (
                    <Suspense fallback={<NotificationLoadingEffect />}>
                      <NotificationCard
                        navigation={props.navigation}
                        key={index}
                        notification={notification}
                      />
                    </Suspense>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: COLORS.WHITE,
  },
  container: {
    height: Dimensions.get('window').height,
  },
  centerBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifications: {
    marginTop: 20,
    marginBottom: 100,
  },
  small: {
    color: COLORS.SECONDARY_TRANSPARENT,
    fontSize: 12,
  },
  footer: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.SECONDARY_TRANSPARENT,
    fontSize: 18,
  },
});

export default NotificationsFull;
