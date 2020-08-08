import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import CongratulationsImage from './congratulations.svg';
import {COLORS, textStyles, buttons} from '../../styles/styles';

const DEVICE_HEIGHT = Dimensions.get('screen').height;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const Congratulations = (props) => {
  const [text] = useState(props.route.params.text || '');
  const [booking] = useState(props.route.params.booking || null);

  return (
    <View
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        backgroundColor: COLORS.WHITE,
      }}>
      <View
        style={{
          height: 100,
        }}></View>

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
            props.navigation.navigate('SingleBooking', {
              booking: booking,
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
