import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';

import Circles from './circlesBackground.svg';

const DEVICE_WIDTH = Dimensions.get('screen').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;

const CirclesBackground = () => {
  return (
    <Circles
      height={DEVICE_HEIGHT}
      width={DEVICE_WIDTH}
      style={styles.background}
    />
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default CirclesBackground;
