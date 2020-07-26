import React, { useState, createRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    ActivityIndicator,
    ToastAndroid,
    PermissionsAndroid,
    TouchableHighlight,
    Image
} from 'react-native'
import { TouchableOpacity, ScrollView, TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import Modal from 'react-native-modalbox';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs'

import Navbar from '../../components/Header/Navbar'
import StatusBarWhite from '../../components/StatusBar'
import SecondaryBackground from '../../components/Backgrounds/SecondaryBackground'

import { COLORS, buttons, textStyles } from '../../styles/styles'

const SignUp = ({ navigation }) => {
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState("")
    const [cnfPassword, setCnfPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("")


    const [loading, setLoading] = useState(false)
    const [modalText, setModalText] = useState("Registering")
    const loadingModal = createRef();

    const input1 = createRef();
    const input2 = createRef();
    const input3 = createRef();
    const input4 = createRef();
    const input5 = createRef();
    const input6 = createRef();

    const requestPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
            return (granted === PermissionsAndroid.RESULTS.GRANTED)
        } catch (err) {
            console.warn(err)
        }
    }

    const exceptionHandler = (exception) => {
        ToastAndroid.show(exception, ToastAndroid.SHORT)
    }

    const pickImageFromLocalStorage = () => {
        const ImagePickerOptions = {
            title: "Select Avatar"
        }
        return new Promise((resolve, reject) => {
            ImagePicker.launchImageLibrary(ImagePickerOptions, (pickedImage) => {
                if (pickedImage.didCancel) reject("No image selected")
                else if (pickedImage.error) reject(`Error: ${pickedImage.error}`)
                else resolve(pickedImage.uri)
            })
        })
    }

    const jpegToBase64 = uri => {
        return new Promise((resolve, reject) => {
            RNFS.readFile(uri, 'base64')
                .then(base64Image => resolve(base64Image))
                .catch(err => reject(err))
        })
    }

    const compressUserAvatarImage = uri => {
        const USER_IMAGE_SIZE = {
            height: 400,
            width: 400
        }
        const USER_IMAGE_SCALE_PERCENTAGE = 50
        const USER_IMAGE_FORMAT = "JPEG"
        const USER_IMAGE_ROTATION = 0

        return new Promise((resolve, reject) => {
            ImageResizer.createResizedImage(uri,
                USER_IMAGE_SIZE.width,
                USER_IMAGE_SIZE.height,
                USER_IMAGE_FORMAT,
                USER_IMAGE_SCALE_PERCENTAGE,
                USER_IMAGE_ROTATION)
                .then(async compressedImage => resolve(compressedImage.uri))
                .catch(err => reject(err));
        })
    }

    const selectPicture = () => {
        requestPermission()
            .then(granted => {
                if (granted) {
                    pickImageFromLocalStorage()
                        .then(pickedImageUri => {
                            compressUserAvatarImage(pickedImageUri)
                                .then(compressedImageUri => {
                                    jpegToBase64(compressedImageUri)
                                        .then(convertedImage => setAvatar(convertedImage))
                                        .catch(conversionError => exceptionHandler(conversionError))
                                })
                                .catch(compressionError => exceptionHandler(compressionError))
                        })
                        .catch(pickerError => exceptionHandler(pickerError))
                }
                else exceptionHandler("File permission required to upload image")
            });
    }

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
                        navigation.navigate("Verification", { phone, password, firstName, lastName, email, avatar });
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
        if (phone && phone.match(phoneno)) return true;
        Alert.alert("Please enter a valid 10 digit mobile number")
        return false;
    }

    const validatePassword = () => {
        if (password.length < 8) {
            Alert.alert("Password must be at least 8 character long")
            return false
        }
        else if (password === cnfPassword) return true;
        Alert.alert("Passwords do not match");
        return false;
    }

    const validateName = () => {
        let nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        if (firstName.match(nameRegex)) return true;
        Alert.alert("Please enter a name")
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
                    <Text style={{ marginHorizontal: 20, ...textStyles.paragraphLarge, color: COLORS.BLACK }}>
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
                                <Text style={{ ...styles.tabNavigationText, ...textStyles.paragraphLarge }}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.tabNavigationObjectSelected}>
                                <Text style={{ ...styles.tabNavigationText, ...textStyles.paragraphLargeBold }}>Register</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.form}>
                            <View style={styles.userPhotoContainer}>
                                <View style={styles.photo}>
                                    {
                                        avatar && avatar.length > 0 ?
                                            <Image source={{ uri: `data:image/gif;base64,${avatar}` }} style={styles.avatar} />
                                            :
                                            <Icon name="person" size={80} color="#FFF" />
                                    }
                                    <TouchableHighlight
                                        style={styles.cameraContainer}
                                        onPress={() => { selectPicture() }}
                                    >
                                        <Icon name="camera-alt" size={18} color="#BDBDBD" />
                                    </TouchableHighlight>
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
                                placeholder="Confirm Password"
                                autoCompleteType="password"
                                secureTextEntry
                                passwordRules
                                value={cnfPassword}
                                onChangeText={(value) => { setCnfPassword(value) }}
                            />
                        </View>
                        <View style={styles.buttonArea}>
                            <TouchableOpacity style={buttons.roundedPrimaryButton} onPress={() => { handleSubmit() }}>
                                <Text style={textStyles.roundedButtonText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.terms}>
                            <Text style={{ ...styles.termsText, ...textStyles.paragraphSmall }}>
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
        backgroundColor: COLORS.WHITE
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
    avatar: {
        height: 100,
        width: 100,
        borderRadius: 50,
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
    }
})

export default SignUp