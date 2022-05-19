import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  AuthContext,
  LanguageContext,
  SignInContext,
  SignInErrorContext,
} from '../context';
import {AppleLoginButton} from '../component/Button/AppleLoginButton';
import {FacebookLoginButton} from '../component/Button/FacebookLoginButton';
import {GoogleLoginButton} from '../component/Button/GoogleLoginButton';
import {BleManager} from 'react-native-ble-plx';
import Modal from 'react-native-modal';
import colors from '../src/colors';

export const SignIn = ({navigation}) => {
  const bleManager = new BleManager();

  const {signIn} = useContext(AuthContext);

  const strings = useContext(LanguageContext);
  const signInState = useContext(SignInContext);
  const signInErrorMessage = useContext(SignInErrorContext);

  const [securePw, setSecurePw] = useState(true);
  const [scanAlert, setScanAlert] = useState(false);
  const [bleModal, setBleModal] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [id, setID] = useState('');
  const [pw, setPw] = useState('');

  const showWhatSignInError = () => {
    if (signInErrorMessage === 'err_unregistered_user') {
      return strings.login_error_email;
    } else if (signInErrorMessage === 'err_invalid_password') {
      return strings.login_error_password;
    } else {
      return 'Unregistered error occur. Check another process';
    }
  };

  // 블루투스 권한 요청 처리
  // 블루투스 On => 바로 Find PiCOHOME
  // 블루투스 Off => 권한요청 Modal => Allow : Find PiCOHOME / Deny : Modal Off, stay
  const getBLEPermission = () => {
    bleManager.state().then((res) => {
      if (res === 'PoweredOff') {
        setBleModal(true);
      } else {
        navigation.navigate('FindPicoToScan', {from: 'auth', strings: strings});
      }
    });
  };

  const onBleGoScan = () => {
    bleManager.enable();
    setScanLoading(true);
    setTimeout(() => {
      setBleModal(false);
      setScanLoading(false);
      navigation.navigate('FindPicoToScan', {from: 'auth', strings: strings});
    }, 3000);
  };

  const showScanAlertWindow = () => {
    setScanAlert(true);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.picoHomeImage}>
          <Image source={require('../../Assets/img/imgLogoBasic.png')} />
        </View>
        <View style={styles.signInViewStyle}>
          <View
            style={[
              styles.fldBasicActive,
              signInState ? null : {borderBottomColor: colors.coral},
            ]}>
            <Text style={styles.emailText}>{strings.login_label_email}</Text>
            <View style={styles.emailInputFld}>
              <Image source={require('../../Assets/img/icEmail.png')} />
              <TextInput
                style={styles.emailTextInputStyle}
                onChangeText={(text) => setID(text.trim())}></TextInput>
            </View>
          </View>
          <View style={{height: height * 0.0334}}></View>
          <View
            style={[
              styles.fldBasicActive,
              signInState ? null : {borderBottomColor: colors.coral},
            ]}>
            <Text style={styles.pwText}>{strings.login_label_password}</Text>
            <View style={styles.pwInputFld}>
              <Image source={require('../../Assets/img/icLock.png')} />
              <TextInput
                style={styles.pwTextInputStyle}
                onChangeText={(text) => setPw(text.trim())}
                secureTextEntry={securePw}
              />
              <TouchableOpacity
                style={styles.icVisibilityHidden}
                onPress={() => setSecurePw((prevState) => !prevState)}>
                <Image
                  source={
                    securePw
                      ? require('../../Assets/img/icVisibilityHidden.png')
                      : require('../../Assets/img/iconsIcVisibilityVisible.png')
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{width: width * 0.8, marginTop: height * 0.01}}>
            {signInState ? null : (
              <Text style={{color: colors.coral}}>{showWhatSignInError()}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => signIn(id, pw, '', '', '', '')}>
            <Text style={styles.buttonText}>{strings.login_button_login}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.snsAndScanStyle}>
          <View style={styles.snsAndScanViewStyle}>
            <GoogleLoginButton />
            <Text style={styles.snsAndScanText}>
              {strings.login_button_google}
            </Text>
          </View>
          <View style={styles.snsAndScanViewStyle}>
            <FacebookLoginButton />
            <Text style={styles.snsAndScanText}>
              {strings.login_button_facebook}
            </Text>
          </View>
          <View style={styles.snsAndScanViewStyle}>
            <AppleLoginButton />
            <Text style={styles.snsAndScanText}>apple</Text>
          </View>
          <View style={styles.snsAndScanViewStyle}>
            <TouchableOpacity onPress={() => getBLEPermission()}>
              <Image source={require('../../Assets/img/icScan.png')} />
            </TouchableOpacity>
            <Text style={styles.snsAndScanText}>
              {strings.login_button_scan}
            </Text>
          </View>
          <Modal
            isVisible={bleModal}
            onBackdropPress={() => setBleModal(false)}>
            <View>
              {scanLoading ? (
                <View style={[styles.modalContainer, {height: height * 0.3}]}>
                  <View style={styles.indicator}>
                    <ActivityIndicator size="large" color={colors.azure} />
                  </View>
                </View>
              ) : (
                <View style={styles.modalContainer}>
                  <View style={styles.modalCancel}>
                    <TouchableOpacity onPress={() => setBleModal(false)}>
                      <Image
                        source={require('../../Assets/img/icCancel.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalHeaderTextView}>
                    <Text style={styles.modalHeaderText}>
                      {strings.ble_permission_popup_title}
                    </Text>
                  </View>
                  <View style={styles.modalSubTextView}>
                    <Text style={styles.modalSubText}>
                      {strings.ble_permission_popup_contents}
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => setBleModal(false)}>
                      <View style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>
                          {strings.login_popup_button_ok}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {/* 
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => setBleModal(false)}>
                      <View
                        style={[
                          styles.modalButton,
                          {backgroundColor: colors.veryLightPink},
                        ]}>
                        <Text style={styles.modalButtonText}>
                          {strings.ble_permission_popup_button_deny}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onBleGoScan()}>
                      <View style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>
                          {strings.ble_permission_popup_button_allow}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  */}
                </View>
              )}
            </View>
          </Modal>
          <View style={styles.scanAlertPosition}>
            <TouchableOpacity onPress={() => showScanAlertWindow()}>
              <Image source={require('../../Assets/img/icInformation.png')} />
            </TouchableOpacity>
            <Modal
              isVisible={scanAlert}
              onBackdropPress={() => setScanAlert(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalCancel}>
                  <TouchableOpacity onPress={() => setScanAlert(false)}>
                    <Image source={require('../../Assets/img/icCancel.png')} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalHeaderTextView}>
                  <Text style={styles.modalHeaderText}>
                    {strings.login_popup_title}
                  </Text>
                </View>
                <View style={styles.modalSubTextView}>
                  <Text style={styles.modalSubText}>
                    {strings.login_popup_contents}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setScanAlert(false)}>
                  <View style={[styles.modalButton, {width: width * 0.8}]}>
                    <Text style={styles.modalButtonText}>
                      {strings.login_popup_button_ok}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </View>
        <View style={styles.accountFldStyle}>
          <View style={styles.changePwPosition}>
            <TouchableOpacity onPress={() => navigation.push('ChangePassword')}>
              <Text style={styles.changePw}>
                {strings.login_button_changepw}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.signUpPosition}>
            <TouchableOpacity onPress={() => navigation.push('SignUp1')}>
              <Text style={styles.signUp}>{strings.login_button_signup}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  appleButton: {
    width: 300,
    height: 50,
    margin: 10,
  },
  signInButton: {
    width: 200,
    height: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  picoHomeImage: {
    marginTop: height * 0.132,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  signInViewStyle: {
    marginTop: height * 0.07,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  fldBasicActive: {
    width: width * 0.8,
    height: height * 0.0845,
    borderBottomColor: colors.azure,
    borderBottomWidth: 1,
  },
  emailText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  emailInputFld: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailTextInputStyle: {
    width: width * 0.68,
    marginLeft: width * 0.025,
    color: colors.brownGrey,
  },
  pwText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  pwInputFld: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  pwTextInputStyle: {
    width: width * 0.68,
    marginLeft: width * 0.025,
    color: colors.brownGrey,
  },
  icVisibilityHidden: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    width: width * 0.8,
    height: 40,
    marginTop: height * 0.04,
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
    elevation: 2,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.white,
  },
  snsAndScanStyle: {
    flexDirection: 'row',
    width: width * 0.8,
    height: height * 0.2,
    marginTop: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snsAndScanViewStyle: {
    marginHorizontal: width * 0.047,
    alignItems: 'center',
  },
  snsAndScanText: {
    marginTop: height * 0.007,
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.brownishGrey,
  },
  scanAlertPosition: {position: 'absolute', right: 0, top: 23},
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
    width: width * 0.9,
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: 22,
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
  },
  modalSubTextView: {
    width: width * 0.75,
    marginTop: height * 0.0281,
    alignItems: 'center',
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'NotoSans',
    color: colors.brownGrey,
    textAlign: 'center',
  },
  modalButton: {
    width: width * 0.75,
    height: height * 0.07,
    marginTop: height * 0.0423,
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
  },
  modalButtonText: {
    fontSize: 14,
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    color: colors.white,
  },
  accountFldStyle: {
    width: width,
    marginTop: height * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePwPosition: {position: 'absolute', left: width * 0.237},
  changePw: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownishGrey,
  },
  divider: {
    position: 'absolute',
    width: 1,
    height: 16,
    backgroundColor: colors.brownGrey,
  },
  signUpPosition: {position: 'absolute', right: width * 0.293},
  signUp: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownishGrey,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
