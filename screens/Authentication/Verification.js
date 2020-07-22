import React, { useState, useContext, createRef, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Linking, ActivityIndicator } from 'react-native'
import { TouchableOpacity, ScrollView, TextInput } from 'react-native-gesture-handler'
import Modal from 'react-native-modalbox';

import Navbar from '../../components/Header/Navbar'
import StatusBarWhite from '../../components/StatusBar'
import SecondaryBackground from '../../components/Backgrounds/SecondaryBackground'

import { GlobalContext } from '../../providers/GlobalContext'

const Login = (props) => {
    const { phone, password, firstName, lastName, email } = props.route.params;
    const { authActions } = useContext(GlobalContext);

    const [otp, setOtp] = useState()
    const [session, setSession] = useState("")

    const [loading, setLoading] = useState(false)
    const [modalText, setModalText] = useState("Verifying")
    const loadingModal = createRef();

    const sendOtpRequest = async () => {
        fetch(`https://2factor.in/API/V1/01300eab-b6d0-11ea-9fa5-0200cd936042/SMS/${phone}/AUTOGEN`, {
            "method": "GET",
            "port": null,
            "async": true,
            "crossDomain": true,
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {}
        })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            if (data.Status === "Success") {
                                console.log(data)
                                setSession(data.Details)
                            }
                            else {
                                setLoading(false)
                                loadingModal.current.open();
                                setModalText(data.Details)
                            }
                        })
                }
                else {
                    setLoading(false)
                    loadingModal.current.open();
                    res.json()
                        .then(data => {
                            setModalText(data.error)
                        })
                }
            })
    }



    const verifyOtpRequest = async () => {
        if (otp.length === 6) {
            loadingModal.current.open();
            setModalText("Verifying OTP");
            setLoading(true);
            fetch(`https://2factor.in/API/V1/01300eab-b6d0-11ea-9fa5-0200cd936042/SMS/VERIFY/${session}/${otp}`, {
                "method": "GET",
                "port": null,
                "async": true,
                "crossDomain": true,
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {}
            })
                .then(res => {
                    if (res.status === 200) {
                        res.json()
                            .then(data => {
                                if (data.Status === "Success" && data.Details === "OTP Matched") {
                                    console.log(data)
                                    callSignUp();
                                }
                                else {
                                    setLoading(false)
                                    setModalText(data.Details)
                                }
                            })
                    }
                    else {
                        res.json()
                            .then(data => {
                                setLoading(false)
                                setModalText(data.Details)
                            })
                    }
                })
        }

    }

    const callSignUp = async () => {
        setLoading(true)
        setModalText("Loggin in")
        let result = await authActions.signUp({ phone, password, firstName, lastName, email });
        if (result[0] === false) {
            setLoading(false)
            setModalText(result[1])
        }
    }

    useEffect(() => {
        sendOtpRequest()
    }, [])

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

            <ScrollView style={styles.container}>
                <Navbar type="locked" />
                <View style={styles.contentContainer} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
                    <View style={styles.tabNavigation}>
                        <TouchableOpacity style={styles.tabNavigationObjectSelected}>
                            <Text style={styles.tabNavigationText}>
                                Verification Code
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.form}>
                        <TextInput
                            returnKeyType="send"
                            blurOnSubmit={true}
                            onSubmitEditing={() => { verifyOtpRequest() }}
                            style={styles.textInput}
                            placeholder="OTP"
                            keyboardType='numeric'
                            value={otp}
                            onChangeText={(value) => { setOtp(value) }}
                        />
                    </View>
                    <View style={styles.buttonArea}>
                        <TouchableOpacity style={styles.defaultButton} onPress={() => { verifyOtpRequest() }}>
                            <Text style={styles.defaultButtonText}>
                                Verify OTP
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.forgotPassword}>
                        <Text style={{ color: "#666" }}>Didn't recieve OTP? </Text>
                        <TouchableOpacity>
                            <Text style={styles.forgotPasswordText}>
                                Resend OTP
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.terms}>
                        <Text style={styles.termsText}>
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
        // backgroundColor: "#F8F9FD",
        height: Dimensions.get('screen').height,
        backgroundColor: "#fff"
    },
    container: {
    },
    contentContainer: {
        justifyContent: "flex-start",
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
        alignItems: "center",
        marginTop: 20
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
        marginTop: 100,
    },
    defaultButton: {
        width: Math.floor(Dimensions.get('window').width / 2),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        backgroundColor: "#0062FF",
        padding: 10,
        borderWidth: 1,
        borderColor: "#CAD0D8",
    },
    defaultButtonText: {
        color: "#FFF"
    },
    forgotPassword: {
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    forgotPasswordText: {
        color: "#0062FF",
    },
    terms: {
        marginTop: 50,
        marginBottom: 160,
        paddingHorizontal: 45,
    },
    termsText: {
        textAlign: "center",
        color: "#666",
        fontSize: 12,
    },
})

export default Login