import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Dimensions, Alert } from 'react-native'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import  AsyncStorage from '@react-native-community/async-storage'

import { AuthContext } from '../../App'

import Portrait from './menu-icons/portrait.svg'
import Calendar from './shopout.svg'
import StatusBarWhite from '../UXComponents/StatusBar'
import MenuBackground from '../UXComponents/MenuBackground'

const Profile = ({ navigation }) => {

    const { signOut } = React.useContext(AuthContext);

    const [user, setUser] = useState({})

    useEffect(() => {
        const bootstraper = async () => {
            let storedUser = JSON.parse(await AsyncStorage.getItem("user"))
            return storedUser
        }
        bootstraper()
            .then((storedUser) => {
                setUser(storedUser);
            })
    }, [])


    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />
            <MenuBackground />
            <ScrollView style={styles.container}>

                <View style={styles.contentContainer}>

                    <View style={styles.header}>
                        <View style={styles.userPhotoContainer}>
                            <View style={styles.photo}>
                                {
                                    user.avatar ?
                                        <Image source={{ uri: `data:image/gif;base64,${user.avatar}` }} style={styles.avatar} />
                                        :
                                        <Icon name="person" size={60} color="#0062FF" />
                                }
                            </View>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
                            <Text style={styles.number}>+91 {user.phone}</Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableWithoutFeedback
                            style={styles.button}
                        >
                            <View style={styles.buttonIcon}>
                                <Portrait />
                            </View>
                            <Text style={styles.buttonText}>My Profile</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            style={styles.button}
                            onPress={() => { navigation.navigate("UpcomingBookings") }}
                        >
                            <View style={styles.buttonIcon}>
                                <Calendar />
                            </View>
                            <Text style={styles.buttonText}>Appointments</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback style={styles.button}>
                            <View style={styles.buttonIcon}>
                                <Calendar />
                            </View>
                            <Text style={styles.buttonText}>Favourites</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback style={styles.button}>
                            <View style={styles.buttonIcon}>
                                <Calendar />
                            </View>
                            <Text style={styles.buttonText}>Support</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            style={styles.button}
                            onPress={() => { 
                                signOut()
                             }}
                        >
                            <View style={styles.buttonIcon}>
                                {/* <Calendar /> */}
                            </View>
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableWithoutFeedback>
                    </View>

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
    header: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    details: {
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 20,
        marginVertical: 20,
    },
    name: {
        fontSize: 18,
        color: "#FFF",
        fontWeight: "bold",
    },
    number: {
        color: "#FFF",
        fontWeight: "bold",

    },
    userPhotoContainer: {
        height: 100,
        width: 100,
        borderRadius: 100 / 2,
        // elevation: 3,
        padding: 20,
        marginVertical: 20,
        backgroundColor: "#FFFFFF2F",
        justifyContent: "center",
        alignItems: "center"
    },
    photo: {
        height: 80,
        width: 80,
        borderRadius: 80 / 2,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        width: undefined,
        height: undefined,
        flex: 1,
        resizeMode: "contain",
    },
    buttonContainer: {
        flex: 1,
        marginTop: 50,
        justifyContent: "space-around",
        alignItems: "center",
    },
    button: {
        marginVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    buttonIcon: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 36,
    },
    buttonText: {
        flex: 7,
        paddingHorizontal: 20,
        fontSize: 18,
    },
})

export default Profile