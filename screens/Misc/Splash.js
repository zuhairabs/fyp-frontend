import React from 'react';
import {View, StatusBar, Dimensions, StyleSheet} from 'react-native';

import ShopOutLogo from './shopout.svg';

const Splash = () => {
  return (
    <View style={Styles.screenContainer}>
      <View style={Styles.container}>
        <ShopOutLogo height="100%" width="100%" />
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#F8F9FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: Dimensions.get('window').width / 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#0062FF',
  },
});

export default Splash;
