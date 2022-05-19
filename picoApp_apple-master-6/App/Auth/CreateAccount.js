import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {NewUserIdContext, LanguageContext, NewUserPWContext} from '../context';
import Modal from 'react-native-modal';
import colors from '../src/colors';

export const CreateAccount = ({navigation}) => {
  const strings = useContext(LanguageContext);
  const id = useContext(NewUserIdContext);
  const pw = useContext(NewUserPWContext);

  const [nextStepLoading, setNextStepLoading] = useState(true);
  const [sendEmailModal, setSendEmailModal] = useState(false);
  const [checkEmailModal, setCheckEmailModal] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [signUpComplete, setSignUpComplete] = useState(false);

  const checkEmailConfirmed = (Info) => {
    if (Info.EmailConfirmed === '0') {
      console.log('Please check your E-mail confirmed.');
      setCheckEmailModal(true);
    } else if (Info.EmailConfirmed === '1') {
      console.log('Email confirmed');
      setNextStepLoading(false);
      updateProfile(Info);
      setSignUpComplete(true);
    } else {
      console.log('Something went wrong...');
    }
  };

  const registCompelete = () => {
    setSignUpComplete(false);
    navigation.navigate('SignIn');
    setNextStepLoading(true);
  };

  const getEmailConfirmed = () => {
    fetch('https://us-central1-pico-home.cloudfunctions.net/Login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        password: pw,
        kind: '',
        phoneType: '',
        phoneToken: '',
        email: '',
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res.Info);
        checkEmailConfirmed(res.Info);
      })
      .catch((err) => console.error(err));
  };

  const getUserInfo = () => {
    fetch('https://us-central1-pico-home.cloudfunctions.net/Login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        password: pw,
        kind: '',
        phoneType: '',
        phoneToken: '',
        email: '',
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res.Info);
        sendEmailVerification(res.Info.userid, res.Info.apiKey);
      })
      .catch((err) => console.error(err));
  };

  const sendEmailVerification = (userid, apiKey) => {
    setSendEmailModal(true);
    fetch('https://us-central1-pico-home.cloudfunctions.net/SendEmailAuth', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userid,
        apiKey: apiKey,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Msg === 'success') {
          setSendSuccess(true);
        } else if (res.Msg === 'err_authorized_email') {
          console.log(res.Msg);
          setAuthModal(true);
        }
      })
      .catch((err) => console.error(err));
  };

  const updateProfile = async (Info) => {
    try {
      let response = await fetch(
        'https://us-central1-pico-home.cloudfunctions.net/UpdateProfile',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userid: Info.userid, // userInfo.userid,
            apiKey: Info.apiKey, // userInfo.apiKey,
            name: id,
            gender: 'neutral',
            birthday: '',
            notification: 'Yes',
            currentPassword: '',
            newPassword: '',
          }),
        },
      );
      let post = await response.json();
      if (post.Msg === 'success') {
        console.log('SignUp complete!');
      } else {
        console.log(post.Msg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      {nextStepLoading ? (
        <View style={{flex: 1}}>
          <View style={{width: width * 0.8, marginTop: 150}}>
            <Text style={styles.text}>{strings.signup_confirmemail_text1}</Text>
            <Text style={styles.text}>{strings.signup_confirmemail_text2}</Text>
          </View>
          <TouchableOpacity
            style={[styles.buttonStyle, {marginTop: height * 0.1}]}
            onPress={() => getUserInfo()}>
            <Text style={styles.buttonText}>
              {strings.signup_confirmemail_confirm_button}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonStyle, {position: 'absolute', bottom: 30}]}
            onPress={() => getEmailConfirmed()}>
            <Text style={styles.buttonText}>
              {strings.signup_confirmemail_check_button}
            </Text>
          </TouchableOpacity>
          {/* Send E-mail modal */}
          <Modal
            isVisible={sendEmailModal}
            onBackdropPress={() => setSendEmailModal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalCancel}>
                <TouchableOpacity onPress={() => setSendEmailModal(false)}>
                  <Image source={require('../../Assets/img/icCancel.png')} />
                </TouchableOpacity>
              </View>
              {sendSuccess ? (
                <View>
                  <View style={styles.modalHeaderTextView}>
                    <Text style={styles.modalHeaderText}>
                      {strings.signup_confirmemail_popup1_contents}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSendEmailModal(false)}>
                    <View style={styles.modalButton}>
                      <Text style={styles.modalButtonText}>
                        {strings.signup_confirmemail_popup1_ok}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.modalContainer}>
                  <View style={styles.indicator}>
                    <ActivityIndicator size="large" color={colors.azure} />
                  </View>
                </View>
              )}
            </View>
          </Modal>
          {/* Check E-mail modal */}
          <Modal
            isVisible={checkEmailModal}
            onBackdropPress={() => setCheckEmailModal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalCancel}>
                <TouchableOpacity onPress={() => setCheckEmailModal(false)}>
                  <Image source={require('../../Assets/img/icCancel.png')} />
                </TouchableOpacity>
              </View>
              <View>
                <View style={styles.modalHeaderTextView}>
                  <Text style={styles.modalHeaderText}>
                    {strings.signup_confirmemail_popup2_title}
                  </Text>
                </View>
                <View style={styles.modalSubTextView}>
                  <Text style={styles.modalSubText}>
                    {strings.signup_confirmemail_popup2_contents}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setCheckEmailModal(false)}>
                  <View style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>
                      {strings.signup_confirmemail_popup2_button}
                    </Text>
                  </View>
                </TouchableOpacity>{' '}
              </View>
            </View>
          </Modal>
          {/* E-mail Auth modal */}
          <Modal
            isVisible={authModal}
            onBackdropPress={() => setAuthModal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalCancel}>
                <TouchableOpacity onPress={() => setAuthModal(false)}>
                  <Image source={require('../../Assets/img/icCancel.png')} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalHeaderTextView}>
                <Text style={styles.modalHeaderText}>
                  {strings.signup_regist_error_title}
                </Text>
              </View>
              <View style={[styles.modalSubTextView, {alignItems: 'center'}]}>
                <Text style={styles.modalSubText}>
                  {strings.signup_regist_error_text}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setAuthModal(false)}>
                <View style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>
                    {strings.signup_regist_error_button_ok}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      ) : (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={colors.azure} />
          {/* SignUp Complete modal */}
          <Modal isVisible={signUpComplete}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeaderTextView}>
                <Text style={styles.modalHeaderText}>
                  {strings.signup_complete_popup_contents}
                </Text>
              </View>
              <TouchableOpacity onPress={() => registCompelete()}>
                <View style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>
                    {strings.signup_complete_popup_ok}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  text: {
    fontFamily: 'NotoSans',
    color: colors.brownGrey,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
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
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  modalContainer: {
    width: width * 0.9,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  modalCancel: {position: 'absolute', top: 12, right: 12},
  modalHeaderTextView: {
    alignItems: 'center',
  },
  modalHeaderText: {fontSize: 20, fontFamily: 'NotoSans', fontWeight: 'bold'},
  modalSubTextView: {
    width: width * 0.75,
    marginTop: height * 0.0281,
  },
  modalSubText: {fontSize: 16, color: colors.brownGrey},
  modalButton: {
    width: width * 0.75,
    height: height * 0.06,
    marginTop: height * 0.04,
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
    fontSize: 14,
    fontFamily: 'NotoSans',
    color: colors.white,
  },
});
