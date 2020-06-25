import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import  AsyncStorage from '@react-native-community/async-storage'

const Sidebar = () => {
    const [user, setUser] = useState({})
    const [firstLetter, setFirstLetter] = useState("")

    useEffect(() => {
        const bootstrapper = async () => {
            let storedUser = await AsyncStorage.getItem("user")
            if (storedUser) {
                storedUser = JSON.parse(storedUser)
                setUser(storedUser)
                let storedLetter = storedUser.firstName.charAt(0);
                setFirstLetter(storedLetter);
            }
        }
        bootstrapper();
    }, [])

    return (
        <View>
                {user && user.avatar && user.avatar.length > 0 && (
                    <Text>User has an avatar</Text>
                )}
                {(!user.avatar || user.avatar.length == 0) && (
                    <View style={styles.userAvatarOuterCircle}>
                        <View style={styles.userAvatarCircle}>
                            <Text style={styles.userAvatarText}>
                                {firstLetter}
                            </Text>
                        </View>
                    </View>
                )}
        </View>
    )
}

const styles = StyleSheet.create({
    userAvatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    userAvatarCircle: {
        height: 28,
        width: 28,
        borderRadius: 28 / 2,
        backgroundColor: "#0062FF",
        justifyContent: 'center',
        alignItems: 'center'
    },
    userAvatarOuterCircle: {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: "#E6EEFE",
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Sidebar;