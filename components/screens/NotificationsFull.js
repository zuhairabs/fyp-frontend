import React, { useState, useEffect, lazy, Suspense } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'

import StatusBarWhite from '../UXComponents/StatusBar'
import { NotificationLoadingEffect } from '../NotificationCard/NotificationCard'
const NotificationCard = lazy(() => import('../NotificationCard/NotificationCard'))

const NotificationsFull = (props) => {
    const [notifications, setNotifications] = useState(props.route.params?.notifications)
    const [loading, setLoading] = useState(true)

    const loadNotificationsFromAsyncStorage = async () => {
        return notifications = JSON.parse(await AsyncStorage.getItem("user")).notifications
    }

    useEffect(() => {
        if (props.route.params?.notifications) setLoading(false)
        else
            loadNotificationsFromAsyncStorage()
                .then(notifications => {
                    if (notifications) setNotifications(notifications)
                    else setNotifications([])
                    setLoading(false)
                })
    }, [notifications])

    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />

            <ScrollView style={styles.container}>
                {
                    loading
                        ? <View style={{ height: "85%", marginTop: 20 }}>
                            {
                                Array.from({ length: 10 }, (_, k) => {
                                    return <NotificationLoadingEffect key={k} />
                                })
                            }
                        </View>
                        : <View style={styles.notifications}>
                            {
                                notifications.length === 0
                                    ? <View style={{
                                        ...styles.centerBox,
                                        padding: 20
                                    }}>
                                        <Text style={{ color: "#666" }}>
                                            No new notifications
                                        </Text>
                                    </View>
                                    : <ScrollView contentContainerStyle={{ ...styles.centerBox }}>
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
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        backgroundColor: "#FFF",
    },
    container: {
        height: Dimensions.get('window').height,
    },
    centerBox: {
        justifyContent: "center",
        alignItems: "center"
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