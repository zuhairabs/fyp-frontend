import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, Dimensions, StatusBar, ActivityIndicator } from 'react-native'
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'

import StatusBarWhite from '../../components/StatusBar'
import StoreCard from '../../components/Cards/StoreCard/StoreCard'

import StarBorder from './svg/star-border'
import StarFilled from './svg/star-filled'

const DEVICE_WIDTH = Dimensions.get("window").width;

const RatingParameter = ({ name, index }) => {

    const [rating, setRating] = useState(0)

    const Star = ({ i }) => {
        return <TouchableWithoutFeedback
            onPress={() => { setRating(i) }}
            style={{
                paddingHorizontal: 1,
            }}
        >
            {
                rating >= i ?
                    <StarFilled />
                    :
                    <StarBorder />
            }
        </TouchableWithoutFeedback>
    }

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginVertical: 20,
        }}>
            <Text style={{ flex: 2, fontSize: 16 }}>
                {
                    name
                }
            </Text>
            <View style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center"
            }}>
                {
                    Array.from({ length: 5 }, (_, k) => {
                        return <Star i={k + 1} />
                    })
                }
            </View>
        </View>
    )
}

const Rating = (props) => {
    const booking = props.route.params.booking
    const [loading, setLoading] = useState(true);

    const parameters = [
        "Social distancing maintained",
        "Temperature checks for everyone",
        "Priority Billing Queues",
        "No Mask No Entry",
        "Shop Sanitized regularly",
        "No-touch packing",
        "Staff followed safety",
        "Assistance in shopping",
        "ePayment options"
    ]

    useEffect(() => {
        setLoading(false)
    }, [])

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
                            <StoreCard
                                store={booking.store}
                                noBookButton
                                navigation={props.navigation}
                                status={booking.status}
                            />
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

                                <Text style={{ marginTop: 20, fontSize: 16, color: "#666" }}>
                                    Booking number: {booking.bookingId}
                                </Text>

                                <View style={styles.qrContainer} >
                                    {
                                        parameters.map((param, index) => {
                                            return <RatingParameter name={param} key={index} />
                                        })
                                    }
                                </View>
                                <View style={styles.buttonArea}>
                                    <TouchableOpacity
                                        style={styles.defaultButton}
                                    // disabled={!booking.completed}

                                    >
                                        <Text style={styles.defaultButtonText}>
                                            Submit
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
        height: Dimensions.get('window').height,
    },
    contentContainer: {
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 100,
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
        marginTop: 30,
        marginBottom: 50,
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: 150,
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
    defaultButtonText: {
        color: "#FFF",
        fontSize: 20,
        textTransform: "uppercase",
        fontWeight: "bold"
    },
})

export default Rating