import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Share from 'react-native-share';
import { Post } from '../../api/http';
import { GlobalContext } from '../../providers/GlobalContext';
import StatusBarWhite from '../../components/StatusBar';
import CongratulationsImage from './congratulations.svg';
import { COLORS, textStyles, buttons } from '../../styles/styles';

const DEVICE_HEIGHT = Dimensions.get('screen').height;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const Congratulations = (props) => {
  const [text] = useState(props.route.params.text || '');
  const [booking, setBooking] = useState(
    { _id: props.route.params.booking } || null,
  );
  const { state } = useContext(GlobalContext);
  const demoBooking = props.route.params.demoBooking || false;

  const shareBooking = () => {
    if (booking && booking.store) {
      const display_name = booking.store.business.display_name;
      const date = new Date(booking.start);
      const display_date =
        date.toDateString() + ', ' + date.toLocaleTimeString().slice(0, 5);
      const options = {
        message: `I am heading to shop at ${display_name} on ${display_date}, want to join me? Click here!`,
        title: 'Try out the ShopOut app',
        url: 'https://shopout.co.in',
      };
      Share.open(options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
    }
  };

  const fetchBooking = () => {
    const body = JSON.stringify({
      cred: {
        phone: state.user.phone,
      },
      bookingData: {
        _id: booking._id,
      },
    });
    Post('booking/fetch/single', body, state.token)
      .then((data) => {
        setBooking(data.booking);
        console.log(data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (!demoBooking && booking && booking._id) fetchBooking();
  }, []);

  return (
    <View
      style={{
        justifyContent: 'space-between',
        height: DEVICE_HEIGHT,
        width: Dimensions.get('window').width,
        backgroundColor: COLORS.WHITE,
      }}>
      <StatusBarWhite />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingTop: 50,
          paddingHorizontal: 50,
        }}>
        <TouchableOpacity
          style={styles.extensionTabLast}
          onPress={() => {
            shareBooking();
          }}>
          <Icon name="share" size={28} color={COLORS.SECONDARY} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CongratulationsImage width={Dimensions.get('window').width} />
        <Text
          style={{
            ...textStyles.paragraphExtraLarge,
            marginTop: 30,
          }}>
          Congratulations
        </Text>
        <Text
          style={{
            ...textStyles.paragraphMedium,
            color: COLORS.SECONDARY,
          }}>
          {text}
        </Text>
      </View>

      <View style={styles.buttonArea}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Home');
          }}
          style={buttons.secondaryButton}>
          <Text style={textStyles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            demoBooking
              ? props.navigation.navigate('SingleDemoBooking', {
                booking: booking._id,
              })
              : props.navigation.navigate('SingleBooking', {
                booking: booking._id,
              });
          }}
          style={buttons.primaryButton}>
          <Text style={textStyles.primaryButtonText}>View Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonArea: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: DEVICE_HEIGHT - WINDOW_HEIGHT,
  },
});

export default Congratulations;
