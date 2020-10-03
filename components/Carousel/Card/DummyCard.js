import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {COLORS} from '../../../styles/styles';
import styles from './CardStyles';

const DummyCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader} />
        <View style={styles.cardContent}>
          <ActivityIndicator color={COLORS.PRIMARY} />
        </View>
      </View>
    </View>
  );
};

export default DummyCard;
