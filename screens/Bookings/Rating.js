import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, Dimensions, StatusBar, ActivityIndicator, ToastAndroid } from 'react-native'
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'

import StatusBarWhite from '../../components/StatusBar'
import StoreCard from '../../components/Cards/StoreCard/StoreCard'

import StarBorder from './svg/star-border'
import StarFilled from './svg/star-filled'
import { COLORS, textStyles, buttons } from '../../styles/styles'

const RatingParameter = ({ name, index, changeRating }) => {
    const [rating, setRating] = useState(0)

    const Star = ({ i }) => (
        <TouchableWithoutFeedback
            onPress={() => { setRating(i); changeRating(index, i); }}
            style={{ paddingHorizontal: 1 }}
        >
            {rating >= i
                ? <StarFilled />
                : <StarBorder />
            }
        </TouchableWithoutFeedback>
    )

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginVertical: 20
        }}>
            <Text style={{ flex: 2, ...textStyles.paragraphMedium }}>
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
    const [parameters, setParameters] = useState([])

    const formatParams = () => {
        let temp = []
        if (booking.store.parameters)
            booking.store.parameters.forEach(param => {
                temp.push({
                    title: param.title,
                    score: 0
                })
            });
        return (temp)
    }

    const changeRating = (index, score) => {
        setParameters(prev => {
            prev[index].score = score
            return prev
        })
    }

    const submitReview = () => {
        const reviewData = {
            "user": booking.user,
            "store": booking.store,
            "booking": booking._id,
            "params": parameters
        }
        fetch("https://shopout.herokuapp.com/user/review/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reviewData
            }),
        }).then((res) => {
            if (res.status === 200)
                res.json().then(data => {
                    ToastAndroid.show("Thank you!", ToastAndroid.SHORT)
                    props.navigation.navigate('Home')
                });
            else ToastAndroid.show(res.statusText, ToastAndroid.SHORT)
        });
    }

    useEffect(() => {
        setLoading(false)
        setParameters(formatParams())
    }, [])

    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />

            <ScrollView style={styles.container}>

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
                                        <Text style={{ color: COLORS.SECONDARY, ...textStyles.paragraphMedium }}>Appointment Time</Text>
                                        <Text style={{ color: COLORS.SECONDARY, ...textStyles.paragraphMedium }}>
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
                                        <Text style={{ color: COLORS.SECONDARY, ...textStyles.paragraphMedium }}>Appointment Date</Text>
                                        <Text style={{ color: COLORS.SECONDARY, ...textStyles.paragraphMedium }}>
                                            {
                                                new Date(booking.start).toDateString()
                                            }
                                        </Text>
                                    </View>
                                </View>

                                <Text style={{ marginTop: 20, color: COLORS.SECONDARY, ...textStyles.paragraphLarge }}>
                                    Booking number: {booking.bookingId}
                                </Text>

                                <View style={styles.qrContainer} >
                                    {
                                        parameters.map((param, index) => {
                                            return <RatingParameter
                                                changeRating={changeRating}
                                                name={param.title}
                                                index={index}
                                                key={index} />
                                        })
                                    }
                                </View>
                                <View style={styles.buttonArea}>
                                    <TouchableOpacity
                                        style={buttons.primaryButton}
                                        onPress={() => { submitReview() }}
                                    >
                                        <Text style={textStyles.primaryButtonText}>
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
        backgroundColor: COLORS.WHITE,
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
        backgroundColor: COLORS.WHITE,
        borderRadius: 8,
        borderColor: COLORS.SECONDARY_TRANSPARENT,
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
    }
})

export default Rating