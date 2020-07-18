import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import CongratulationsImage from './congratulations.svg'

const DEVICE_HEIGHT = Dimensions.get("screen").height
const WINDOW_HEIGHT = Dimensions.get("window").height

const Congratulations = (props) => {
    const [text] = useState(props.route.params.text || "")
    const [booking] = useState(props.route.params.booking || null)

    return (
        <View style={{
            justifyContent: "space-between",
            alignItems: "center",
            height: Dimensions.get('window').height,
            width: Dimensions.get("window").width,
            backgroundColor: "#FFF"
        }}>
            <View
                style={{
                    height: 100
                }}
            ></View>

            <View style={{
                justifyContent: "center",
                alignItems: "center"
            }}>
                <CongratulationsImage width={Dimensions.get("window").width} />
                <Text style={{
                    fontSize: 28,
                    marginTop: 30,
                }}>Congratulations
                </Text>
                <Text style={{
                    fontSize: 15,
                    color: "#666"
                }}>
                    {text}
                </Text>
            </View>


            <View style={styles.buttonArea}>
                <TouchableOpacity
                    onPress={() => { props.navigation.navigate("Home") }}
                    style={styles.secondaryButton}
                >
                    <Text style={styles.secondaryButtonText}>
                        Back to Home
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate("SingleBooking", {
                            booking: booking
                        })
                    }}
                    style={styles.defaultButton}
                >
                    <Text style={styles.defaultButtonText}>
                        View Booking
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonArea: {
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        marginBottom: DEVICE_HEIGHT - WINDOW_HEIGHT,
    },
    defaultButton: {
        width: Dimensions.get("window").width - 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "#0062FF",
        padding: 18,
        marginVertical: 5,
    },
    secondaryButton: {
        width: Dimensions.get("window").width - 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "#FFF",
        padding: 16,
        marginVertical: 5,
        borderWidth: 2,
        borderColor: "#0062FF"
    },
    defaultButtonText: {
        color: "#FFF",
        fontSize: 20,
        textTransform: "uppercase",
        fontWeight: "bold"
    },
    secondaryButtonText: {
        color: "#0062FF",
        fontSize: 20,
        textTransform: "uppercase",
        fontWeight: "bold"
    },
})

export default Congratulations;