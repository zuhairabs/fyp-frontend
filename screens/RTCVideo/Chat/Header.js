import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {COLORS} from '../../../styles/styles';
import styles from './Styles';

const Header = ({title, closeChatBox}) => (
  <View style={styles.header}>
    <View style={styles.statusLight} />
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity onPress={() => closeChatBox()}>
      <Icon name="close" size={20} color={COLORS.WHITE} />
    </TouchableOpacity>
  </View>
);

export default Header;
