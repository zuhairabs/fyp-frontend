import React from 'react';
import {View, StyleSheet} from 'react-native';

import Navbar from './Navbar';
import CategoryScroll from './CategoryScroll';

const Header = (props) => {
  return (
    <View style={Styles.header}>
      <Navbar type="full" />
      <Search />
      <CategoryScroll />
    </View>
  );
};

const Styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'space-between',
    fontSize: 28,
  },
});

export default Header;
