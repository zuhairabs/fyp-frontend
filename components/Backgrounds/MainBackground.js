import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const DEVICE_WIDTH = Dimensions.get('window').width;

const MainBackground = () => {
  return (
    <LinearGradient
      colors={['#D8E5FF', '#F3F8FF']}
      locations={[0, 0.9]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={styles.gradient}></LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    width: Math.floor(DEVICE_WIDTH * 0.23),
    top: 0,
    bottom: 0,
    left: 0,
  },
});

export default MainBackground;
