import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

import StatusBarWhite from '../../components/StatusBar';
import BookingCard from '../../components/Cards/BookingCard/bookingCard';

import {styles} from './PreviousBookings';
import {GlobalContext} from '../../providers/GlobalContext';
import {URI} from '../../api/constants';

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

const UpcomingBookings = ({navigation}) => {
  const {state} = useContext(GlobalContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const startMonth =
    bookings.length > 0 ? new Date(bookings[0].start).getUTCMonth() : null;
  const endMonth =
    bookings.length > 0
      ? new Date(bookings[bookings.length - 1].start).getUTCMonth()
      : null;

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + state.token,
      },
      body: JSON.stringify({
        cred: {
          phone: state.user.phone,
        },
      }),
    };
    console.log(requestOptions);
    fetch(`${URI}/user/bookings`, requestOptions).then((res) => {
      if (res.status === 200)
        res.json().then((data) => {
          setBookings(data.bookings);
          sortBookings().then(() => {
            setLoading(false);
          });
        });
      else {
        Alert.alert('Something went wrong ', res.statusText);
      }
    });
  }, []);

  const sortBookings = async () => {
    setBookings((prev) => {
      return prev.sort((a, b) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
    });
  };

  const removeBooking = (id) => {
    setBookings((prev) => {
      return prev.filter((item) => item._id != id);
    });
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />

      <ScrollView style={styles.container}>
        <View style={styles.tabNavigation}>
          <View style={styles.tab}>
            <TouchableWithoutFeedback
              style={styles.tabNavigationObjectSelected}>
              <Text style={styles.tabNavigationTextSelected}>Upcoming</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.tab}>
            <TouchableWithoutFeedback
              style={styles.tabNavigationObject}
              onPress={() => {
                navigation.navigate('PreviousBookings');
              }}>
              <Text style={styles.tabNavigationText}>Previous</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {loading ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').height - 100,
              width: '100%',
            }}>
            <ActivityIndicator size="large" color="#0062FF" />
          </View>
        ) : (
          <>
            <View style={styles.monthSelectorContainer}>
              {bookings.length > 0 ? (
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
                {bookings.map((booking, _) => {
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
        )}
      </ScrollView>
    </View>
  );
};

export default UpcomingBookings;
