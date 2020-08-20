import React, {useEffect, useContext} from 'react';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {GlobalContext} from './providers/GlobalContext';
import notificationListener from './NotificationHandler';

import Home from './screens/Home/Home';
import Store from './screens/Store/Store';

import Verification from './screens/Authentication/Verification';
import Authentication from './screens/Authentication/Authentication';
import Success from './screens/Authentication/Success';

import EditProfile from './screens/Profile/EditProfile';
import Profile from './screens/Profile/Profile';

import Favourites from './screens/Favourites/Favourites';
import Categories from './screens/Favourites/Categories';

import Rating from './screens/Bookings/Rating';
import SingleBooking from './screens/Bookings/SingleBooking';

import Congratulations from './screens/Misc/Congratulations';
import NotificationsFull from './screens/Notifications/NotificationsFull';
import SearchFull from './screens/Misc/SearchFull';
import Splash from './screens/Misc/Splash';
import Support from './screens/Misc/Support';
import Welcome from './screens/OnBoarding/OnBoarding';

import BackButton from './components/Buttons/BackButton';
import ResetPassword from './screens/Authentication/ResetPassword';
import Bookings from './screens/Bookings/Bookings';
import Video from './screens/Store/Video';

const Stack = createStackNavigator();
export const navigationRef = React.createRef();
const SCREEN_OPTIONS = {
  headerShown: false,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

const SCREEN_HEADER_OPTIONS = {
  headerShown: true,
  headerBackImage: () => {
    return <BackButton />;
  },
  headerLeftContainerStyle: {
    padding: 20,
  },
};

const AuthStack = ({state}) => {
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

const clearNotifications = async () => {
  console.log('cleared');
};

const MainStack = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen
      name="Favourites"
      component={Favourites}
      options={{
        title: 'Favourites',
        ...SCREEN_HEADER_OPTIONS,
      }}
    />
    <Stack.Screen
      name="Categories"
      component={Categories}
      options={{
        title: 'Categories',
        ...SCREEN_HEADER_OPTIONS,
      }}
    />
    <Stack.Screen
      name="Support"
      component={Support}
      options={{
        title: 'Support',
        ...SCREEN_HEADER_OPTIONS,
      }}
    />
    <Stack.Screen name="EditProfile" component={EditProfile} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
    <Stack.Screen name="Success" component={Success} />
    <Stack.Screen name="Store" component={Store} />
    <Stack.Screen name="Video" component={Video} />
    <Stack.Screen
      name="SearchFull"
      component={SearchFull}
      options={{
        gestureDirection: 'vertical',
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
      }}
    />
    <Stack.Screen
      name="Bookings"
      component={Bookings}
      options={{
        title: 'Appointment',
        ...SCREEN_HEADER_OPTIONS,
      }}
    />
    <Stack.Screen
      name="SingleBooking"
      component={SingleBooking}
      options={{
        title: 'Booking',
        ...SCREEN_HEADER_OPTIONS,
      }}
    />
    <Stack.Screen
      name="Rating"
      component={Rating}
      options={{
        title: 'Rate the store',
        ...SCREEN_HEADER_OPTIONS,
      }}
    />
    <Stack.Screen
      name="NotificationsFull"
      component={NotificationsFull}
      options={{
        title: 'Notifications',
        ...SCREEN_HEADER_OPTIONS,
        headerRight: () => (
          <TouchableOpacity onPress={() => clearNotifications()}>
            <Text
              style={{
                color: '#6666666F',
              }}>
              MARK ALL AS SEEN
            </Text>
          </TouchableOpacity>
        ),
        headerRightContainerStyle: {
          padding: 20,
        },
      }}
    />
    <Stack.Screen name="Congratulations" component={Congratulations} />
  </Stack.Navigator>
);

const AppStack = ({state}) =>
  state.isLoading ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={Splash} />
    </Stack.Navigator>
  ) : state.token === null ? (
    <AuthStack state={state} />
  ) : (
    <MainStack />
  );

const AppNavigation = () => {
  const {authActions, state} = useContext(GlobalContext);

  useEffect(() => {
    authActions.retrieveToken();
    notificationListener(authActions.setNotifications);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack state={state} />
    </NavigationContainer>
  );
};

export default AppNavigation;
