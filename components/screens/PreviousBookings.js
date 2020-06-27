import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

import StatusBarWhite from '../UXComponents/StatusBar'
import BookingCardSmall from '../BookingCard/bookingCardSmall'

const UpcomingBookings = ({ navigation }) => {

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    const mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

            <ScrollView
                style={styles.container}
            >

                <View style={styles.tabNavigation}>
                    <View style={styles.tab}>
                        <TouchableWithoutFeedback
                         onPress={() => {
                            navigation.navigate("UpcomingBookings")
                        }}
                         style={styles.tabNavigationObject}>
                            <Text style={styles.tabNavigationText}>Upcoming</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.tab}>
                        <TouchableWithoutFeedback style={styles.tabNavigationObjectSelected}>
                            <Text style={styles.tabNavigationTextSelected}>Previous</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: "#FFF",
                    }}
                >
                    <View style={styles.monthSelectorContainer}>
                        <Text style={styles.selectedMonth}>
                            {mlist[new Date().getUTCMonth()]} {new Date().getUTCFullYear()}
                        </Text>
                        <View style={styles.monthSelector}>
                            <Text style={styles.selectedMonth}>
                                This Month
                            </Text>
                            <Icon name="arrow-drop-down" size={20} color="#666" />

                        </View>
                    </View>
                </View>

                <ScrollView style={styles.contentContainer} contentContainerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                }}>

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
                                        return <BookingCardSmall key={booking._id} booking={booking} navigation={navigation} />
                                    })
                                }
                            </View>
                    }
                </ScrollView>

            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: "#FFF",
    },
    container: {
        height: Dimensions.get('window').height,
        marginBottom: 50,
    },
    contentContainer: {
        marginBottom: 100,
    },
    tabNavigation: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
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
    monthSelectorContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 40,
    },
    monthSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    selectedMonth: {
        color: "#666",
    },
    results: {
        marginTop: 20,
    },
});

export default UpcomingBookings;