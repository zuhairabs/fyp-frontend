import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

import AuthStack from './AuthStack';
import MainStack from './MainStack';
import Splash from '../../screens/Misc/Splash';

export const AppStack = ({state}) => {
  if (state.isLoading) return <SplashScreen />;
  else if (state.token === null) return <AuthStack state={state} />;
  else return <MainStack />;
};

const SplashScreen = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Splash" component={Splash} />
  </Stack.Navigator>
);
