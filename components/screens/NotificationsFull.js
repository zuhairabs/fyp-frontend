import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import  AsyncStorage from '@react-native-community/async-storage'

import StatusBarWhite from '../UXComponents/StatusBar'
import NotificationCard from '../NotificationCard/NotificationCard'

const NotificationsFull = ({ navigation }) => {

    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const bootstrapper = async () => {
            let notifications = JSON.parse(await AsyncStorage.getItem("user")).notifications
            return notifications
        }
        bootstrapper()
            .then(notifications => {
                if (notifications) {
                    setNotifications(notifications)
                    setLoading(false)
                }
                else setNotifications([])
            })
    }, [])

    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />

            <ScrollView style={styles.container}>
                <View style={styles.contentContainer}>
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
                            : <View style={styles.notifications}>
                                {
                                    notifications.length === 0
                                        ? <View style={{ justifyContent: "center", alignItems: "center", padding: 20 }}>
                                            <Text style={{ color: "#666", fontSize: 16 }}>No new notifications</Text>
                                        </View>
                                        : <ScrollView contentContainerStyle={{
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            {
                                                notifications.map(notification => {
                                                    return <NotificationCard key={notification._id} notification={notification} />
                                                })
                                            }
                                        </ScrollView>
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
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: "#FFF",
    },
    container: {
        height: Dimensions.get('window').height,
    },
    notifications: {
        marginTop: 20,
        marginBottom: 100,
    },
    small: {
        color: "#6666666F",
        fontSize: 12,
    },
    footer: {
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: "#6666662F",
        fontSize: 18
    }
});

export default NotificationsFull;