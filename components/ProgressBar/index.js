import React from 'react';
import {Dimensions, View} from 'react-native';

import {COLORS} from '../../styles/styles';
const {width} = Dimensions.get('window');

const ProgressBar = ({progress, color = COLORS.PRIMARY, size = 'small'}) => {
  const getProgressBarWidth = () => {
    if (progress === 0) return width * 0.1;
    if (progress === 1) return 0;
    else return width * progress;
  };

  const getProgressBarHeight = () => {
    if (size === 'small') return 1;
    if (size === 'medium') return 2;
    else return 5;
  };

  return (
    <View
      style={{
        paddingVertical: getProgressBarHeight(),
        backgroundColor: color,
        width: getProgressBarWidth(),
      }}
    />
  );
};

export default ProgressBar;
