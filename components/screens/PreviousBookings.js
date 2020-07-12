import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Alert, ActivityIndicator, Image } from 'react-native'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'

import StatusBarWhite from '../UXComponents/StatusBar'
import BookingCardSmall from '../BookingCard/bookingCardSmall'

const UpcomingBookings = ({ navigation }) => {

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    const mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const startMonth = bookings.length > 0 ? new Date(bookings[0].start).getUTCMonth() : null;
    const endMonth = bookings.length > 0 ? new Date(bookings[bookings.length - 1].start).getUTCMonth() : null;

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
                fetch("https://shopout.herokuapp.com/user/archivedbookings", requestOptions)
                    .then((res) => {
                        if (res.status === 200)
                            res.json()
                                .then(data => {
                                    setBookings(data.archivedBookings);
                                    sortBookings().then(() => {
                                        setLoading(false)
                                    })
                                })
                        else {
                            Alert.alert("Something went wrong ", res.statusText)
                        }
                    })
            })
    }, [])

    const sortBookings = async () => {
        setBookings(prev => {
            return prev.sort((a, b) => {
                return new Date(a.start).getTime() - new Date(b.start).getTime();
            })
        })
    }

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
                        :
                        <>
                            <View
                                style={{
                                    backgroundColor: "#FFF",
                                }}
                            >
                                <View style={styles.monthSelectorContainer}>
                                    <View>
                                        {
                                            bookings.length > 0
                                                ?
                                                <Text style={styles.selectedMonth}>
                                                    {
                                                        startMonth === endMonth ?
                                                            <Text>{mlist[endMonth]} {new Date().getUTCFullYear()}</Text>
                                                            :
                                                            <Text>{mlist[startMonth]} - {mlist[endMonth]} {new Date().getUTCFullYear()}</Text>
                                                    }
                                                </Text>
                                                :
                                                <View style={{
                                                    width: Dimensions.get('window').width,
                                                    height: Dimensions.get('window').height - 480,
                                                    justifyContent: "center",
                                                    flex: 1,
                                                    marginTop: 120,
                                                }}>
                                                    <Image
                                                        source={require('../UXComponents/EmptyPage.png')}
                                                        style={{
                                                            width: undefined,
                                                            height: undefined,
                                                            flex: 1,
                                                            resizeMode: "contain"
                                                        }}
                                                    />
                                                    <Text style={{
                                                        color: "#666",
                                                        alignSelf: "center",
                                                        textAlign: "center",
                                                        marginTop: 20,
                                                        paddingHorizontal: 40,
                                                        fontSize: 16
                                                    }}
                                                    >
                                                        Nothing here!
                                        </Text>
                                                </View>
                                        }
                                    </View>
                                </View>
                            </View>
                            <ScrollView style={styles.contentContainer} contentContainerStyle={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <View style={styles.results}>
                                    {
                                        bookings.map((booking, index) => {
                                            return <BookingCardSmall key={index} booking={booking} navigation={navigation} />
                                        })
                                    }
                                </View>
                            </ScrollView>
                        </>
                }

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