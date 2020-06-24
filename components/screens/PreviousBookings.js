import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, AsyncStorage, Alert, ActivityIndicator } from 'react-native'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'

import StatusBarWhite from '../UXComponents/StatusBar'
import NavbarBackButton from '../Header/NavbarBackButton'
import BookingCardSmall from '../BookingCard/bookingCardSmall'

const PreviousBookings = ({ navigation }) => {

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const bootstrapper = async () => {
            let user = JSON.parse(await AsyncStorage.getItem("user"))
            let token = await AsyncStorage.getItem("jwt")
            return { user, token }
        }
        bootstrapper()
            .then(({ user, token }) => {
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
                console.log(requestOptions)
                fetch("https://shopout.herokuapp.com/user/bookings", requestOptions)
                    .then((res) => {
                        if (res.status === 200)
                            res.json()
                                .then(data => { setBookings(data.bookings); setLoading(false) })
                        else {
                            Alert.alert("Something went wrong ", res.statusText)
                        }
                    })
            })
    }, [])

    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />

            <ScrollView style={styles.container}>
                <NavbarBackButton header="Appointments" navigation={navigation} />
                <View style={styles.contentContainer}>
                    <View style={styles.tabNavigation}>
                        <View style={styles.tab}>
                            <TouchableWithoutFeedback style={styles.tabNavigationObject}
                                onPress={()=>{navigation.navigate("UpcomingBookings")}}
                            >
                                <Text style={styles.tabNavigationText}>Upcoming</Text>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.tab}>
                            <TouchableWithoutFeedback style={styles.tabNavigationObjectSelected}>
                                <Text style={styles.tabNavigationTextSelected}>Previous</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    {
                        loading
                            ? <View style=
                                {{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: Dimensions.get('window').height - 100,
                                    width: "100%"
                                }}
                            >
                                <ActivityIndicator size="large" color="#0062FF" />
                            </View>
                            : <View style={styles.results}>
                                {
                                    bookings.map(booking => {
                                        return <BookingCardSmall key={booking._id} booking={booking} />
                                    })
                                }
                            </View>
                    }
                </View>

            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: "#FFF",
    },
    container: {
        height: Dimensions.get('window').height
    },
    contentContainer: {
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    tabNavigation: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 20,
    },
    tab: {
        flex: 2,
    },
    tabNavigationObject: {
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#6666666F"
    },
    tabNavigationObjectSelected: {
        borderBottomWidth: 3,
        borderColor: "#0062FF",
        alignItems: "center"
    },
    tabNavigationText: {
        fontSize: 18,
        color: "#6666666F",
        borderBottomWidth: 1,
        borderColor: "#00000000",
        paddingBottom: 10,
        paddingHorizontal: 15,
    },
    tabNavigationTextSelected: {
        fontSize: 18,
        color: "#0062FF",
        borderBottomWidth: 1,
        borderColor: "#00000000",
        paddingBottom: 10,
        paddingHorizontal: 15,
    },
    results: {
        marginTop: 20,
    },
});

export default PreviousBookings;