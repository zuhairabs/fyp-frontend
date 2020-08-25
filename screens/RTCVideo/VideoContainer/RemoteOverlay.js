import React from 'react';
import {Text, View} from 'react-native';
import styles from './ContainerStyles';

const OverlayButton = ({title}) => (
  <View style={styles.overlayButton}>
    <Text style={styles.overlayButtonText}>{title}</Text>
  </View>
);

const OverlayText = ({text}) => <Text style={styles.overlayText}>{text}</Text>;

export default () => (
  <View style={styles.remoteOverlay}>
    <OverlayText text="John Doe" />
    <OverlayText text="Store manager" />
    <OverlayButton title="23:00" />
  </View>
);
