import React, {useState, useContext, createRef, useEffect} from 'react';
import {
  View,
  Text,
  Linking,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';

import Navbar from '../../components/Header/Navbar';
import StatusBarWhite from '../../components/StatusBar';
import SecondaryBackground from '../../components/Backgrounds/SecondaryBackground';

import {GlobalContext} from '../../providers/GlobalContext';
import {URI} from '../../api/constants';

import styles from './AuthStyles';
import {textStyles, COLORS, buttons} from '../../styles/styles';

const PhoneNumber = ({phone, setPhone, checkPhoneRegistered}) => {
  const validatePhone = () => {
    if (phone) {
      let phoneNumberRegex = /^\d{10}$/;
      if (phone.match(phoneNumberRegex)) checkPhoneRegistered();
    } else ToastAndroid.show('Enter a valid phone number', ToastAndroid.LONG);
  };
  return (
    <>
      <View style={styles.form}>
        <TextInput
          returnKeyType="send"
          blurOnSubmit={true}
          onSubmitEditing={() => {
            validatePhone();
          }}
          style={styles.textInput}
          placeholder="Phone number"
          keyboardType="numeric"
          value={phone}
          onChangeText={(value) => {
            setPhone(value);
          }}
        />
      </View>
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={buttons.roundedPrimaryButton}
          onPress={() => {
            validatePhone();
          }}>
          <Text style={textStyles.roundedButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const OTPVerification = ({otp, setOtp, verifyOtpRequest, loadingModal}) => {
  useEffect(() => {
    loadingModal.current?.close();
  }, []);

  return (
    <>
      <View style={styles.form}>
        <TextInput
          returnKeyType="send"
          blurOnSubmit={true}
          onSubmitEditing={() => {
            verifyOtpRequest();
          }}
          style={styles.textInput}
          placeholder="OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={(value) => {
            setOtp(value);
          }}
        />
      </View>
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={buttons.roundedPrimaryButton}
          onPress={() => {
            verifyOtpRequest();
          }}>
          <Text style={textStyles.roundedButtonText}>Change password</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.forgotPassword}>
        <Text style={{color: '#666'}}>Didn't recieve OTP? </Text>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const ChangePassword = ({changePasswordRequest, loadingModal}) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const confirm = createRef();

  const handleSubmit = () => {
    if (newPass.length < 8)
      ToastAndroid.show(
        'Password must be at least 8 characters',
        ToastAndroid.LONG,
      );
    else if (newPass === confirmPass) changePasswordRequest(newPass);
    else ToastAndroid.show('Passwords do not match', ToastAndroid.LONG);
  };

  useEffect(() => {
    loadingModal.current?.close();
  }, []);

  return (
    <>
      <View style={styles.form}>
        <TextInput
          returnKeyType="send"
          blurOnSubmit={true}
          onSubmitEditing={() => {
            confirm.current?.focus();
          }}
          style={styles.textInput}
          placeholder="Create new password"
          autoCompleteType="password"
          secureTextEntry
          passwordRules
          value={newPass}
          onChangeText={(value) => {
            setNewPass(value);
          }}
        />
        <TextInput
          returnKeyType="send"
          blurOnSubmit={true}
          onSubmitEditing={() => {
            handleSubmit();
          }}
          style={styles.textInput}
          placeholder="Confirm new password"
          autoCompleteType="password"
          secureTextEntry
          passwordRules
          value={confirmPass}
          onChangeText={(value) => {
            setConfirmPass(value);
          }}
        />
      </View>
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={buttons.roundedPrimaryButton}
          onPress={() => {
            handleSubmit();
          }}>
          <Text style={textStyles.roundedButtonText}>Change password</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const ResetPassword = ({navigation}) => {
  // const { phone, password, firstName, lastName, email } = props.route.params;
  const {authActions} = useContext(GlobalContext);
  const [otp, setOtp] = useState();
  const [session, setSession] = useState('');
  const [key, setKey] = useState();

  const [credentialsEntered, setCredentialsEntered] = useState(false);
  const [verified, setVerification] = useState(false);

  const [phone, setPhone] = useState();
  const [loading, setLoading] = useState(false);
  const [modalText, setModalText] = useState('Verifying');
  const loadingModal = createRef();

  const checkPhoneRegistered = async () => {
    setLoading(true);
    loadingModal.current?.open();
    setModalText('Sending OTP');
    if (phone) {
      fetch(`${URI}/user/verification/phoneregistered`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
        }),
      }).then((res) => {
        if (res.status === 403) {
          res.json().then((data) => {
            setKey(data.key);
            loadingModal.current?.close();
            setLoading(false);
            setCredentialsEntered(true);
            sendOtpRequest(data.key);
          });
        } else {
          setLoading(false);
          setModalText('Phone number not registered');
        }
      });
    }
  };

  const sendOtpRequest = async (otpKey) => {
    if (phone && otpKey)
      fetch(`https://2factor.in/API/V1/${otpKey}/SMS/${phone}/AUTOGEN`, {
        method: 'GET',
        port: null,
        async: true,
        crossDomain: true,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {},
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            if (data.Status === 'Success') {
              console.log(data);
              setSession(data.Details);
            } else {
              setLoading(false);
              loadingModal.current?.open();
              setModalText(data.Details);
            }
          });
        } else
          res.json().then((data) => {
            setLoading(false);
            setModalText(data.error);
            loadingModal.current?.open();
          });
      });
    else {
      setCredentialsEntered(false);
      setLoading(false);
      setModalText('Enter your phone number');
      loadingModal.current?.open();
    }
  };

  const verifyOtpRequest = async () => {
    if (otp) {
      loadingModal.current?.open();
      setModalText('Verifying OTP');
      setLoading(true);
      fetch(`https://2factor.in/API/V1/${key}/SMS/VERIFY/${session}/${otp}`, {
        method: 'GET',
        port: null,
        async: true,
        crossDomain: true,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {},
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            if (data.Status === 'Success' && data.Details === 'OTP Matched') {
              loadingModal.current?.close();
              setVerification(true);
              setLoading(false);
            } else {
              setLoading(false);
              setModalText(data.Details);
            }
          });
        } else {
          res.json().then((data) => {
            setLoading(false);
            setModalText(data.Details);
          });
        }
      });
    }
  };

  const changePasswordRequest = (password) => {
    setLoading(true);
    setModalText('Please wait');
    loadingModal.current?.open();
    try {
      fetch(`${URI}/user/password/reset`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          cred: {
            phone: phone,
            password: password,
          },
        }),
      }).then((res) => {
        if (res.status === 200)
          navigation.navigate('Success', {
            text: 'Your password has been changed successfully',
          });
        else {
          setLoading(false);
          setModalText(res.statusText);
        }
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Modal
        ref={loadingModal}
        useNativeDriver={false}
        style={styles.bottomModal}
        position={'bottom'}
        swipeToClose={!loading}
        backdropPressToClose={!loading}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text
            style={{
              marginHorizontal: 20,
              ...textStyles.paragraphLarge,
              color: COLORS.BLACK,
            }}>
            {modalText}
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          ) : null}
        </View>
      </Modal>

      <StatusBarWhite />
      <SecondaryBackground />

      <ScrollView style={styles.container}>
        <Navbar type="locked" />
        <View
          style={styles.contentContainer}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.tabNavigation}>
            <TouchableOpacity style={styles.tabNavigationObjectSelected}>
              <Text
                style={{
                  ...styles.tabNavigationText,
                  ...textStyles.paragraphLargeBold,
                }}>
                Reset password
              </Text>
            </TouchableOpacity>
          </View>
          {!credentialsEntered ? (
            <PhoneNumber
              phone={phone}
              setPhone={setPhone}
              checkPhoneRegistered={checkPhoneRegistered}
            />
          ) : verified ? (
            <ChangePassword
              changePasswordRequest={changePasswordRequest}
              loadingModal={loadingModal}
            />
          ) : (
            <OTPVerification
              otp={otp}
              setOtp={setOtp}
              verifyOtpRequest={verifyOtpRequest}
              loadingModal={loadingModal}
            />
          )}
          <View style={styles.terms}>
            <Text style={styles.termsText}>
              By clicking Next, you acknowledge to reading & agreement to our
              <Text
                style={{color: '#0062FF'}}
                onPress={() => {
                  Linking.openURL('https://www.github.com');
                }}>
                {' '}
                Terms of Use
              </Text>{' '}
              and
              <Text style={{color: '#0062FF'}}> Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResetPassword;
