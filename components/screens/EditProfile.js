import React, { useState, useEffect } from 'react'
import { View, StyleSheet, StatusBar, Dimensions, Text, Keyboard, KeyboardAvoidingView, ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { ScrollView, TouchableWithoutFeedback, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import Svg, { Circle } from 'react-native-svg'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

import StatusBarWhite from '../UXComponents/StatusBar'
import NavbarBackButton from '../Header/NavbarBackButton'
import ProfileBackground from '../UXComponents/ProfileBackground'

const EditProfile = ({ navigation }) => {

    const [user, setUser] = useState({})

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState()
    const [email, setEmail] = useState("")
    const [location, setLocation] = useState()

    useEffect(() => {
        const bootstraper = async () => {
            let storedUser = JSON.parse(await AsyncStorage.getItem("user"))
            return storedUser
        }
        bootstraper()
            .then((storedUser) => {
                setUser(storedUser);
                setFirstName(storedUser.firstName)
                setLastName(storedUser.lastName)
                setPhone(storedUser.phone)
                setEmail(storedUser.email)
            })
    }, [])

    const save = () => {
        const saveToAsync = async (user) => {
            await AsyncStorage.setItem("user", JSON.stringify(user))
        }
        const bootstrapper = async () => {
            let token = await AsyncStorage.getItem("jwt")
            let user = JSON.parse(await AsyncStorage.getItem("user"))
            fetch("https://shopout.herokuapp.com/user/updateprofile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    cred: {
                        phone: user.phone,
                    },
                    userData: {
                        firstName: firstName,
                        lastName: lastName,
                        email: email
                    }
                }),
            }).then((res) => {
                if (res.status === 200) {
                    user.firstName = firstName
                    user.lastName = lastName
                    user.email = email
                    saveToAsync(user)
                        .then(() => {
                            ToastAndroid.show("Profile updated!", ToastAndroid.LONG)
                        })
                }
                else
                    Alert.alert(res.statusText)
            });
        }
        bootstrapper();
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.screenContainer}
        >
            <StatusBarWhite />
            {/* <ProfileBackground /> */}

            <Svg viewBox="0 0 600 600" height="150%" width="150%" style={styles.circleTop}>
                <Circle cx="300"
                    cy="300"
                    r="300"
                    fill="#0062FF" />
            </Svg>

            <NavbarBackButton color="white" navigation={navigation} />

            <ScrollView style={styles.container}>

                <View style={styles.header}>
                    <View style={styles.userPhotoContainer}>
                        <View style={styles.photo}>
                            {
                                user.avatar ?
                                    <Image source={{ uri: `data:image/gif;base64,${user.avatar}` }} style={styles.avatar} />
                                    :
                                    <Icon name="person" size={80} color="#0062FF" />
                            }
                            <View style={styles.cameraContainer}>
                                <Icon name="camera-alt" size={18} color="#BDBDBD" />
                            </View>
                        </View>
                    </View>
                    <Text style={styles.number}>+91 {user.phone}</Text>
                </View>

                <View style={styles.contentContainer}>

                    <View style={styles.formContainer}>

                        <View style={styles.formObject}>
                            <Text style={styles.formLabel}>
                                First Name
                            </Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    value={firstName}
                                    style={styles.formInput}
                                    onChangeText={(value) => setFirstName(value)}
                                    returnKeyType="done"
                                />
                                <Icon name="edit" color="#D7D7D7" size={24} />
                            </View>
                        </View>

                        <View style={styles.formObject}>
                            <Text style={styles.formLabel}>
                                Last Name
                            </Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    value={lastName}
                                    style={styles.formInput}
                                    onChangeText={(value) => setLastName(value)}
                                    returnKeyType="done"
                                />
                                <Icon name="edit" color="#D7D7D7" size={24} />
                            </View>
                        </View>

                        {/* <View style={styles.formObject}>
                            <Text style={styles.formLabel}>
                                Phone Number
                            </Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    value={phone ? phone.toString() : null}
                                    style={styles.formInput}
                                    onChangeText={(value) => setPhone(Number(value))}
                                    returnKeyType="done"
                                    keyboardType="numeric"
                                />
                                <Icon name="edit" color="#D7D7D7" size={24} />
                            </View>
                        </View> */}

                        <View style={styles.formObject}>
                            <Text style={styles.formLabel}>
                                Email ID
                            </Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    value={email}
                                    style={styles.formInput}
                                    onChangeText={(value) => setEmail(value)}
                                    returnKeyType="done"
                                />
                                <Icon name="edit" color="#D7D7D7" size={24} />
                            </View>
                        </View>

                        <View style={styles.formObject}>
                            <Text style={styles.formLabel}>
                                Location
                            </Text>
                            <TextInput
                                value={location || "Powai, Mumbai"}
                                style={styles.formInput}
                                onChangeText={(value) => setLocation(value)}
                                returnKeyType="done"
                                editable={false}
                            />
                        </View>

                        <View style={styles.buttonArea}>
                            <TouchableOpacity
                                style={styles.defaultButton}
                                onPress={() => { save() }}
                            >
                                <Text style={styles.defaultButtonText}>
                                    Save Profile
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.resetLink}>
                            <Text style={{ color: "#0062FF" }}>Reset Password</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </ScrollView>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: "#FFF",
    },
    container: {
        height: Dimensions.get('window').height,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 0,
        marginTop: 50,
        marginBottom: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF"
    },
    circleTop: {
        position: "absolute",
        top: "-82%",
        left: "-25%",
    },
    header: {
        justifyContent: "center",
        alignItems: "center",
    },
    userPhotoContainer: {
        height: 120,
        width: 120,
        borderRadius: 120 / 2,
        padding: 20,
        marginBottom: 10,
        backgroundColor: "#FFFFFF2F",
        justifyContent: "center",
        alignItems: "center",
    },
    photo: {
        height: 100,
        width: 100,
        borderRadius: 100 / 2,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center"
    },
    cameraContainer: {
        height: 28,
        width: 28,
        borderRadius: 28 / 2,
        backgroundColor: "#fff",
        elevation: 2,
        position: "absolute",
        bottom: -8,
        right: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: undefined,
        height: undefined,
        flex: 1,
        resizeMode: "contain",
    },
    number: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 20,
    },
    formContainer: {
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginBottom: 50,
    },
    formObject: {
        width: Dimensions.get('window').width - 40,
        borderColor: "#CAD0D8",
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 5,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 12,
        color: "#0062FF",
        backgroundColor: "#FFF",
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "#FFF",
    },
    formInput: {
        height: 36,
        color: "#666666",
        backgroundColor: "#FFF",
        fontSize: 15,
        paddingHorizontal: 0,
        paddingVertical: 2,
        flex: 1,
    },
    resetLink: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    buttonArea: {
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        marginTop: 20,
    },
    defaultButton: {
        width: Dimensions.get("window").width - 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "#0062FF",
        padding: 12,
    },
    defaultButtonText: {
        color: "#FFF",
        fontSize: 16,
        textTransform: "uppercase",
        fontWeight: "bold"
    },
})

export default EditProfile;