import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import BookingCardSmall from '../../components/Cards/BookingCard/bookingCardSmall';
import BookingCard from '../../components/Cards/BookingCard/bookingCard';
import {COLORS, textStyles} from '../../styles/styles';

const mlist = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default ({navigation, smallCards, bookings, removeBooking}) => {
  // variable for title of month selectors on top of the booking list
  const startMonth =
    bookings && bookings.length > 0
      ? new Date(bookings[0].start).getUTCMonth()
      : null;
  const endMonth =
    bookings && bookings.length > 0
      ? new Date(bookings[bookings.length - 1].start).getUTCMonth()
      : null;

  return (
    <>
      <View style={styles.monthSelectorContainer}>
        {bookings && bookings.length > 0 ? (
          <Text style={styles.selectedMonth}>
            {startMonth === endMonth ? (
              <Text>
                {mlist[endMonth]} {new Date().getUTCFullYear()}
              </Text>
            ) : (
              <Text>
                {mlist[startMonth]} - {mlist[endMonth]}{' '}
                {new Date().getUTCFullYear()}
              </Text>
            )}
          </Text>
        ) : (
          <View
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height - 480,
              justifyContent: 'center',
              flex: 1,
              marginTop: 120,
            }}>
            <Image
              source={require('../../components/UXComponents/svg/EmptyPage.png')}
              style={{
                width: undefined,
                height: undefined,
                flex: 1,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                color: '#666',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 20,
                paddingHorizontal: 40,
                fontSize: 16,
              }}>
              Nothing here!
            </Text>
          </View>
        )}
      </View>
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.results}>
          {bookings &&
            bookings.map((booking, _) => {
              if (smallCards)
                return (
                  <BookingCardSmall
                    key={booking._id}
                    booking={booking}
                    navigation={navigation}
                    removeBooking={removeBooking}
                  />
                );
              else
                return (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    navigation={navigation}
                    removeBooking={removeBooking}
                  />
                );
            })}
        </View>
      </ScrollView>
    </>
  );
};

export const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: 100,
  },
  monthSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 40,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedMonth: {
    color: COLORS.SECONDARY,
    ...textStyles.paragraphSmall,
  },
  results: {
    marginTop: 20,
  },
});
