import React, { useState, createRef } from 'react'
import {
    View,
    Text,
    Alert,
    ToastAndroid,
    PermissionsAndroid,
    TouchableHighlight,
    Image
} from 'react-native'
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs'

import styles from './AuthStyles'
import { buttons, textStyles } from '../../styles/styles'

const SignUp = ({ actions, loadingModal }) => {
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState("")
    const [cnfPassword, setCnfPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("")

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
        actions.setLoading(true)
        loadingModal.current?.open()
        actions.setModalText("Registering")
        if (validateForm()) {
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
                        actions.setLoading(false);
                        loadingModal.current?.close();
                        actions.navigateToVerification({ phone, password, firstName, lastName, email, avatar })
                    }
                    else {
                        actions.setLoading(false)
                        actions.setModalText("Phone number already registered")
                    }
                })
        }
    }

    const validateForm = () => {
        if (validateName() && validatePhone() && validatePassword())
            return true;
        else return false;
    }

    const validatePhone = () => {
        let phoneno = /^\d{10}$/;
        if (phone && phone.match(phoneno)) return true;
        actions.setLoading(false);
        actions.setModalText("Please enter a valid mobile number");
        return false;
    }

    const validatePassword = () => {
        if (password.length < 8) {
            actions.setLoading(false);
            actions.setModalText("Password must be at least 8 characters long")
            return false
        }
        else if (password === cnfPassword) return true;
        actions.setLoading(false);
        actions.setModalText("Passwords do not match");
        return false;
    }

    const validateName = () => {
        let nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        if (firstName.match(nameRegex)) return true;
        actions.setLoading(false);
        actions.setModalText("Please enter a name");
        return false;
    }


    return (
        // <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <>
            <View style={styles.tabNavigation}>
                <TouchableOpacity style={styles.tabNavigationObject} onPress={() => { actions.changeView('login') }}>
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
        </>
        // </KeyboardAvoidingView>
    );
}

export default SignUp