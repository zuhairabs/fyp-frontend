import React, { useState, useEffect, lazy, Suspense } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'

import StatusBarWhite from '../UXComponents/StatusBar'
import { NotificationLoadingEffect } from '../NotificationCard/NotificationCard'
const NotificationCard = lazy(() => import('../NotificationCard/NotificationCard'))

const NotificationsFull = (props) => {

    const [notifications, setNotifications] = useState(props.route.params?.notifications)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const bootstrapper = async () => {
            let notifications = JSON.parse(await AsyncStorage.getItem("user")).notifications
            return notifications
        }
        if (props.route.params?.notifications) setLoading(false)
        else {
            bootstrapper()
                .then(notifications => {
                    if (notifications) {
                        setNotifications(notifications)
                        setLoading(false)
                    }
                    else setNotifications([])
                })
        }
    }, [])

    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />

            <ScrollView style={styles.container}>
                <View style={styles.contentContainer}>
                    {
                        loading
                            ? <ScrollView style={{ height: "85%", marginTop: 20 }}>
                                {
                                    Array.from({ length: 10 }, (_, k) => {
                                        return <NotificationLoadingEffect />
                                    })
                                }
                            </ScrollView>
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
                                                notifications.map((notification, index) => {
                                                    return <Suspense fallback={<NotificationLoadingEffect />}>
                                                        <NotificationCard key={index} notification={notification} />
                                                    </Suspense>
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