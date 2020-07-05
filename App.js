import * as React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity } from 'react-native-gesture-handler';

export const AuthContext = React.createContext();
const Stack = createStackNavigator();

import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Splash from './components/screens/Splash'
import Profile from './components/screens/Profile'
import Favourites from './components/screens/Favourites'
import SignUp from './components/screens/SignUp'
import Verification from './components/screens/Verification'
import Store from './components/screens/store-page/Store'
import SearchFull from './components/screens/SearchFull'
import UpcomingBookings from './components/screens/UpcomingBookings';
import PreviousBookings from './components/screens/PreviousBookings';
import SingleBooking from './components/screens/SingleBooking';
import NotificationsFull from './components/screens/NotificationsFull';
import BackButton from './components/UXComponents/BackButton';
import EditProfile from './components/screens/EditProfile';
import Congratulations from './components/screens/misc/Congratulations';
import Support from './components/screens/Support';
import Welcome from './components/screens/Welcome';

const App = () => {
  // console.disableYellowBox = true;

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            token: action.token,
            user: action.user,
            welcomeShown: action.welcomeShown,
            isLoading: false
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
        case 'WELCOME_SHOWN':
          return {
            ...prevState,
            welcomeShown: true
          }
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
        let welcomeShown = await AsyncStorage.getItem("welcomeShown") ? true : false;

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
            fetch('https://shopout.herokuapp.com/user/verify', requestOptions)
              .then(response => {
                if (response.status === 200) {
                  dispatch({ type: 'RESTORE_TOKEN', token: token, user: user, welcomeShown: true });
                  console.log(welcomeShown);
                }
                else {
                  response.json()
                    .then(data => {
                      console.log(data)
                      dispatch({ type: 'RESTORE_TOKEN', token: null, user: null, welcomeShown: welcomeShown })
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
          console.log(welcomeShown)
          dispatch({ type: 'RESTORE_TOKEN', token: null, user: null, welcomeShown: welcomeShown })
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
        return new Promise(resolve => {
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
                    dispatch({ type: 'SIGN_IN', token: data.token.toString(), user: data.user });
                    resolve(true);
                  })
              } else {
                if (response.status === 500)
                  resolve([false, "Internal Server Error"]);
                else if (response.status === 404) {
                  resolve([false, "Invalid phone number or password"]);
                }
                else {
                  resolve([false, "Server error please try again later"]);
                }
              }
            });
          }
          catch (e) {
            resolve([false, "Can not login right now, please check your internet connection and try again"]);
          }
        })

      },

      setWelcomeShown: async () => {
        AsyncStorage.setItem("welcomeShown", "true")
        dispatch({ type: 'WELCOME_SHOWN' })
      },

      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async userData => {
        return new Promise(resolve => {
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
                      resolve(true)
                    })
                } else {
                  if (response.status === 500)
                    resolve([false, "Internal server error"]);
                  else if (response.status === 404)
                    resolve([false, "Not found"])
                  else
                    resolve([false, "Unkown server error"])
                }
              });
          }
          catch (e) {
            resolve([false, "Can not login right now, please check your internet connection and try again"])
          }
        })
      }
    }), [])

  const clearNotifications = async () => {
    const markRead = async () => {
      let user = JSON.parse(await AsyncStorage.getItem("user"));
      user.notificaitons.forEach(notification => { notification.readStatus = true });
      return user
    }
    markRead().then(user => {
      AsyncStorage.setItem("user", user)
    })
  }

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
                    name="Welcome"
                    component={state.welcomeShown ? Login : Welcome}
                  />
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
                      animationTypeForReplace: state.loggedIn ? 'push' : 'pop',
                    }}
                  />
                  <Stack.Screen
                    name="Verification"
                    component={Verification}
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
                      name="Favourites"
                      component={Favourites}
                      options={{
                        title: "Favourites",
                        headerShown: true,
                        headerBackImage: () => {
                          return <BackButton />
                        },
                        headerLeftContainerStyle: {
                          padding: 20,
                        },
                      }}
                    />
                    <Stack.Screen
                      name="Support"
                      component={Support}
                      options={{
                        title: "Support",
                        headerShown: true,
                        headerBackImage: () => {
                          return <BackButton />
                        },
                        headerLeftContainerStyle: {
                          padding: 20,
                        },
                      }}
                    />
                    <Stack.Screen
                      name="EditProfile"
                      component={EditProfile}
                    />
                    <Stack.Screen
                      name="Store"
                      component={Store}
                    />
                    <Stack.Screen
                      name="SearchFull"
                      component={SearchFull}
                    />
                    <Stack.Screen
                      name="UpcomingBookings"
                      component={UpcomingBookings}
                      options={{
                        title: "Appointments",
                        headerShown: true,
                        headerBackImage: () => {
                          return <BackButton />
                        },
                        headerLeftContainerStyle: {
                          padding: 20,
                        },
                      }}
                    />
                    <Stack.Screen
                      name="PreviousBookings"
                      component={PreviousBookings}
                      options={{
                        animationEnabled: false,
                        title: "Appointments",
                        headerShown: true,
                        headerBackImage: () => {
                          return <BackButton />
                        },
                        headerLeftContainerStyle: {
                          padding: 20,
                        },
                      }}
                    />
                    <Stack.Screen
                      name="SingleBooking"
                      component={SingleBooking}
                      options={{
                        title: "Booking",
                        headerShown: true,
                        headerBackImage: () => {
                          return <BackButton />
                        },
                        headerLeftContainerStyle: {
                          padding: 20,
                        },
                      }}
                    />
                    <Stack.Screen
                      name="NotificationsFull"
                      component={NotificationsFull}
                      options={{
                        title: "Notifications",
                        headerShown: true,
                        headerBackImage: () => {
                          return <BackButton />
                        },
                        headerLeftContainerStyle: {
                          padding: 20,
                        },
                        headerRight: () => (
                          <TouchableOpacity
                            onPress={() => clearNotifications()}
                          >
                            <Text style={{
                              color: "#6666666F"
                            }}>
                              MARK ALL AS SEEN
                            </Text>
                          </TouchableOpacity>
                        ),
                        headerRightContainerStyle: {
                          padding: 20,
                        }
                      }}
                    />
                    <Stack.Screen
                      name="Congratulations"
                      component={Congratulations}
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
