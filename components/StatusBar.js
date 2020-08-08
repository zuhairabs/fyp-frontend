import React from 'react';
import {StatusBar} from 'react-native';

export default () => {
  return (
    <StatusBar
      barStyle="dark-content"
      backgroundColor="transparent"
      animated={true}
      translucent
    />
  );
};
