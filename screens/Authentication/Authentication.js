import React, {useState, createRef} from 'react';
import {
  View,
  Text,
  Linking,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';

import Login from './Login';
import SignUp from './SignUp';
import Navbar from '../../components/Header/Navbar';
import StatusBarWhite from '../../components/StatusBar';
import SecondaryBackground from '../../components/Backgrounds/SecondaryBackground';

import styles from './AuthStyles';
import {textStyles, COLORS} from '../../styles/styles';

export default Authentication = ({navigation}) => {
  const [view, changeView] = useState('login');

  const [loading, setLoading] = useState(false);
  const [modalText, setModalText] = useState('Unknown error');
  const loadingModal = createRef();

  const navigateToVerification = (data) => {
    navigation.navigate('Verification', data);
  };

  const forgotPassword = () => {
    navigation.navigate('ResetPassword');
  };

  const screenFunctions = {
    changeView,
    setLoading,
    setModalText,
    navigateToVerification,
    forgotPassword,
  };

  const screens = {
    login: <Login actions={screenFunctions} loadingModal={loadingModal} />,
    signup: <SignUp actions={screenFunctions} loadingModal={loadingModal} />,
  };

  return (
    <View style={styles.screenContainer}>
      <Modal
        ref={loadingModal}
        style={styles.bottomModal}
        position={'bottom'}
        swipeToClose={!loading}
        backdropPressToClose={!loading}
        useNativeDriver={true}>
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

      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.container}>
          <Navbar type="locked" />
          <View style={styles.contentContainer}>
            {screens[view]}
            <View style={styles.terms}>
              <Text style={{...styles.termsText, ...textStyles.paragraphSmall}}>
                By clicking Login, you acknowledge to reading & agreement to our
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
      </KeyboardAvoidingView>
    </View>
  );
};
