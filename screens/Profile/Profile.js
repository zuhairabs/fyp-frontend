import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    Image,
    Alert
} from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import AsyncStorage from '@react-native-community/async-storage'

import { GlobalContext } from '../../providers/GlobalContext'

import StatusBarWhite from '../../components/StatusBar'
import MenuBackground from '../../components/Backgrounds/MenuBackground'
import { COLORS, textStyles } from '../../styles/styles'

const Profile = ({ navigation }) => {
    const { authActions, state } = React.useContext(GlobalContext);
    const [user, setUser] = useState({})

    const getUserFromAsyncStorage = async () => {
        return storedUser = JSON.parse(await AsyncStorage.getItem("user"))
    }

    useEffect(() => {
        if (state.user)
            setUser(state.user)
        else
            getUserFromAsyncStorage()
                .then(storedUser => setUser(storedUser))
    }, [state.user])

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
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("EditProfile", { cachedUser: user });
                            }}
                            style={styles.button}
                        >
                            <View style={styles.buttonIcon}>
                                <Image source={require('./menu-icons/portrait-black-48dp.png')} style={styles.buttonIconImage} />
                            </View>
                            <Text style={styles.buttonText}>My Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => { navigation.navigate("UpcomingBookings") }}
                        >
                            <View style={styles.buttonIcon}>
                                <Image source={require('./menu-icons/date_range-black-48dp.png')} style={styles.buttonIconImage} />
                            </View>
                            <Text style={styles.buttonText}>Appointments</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => { navigation.navigate("Favourites") }}
                        >
                            <View style={styles.buttonIcon}>
                                <Image source={require('./menu-icons/favorite_border-black-48dp.png')} style={styles.buttonIconImage} />
                            </View>
                            <Text style={styles.buttonText}>Favourites</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => { navigation.navigate("Support") }}
                        >
                            <View style={styles.buttonIcon}>
                                <Image source={require('./menu-icons/help_outline-24px.png')} style={styles.buttonIconImage} />
                            </View>
                            <Text style={styles.buttonText}>Support</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                Alert.alert(
                                    "Do you want to logout?",
                                    "",
                                    [
                                        {
                                            text: "NO",
                                            onPress: () => { },
                                            style: "cancel"
                                        },
                                        {
                                            text: "YES",
                                            onPress: () => { authActions.signOut() },
                                            style: "default"
                                        }
                                    ]
                                )
                            }}
                        >
                            <View style={styles.buttonIcon}>
                                <Image source={require('./menu-icons/logout-black-48dp.png')} style={styles.buttonIconImage} />
                            </View>
                            <Text style={styles.buttonText}>Logout</Text>
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
        backgroundColor: COLORS.WHITE,
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
        marginTop: 30,
    },
    name: {
        ...textStyles.paragraphLargeBold,
        color: COLORS.WHITE,
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
        backgroundColor: COLORS.WHITE,
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
    },
    buttonContainer: {
        marginTop: 50,
        justifyContent: "space-around",
        alignItems: "center",
        width: Math.floor(Dimensions.get("window").width / 1.5),
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
        height: 24,
        width: 24
    },
    buttonIconImage: {
        width: 24,
        height: 24,
        resizeMode: "contain"
    },
    buttonText: {
        flex: 8,
        paddingHorizontal: 20,
        ...textStyles.paragraphLarge
    },
})

export default Profile