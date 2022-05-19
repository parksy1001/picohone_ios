import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {LanguageContext} from '../context';
import Modal from 'react-native-modal';
import colors from '../src/colors';

export const ChangePassword = () => {
  const strings = useContext(LanguageContext);

  const [email, setEmail] = useState(null);
  const [emailValidate, setEmailValidate] = useState(false);
  const [emailAccess, setEmailAccess] = useState(false);
  const [checkEmailAlert, setCheckEmailAlert] = useState(false);

  const showCheckEmailAlert = () => {
    fetch('https://us-central1-pico-home.cloudfunctions.net/SendTempPassword', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => console.log(response))
      .catch((error) => {
        console.error(error);
      });
    setCheckEmailAlert(true);
  };

  const emailValidation = (text) => {
    const emailEx = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i;
    if (text === '') {
      setEmailAccess(false);
    } else {
      setEmailAccess(true);
      if (emailEx.test(text)) {
        setEmail(text);
        setEmailValidate(true);
      } else {
        setEmailValidate(false);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View
          style={[
            styles.fldViewStyle,
            emailAccess
              ? emailValidate
                ? {borderBottomColor: colors.azure}
                : {borderBottomColor: colors.coral}
              : null,
          ]}>
          <Text style={styles.emailText}>{strings.changepw_label_email}</Text>
          <View style={styles.emailTextInputView}>
            <Image source={require('../../Assets/img/icEmail.png')} />
            <TextInput
              style={styles.emailTextInputStyle}
              onChangeText={(text) => emailValidation(text)}
              placeholder="picohome@brilcom.com"
              placeholderTextColor={colors.brownGrey}
            />
          </View>
        </View>
        <View style={styles.explainText}>
          <Text style={styles.message}>{strings.changepw_contents}</Text>
        </View>
        <View style={styles.buttonView}>
          {emailValidate ? (
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => showCheckEmailAlert()}>
              <Text style={styles.buttonText}>
                {strings.changepw_button_send}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.buttonStyle,
                {backgroundColor: colors.veryLightPink},
              ]}
              onPress={() => null}>
              <Text style={styles.buttonText}>
                {strings.changepw_button_send}
              </Text>
            </TouchableOpacity>
          )}
          <Modal
            isVisible={checkEmailAlert}
            onBackdropPress={() => setCheckEmailAlert(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalCancel}>
                <TouchableOpacity onPress={() => setCheckEmailAlert(false)}>
                  <Image source={require('../../Assets/img/icCancel.png')} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalHeaderTextView}>
                <Text style={styles.modalHeaderText}>
                  {strings.changepw_popup_title}
                </Text>
              </View>
              <View style={styles.modalSubTextView}>
                <Text style={styles.modalSubText}>
                  {strings.changepw_popup_contents}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setCheckEmailAlert(false)}>
                <View style={[styles.modalButton, {width: width * 0.8}]}>
                  <Text style={styles.modalButtonText}>
                    {strings.changepw_popup_button_ok}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  fldViewStyle: {
    width: width * 0.8,
    height: height * 0.0845,
    marginTop: height * 0.0423,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  emailText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  emailTextInputView: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  emailTextInputStyle: {
    marginLeft: 8,
    width: 220,
    fontFamily: 'NotoSans',
    fontSize: 14,
  },
  explainText: {width: width * 0.8},
  message: {
    marginTop: 7,
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  buttonView: {
    position: 'absolute',
    top: height * 0.74,
  },
  buttonStyle: {
    width: width * 0.8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.azure,
    shadowColor: 'rgba(0, 172, 255, 0.2)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  buttonText: {
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.white,
  },
  modalContainer: {
    width: width * 0.9,
    height: height * 0.382,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  modalCancel: {position: 'absolute', top: 12, right: 12},
  modalHeaderTextView: {
    width: width * 0.9,
    marginTop: height * 0.056,
    alignItems: 'center',
  },
  modalHeaderText: {fontSize: 22, fontFamily: 'NotoSans'},
  modalSubTextView: {
    width: width * 0.75,
    marginTop: height * 0.07,
  },
  modalSubText: {textAlign: 'center', fontSize: 14, color: colors.brownGrey},
  modalButton: {
    width: width * 0.3875,
    height: height * 0.0704,
    marginTop: height * 0.07,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.azure,
    shadowColor: 'rgba(0, 172, 255, 0.2)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  modalButtonText: {
    fontSize: 20,
    fontFamily: 'NotoSans',
    color: colors.white,
  },
});
