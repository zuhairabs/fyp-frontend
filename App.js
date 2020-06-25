import * as React from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  AsyncStorage from '@react-native-community/async-storage'

export const AuthContext = React.createContext();
const Stack = createStackNavigator();

import * as StorageService from './storageService'

import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Splash from './components/screens/Splash'
import Profile from './components/screens/Profile'
import SignUp from './components/screens/SignUp'
import Store from './components/screens/Store'
import SearchFull from './components/screens/SearchFull'
import UpcomingBookings from './components/screens/UpcomingBookings';
import PreviousBookings from './components/screens/PreviousBookings';
import SingleBooking from './components/screens/SingleBooking';
import NotificationsFull from './components/screens/NotificationsFull';

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            token: action.token,
            user: action.user,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            signedIn: true,
            token: action.token,
            user: action.user,
          };
        case 'SIGN_OUT':
          try {
            AsyncStorage.removeItem("jwt")
            AsyncStorage.removeItem("user")
          }
          catch (e) {
            console.error(error)
          }
          return {
            ...prevState,
            signedIn: false,
            token: null,
            user: null
          };
      }
    },
    {
      isLoading: true,
      signedIn: false,
      token: null,
      user: null
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        let token = await AsyncStorage.getItem("jwt");
        let user = await AsyncStorage.getItem("user");

        if (user) user = JSON.parse(user)

        if (token && user.phone) {
          try {
            const requestOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
              },
              body: JSON.stringify({
                cred: {
                  phone: user.phone,
                },
              }),
            }
            console.log(requestOptions.headers);
            fetch('https://shopout.herokuapp.com/user/verify', requestOptions)
              .then(response => {
                if (response.status === 200)
                  dispatch({ type: 'RESTORE_TOKEN', token: token, user: user });
                else {
                  response.json()
                    .then(data => {
                      console.log(data)
                      dispatch({ type: 'RESTORE_TOKEN', token: null, user: null })
                    })
                }
              })
          }
          catch (e) {
            console.error(e)
          }
        }
        else {
          console.log("No user in async storage")
          dispatch({ type: 'RESTORE_TOKEN', token: null, user: null })
        }

      }
      catch (e) {
        console.error(e)
        console.log("Restoring session failed")
        dispatch({ type: 'RESTORE_TOKEN', token: null, user: null })
      }
    };
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (userData) => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cred: {
              phone: userData.phone,
              password: userData.password
            },
          }),
        };

        try {
          fetch("https://shopout.herokuapp.com/user/login", requestOptions).then((response) => {
            if (response.status === 200) {
              response
                .json()
                .then((data) => {
                  AsyncStorage.setItem("jwt", data.token.toString());
                  AsyncStorage.setItem("user", JSON.stringify(data.user))
                  console.log(data.user.notifications)
                  dispatch({ type: 'SIGN_IN', token: data.token.toString(), user: data.user });
                })
            } else {
              if (response.status === 500) Alert.alert("Internal Server Error");
              else if (response.status === 404) {
                response.json()
                  .then(data => {
                    Alert.alert(data.error);
                  })
              }
              else Alert.alert("Unknown server error");
            }
          });
        }
        catch (e) {
          Alert.alert("Something went wrong")
        }
      },

      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async userData => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userData: {
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phone,
              password: userData.password,
              email: userData.email
            },
          }),
        };

        try {
          fetch("https://shopout.herokuapp.com/user/signup", requestOptions)
            .then(response => {
              if (response.status === 200) {
                response
                  .json()
                  .then((data) => {
                    AsyncStorage.setItem("jwt", data.token.toString());
                    AsyncStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({ type: 'SIGN_IN', token: data.token.toString(), user: data.user });
                  })
              } else {
                if (response.status === 500) Alert.alert("Internal Server Error");
                else if (response.status === 404) Alert.alert("Try logging in")
                else Alert.alert("Unknown server error");
              }
            });
        }
        catch (e) {
          Alert.alert("Something went wrong")
        }
      }
    }), [])

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          {state.isLoading ?
            (
              <Stack.Screen
                name="Splash"
                component={Splash}
              />
            ) : (
              state.token === null ? (
                <>
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                      animationTypeForReplace: state.loggedIn ? 'push' : 'pop',
                    }}
                  />
                  <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{
                      animationEnabled: false
                    }}
                  />
                </>
              ) : (
                  <>
                    <Stack.Screen
                      name="Home"
                      component={Home}
                    />
                    <Stack.Screen
                      name="Profile"
                      component={Profile}
                    />
                    <Stack.Screen
                      name="Store"
                      component={Store}
                    />
                    <Stack.Screen
                      name="SearchFull"
                      component={SearchFull}
                      options={{
                        animationEnabled: false
                      }}
                    />
                    <Stack.Screen
                      name="UpcomingBookings"
                      component={UpcomingBookings}
                    />
                    <Stack.Screen
                      name="PreviousBookings"
                      component={PreviousBookings}
                      options={{
                        animationEnabled: false
                      }}
                    />
                    <Stack.Screen 
                      name="SingleBooking"
                      component={SingleBooking}
                    />
                    <Stack.Screen 
                      name="NotificationsFull"
                      component={NotificationsFull}
                    />
                  </>
                )
            )}

        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
