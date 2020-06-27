import React from 'react'
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const NotificationCard = ({ notification }) => {
    return (
        <>
            {
                notification.readStatus
                    ? <View style={styles.container}>
                        <View style={styles.imageContainer}>
                            <Image source={require('./cafe.png')} style={styles.image} />
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.title}>
                                {notification.text}
                            </Text>
                            <Text style={styles.date}>
                                {new Date(notification.generatedTime).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                    :
                    <View style={styles.containerUnread}>
                        <View style={styles.imageContainer}>
                            {
                                notification.image
                                    ? <Image source={require('./cafe.png')} style={styles.image} />
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
                    </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    containerUnread: {
        backgroundColor: "#0062FF05",
        padding: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        borderColor: "#ECF0F4",
        borderBottomWidth: 1,
    },
    container: {
        backgroundColor: "#fff",
        padding: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        borderColor: "#ECF0F4",
        borderBottomWidth: 1,
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