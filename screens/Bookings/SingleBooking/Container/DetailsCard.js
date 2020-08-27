import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {textStyles, COLORS} from '../../../../styles/styles';
import styles from '../Styles';

export default ({title, text, icon}) => (
  <View style={styles.card}>
    <Text
      style={{
        color: COLORS.SECONDARY,
        ...textStyles.paragraphMedium,
      }}>
      {title}
    </Text>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <Icon name={icon} size={16} color={COLORS.SECONDARY} />
      <Text
        style={{
          color: COLORS.SECONDARY,
          paddingLeft: 5,
          ...textStyles.paragraphMedium,
        }}>
        {text}
      </Text>
    </View>
  </View>
);
