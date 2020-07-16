import React, { useState, useEffect, lazy, Suspense } from 'react'
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/dist/Feather'
import { TouchableWithoutFeedback, TouchableOpacity, ScrollView } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'

import { NotificationLoadingEffect } from '../NotificationCard/NotificationCard'
const NotificationCard = lazy(() => import('../NotificationCard/NotificationCard'))
import NotificationBell from './notifications.svg'

const Dropdown = ({ navigation }) => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)

    const loadNotificationsFromAsyncStorage = async () => {
        let storedNotifications = JSON.parse(await AsyncStorage.getItem("user")).notifications
        return storedNotifications
    }

    useEffect(() => {
        setLoading(true)
        loadNotificationsFromAsyncStorage()
            .then(storedNotifications => {
                if (storedNotifications) setNotifications(storedNotifications)
                else setNotifications([])
                setLoading(false)
            })
    }, [])

    return (
        <View style={styles.dropdown}>
            <View style={styles.notifications}>
                <View style={styles.header}>
                    <Text style={styles.heading}>Notifications</Text>
                </View>
                {
                    loading
                    && <ScrollView style={{ height: "85%" }}>
                        {
                            Array.from({ length: 5 }, (_, k) => {
                                return <NotificationLoadingEffect key={k} />
                            })
                        }
                    </ScrollView>
                }
                {
                    !loading && notifications.length === 0
                        ? <View style={{ height: "80%", justifyContent: "center", alignItems: "center", padding: 20 }}>
                            <Text style={{ color: "#666", fontSize: 16 }}>No new notifications</Text>
                        </View>
                        : <ScrollView style={{ height: "85%" }}>
                            {
                                notifications.map(notification => {
                                    return <Suspense fallback={<NotificationLoadingEffect />}>
                                        <NotificationCard
                                            key={notification._id}
                                            notification={notification}
                                            navigation={navigation}
                                        />
                                    </Suspense>
                                })
                            }
                        </ScrollView>
                }
                <TouchableOpacity
                    style={styles.footer}
                    onPress={() => navigation.navigate("NotificationsFull", { notifications: notifications })}
                >
                    <Text>View All</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const NotificationDropdown = (props) => {

    const [expand, setExpand] = useState(false)

    return (
        <>
            <TouchableWithoutFeedback onPress={() => {
                setExpand(!expand)
            }}
                style={styles.container}
            >
                <NotificationBell height="90%" />
            </TouchableWithoutFeedback>
            {
                expand && <Dropdown navigation={props.navigation} />
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    dropdown: {
        position: "absolute",

        height: Math.floor(Dimensions.get("window").height / 1.5),
        width: Math.floor(Dimensions.get("window").width) - 40,

        backgroundColor: "#fff",
        zIndex: 10,
        elevation: 5,
        borderColor: "#E5E5E5",
        borderWidth: 1,
        right: 0,
        top: 55,
        borderRadius: 15,
        paddingBottom: 20,
    },
    notifications: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#6666662F"
    },
    heading: {
        fontSize: 20,
    },
    small: {
        color: "#6666666F",
        fontSize: 12,
    },
    footer: {
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: "#6666662F",
        fontSize: 18,
    }
})

export default NotificationDropdown;