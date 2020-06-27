import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import CongratulationsImage from './congratulations.svg'

const Congratulations = (props) => {
    const [text, setText] = useState(props.route.params.text || "")

    return (
        <View style={{
            justifyContent: "space-between",
            alignItems: "center",
            height: Dimensions.get('window').height,
            width: Dimensions.get("window").width
        }}>
            <View></View>

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
                    style={styles.defaultButton}
                >
                    <Text style={styles.defaultButtonText}>
                        Back to Home
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
        marginTop: 20,
    },
    defaultButton: {
        width: Dimensions.get("window").width - 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "#0062FF",
        padding: 18,
    },
    defaultButtonText: {
        color: "#FFF",
        fontSize: 20,
        textTransform: "uppercase",
        fontWeight: "bold"
    },
})

export default Congratulations;