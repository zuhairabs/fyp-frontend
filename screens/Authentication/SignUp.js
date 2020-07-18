import React, { useState, createRef } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import { TouchableOpacity, ScrollView, TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import Modal from 'react-native-modalbox';

import Navbar from '../../components/Header/Navbar'
import StatusBarWhite from '../../components/StatusBar'
import SecondaryBackground from '../../components/Backgrounds/SecondaryBackground'


const SignUp = ({ navigation }) => {
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState("")
    const [cnfPassword, setCnfPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")


    const [loading, setLoading] = useState(false)
    const [modalText, setModalText] = useState("Registering")
    const loadingModal = createRef();

    const input1 = createRef();
    const input2 = createRef();
    const input3 = createRef();
    const input4 = createRef();
    const input5 = createRef();
    const input6 = createRef();

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true)
            loadingModal.current.open()
            setModalText("Registering")
            fetch("https://shopout.herokuapp.com/user/verification/phoneregistered", {
                "method": "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: phone
                })
            })
                .then(res => {
                    if (res.status === 200) {
                        setLoading(false);
                        navigation.navigate("Verification", {phone, password, firstName, lastName, email});
                        loadingModal.current.close();
                    }
                    else {
                        setLoading(false)
                        setModalText("Phone number already registered")
                    }
                })
        }
    }

    const validateForm = () => {
        if (validatePhone() && validatePassword() && validateName())
            return true;
        else return false;
    }

    const validatePhone = () => {
        let phoneno = /^\d{10}$/;
        if (phone.match(phoneno)) return true;
        Alert.alert("Please enter a valid 10 digit mobile number")
        return false;
    }

    const validatePassword = () => {
        if (password.length < 8) {
            Alert.alert("Password must be atleast 8 character long")
            return false
        }
        else if (password === cnfPassword) return true;
        Alert.alert("Passwords do not match");
        return false;
    }

    const validateName = () => {
        let nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        if (firstName.match(nameRegex)) return true;
        Alert.alert("Enter a valid name")
        return false;
    }


    return (
        <View style={styles.screenContainer}>

            <Modal
                ref={loadingModal}
                useNativeDriver={false}
                style={styles.bottomModal}
                position={"bottom"}
                swipeToClose={!loading}
                backdropPressToClose={!loading}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                    <Text style={{ fontSize: 20, marginHorizontal: 20 }}>
                        {modalText}
                    </Text>
                    {
                        loading ?
                            <ActivityIndicator size="large" color="#0062FF" />
                            : null
                    }
                </View>
            </Modal>

            <StatusBarWhite />
            <SecondaryBackground />

            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <ScrollView style={styles.container}
                    stickyHeaderIndices={[0]}
                >
                    <Navbar type="locked" />
                    <View style={styles.contentContainer} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
                        <View style={styles.tabNavigation}>
                            <TouchableOpacity style={styles.tabNavigationObject} onPress={() => { navigation.navigate("Login") }}>
                                <Text style={styles.tabNavigationText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.tabNavigationObjectSelected}>
                                <Text style={styles.tabNavigationText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.form}>
                            <View style={styles.userPhotoContainer}>
                                <View
                                    onPress={() => { savePicture() }}
                                    style={styles.photo}
                                >
                                    <Icon name="person" size={80} color="#FFF" />
                                    <View style={styles.cameraContainer}>
                                        <Icon name="camera-alt" size={20} color="#BDBDBD" />
                                    </View>
                                </View>
                            </View>
                            <TextInput
                                ref={input1}
                                returnKeyType="next"
                                onSubmitEditing={() => { input2.current.focus() }}
                                style={styles.textInput}
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={(value) => { setFirstName(value) }}
                            />
                            <TextInput
                                ref={input2}
                                returnKeyType="next"
                                onSubmitEditing={() => { input3.current.focus() }}
                                style={styles.textInput}
                                placeholder="Last Name (optional)"
                                value={lastName}
                                onChangeText={(value) => { setLastName(value) }}
                            />
                            <TextInput
                                ref={input3}
                                returnKeyType="next"
                                onSubmitEditing={() => { input4.current.focus() }}
                                style={styles.textInput}
                                placeholder="Phone Number"
                                keyboardType='numeric'
                                autoCompleteType="tel"
                                value={phone}
                                onChangeText={(value) => { setPhone(value) }}
                            />
                            <TextInput
                                ref={input4}
                                returnKeyType="next"
                                onSubmitEditing={() => { input5.current.focus() }}
                                style={styles.textInput}
                                placeholder="Email address (optional)"
                                value={email}
                                autoCompleteType="email"
                                onChangeText={(value) => { setEmail(value) }}
                            />
                            <TextInput
                                ref={input5}
                                returnKeyType="next"
                                onSubmitEditing={() => { input6.current.focus() }}
                                style={styles.textInput}
                                placeholder="Create Password"
                                autoCompleteType="password"
                                secureTextEntry
                                passwordRules
                                value={password}
                                onChangeText={(value) => { setPassword(value) }}
                            />
                            <TextInput
                                ref={input6}
                                returnKeyType="send"
                                blurOnSubmit={true}
                                onSubmitEditing={() => { handleSubmit() }}
                                style={styles.textInput}
                                placeholder="Confrim Password"
                                autoCompleteType="password"
                                secureTextEntry
                                passwordRules
                                value={cnfPassword}
                                onChangeText={(value) => { setCnfPassword(value) }}
                            />
                        </View>
                        <View style={styles.buttonArea}>
                            <TouchableOpacity style={styles.defaultButton} onPress={() => { handleSubmit() }}>
                                <Text style={styles.defaultButtonText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.terms}>
                            <Text style={styles.termsText}>
                                By clicking Login, you acknowledge to reading & agreement to our
                                <Text style={{ color: "#0062FF" }}> Terms of Use</Text> and
                                <Text style={{ color: "#0062FF" }}> Privacy Policy</Text>.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomModal: {
        justifyContent: "center",
        alignItems: "center",
        height: 200,
    },
    screenContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: "#FFF",
        height: Dimensions.get('screen').height,
    },
    container: {

    },
    contentContainer: {
        justifyContent: "center",
        alignItems: "center",
        elevation: 0,
    },
    tabNavigation: {
        marginTop: 70,
        marginBottom: 20,
        paddingHorizontal: 20,
        marginLeft: 20,
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    tabNavigationObject: {
        borderBottomWidth: 1,
        borderColor: "#0062FF",
    },
    tabNavigationObjectSelected: {
        borderBottomWidth: 3,
        borderColor: "#0062FF",
    },
    tabNavigationText: {
        fontSize: 18,
        color: "#0062FF",
        borderBottomWidth: 1,
        borderColor: "#00000000",
        paddingBottom: 10,
        paddingHorizontal: 15,
    },
    form: {
        flex: 2,
        width: "100%",
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    userPhotoContainer: {
        height: 120,
        width: 120,
        borderRadius: 120 / 2,
        elevation: 3,
        padding: 20,
        marginVertical: 20,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center"
    },
    photo: {
        height: 100,
        width: 100,
        borderRadius: 100 / 2,
        backgroundColor: "#0062FF",
        justifyContent: "center",
        alignItems: "center"
    },
    cameraContainer: {
        height: 30,
        width: 30,
        borderRadius: 30 / 2,
        backgroundColor: "#fff",
        elevation: 2,
        position: "absolute",
        bottom: -8,
        right: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    textInput: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#66666666",
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    buttonArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: 20,
    },
    defaultButton: {
        width: Math.floor(Dimensions.get('window').width / 2),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        backgroundColor: "#0062FF",
        padding: 10
    },
    defaultButtonText: {
        color: "#FFF"
    },
    forgotPassword: {
        marginVertical: 20,
    },
    forgotPasswordText: {
        color: "#0062FF",
    },
    terms: {
        marginTop: 20,
        marginBottom: 160,
        paddingHorizontal: 45,
    },
    termsText: {
        textAlign: "center",
        color: "#666",
        fontSize: 12,
    },
})

export default SignUp