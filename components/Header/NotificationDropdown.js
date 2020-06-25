import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/dist/Feather'
import { TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'
import  AsyncStorage from '@react-native-community/async-storage'

import NotificationCard from '../NotificationCard/NotificationCard'

const NotificationDropdown = (props) => {

    const [expand, setExpand] = useState(false)
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
        <>
            <TouchableWithoutFeedback onPress={() => {
                setExpand(!expand)
            }}
                style={styles.container}
            >
                <Icon name="bell" size={24} color="#06369B" />
                <View style={styles.notificationCountCircle}>
                </View>
            </TouchableWithoutFeedback>
            {
                expand ?
                    <View style={styles.dropdown}>
                        {
                            loading ? <View style={{ justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                                <ActivityIndicator size="large" color="#0062FF" />
                            </View>
                                : <View style={styles.notifications}>
                                    <View style={styles.header}>
                                        <Text style={styles.heading}>Notifications</Text>
                                        <TouchableHighlight
                                            onPress={() => console.log("Pressed notification clear")}
                                        >
                                            <Text style={styles.small}>MARK ALL AS SEEN</Text>
                                        </TouchableHighlight>
                                    </View>
                                    {
                                        notifications.length === 0
                                            ? <View style={{justifyContent: "center", alignItems:"center", padding: 20}}>
                                                <Text style={{ color: "#666", fontSize: 16 }}>No new notifications</Text>
                                            </View>
                                            : <View>
                                                {
                                                    notifications.map(notification => {
                                                        return <NotificationCard key={notification._id} notification={notification} />
                                                    })
                                                }
                                            </View>
                                    }
                                    <TouchableOpacity 
                                        style={styles.footer}
                                        onPress={()=>props.navigation.navigate("NotificationsFull")}
                                    >
                                        <Text>View All</Text>
                                    </TouchableOpacity>
                                </View>
                        }
                    </View>
                    :
                    null
            }

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    notificationCountCircle: {
        height: 12,
        width: 12,
        borderRadius: 12 / 2,
        fontSize: 16,
        textAlign: "center",
        position: 'absolute',
        top: 6,
        right: 10,
        backgroundColor: "#EF1515",
        justifyContent: "center",
        alignItems: "center"
    },
    dropdown: {
        position: "absolute",
        maxHeight: Math.floor(Dimensions.get("window").height / 1.5),
        width: Math.floor(Dimensions.get("window").width) - 40,
        backgroundColor: "#fff",
        zIndex: 10,
        elevation: 5,
        borderColor: "#E5E5E5",
        borderWidth: 1,
        right: 0,
        top: 50,
        borderRadius: 15,
        backgroundColor: "#fff",
    },
    notifications: {
        paddingVertical: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
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
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: "#6666662F",
        fontSize: 18
    }
})

export default NotificationDropdown;