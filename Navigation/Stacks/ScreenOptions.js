import React from 'react';
import {CardStyleInterpolators} from '@react-navigation/stack';
import BackButton from '../../components/Buttons/BackButton';

export const SCREEN_OPTIONS = {
  headerShown: false,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export const SCREEN_HEADER_OPTIONS = {
  headerShown: true,
  headerBackImage: () => {
    return <BackButton />;
  },
  headerLeftContainerStyle: {
    padding: 20,
  },
};
