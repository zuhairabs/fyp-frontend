import React, { useState } from 'react'
import { View, StyleSheet, StatusBar, Dimensions, Platform, Text } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

import { AuthContext } from '../../App'

import Navbar from '../Header/Navbar'
import StatusBarWhite from '../UXComponents/StatusBar'
import SecondaryBackground from '../UXComponents/SecondaryBackground'

import GraphicWelcome from './welcome1.svg'
import GraphicVisit from './welcome2.svg'
import GraphicBook from './welcome3.svg'

const headings = ["Welcome to ShopOut!", "Visit any store on your time!", "Book your appointment!"]
const illustrations = [<GraphicWelcome />, <GraphicVisit />, <GraphicBook />]
const text = [
    "Your window to shopping with safety and wellbeing",
    "Find your preferred shopping destinations and visit at your convinience",
    "Book your time slot and visit in confidence"
]

const Welcome = () => {
    const { setWelcomeShown } = React.useContext(AuthContext);
    const [page, setPage] = useState(0)

    const nextPage = () => {
        if (page >= 2)
            setWelcomeShown();
        else setPage(page + 1);
    }

    return (
        <View style={styles.screenContainer}>
            <SecondaryBackground />
            <StatusBarWhite />

            <ScrollView 
                style={styles.container}
                scrollEnabled={false}
            >
                <Navbar type="locked" />

                <View style={styles.contentContainer}>
                    <View style={styles.svgContainer}>
                        {illustrations[page]}
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.header}>
                            {headings[page]}
                        </Text>
                        <Text style={styles.text}>
                            {text[page]}
                        </Text>
                    </View>

                    <View style={styles.buttonArea}>
                        <View style={styles.indicatorContainer}>
                            <View style={styles.indicatorFilled}></View>
                            <View style={page > 0 ? styles.indicatorFilled : styles.indicator}></View>
                            <View style={page > 1 ? styles.indicatorFilled : styles.indicator}></View>
                        </View>
                        <TouchableOpacity style={styles.defaultButton} onPress={() => { nextPage() }}>
                            <Text style={styles.defaultButtonText}>Next</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setWelcomeShown() }}
                        >
                            <Text style={{ color: "#0062FF", marginTop: 20, }}>
                                Skip
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        height: Dimensions.get('screen').height,
        backgroundColor: "#fff"
    },
    contentContainer: {
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 40,
        height: Dimensions.get("window").height - 240,
        marginTop: 80,
    },
    svgContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        fontSize: 20,
        color: "#0062FF",
        marginTop: 20,
    },
    text: {
        fontSize: 18,
        color: "#0062FF",
        marginTop: 20,
        textAlign: "center",
        fontWeight: "100",
    },
    buttonArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    indicatorContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 50,
        marginBottom: 20,
    },
    indicator: {
        paddingVertical: 1,
        paddingHorizontal: 16,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "#0062FF",
        borderRadius: 6,
        backgroundColor: "#0062FF",
        opacity: 0.5,
    },
    indicatorFilled: {
        paddingVertical: 1,
        paddingHorizontal: 16,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "#0062FF",
        borderRadius: 6,
        backgroundColor: "#0062FF",
    },
    defaultButton: {
        width: Math.floor(Dimensions.get('window').width / 2),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        backgroundColor: "#0062FF",
        padding: 10
    },
    defaultButtonText: {
        color: "#FFF"
    },
})

export default Welcome;