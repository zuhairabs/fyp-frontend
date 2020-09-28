import React from 'react';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
// SCREEN IMPORTS
import Home from '../../screens/Home/VideoHome';
import Store from '../../screens/Store/Store';
import EditProfile from '../../screens/Profile/EditProfile';
import Profile from '../../screens/Profile/Profile';
import Favourites from '../../screens/Favourites/Favourites';
import Categories from '../../screens/Favourites/Categories';
import SingleBooking from '../../screens/Bookings/SingleBooking/SingleBooking';
import Congratulations from '../../screens/Misc/Congratulations';
import NotificationsFull from '../../screens/Notifications/NotificationsFull';
import ResetPassword from '../../screens/Authentication/ResetPassword/ResetPassword';
import SearchFull from '../../screens/Search';
import Support from '../../screens/Misc/Support';
import Success from '../../screens/Authentication/ResetPassword/Success';
import Bookings from '../../screens/Bookings/Bookings';
import Video from '../../screens/Store/Video';
import RTCVideo from '../../screens/RTCVideo/RTCVideo';
// NAVIGATOR OPTIONS
import {SCREEN_HEADER_OPTIONS, SCREEN_OPTIONS} from './ScreenOptions';
import FullScreenWebView from '../../screens/FullScreenWebView';

const Stack = createStackNavigator();
// todo: export this function to notification handler
const clearNotifications = async () => {
  console.log('cleared');
};

export default () => (
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
    <Stack.Screen name="RTCVideo" component={RTCVideo} />
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
        title: 'Appointments',
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
    <Stack.Screen
      name="FullScreenWebView"
      component={FullScreenWebView}
      options={({route}) => ({
        title: route.params.title,
        ...SCREEN_HEADER_OPTIONS,
      })}
    />
    <Stack.Screen name="Congratulations" component={Congratulations} />
  </Stack.Navigator>
);
