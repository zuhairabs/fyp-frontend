import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { COLORS, textStyles } from '../../../styles/styles';
import { dropdownModal } from '../../Header/NotificationDropdown';
import { navigationRef } from '../../../Navigation/Navigation';

const MINUTE_LENGTH = 60 * 1000;
const HOUR_LENGTH = 60 * MINUTE_LENGTH;
const DAY_LENGTH = 24 * HOUR_LENGTH;
const WEEK_LENGTH = 7 * DAY_LENGTH;
const MONTH_LENGTH = 30 * DAY_LENGTH;

export const NotificationLoadingEffect = () => {
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: COLORS.WHITE,
      }}>
      <View
        style={{
          ...styles.imageContainer,
          backgroundColor: COLORS.SECONDARY,
          opacity: 0.3,
        }}
      />
      <View
        style={{
          ...styles.contentContainer,
          backgroundColor: COLORS.SECONDARY,
          opacity: 0.3,
        }}
      />
    </TouchableOpacity>
  );
};

const calculateNotificationTime = (time) => {
  let generatedTime = new Date(time).getTime();
  let currentTime = new Date().getTime();
  let offset = currentTime - generatedTime;

  if (offset < MINUTE_LENGTH) return 'Just now';
  else if (offset < HOUR_LENGTH)
    return `${Math.floor(offset / MINUTE_LENGTH)} minutes ago`;
  else if (offset < DAY_LENGTH)
    return `${Math.floor(offset / HOUR_LENGTH)} hours ago`;
  else if (offset / DAY_LENGTH < 2) return 'Yesterday';
  else if (offset < WEEK_LENGTH)
    return `${Math.floor(offset / DAY_LENGTH)} days ago`;
  else if (offset / WEEK_LENGTH < 2) return '1 week ago';
  else if (offset < MONTH_LENGTH)
    return `${Math.floor(offset / WEEK_LENGTH)} weeks ago`;
  else if (offset / MONTH_LENGTH < 2) return '1 month ago';
  else return `${Math.floor(offset / MONTH_LENGTH)} months ago`;
};

const NotificationCard = ({ notification }) => {
  const handleNotificationCardPress = () => {
    dropdownModal.current?.close();
    if (notification.booking)
      navigationRef.current?.navigate('SingleBooking', {
        booking: notification.booking,
        archived: notification.archived,
      });
    else if (notification.demobooking)
      navigationRef.current?.navigate('SingleDemoBooking', {
        booking: notification.demobooking,
        archived: notification.archived,
      });
    else if (notification.store)
      navigationRef.current?.navigate('Store', {
        store: notification.store,
        searched: false,
      });
    else ToastAndroid.show('No actions available', ToastAndroid.SHORT);
  };

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: notification.readStatus ? COLORS.WHITE : '#0062FF05',
      }}
      onPress={() => {
        handleNotificationCardPress();
      }}>
      <View
        style={{
          ...styles.imageContainer,
          backgroundColor: notification.readStatus ? COLORS.WHITE : '#0062FF05',
        }}>
        {notification.image ? (
          <Image
            source={{ uri: `data:image/png;base64,${notification.image}` }}
            style={styles.logo}
          />
        ) : (
          <Image source={require('./shopout.png')} style={styles.image} />
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{notification.text}</Text>
        <Text style={styles.date}>
          {calculateNotificationTime(notification.generatedTime)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#ECF0F4',
    borderBottomWidth: 1,
    width: '100%',
  },
  imageContainer: {
    marginRight: 20,
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: undefined,
    width: undefined,
    borderRadius: 64 / 2,
    flex: 1,
  },
  logo: {
    flex: 1,
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 8,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  title: {
    flex: 3,
    color: '#666',
    marginBottom: 8,
    ...textStyles.paragraphMedium,
  },
  date: {
    flex: 1,
    color: '#666',
    ...textStyles.paragraphExtraSmall,
  },
});

export default NotificationCard;
