import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
// AUTH STACK SCREENS
import Verification from '../../screens/Authentication/Verification';
import Authentication from '../../screens/Authentication/Authentication';
import Success from '../../screens/Authentication/Success';
import ResetPassword from '../../screens/Authentication/ResetPassword';
import Welcome from '../../screens/OnBoarding/OnBoarding';
import {SCREEN_OPTIONS} from './ScreenOptions';

export default ({state}) => {
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
