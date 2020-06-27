import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Dimensions, Platform, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import StatusBarWhite from '../UXComponents/StatusBar'
import NavbarBackButton from '../Header/NavbarBackButton'
import StoreCard from '../StoreCard/StoreCard'

import QRCode from 'react-native-qrcode-svg';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

const DEVICE_WIDTH = Dimensions.get("window").width;

const SingleBooking = (props) => {

    const bookingId = props.route.params.booking
    const [loading, setLoading] = useState(true)
    const [booking, setBooking] = useState({})

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
                        bookingData: {
                            _id: bookingId
                        }
                    }),
                }
                console.log(requestOptions)
                fetch("https://shopout.herokuapp.com/user/booking/fetchone", requestOptions)
                    .then((res) => {
                        if (res.status === 200)
                            res.json()
                                .then(data => { setBooking(data.booking); setLoading(false) })
                        else {
                            Alert.alert("Something went wrong ", res.statusText)
                        }
                    })
            })
    }, [bookingId])


    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />

            <ScrollView style={styles.container}>
                {/* <NavbarBackButton header="Booking" navigation={props.navigation} /> */}

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
                        <View style={styles.contentContainer}>
                            <StoreCard store={booking.store} noBookButton navigation={props.navigation} />
                            <View style={styles.bookingData}>
                                <View style={styles.cardContainer}>
                                    <View style={styles.card}>
                                        <Text style={{ color: "#666" }}>Appointment Time</Text>
                                        <Text style={{ color: "#666" }}>
                                            {
                                                new Date(booking.start)
                                                    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                                                    .replace(/(:\d{2}| [AP]M)$/, "")
                                            } - {
                                                new Date(booking.end)
                                                    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                                                    .replace(/(:\d{2}| [AP]M)$/, "")
                                            }
                                        </Text>
                                    </View>
                                    <View style={styles.card}>
                                        <Text style={{ color: "#666" }}>Appointment Date</Text>
                                        <Text style={{ color: "#666" }}>
                                            {
                                                new Date(booking.start).toDateString()
                                            }
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.qrContainer}>
                                    <QRCode
                                        value="https://shopout.herokuapp.com/store/qrcode/scan"
                                        logo={{ uri: booking.store.business.logo }}
                                        size={180}
                                        logoBackgroundColor='transparent'
                                    />
                                    <Text style={{ marginTop: 20, fontSize: 24, fontWeight: "bold" }}>{booking.bookingId}</Text>
                                </View>
                                <View style={styles.buttonArea}>
                                    <TouchableOpacity style={!booking.completed ? styles.disabledButton : styles.defaultButton}
                                        disabled={!booking.completed}
                                    >
                                        <Text style={styles.defaultButtonText}>
                                            Rate Store
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                }


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
    bookingData: {
        flex: 1,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "space-around"
    },
    cardContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    card: {
        flex: 1,
        elevation: 5,
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 10,
        backgroundColor: "#FFF",
        borderRadius: 8,
        borderColor: "#6666666F",
    },
    qrContainer: {
        flex: 3,
        marginTop: 50,
        marginBottom: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonArea: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
    },
    defaultButton: {
        width: DEVICE_WIDTH - 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "#0062FF",
        padding: 20,
    },
    disabledButton: {
        width: DEVICE_WIDTH - 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "#66666632",
        padding: 20,
    },
    defaultButtonText: {
        color: "#FFF",
        fontSize: 20,
        textTransform: "uppercase",
        fontWeight: "bold"
    },
})

export default SingleBooking;