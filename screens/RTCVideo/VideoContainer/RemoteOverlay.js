import React from 'react';
import {Text, View} from 'react-native';
import styles from './ContainerStyles';

String.prototype.formatTimeString = function () {
  var sec_num = parseInt(this, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;
  return hours + ':' + minutes + ':' + seconds;
};

const OverlayButton = ({title}) => (
  <View style={styles.overlayButton}>
    <Text style={styles.overlayButtonText}>{title}</Text>
  </View>
);

const OverlayText = ({text}) => <Text style={styles.overlayText}>{text}</Text>;

export default ({time, title, name}) => (
  <View style={styles.remoteOverlay}>
    <OverlayText text={name} />
    <OverlayText text={title} />
    <OverlayButton title={time.toString().formatTimeString()} />
  </View>
);
