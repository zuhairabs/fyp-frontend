import React, {createContext, useReducer} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {URI} from '../api/constants';
export const GlobalContext = createContext();

export const GlobalContextProvider = (props) => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            token: action.token,
            user: action.user,
            welcomeShown: action.welcomeShown,
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
            AsyncStorage.removeItem('jwt');
            AsyncStorage.removeItem('user');
          } catch (e) {
            console.error(error);
          }
          return {
            ...prevState,
            signedIn: false,
            token: null,
            user: null,
          };
        case 'WELCOME_SHOWN':
          return {
            ...prevState,
            welcomeShown: true,
          };
        case 'SET_LOCATION':
          return {
            ...prevState,
            location: action.location,
          };
        case 'UPDATE_USER':
          return {
            ...prevState,
            user: action.user,
          };
      }
    },
    {
      isLoading: true,
      signedIn: false,
      welcomeShown: false,
      token: null,
      user: null,
      location: {},
    },
  );

  const authActions = React.useMemo(
    () => ({
      signIn: async (userData) => {
        return new Promise((resolve) => {
          messaging()
            .getToken()
            .then((firebaseToken) => {
              const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  cred: {
                    phone: userData.phone,
                    password: userData.password,
                    firebaseToken: firebaseToken,
                  },
                }),
              };

              try {
                fetch(`${URI}/user/login`, requestOptions).then((response) => {
                  if (response.status === 200) {
                    response.json().then((data) => {
                      AsyncStorage.setItem('jwt', data.token.toString());
                      AsyncStorage.setItem('user', JSON.stringify(data.user));
                      dispatch({
                        type: 'SIGN_IN',
                        token: data.token.toString(),
                        user: data.user,
                      });
                      resolve(true);
                    });
                  } else {
                    if (response.status === 500)
                      resolve([false, 'Internal Server Error']);
                    else if (response.status === 404) {
                      resolve([false, 'Invalid phone number or password']);
                    } else {
                      resolve([false, 'Server error please try again later']);
                    }
                  }
                });
              } catch (e) {
                resolve([
                  false,
                  'Can not login right now, please check your internet connection and try again',
                ]);
              }
            });
        });
      },

      setWelcomeShown: async () => {
        AsyncStorage.setItem('welcomeShown', 'true');
        dispatch({type: 'WELCOME_SHOWN'});
      },

      signOut: () => {
        messaging()
          .deleteToken()
          .then(() => {
            console.log('FCM token deleted');
            messaging()
              .registerDeviceForRemoteMessages()
              .then(() => {
                console.log('FCM token refreshed');
                dispatch({type: 'SIGN_OUT'});
              });
          });
      },

      signUp: async (userData) => {
        return new Promise((resolve) => {
          const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              userData: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone,
                password: userData.password,
                email: userData.email,
              },
            }),
          };

          try {
            fetch(`${URI}/user/signup`, requestOptions).then((response) => {
              if (response.status === 200) {
                response.json().then((data) => {
                  AsyncStorage.setItem('jwt', data.token.toString());
                  AsyncStorage.setItem('user', JSON.stringify(data.user));
                  dispatch({
                    type: 'SIGN_IN',
                    token: data.token.toString(),
                    user: data.user,
                  });
                  resolve(true);
                });
              } else {
                if (response.status === 500)
                  resolve([false, 'Internal server error']);
                else if (response.status === 404) resolve([false, 'Not found']);
                else resolve([false, 'Unkown server error']);
              }
            });
          } catch (e) {
            resolve([
              false,
              'Can not login right now, please check your internet connection and try again',
            ]);
          }
        });
      },

      retrieveToken: async () => {
        try {
          let token = await AsyncStorage.getItem('jwt');
          let user = await AsyncStorage.getItem('user');
          let welcomeShown = (await AsyncStorage.getItem('welcomeShown'))
            ? true
            : false;

          if (user) user = JSON.parse(user);

          if (token && user.phone) {
            try {
              const requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  authorization: 'Bearer ' + token,
                },
                body: JSON.stringify({
                  cred: {
                    phone: user.phone,
                  },
                }),
              };
              fetch(`${URI}/user/verify/refresh`, requestOptions).then(
                (response) => {
                  if (response.status === 200) {
                    response.json().then(async (data) => {
                      await AsyncStorage.setItem('jwt', data.token);
                      dispatch({
                        type: 'RESTORE_TOKEN',
                        token: data.token,
                        user: user,
                        welcomeShown: true,
                      });
                    });
                  } else
                    response.json().then((data) => {
                      console.log(data);
                      dispatch({
                        type: 'RESTORE_TOKEN',
                        token: null,
                        user: null,
                        welcomeShown: welcomeShown,
                      });
                    });
                },
              );
            } catch (e) {
              console.error(e);
            }
          } else {
            console.log('No user in async storage');
            dispatch({
              type: 'RESTORE_TOKEN',
              token: null,
              user: null,
              welcomeShown: welcomeShown,
            });
          }
        } catch (e) {
          console.error(e);
          dispatch({type: 'RESTORE_TOKEN', token: null, user: null});
        }
      },

      updateUser: async () => {
        let user = JSON.parse(await AsyncStorage.getItem('user'));
        dispatch({type: 'UPDATE_USER', user});
      },

      changeLocation: async (long, lat) => {
        const location = {long, lat};
        await AsyncStorage.setItem('location', JSON.stringify(location));
        dispatch({type: 'SET_LOCATION', location: location});
      },

      setNotifications: async () => {
        let user = JSON.parse(await AsyncStorage.getItem('user'));
        dispatch({type: 'UPDATE_USER', user});
      },

      addFavouriteStore: (_id) => {
        // let tempUser = state
        // tempUser.favouriteStores.push(_id)
        console.log(state);
        // dispatch({ type: 'ADD_FAVOURITE', user: tempUser })
      },
    }),
    [],
  );

  return (
    <GlobalContext.Provider value={{authActions, state, dispatch}}>
      {props.children}
    </GlobalContext.Provider>
  );
};

// consumer as a higher order component
export const withGlobalContext = (ChildComponent) => (props) => (
  <GlobalContext.Consumer>
    {(context) => <ChildComponent {...props} global={context} />}
  </GlobalContext.Consumer>
);
