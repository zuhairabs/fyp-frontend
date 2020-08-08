import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableHighlight,
  ToastAndroid,
  PermissionsAndroid,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import Svg, {Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

import {GlobalContext} from '../../providers/GlobalContext';
import {URI} from '../../api/constants';

import StatusBarWhite from '../../components/StatusBar';
import NavbarBackButton from '../../components/Header/NavbarBackButton';
import {COLORS, textStyles, buttons} from '../../styles/styles';

const EditProfile = (props) => {
  const {state, authActions} = useContext(GlobalContext);
  const navigation = props.navigation;

  const [user, setUser] = useState({});

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState();
  const [avatar, setAvatar] = useState('');

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
    }
  };

  const exceptionHandler = (exception) => {
    ToastAndroid.show(exception, ToastAndroid.SHORT);
  };

  const pickImageFromLocalStorage = () => {
    const ImagePickerOptions = {
      title: 'Select Avatar',
    };
    return new Promise((resolve, reject) => {
      ImagePicker.launchImageLibrary(ImagePickerOptions, (pickedImage) => {
        if (pickedImage.didCancel) reject('No image selected');
        else if (pickedImage.error) reject(`Error: ${pickedImage.error}`);
        else resolve(pickedImage.uri);
      });
    });
  };

  const jpegToBase64 = (uri) => {
    return new Promise((resolve, reject) => {
      RNFS.readFile(uri, 'base64')
        .then((base64Image) => resolve(base64Image))
        .catch((err) => reject(err));
    });
  };

  const compressUserAvatarImage = (uri) => {
    const USER_IMAGE_SIZE = {
      height: 400,
      width: 400,
    };
    const USER_IMAGE_SCALE_PERCENTAGE = 50;
    const USER_IMAGE_FORMAT = 'JPEG';
    const USER_IMAGE_ROTATION = 0;

    return new Promise((resolve, reject) => {
      ImageResizer.createResizedImage(
        uri,
        USER_IMAGE_SIZE.width,
        USER_IMAGE_SIZE.height,
        USER_IMAGE_FORMAT,
        USER_IMAGE_SCALE_PERCENTAGE,
        USER_IMAGE_ROTATION,
      )
        .then(async (compressedImage) => resolve(compressedImage.uri))
        .catch((err) => reject(err));
    });
  };

  const selectPicture = () => {
    requestPermission().then((granted) => {
      if (granted) {
        pickImageFromLocalStorage()
          .then((pickedImageUri) => {
            compressUserAvatarImage(pickedImageUri)
              .then((compressedImageUri) => {
                jpegToBase64(compressedImageUri)
                  .then((convertedImage) => setAvatar(convertedImage))
                  .catch((conversionError) =>
                    exceptionHandler(conversionError),
                  );
              })
              .catch((compressionError) => exceptionHandler(compressionError));
          })
          .catch((pickerError) => exceptionHandler(pickerError));
      } else exceptionHandler('File permission required to upload image');
    });
  };

  const getUserFromAsyncStorage = async () => {
    return (storedUser = JSON.parse(await AsyncStorage.getItem('user')));
  };

  const setInputBoxValues = (user) => {
    setUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setAvatar(user.avatar);
  };

  useEffect(() => {
    if (state.user) setInputBoxValues(state.user);
    else
      getUserFromAsyncStorage().then((storedUser) =>
        setInputBoxValues(storedUser),
      );
  }, [state.user]);

  const save = () => {
    const saveToAsync = async (user) => {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    };
    const bootstrapper = async () => {
      let token = await AsyncStorage.getItem('jwt');
      let user = JSON.parse(await AsyncStorage.getItem('user'));
      fetch(`${URI}/user/updateprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          cred: {
            phone: user.phone,
          },
          userData: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            avatar: avatar,
          },
        }),
      }).then((res) => {
        if (res.status === 200) {
          user.firstName = firstName;
          user.lastName = lastName;
          user.email = email;
          user.avatar = avatar;
          saveToAsync(user).then(() => {
            authActions.updateUser();
            ToastAndroid.show('Profile updated!', ToastAndroid.LONG);
          });
        } else Alert.alert(res.error);
      });
    };
    bootstrapper();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.screenContainer}>
      <StatusBarWhite />
      {/* <ProfileBackground /> */}

      <Svg
        viewBox="0 0 600 600"
        height="150%"
        width="150%"
        style={styles.circleTop}>
        <Circle cx="300" cy="300" r="300" fill={COLORS.PRIMARY} />
      </Svg>

      <NavbarBackButton color="white" navigation={navigation} />

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userPhotoContainer}>
            <View style={styles.photo}>
              {avatar && avatar.length > 0 ? (
                <Image
                  source={{uri: `data:image/gif;base64,${avatar}`}}
                  style={styles.avatar}
                />
              ) : (
                <Icon name="person" size={80} color={COLORS.PRIMARY} />
              )}
              <TouchableHighlight
                style={styles.cameraContainer}
                onPress={() => {
                  selectPicture();
                }}>
                <Icon name="camera-alt" size={18} color="#BDBDBD" />
              </TouchableHighlight>
            </View>
          </View>
          <Text style={styles.number}>+91 {user.phone}</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.formContainer}>
            <View style={styles.formObject}>
              <Text style={styles.formLabel}>First Name</Text>
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
              <Text style={styles.formLabel}>Last Name</Text>
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

            <View style={styles.formObject}>
              <Text style={styles.formLabel}>Email ID</Text>
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
              <Text style={styles.formLabel}>Location</Text>
              <TextInput
                value={location || 'Powai, Mumbai'}
                style={styles.formInput}
                onChangeText={(value) => setLocation(value)}
                returnKeyType="done"
                editable={false}
              />
            </View>

            <TouchableOpacity style={styles.resetLink}>
              <Text style={{...textStyles.link}}>Reset Your Password</Text>
            </TouchableOpacity>

            <View style={styles.buttonArea}>
              <TouchableOpacity
                style={{...buttons.primaryButton, marginHorizontal: 20}}
                onPress={() => {
                  save();
                }}>
                <Text style={{...textStyles.primaryButtonText}}>
                  Save Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#FFF',
  },
  container: {
    height: Dimensions.get('window').height,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginTop: 50,
    marginBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  circleTop: {
    position: 'absolute',
    top: '-82%',
    left: '-25%',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPhotoContainer: {
    height: 120,
    width: 120,
    borderRadius: 120 / 2,
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#FFFFFF2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    height: 28,
    width: 28,
    borderRadius: 28 / 2,
    backgroundColor: '#fff',
    elevation: 2,
    position: 'absolute',
    bottom: -8,
    right: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  number: {
    color: COLORS.WHITE,
    ...textStyles.paragraphLargeBold,
  },
  formContainer: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 50,
  },
  formObject: {
    width: Dimensions.get('window').width - 40,
    borderColor: COLORS.BORDER_LIGHT,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  formLabel: {
    ...textStyles.paragraphSmall,
    color: COLORS.PRIMARY,
    backgroundColor: COLORS.WHITE,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.WHITE,
  },
  formInput: {
    height: 36,
    color: COLORS.SECONDARY,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 0,
    paddingVertical: 2,
    flex: 1,
    ...textStyles.paragraphMedium,
  },
  resetLink: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonArea: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
});

export default EditProfile;
