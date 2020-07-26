import React, { useState, useContext, createRef } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Linking, ActivityIndicator } from 'react-native'
import { TouchableOpacity, ScrollView, TextInput } from 'react-native-gesture-handler'
import Modal from 'react-native-modalbox';

import Navbar from '../../components/Header/Navbar'
import StatusBarWhite from '../../components/StatusBar'
import SecondaryBackground from '../../components/Backgrounds/SecondaryBackground'

import { COLORS, buttons, textStyles } from '../../styles/styles'
import { GlobalContext } from '../../providers/GlobalContext'

const Login = ({ navigation }) => {
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState("")

    const [modalText, setModalText] = useState("Unknown error")
    const [loading, setLoading] = useState(false)
    const loadingModal = createRef();

    const { authActions } = useContext(GlobalContext);

    const phoneInput = createRef();
    const passwordInput = createRef();

    const validatePhone = () => {
        if (phone) {
            let phoneNumberRegex = /^\d{10}$/;
            if (phone.match(phoneNumberRegex))
                return true;
        }
        return false;
    }

    const handleSubmit = async () => {
        setLoading(true);
        loadingModal.current.open();
        setModalText("Logging In")
        if (validatePhone()) {
            let res = await authActions.signIn({ phone: phone, password: password });
            if (res[0] === false) {
                setLoading(false);
                setModalText(res[1]);
            }
        }
        else {
            setLoading(false);
            setModalText("Please enter a valid mobile number");
        }
    }

    return (
        <View style={styles.screenContainer}>

            <Modal
                ref={loadingModal}
                style={styles.bottomModal}
                position={"bottom"}
                swipeToClose={!loading}
                backdropPressToClose={!loading}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                    <Text style={{ marginHorizontal: 20, ...textStyles.paragraphLarge, color: COLORS.BLACK }}>
                        {modalText}
                    </Text>
                    {
                        loading ?
                            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                            : null
                    }
                </View>
            </Modal>

            <StatusBarWhite />
            <SecondaryBackground />

            <ScrollView style={styles.container}>
                <Navbar type="locked" />
                <View style={styles.contentContainer} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
                    <View style={styles.tabNavigation}>
                        <TouchableOpacity style={styles.tabNavigationObjectSelected}>
                            <Text style={{ ...styles.tabNavigationText, ...textStyles.paragraphLargeBold }}>
                                Login
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabNavigationObject} onPress={() => { navigation.navigate("SignUp") }}>
                            <Text style={{ ...styles.tabNavigationText, ...textStyles.paragraphLarge }}>Register</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.form}>
                        <TextInput
                            style={{ ...styles.textInput, }}
                            placeholder="Phone Number"
                            keyboardType='numeric'
                            autoCompleteType="tel"
                            value={phone}
                            onChangeText={(value) => { setPhone(value) }}
                            onSubmitEditing={() => { passwordInput.current.focus() }}
                            returnKeyType="next"
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Password"
                            autoCompleteType="password"
                            secureTextEntry
                            passwordRules
                            textContentType="password"
                            onChangeText={(value) => { setPassword(value) }}
                            ref={passwordInput}
                            onSubmitEditing={() => { handleSubmit() }}
                            blurOnSubmit={true}
                            returnKeyType="send"
                        />
                    </View>
                    <View style={styles.buttonArea}>
                        <TouchableOpacity style={buttons.roundedPrimaryButton} onPress={() => { handleSubmit() }}>
                            <Text style={textStyles.roundedButtonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.forgotPassword}>
                        <TouchableOpacity>
                            <Text style={textStyles.link}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.terms}>
                        <Text style={{ ...styles.termsText, ...textStyles.paragraphSmall }}>
                            By clicking Login, you acknowledge to reading & agreement to our
                            <Text style={{ color: "#0062FF" }}
                                onPress={() => { Linking.openURL("https://www.github.com") }}
                            > Terms of Use</Text> and
                            <Text style={{ color: "#0062FF" }}> Privacy Policy</Text>.
                        </Text>
                    </View>
                </View>
            </ScrollView>
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
        height: Dimensions.get('screen').height,
        backgroundColor: COLORS.WHITE
    },
    container: {
    },
    contentContainer: {
        justifyContent: "center",
        alignItems: "center"
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
        borderColor: COLORS.PRIMARY,
    },
    tabNavigationObjectSelected: {
        borderBottomWidth: 3,
        borderColor: COLORS.PRIMARY,
    },
    tabNavigationText: {
        color: COLORS.PRIMARY,
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
    textInput: {
        width: "100%",
        borderWidth: 1,
        borderColor: COLORS.BORDER_LIGHT,
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
    forgotPassword: {
        marginVertical: 20,
    },
    terms: {
        marginTop: 20,
        marginBottom: 160,
        paddingHorizontal: 45,
    },
    termsText: {
        textAlign: "center",
        color: COLORS.SECONDARY,
    },
})

export default Login