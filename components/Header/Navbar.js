import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';

import NotificationDropdown from './NotificationDropdown';
import Sidebar from './Sidebar';

import ShopOutLogo from './svg/shopout.svg';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

const Navbar = (props) => {
  if (props.type == 'unlocked') {
    return (
      <View style={Styles.navbar}>
        <View style={Styles.navbarLogo}>
          <ShopOutLogo width={120} height={60} />
        </View>
        <View style={Styles.navbarLinks}>
          <TouchableNativeFeedback
            onPress={() => {
              props.navigation.navigate('Video');
            }}>
            <Icon name="videocam" size={24} color="#0062FF" />
          </TouchableNativeFeedback>
          <NotificationDropdown navigation={props.navigation} />
          <TouchableNativeFeedback
            onPress={() => {
              props.navigation.navigate('Profile');
            }}>
            <Sidebar />
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  } else {
    return (
      <View style={Styles.navbarOnlyLogo}>
        <View style={Styles.navbarLogo}>
          <ShopOutLogo width={120} height={60} />
        </View>
      </View>
    );
  }
};

const Styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 20,
    paddingTop: 5,
    height: 70,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarOnlyLogo: {
    paddingHorizontal: 20,
    paddingTop: 5,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  navbarLinks: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  navbarLogo: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  coloredLogo: {
    color: '#0062FF',
    fontSize: 24,
  },
});

export default Navbar;
