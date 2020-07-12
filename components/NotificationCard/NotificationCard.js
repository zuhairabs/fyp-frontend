import React from 'react'
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const NotificationCard = ({ notification }) => {

    const logo = notification.store ? notification.store.business.logo : null;

    return (
        <TouchableOpacity style={{
            ...styles.container,
            backgroundColor: notification.readStatus ? "#FFF" : "#0062FF05"
        }}>
            <View style={styles.imageContainer}>
                {
                    logo
                        ? <Image source={{ uri: `data:image/gif;base64,${logo}` }} />
                        : <Image source={require('./shopout.png')} style={styles.image} />
                }
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>
                    {notification.text}
                </Text>
                <Text style={styles.date}>
                    {new Date(notification.generatedTime).toLocaleDateString()}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        borderColor: "#ECF0F4",
        borderBottomWidth: 1,
        width: "100%"
    },
    imageContainer: {
        flex: 2,
        marginRight: 20,
    },
    image: {
        height: 60,
        width: 60,
        borderRadius: 60 / 2,
        overflow: "hidden",
    },
    contentContainer: {
        flex: 8,
        justifyContent: "space-around",
        alignItems: "flex-start"
    },
    title: {
        flex: 3,
        color: "#666",
    },
    date: {
        flex: 1,
        fontSize: 10,
        color: "#666"
    }
})

export default NotificationCard;