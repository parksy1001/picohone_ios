import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {LanguageContext, SignUpContext} from '../context';
import colors from '../src/colors';

export const SignUp1 = ({navigation}) => {
  const {signUp} = useContext(SignUpContext);
  const {setIdPw} = useContext(SignUpContext);
  const strings = useContext(LanguageContext);

  const [email, setEmail] = useState('');
  const [emailValidate, setEmailValidation] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [emailAccess, setEmailAccess] = useState(false);
  const [pw, setPw] = useState('');
  const [pwValidate, setPwValidation] = useState(null);
  const [pwAccess, setPwAccess] = useState(false);
  const [pw2, setPw2] = useState('');
  const [checkPw, setUpCheckPw] = useState(false);
  const [checkPwAccess, setCheckPwAccess] = useState(false);
  const [agreeTerm, setUpTerm] = useState(false);
  const [secureNewPW, setSecureNewPw] = useState(true);
  const [secureRePw, setSecureRePw] = useState(true);
  const [nextStep, setNextStep] = useState(false);
  const [signUpWait, setSignUpWait] = useState(true);

  const signUpGoNext = async () => {
    setSignUpWait(false);
    
    const {emailExist} = await signUp(email, pw);
    if (emailExist) {
      setSignUpWait(true); 
      setEmailExist(emailExist)
    } else {
      setIdPw(email, pw);
      setSignUpWait(false);
    }
  };

  const validation = (text, type) => {
    const emailEx = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i;
    const pwEx = /^.*(?=^.{6,}$)(?=.*\d)(?=.*[a-zA-Z]).*$/;

    if (type === 'email') {
      if (text === '') {
        setEmailAccess(false);
      } else {
        setEmailAccess(true);
        setEmailExist(false)
        if (emailEx.test(text)) {
          setEmailValidation(true);
        } else {
          setEmailValidation(false);
        }
      }
      setEmail(text);
    } else if (type === 'pw') {
      if (text === '') {
        setPwAccess(false);
      } else {
        setPwAccess(true);
        if (pwEx.test(text)) {
          setPwValidation(true);
        } else {
          setPwValidation(false);
        }
      }
      setPw(text);
    }
  };

  const checkPassWord = () => {
    if (pw2 === '') {
      setCheckPwAccess(false);
    } else {
      setCheckPwAccess(true);
      if (pw === pw2) {
        setUpCheckPw(true);
      } else {
        setUpCheckPw(false);
      }
    }
  };

  const agreeServiceTerm = () => {
    if (agreeTerm === true) {
      setUpTerm(false);
    } else {
      setUpTerm(true);
    }
  };

  const checkNextStep = () => {
    if (emailValidate) {
      if (pwValidate) {
        if (checkPw) {
          if (agreeTerm) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    setNextStep(checkNextStep());
  }, [emailValidate, pwValidate, checkPw, agreeTerm]);

  useEffect(() => {
    checkPassWord();
  }, [pw, pw2]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {signUpWait ? (
        <View style={styles.container}>
          <View
            style={[
              styles.fldViewStyle,
              emailAccess
                ? emailValidate
                  ? {borderBottomColor: colors.azure}
                  : {borderBottomColor: colors.coral}
                : null,
              emailExist && { borderBottomColor: colors.coral },
            ]}>
            <Text style={styles.emailText}>{strings.signup_label_email}</Text>
            <View style={styles.emailTextInputView}>
              <Image source={require('../../Assets/img/icEmail.png')} />
              <TextInput
                value={email}
                style={styles.emailTextInputStyle}
                onChangeText={(text) => validation(text.trim(), 'email')}
                placeholder="picohome@brilcom.com"
                placeholderTextColor={colors.brownGrey}
              />
            </View>
          </View>
          {emailAccess ? (
            emailValidate ? null : (
              <View style={{width: width * 0.8, marginTop: height * 0.01}}>
                <Text style={{color: colors.coral}}>
                  {strings.signup_error_email}
                </Text>
              </View>
            )
          ) : null}
          {emailExist && (
              <View style={{ width: width * 0.8, marginTop: height * 0.01 }}>
                <Text style={{ color: colors.coral }}>{strings.signup_regist_error_text}</Text>
              </View>
            )
          }
          <View
            style={[
              styles.fldViewStyle,
              pwAccess
                ? pwValidate
                  ? {borderBottomColor: colors.azure}
                  : {borderBottomColor: colors.coral}
                : null,
            ]}>
            <Text style={styles.passWordText}>
              {strings.signup_label_password}
            </Text>
            <View style={styles.passWordTextInputView}>
              <Image source={require('../../Assets/img/icLock.png')} />
              <TextInput
                value={pw}
                style={styles.passWordTextInputStyle}
                onChangeText={(text) => validation(text.trim(), 'pw')}
                placeholder={strings.signup_input_password}
                placeholderTextColor={colors.brownGrey}
                secureTextEntry={secureNewPW}
              />
              <TouchableOpacity
                style={styles.icVisibilityHidden}
                onPress={() => setSecureNewPw((prevState) => !prevState)}>
                <Image
                  source={
                    secureNewPW
                      ? require('../../Assets/img/icVisibilityHidden.png')
                      : require('../../Assets/img/iconsIcVisibilityVisible.png')
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          {pwAccess ? (
            pwValidate ? null : (
              <View style={{width: width * 0.8, marginTop: height * 0.01}}>
                <Text style={{color: colors.coral}}>
                  {strings.signup_error_password}
                </Text>
              </View>
            )
          ) : null}
          <View
            style={[
              styles.fldViewStyle,
              checkPwAccess
                ? checkPw
                  ? {borderBottomColor: colors.azure}
                  : {borderBottomColor: colors.coral}
                : null,
            ]}>
            <Text style={styles.rePassWordText}>
              {strings.signup_label_reenterpassword}
            </Text>
            <View style={styles.rePassWordTextInputView}>
              <Image source={require('../../Assets/img/icLock.png')} />
              <TextInput
                value={pw2}
                style={styles.rePassWordTextInputStyle}
                onChangeText={(text) => setPw2(text.trim())}
                placeholder={strings.signup_input_reenterpassword}
                placeholderTextColor={colors.brownGrey}
                secureTextEntry={secureRePw}
              />
              <TouchableOpacity
                style={styles.icVisibilityHidden}
                onPress={() => setSecureRePw((prevState) => !prevState)}>
                <Image
                  source={
                    secureRePw
                      ? require('../../Assets/img/icVisibilityHidden.png')
                      : require('../../Assets/img/iconsIcVisibilityVisible.png')
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          {checkPwAccess ? (
            checkPw ? null : (
              <View style={{width: width * 0.8, marginTop: height * 0.01}}>
                <Text style={{color: colors.coral}}>
                  {strings.singup_error_reenterpassword}
                </Text>
              </View>
            )
          ) : null}
          <View style={styles.termsViewStyle}>
            <TouchableOpacity onPress={() => agreeServiceTerm()}>
              <View style={styles.termsOfServiceFld}>
                {agreeTerm ? (
                  <Image
                    source={require('../../Assets/img/iconsIcCheckboxActive.png')}
                  />
                ) : (
                  <Image source={require('../../Assets/img/deactive.png')} />
                )}
                <Text style={styles.iAgreeAllStatemen}>{strings.signup_terms_head}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('WebView', 'terms')}>
                  <Text style={styles.agreeTerm}>{strings.signup_terms}</Text>
                </TouchableOpacity>
                <Text style={[styles.iAgreeAllStatemen, {marginLeft: 0}]}>{strings.signup_terms_tail}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {nextStep ? (
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={[styles.buttonStyle, {backgroundColor: colors.azure}]}
                onPress={() => signUpGoNext()}>
                <Text style={styles.buttonText}>
                  {strings.signup_button_next}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonView}>
              <TouchableOpacity style={styles.buttonStyle}>
                <Text style={styles.buttonText}>
                  {strings.signup_button_next}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={colors.azure} />
        </View>
      )}
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
    flexDirection: 'column',
    width: width * 0.85,
    height: height * 0.0845,
    marginTop: height * 0.0422,
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
    width: width * 0.6875,
    marginLeft: width * 0.0125,
    fontFamily: 'NotoSans',
  },
  passWordText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  passWordTextInputView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passWordTextInputStyle: {
    width: width * 0.72,
    marginLeft: width * 0.0125,
    fontFamily: 'NotoSans',
  },
  rePassWordText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  rePassWordTextInputView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rePassWordTextInputStyle: {
    width: width * 0.72,
    marginLeft: width * 0.0125,
    fontFamily: 'NotoSans',
  },
  icVisibilityHidden: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  userTextInputView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextInputStyle: {
    width: width * 0.8,
    marginLeft: width * 0.0125,
    fontFamily: 'NotoSans',
  },
  birthText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  birthTextInputView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  birthTextInputStyle: {
    width: width * 0.8,
    fontFamily: 'NotoSans',
  },
  genderText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  genderTextInputView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderTextInputStyle: {
    width: width * 0.8,
    fontFamily: 'NotoSans',
  },
  termsViewStyle: {
    flexDirection: 'column',
    width: width * 0.85,
    height: 48,
    marginTop: height * 0.0422,
  },
  termsOfServiceText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  termsOfServiceFld: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  iAgreeAllStatemen: {
    marginLeft: 8,
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  agreeTerm: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.deepSkyBlue,
    textDecorationLine: 'underline',
  },
  buttonView: {position: 'absolute', top: height * 0.74},
  buttonStyle: {
    width: width * 0.8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.veryLightPink,
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
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.white,
  },
  buttonNextView: {position: 'absolute', top: height * 0.74},
  indicator: {
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
