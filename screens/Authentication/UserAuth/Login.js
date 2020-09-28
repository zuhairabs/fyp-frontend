import React, {useState, useContext, createRef} from 'react';
import {View, Text} from 'react-native';
import {TouchableOpacity, TextInput} from 'react-native-gesture-handler';

import {buttons, textStyles} from '../../../styles/styles';
import styles from '../styles/AuthStyles';
import {GlobalContext} from '../../../providers/GlobalContext';

const Login = ({actions, loadingModal}) => {
  const {authActions} = useContext(GlobalContext);
  const passwordInput = createRef();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState('');

  const validatePhone = () => {
    if (phone) {
      let phoneNumberRegex = /^\d{10}$/;
      if (phone.match(phoneNumberRegex)) return true;
    }
    return false;
  };

  const handleSubmit = async () => {
    actions.setLoading(true);
    loadingModal.current.open();
    actions.setModalText('Logging In');
    if (validatePhone()) {
      let res = await authActions.signIn({phone: phone, password: password});
      if (res[0] === false) {
        actions.setLoading(false);
        actions.setModalText(res[1]);
      }
    } else {
      actions.setLoading(false);
      actions.setModalText('Please enter a valid mobile number');
    }
  };

  return (
    <>
      <View style={styles.tabNavigation}>
        <TouchableOpacity style={styles.tabNavigationObjectSelected}>
          <Text
            style={{
              ...styles.tabNavigationText,
              ...textStyles.paragraphLargeBold,
            }}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabNavigationObject}
          onPress={() => {
            actions.changeView('signup');
          }}>
          <Text
            style={{...styles.tabNavigationText, ...textStyles.paragraphLarge}}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <TextInput
          style={{...styles.textInput}}
          placeholder="Phone Number"
          keyboardType="numeric"
          autoCompleteType="tel"
          value={phone}
          onChangeText={(value) => {
            setPhone(value);
          }}
          onSubmitEditing={() => {
            passwordInput.current.focus();
          }}
          returnKeyType="next"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          autoCompleteType="password"
          secureTextEntry
          passwordRules
          textContentType="password"
          onChangeText={(value) => {
            setPassword(value);
          }}
          ref={passwordInput}
          onSubmitEditing={() => {
            handleSubmit();
          }}
          blurOnSubmit={true}
          returnKeyType="send"
        />
      </View>
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={buttons.roundedPrimaryButton}
          onPress={() => {
            handleSubmit();
          }}>
          <Text style={textStyles.roundedButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          style={textStyles.link}
          onPress={() => actions.forgotPassword()}>
          <Text style={textStyles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Login;
