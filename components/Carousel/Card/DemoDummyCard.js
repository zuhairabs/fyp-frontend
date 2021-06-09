import React from 'react';
import { ActivityIndicator, View, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../styles/styles';
const DEVICE_WIDTH = Dimensions.get('window').width;

const DemoDummyCard = () => {
  return (
    <View style={styless.container}>
      <View style={styless.card}>
        <ActivityIndicator color={COLORS.PRIMARY} />
      </View>
    </View>
  );
};

const styless = StyleSheet.create({
  container: {
    width: Math.floor(DEVICE_WIDTH / 2),
    marginVertical: 8,
    borderRadius: 15,
    marginHorizontal: 15,
  },
  card: {
    height: 130,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    elevation: 5,
    borderRadius: 15,
  },
});

export default DemoDummyCard;