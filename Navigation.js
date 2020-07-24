import React, { useEffect, useContext } from 'react'
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage'
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { GlobalContext } from './providers/GlobalContext'

import Home from './screens/Home/Home'
import Store from './screens/Store/Store'

import Login from './screens/Authentication/Login'
import SignUp from './screens/Authentication/SignUp'
import Verification from './screens/Authentication/Verification'

import EditProfile from './screens/Profile/EditProfile';
import Profile from './screens/Profile/Profile'

import Favourites from './screens/Favourites/Favourites'

import PreviousBookings from './screens/Bookings/PreviousBookings';
import Rating from './screens/Bookings/Rating';
import SingleBooking from './screens/Bookings/SingleBooking';
import UpcomingBookings from './screens/Bookings/UpcomingBookings';

import Congratulations from './screens/Misc/Congratulations';
import NotificationsFull from './screens/Notifications/NotificationsFull';
import SearchFull from './screens/Misc/SearchFull'
import Splash from './screens/Misc/Splash'
import Support from './screens/Misc/Support';
import Welcome from './screens/OnBoarding/OnBoarding';

import BackButton from './components/Buttons/BackButton';

const Stack = createStackNavigator();
export const navigationRef = React.createRef();

const SCREEN_HEADER_OPTIONS = {
    headerShown: true,
    headerBackImage: () => {
        return <BackButton />
    },
    headerLeftContainerStyle: {
        padding: 20,
    }
}

const AuthStack = ({ state }) => {
    if (state.welcomeShown)
        return <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
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
        </Stack.Navigator>
    else
        return <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="Welcome"
                component={Welcome}
            />
        </Stack.Navigator>
}

const clearNotifications = async () => {
    console.log("cleared")
}

const MainStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
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
                ...SCREEN_HEADER_OPTIONS
            }}
        />
        <Stack.Screen
            name="Support"
            component={Support}
            options={{
                title: "Support",
                ...SCREEN_HEADER_OPTIONS
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
                ...SCREEN_HEADER_OPTIONS
            }}
        />
        <Stack.Screen
            name="PreviousBookings"
            component={PreviousBookings}
            options={{
                animationEnabled: false,
                title: "Appointments",
                ...SCREEN_HEADER_OPTIONS
            }}
        />
        <Stack.Screen
            name="SingleBooking"
            component={SingleBooking}
            options={{
                title: "Booking",
                ...SCREEN_HEADER_OPTIONS
            }}
        />
        <Stack.Screen
            name="Rating"
            component={Rating}
            options={{
                title: "Rate the store",
                ...SCREEN_HEADER_OPTIONS
            }}
        />
        <Stack.Screen
            name="NotificationsFull"
            component={NotificationsFull}
            options={{
                title: "Notifications",
                ...SCREEN_HEADER_OPTIONS,
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
    </Stack.Navigator>
)

const AppStack = ({ state }) => (
    state.isLoading ?
        (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen
                    name="Splash"
                    component={Splash}
                />
            </Stack.Navigator>
        ) : (
            state.token === null
                ? <AuthStack state={state} />
                : <MainStack />
        )
)

const AppNavigation = () => {
    const { authActions, state } = useContext(GlobalContext)

    useEffect(() => {
        authActions.retrieveToken();
        notificationHandler();
    }, [])

    const fetchNotifications = async () => {
        const bootstrapAsync = async () => {
            let user = JSON.parse(await AsyncStorage.getItem("user"))
            let token = await AsyncStorage.getItem("jwt")
            return { user, token }
        }
        bootstrapAsync()
            .then(({ user, token }) => {
                fetch("https://shopout.herokuapp.com/user/notifications", {
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
                })
                    .then(res => {
                        if (res.status === 200) {
                            res.json().then(async data => {
                                let user = state.user;
                                let notifs = data.notifications
                                user.notifications = notifs.reverse();
                                await AsyncStorage.setItem("user", JSON.stringify(user));
                                authActions.setNotifications();
                            })
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })
            })
    }

    const notificationHandler = () => {
        // Handler to control push notification interaction
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
            );
            console.log(remoteMessage.data)

            if (remoteMessage.data?.booking)
                navigationRef.current?.navigate("SingleBooking", { booking: remoteMessage.data.booking });
            else if (remoteMessage.data?.store)
                navigationRef.current?.navigate("Store", { store: remoteMessage.data.store })
        });

        // Global message handler
        messaging().onMessage(async _ => {
            fetchNotifications();
        });
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <AppStack state={state} />
        </NavigationContainer>
    )
}

export default AppNavigation