import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

import { GlobalContext } from '../../providers/GlobalContext'

const Sidebar = () => {
    const [user, setUser] = useState({})
    const [firstLetter, setFirstLetter] = useState("")
    const { state } = useContext(GlobalContext)

    useEffect(() => {
        if (state.user) {
            setFirstLetter(state.user.firstName.charAt(0))
            setUser(state.user)
        }
    }, [state])

    return (
        <View style={styles.userAvatarOuterCircle}>
            <View style={styles.userAvatarCircle}>
                {
                    user.avatar
                        ? <Image source={{ uri: `data:image/gif;base64,${user.avatar}` }} style={styles.avatar} />
                        : <Text style={styles.userAvatarText}>
                            {firstLetter}
                        </Text>
                }
            </View>
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
    },
    avatar: {
        height: 28,
        width: 28,
        borderRadius: 28 / 2
    }
})

export default Sidebar;