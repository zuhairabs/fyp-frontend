import React, {Suspense, lazy, useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {NotificationLoadingEffect} from '../Cards/NotificationCard/NotificationCard';
// const NotificationCard = lazy(() =>
//   import('../Cards/NotificationCard/NotificationCard'),
// );
import NotificationCard from '../Cards/NotificationCard/NotificationCard';
import {COLORS, textStyles} from '../../styles/styles';

const NotificationList = ({notifications}) => {
  if (!notifications || notifications.length === 0)
    return (
      <View
        style={{
          height: '80%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <Text
          style={{
            color: COLORS.SECONDARY,
            ...textStyles.paragraphMedium,
          }}>
          No new notifications
        </Text>
      </View>
    );
  else
    return (
      <Suspense fallback={<NotificationLoadingEffect />}>
        <ScrollView style={{height: '85%'}}>
          {notifications.map((notification) => {
            return (
              <NotificationCard
                key={notification._id}
                notification={notification}
              />
            );
          })}
        </ScrollView>
      </Suspense>
    );
};

const styles = StyleSheet.create({});

export default NotificationList;
