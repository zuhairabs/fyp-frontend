import React, {useState, useContext, createRef, useEffect} from 'react';
import {View, Text, Linking, ActivityIndicator} from 'react-native';
import {
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';

import Navbar from '../../../components/Header/Navbar';
import StatusBarWhite from '../../../components/StatusBar';
import SecondaryBackground from '../../../components/Backgrounds/SecondaryBackground';

import {GlobalContext} from '../../../providers/GlobalContext';
import styles from '../styles/AuthStyles';
import {textStyles, COLORS, buttons} from '../../../styles/styles';

const Verification = (props) => {
  const {
    phone,
    password,
    firstName,
    lastName,
    email,
    avatar,
    key,
  } = props.route.params;
  const {authActions} = useContext(GlobalContext);

  const [otp, setOtp] = useState();
  const [session, setSession] = useState('');

  const [loading, setLoading] = useState(false);
  const [modalText, setModalText] = useState('Verifying');
  const loadingModal = createRef();

  const sendOtpRequest = async () => {
    fetch(`https://2factor.in/API/V1/${key}/SMS/${phone}/AUTOGEN`, {
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
            loadingModal.current.open();
            setModalText(data.Details);
          }
        });
      } else {
        setLoading(false);
        loadingModal.current.open();
        res.json().then((data) => {
          setModalText(data.error);
        });
      }
    });
  };

  const verifyOtpRequest = async () => {
    if (otp.toString().length === 6) {
      loadingModal.current.open();
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
              console.log(data);
              callSignUp();
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

  const callSignUp = async () => {
    setLoading(true);
    setModalText('Logging in');
    let result = await authActions.signUp({
      phone,
      password,
      firstName,
      lastName,
      email,
      avatar,
    });
    if (result[0] === false) {
      setLoading(false);
      setModalText(result[1]);
    }
  };

  useEffect(() => {
    sendOtpRequest();
    console.log(key);
  }, []);

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
          {loading ? <ActivityIndicator size="large" color="#0062FF" /> : null}
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
                Verification Code
              </Text>
            </TouchableOpacity>
          </View>
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
              <Text style={textStyles.roundedButtonText}>Verify OTP</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.forgotPassword}>
            <Text style={{color: '#666'}}>Didn't recieve OTP? </Text>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.terms}>
            <Text style={styles.termsText}>
              By proceeding, you acknowledge to reading & agreement to our
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

export default Verification;
