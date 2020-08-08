import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import StatusBarWhite from '../../components/StatusBar';
import StoreCard from '../../components/Cards/StoreCard/StoreCard';

import {GlobalContext} from '../../providers/GlobalContext';
import {textStyles, COLORS, buttons} from '../../styles/styles';
import {Post} from '../../api/http';

const DEVICE_WIDTH = Dimensions.get('window').width;

const SingleBooking = (props) => {
  const {state} = useContext(GlobalContext);

  const bookingId = props.route.params.booking;
  const archived = props.route.params.archived;
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({});

  useEffect(() => {
    const body = JSON.stringify({
      cred: {
        phone: state.user.phone,
      },
      bookingData: {
        _id: bookingId,
      },
    });
    const route = `user/booking/${archived ? 'archived/' : ''}fetchone`;
    Post(route, body, state.token).then((data) => {
      setBooking(data.booking);
      setLoading(false);
    });
  }, [bookingId, archived]);

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />

      <ScrollView style={styles.container}>
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
          <View style={styles.contentContainer}>
            <StoreCard
              store={booking.store}
              noBookButton
              navigation={props.navigation}
              status={booking.status}
            />
            <View style={styles.bookingData}>
              <View style={styles.cardContainer}>
                <View style={styles.card}>
                  <Text
                    style={{
                      color: COLORS.SECONDARY,
                      ...textStyles.paragraphMedium,
                    }}>
                    Appointment Time
                  </Text>
                  <Text
                    style={{
                      color: COLORS.SECONDARY,
                      ...textStyles.paragraphMedium,
                    }}>
                    {new Date(booking.start)
                      .toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                      .replace(/(:\d{2}| [AP]M)$/, '')}{' '}
                    -{' '}
                    {new Date(booking.end)
                      .toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                      .replace(/(:\d{2}| [AP]M)$/, '')}
                  </Text>
                </View>
                <View style={styles.card}>
                  <Text
                    style={{
                      color: COLORS.SECONDARY,
                      ...textStyles.paragraphMedium,
                    }}>
                    Appointment Date
                  </Text>
                  <Text
                    style={{
                      color: COLORS.SECONDARY,
                      ...textStyles.paragraphMedium,
                    }}>
                    {new Date(booking.start).toDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.qrContainer}>
                {booking.status === 'upcoming' ? (
                  <>
                    <QRCode
                      value={JSON.stringify({
                        bookingId: booking.bookingId,
                        _id: booking._id,
                      })}
                      size={180}
                      logoBackgroundColor="transparent"
                    />
                    <Text
                      style={{
                        marginTop: 20,
                        color: COLORS.SECONDARY,
                        ...textStyles.paragraphLarge,
                      }}>
                      {booking.bookingId}
                    </Text>
                  </>
                ) : (
                  <View style={{height: 200}}></View>
                )}
              </View>
              <View style={styles.buttonArea}>
                {booking.review ? null : (
                  <TouchableOpacity
                    style={
                      booking.status === 'completed' ||
                      booking.status === 'missed'
                        ? buttons.primaryButton
                        : buttons.primaryButtonDisabled
                    }
                    disabled={
                      booking.status === 'cancelled' ||
                      booking.status === 'upcoming'
                    }
                    onPress={() => {
                      props.navigation.navigate('Rating', {booking: booking});
                    }}>
                    <Text style={{...textStyles.primaryButtonText}}>
                      Rate Store
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    height: Dimensions.get('window').height,
  },
  contentContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 100,
  },
  bookingData: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    elevation: 5,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    borderColor: COLORS.SECONDARY_TRANSPARENT,
  },
  qrContainer: {
    flex: 3,
    marginTop: 50,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
});

export default SingleBooking;
