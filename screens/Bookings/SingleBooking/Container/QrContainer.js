import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {COLORS, textStyles} from '../../../../styles/styles';

export default ({booking}) => {
  if (booking.status === 'upcoming' && booking.type !== 'virtual')
    return (
      <View style={styles.qrContainer}>
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
      </View>
    );
  else
    return (
      <View style={styles.qrContainer}>
        <View style={{height: 200}} />
      </View>
    );
};

const styles = StyleSheet.create({
  qrContainer: {
    flex: 3,
    marginTop: 50,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
