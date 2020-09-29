import React from 'react';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {buttons, textStyles} from '../../../../styles/styles';
import styles from '../Styles';
import {navigationRef} from '../../../../Navigation/Navigation';

export const Button = ({text, buttonFunction}) => (
  <TouchableOpacity
    style={buttons.primaryButton}
    onPress={() => buttonFunction()}>
    <Text style={{...textStyles.primaryButtonText}}>{text}</Text>
  </TouchableOpacity>
);

export const DisabledButton = ({text}) => (
  <TouchableOpacity style={buttons.primaryButtonDisabled} disabled>
    <Text style={{...textStyles.primaryButtonText}}>{text}</Text>
  </TouchableOpacity>
);

const RegularButton = ({booking, setScreen}) =>
  booking.status === 'completed' || booking.status === 'missed' ? (
    <Button text="Rate Store" buttonFunction={() => setScreen(1)} />
  ) : (
    <DisabledButton text="Rate Store" />
  );

const VirtualBookingButton = ({booking}) =>
  booking.status === 'upcoming' ? (
    <Button
      text="Join Call"
      buttonFunction={() =>
        navigationRef.current?.navigate('RTCVideo', {
          channelName: booking.bookingId,
        })
      }
    />
  ) : (
    <DisabledButton text="Join Call" />
  );

export default ({booking, setScreen}) => (
  <View style={styles.buttonArea}>
    {booking.type === 'virtual' ? (
      <VirtualBookingButton booking={booking} />
    ) : (
      <RegularButton booking={booking} setScreen={setScreen} />
    )}
  </View>
);
