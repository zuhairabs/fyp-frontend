import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
// AUTH STACK SCREENS
const DIR = '../../screens/Authentication';
import Verification from `${DIR}/Verification`;
import Authentication from `${DIR}/Authentication`;
import Success from `${DIR}/Success`;
import ResetPassword from `${DIR}/ResetPassword`;
import Welcome from '../../screens/OnBoarding/OnBoarding';
import {SCREEN_OPTIONS} from './ScreenOptions';

export default AuthStack = ({state}) => {
  if (state.welcomeShown)
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="Authentication" component={Authentication} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Success" component={Success} />
      </Stack.Navigator>
    );
  else
    return (
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="Welcome" component={Welcome} />
      </Stack.Navigator>
    );
};
