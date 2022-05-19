/*
 * developer : oogab
 *
 * -----------------bug list-------------------
 *
 * Date Picker 왜 지 마음대로 초기화 되는지 알수가 없다.
 * HomeStack에서 refresh하는 시간에 맞춰서 Datepicker도 초기화 됨.
 * 도대체 왜 그런지 이유를 알 수가 없다...
 * -------------------해결----------------------
 *
 * Date Picker 설정 시 pop up이 한번더 작동하는지 모르겠다.
 * 일단 해결!
 *
 */
import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  NativeModules,
} from 'react-native';
import {
  AuthContext,
  LanguageContext,
  LocaleContext,
  SettingContext,
  UserContext,
  UserDetailInfoContext,
} from '../../../context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import colors from '../../../src/colors';

/*
const locale =
  NativeModules.SettingsManager.settings.AppleLocale ||
  NativeModules.SettingsManager.settings.AppleLanguages[0];
*/

export const Profile = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const {getUserDetailInfo} = useContext(SettingContext);
  const locale = useContext(LocaleContext);
  const strings = useContext(LanguageContext);
  const userInfo = useContext(UserContext);
  const userDetailInfo = useContext(UserDetailInfoContext);

  const [isLoading, setIsLoading] = useState(false);

  const [oldPW, setOldPw] = useState('');
  const [oldPwValidate, setOldPwValidation] = useState(null);
  const [oldPwAccess, setOldPwAccess] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [newPwValidate, setNewPwValidation] = useState(null);
  const [newPwAccess, setNewPwAccess] = useState(false);
  const [pw2, setPw2] = useState('');
  const [checkPw, setUpCheckPw] = useState(false);
  const [checkPwAccess, setCheckPwAccess] = useState(false);
  const [secureOldPw, setSecureOldPw] = useState(true);
  const [secureNewPW, setSecureNewPw] = useState(true);
  const [secureRePw, setSecureRePw] = useState(true);

  const [showGender, setShowGender] = useState(false);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [logOutAlert, setLogOutAlert] = useState(false);
  const [closeAccountAlert, setCloseAccountAlert] = useState(false);
  // const [modifyAlert, setModifyAlert] = useState(false);
  const [withdrawalAlert, setWithdrawalAlert] = useState(false);

  const [userEmail, setUserEmail] = useState(userDetailInfo.Info.Email);
  const [userBirthDay, setUserBirthDay] = useState(
    userDetailInfo.Info.Birthday
      ? userDetailInfo.Info.Birthday.slice(0, -9)
      : '',
  );
  const [userGender, setUserGender] = useState(
    userDetailInfo.Info.Gender ? userDetailInfo.Info.Gender : '',
  );

  const [isDateChanged, setIsDateChanged] = useState(false);
  const [isGenderChanged, setIsGenderChanged] = useState(false);

  const [canUpdate, setCanUpdate] = useState(false);

  const passwordValidation = (text, type) => {
    const pwEx = /^.*(?=^.{6,}$)(?=.*\d)(?=.*[a-zA-Z]).*$/;

    if (type === 'old') {
      if (text === '') {
        setOldPwAccess(false);
      } else {
        setOldPwAccess(true);
        setOldPw(text);
        if (pwEx.test(text)) {
          setOldPwValidation(true);
        } else {
          setOldPwValidation(false);
        }
      }
    } else if (type === 'new') {
      if (text === '') {
        setNewPwAccess(false);
      } else {
        setNewPwAccess(true);
        setNewPw(text);
        if (pwEx.test(text)) {
          setNewPwValidation(true);
        } else {
          setNewPwValidation(false);
        }
      }
    }
  };

  const checkPassWord = () => {
    if (pw2 === '') {
      setCheckPwAccess(false);
    } else {
      setCheckPwAccess(true);
      if (newPw === pw2) {
        setUpCheckPw(true);
      } else {
        setUpCheckPw(false);
      }
    }
  };

  const showLogOutAlertWindow = () => {
    setLogOutAlert(true);
  };

  const showCloseAccountAlertWindow = () => {
    setCloseAccountAlert(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setIsDateChanged(true);
    setDate(currentDate);
    setUserBirthDay(currentDate.toISOString().slice(0, 10));
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const togglePicker = () => {
    setShowGender((prev) => !prev);
  };

  const setGenderValue = (gender) => {
    if (gender != userGender) {
      setIsGenderChanged(true);
    }
    setUserGender(gender);
    setShowGender((prev) => !prev);
  };

  const showLocaleGender = () => {
    if (userGender === 'male') {
      return strings.profile_label_gender_male;
    } else if (userGender === 'female') {
      return strings.profile_label_gender_female;
    } else if (userGender === 'neutral') {
      return strings.profile_label_gender_neutral;
    } else {
      return '';
    }
  };

  const withdrawalComplete = () => {
    setWithdrawalAlert(false);
    signOut();
    setIsLoading(true);
  };

  const closeAccount = () => {
    setIsLoading(false);
    fetch('https://us-central1-pico-home.cloudfunctions.net/SignOff', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userInfo.userid, // userInfo.userid,
        apiKey: userInfo.apiKey, // userInfo.apiKey,
        email: userEmail,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Msg === 'success') {
          console.log('Withdrawal Success!');
          setWithdrawalAlert(true);
          setCloseAccountAlert(false);
          /*
          signOut();
          setTimeout(() => {
            setIsLoading(true);
          }, 3000);
          */
        } else {
          console.log('Error Occur!');
          setTimeout(() => {
            setIsLoading(true);
          }, 3000);
        }
      })
      .catch((err) => console.error(err));
  };

  const modifyProfile = () => {
    setIsLoading(false);
    fetch('https://us-central1-pico-home.cloudfunctions.net/UpdateProfile', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userInfo.userid, // userInfo.userid,
        apiKey: userInfo.apiKey, // userInfo.apiKey,
        name: '',
        gender: userGender,
        birthday: userBirthDay,
        currentPassword: oldPW,
        newPassword: newPw,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Msg === 'success') {
          console.log('Update Success!');
          getUserDetailInfo(userInfo.userid, userInfo.apiKey);
          setTimeout(() => {
            setIsLoading(true);
          }, 3000);
        } else {
          console.log('Error Occur!');
          setTimeout(() => {
            setIsLoading(true);
          }, 3000);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setCanUpdate(false);
    setIsGenderChanged(false);
    setIsDateChanged(false);
    setOldPwAccess(false);
    setNewPwAccess(false);
    setCheckPwAccess(false);
    setOldPwValidation(false);
    setNewPwValidation(false);
    setUpCheckPw(false);
  };

  // User 정보를 수정할 수 있는지 판단
  const canUpdateInfo = () => {
    // 성별과 생일이 변하지 않았다면
    if (isGenderChanged === false && isDateChanged === false) {
      // 이전 비밀번호, 새 비밀번호, 새 비밀번호 확인이 모두 활성화 되지 않았다면
      if (
        oldPwAccess === false &&
        newPwAccess === false &&
        checkPwAccess === false
      ) {
        return false; // 정보가 변한 것이 없음
      }
      // 이전 비밀번호, 새 비밀번호, 새 비밀번호 확인 중 하나라도 활성화 되었다면
      else {
        // 이전 비밀번호, 새 비밀번호, 새 비밀번호 확인이 모두 규칙에 맞다면
        if (oldPwValidate && newPwValidate && checkPw) {
          return true; // 정보가 올바르게 바뀌었음 (비밀번호 변경)
        }
        // 이전 비밀번호, 새 비밀번호, 새 비밀번호 확인 중 하나라도 규칙에 어긋나면
        else {
          return false; // 정보가 올바르게 바뀌지 않음
        }
      }
    }
    // 성별이나 생일 중 하나라도 변했다면
    else {
      // 이전 비밀번호, 새 비밀번호, 새 비밀번호 확인이 모두 활성화 되지 않았다면
      if (
        oldPwAccess === false &&
        newPwAccess === false &&
        checkPwAccess === false
      ) {
        return true; // 정보가 올바르게 바뀌었음 (성별이나 생일만 변경)
      }
      // 이전 비밀번호, 새 비밀번호, 새 비밀번호 확인 중 하나라도 활성화 되었다면
      else {
        // 이전 비밀번호, 새 비밀번호, 새 비밀번호 확인이 모두 규칙에 맞다면
        if (oldPwValidate && newPwValidate && checkPw) {
          return true; // 정보가 올바르게 바뀌었음 (성별, 생일, 비밀번호 변경)
        }
        // 이전 비밀번호, 새 비밀번호, 새 비밀번호 확인 중 하나라도 규칙에 어긋나면
        else {
          return false; // 정보가 올바르게 바뀌지 않음
        }
      }
    }
  };

  useEffect(() => {
    if (userDetailInfo != null) {
      setUserEmail(userDetailInfo.Info.Email);
      setUserBirthDay(
        userDetailInfo.Info.Birthday
          ? userDetailInfo.Info.Birthday.slice(0, -9)
          : '',
      );
      setUserGender(
        userDetailInfo.Info.Gender ? userDetailInfo.Info.Gender : '',
      );
    }
  }, [userDetailInfo]);

  useEffect(() => {
    checkPassWord();
  }, [newPw, pw2]);

  useEffect(() => {
    setCanUpdate(canUpdateInfo());
  }, [
    isGenderChanged,
    isDateChanged,
    oldPwAccess,
    newPwAccess,
    checkPwAccess,
    oldPwValidate,
    newPwValidate,
    checkPw,
  ]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 1000);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {isLoading ? (
          <View>
            <View style={styles.emailFldStyle}>
              <Text style={styles.emailText}>
                {strings.profile_label_email}
              </Text>
              <View style={styles.emailTextInputStyle}>
                <Image source={require('../../../../Assets/img/icEmail.png')} />
                <Text style={styles.emailTextInput}>{userEmail}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => showDatepicker()}>
              <View style={styles.birthFldStyle}>
                <Text style={styles.birthText}>
                  {strings.profile_label_birth}
                </Text>
                <View style={styles.birthTextInputStyle}>
                  <Text style={styles.birthTextInput}>{userBirthDay}</Text>
                  <View style={styles.icVisibilityHidden}>
                    <Image
                      source={require('../../../../Assets/img/icMiniarrowBottom.png')}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            {/* Date picker modal */}
            <Modal
              style={{alignItems: 'center'}}
              isVisible={show}
              onBackdropPress={() => setShow(false)}>
              <View style={styles.modalBox}>
                <View style={styles.modalCancel}>
                  <TouchableOpacity onPress={() => setShow(false)}>
                    <Image
                      source={require('../../../../Assets/img/icCancel.png')}
                    />
                  </TouchableOpacity>
                </View>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    locale={locale}
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="spinner"
                    onChange={onChange}
                    textColor={colors.black}
                  />
                )}
              </View>
            </Modal>
            {/* Gender pick */}
            <TouchableOpacity onPress={() => togglePicker()}>
              <View style={styles.genderFldStyle}>
                <Text style={styles.genderText}>
                  {strings.profile_label_gender}
                </Text>
                <View style={styles.genderTextInputStyle}>
                  <Text>{showLocaleGender()}</Text>
                  <View style={styles.icMiniarrowBottom}>
                    <Image
                      source={require('../../../../Assets/img/icMiniarrowBottom.png')}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <Modal
              style={{alignItems: 'center'}}
              isVisible={showGender}
              onBackdropPress={() => togglePicker()}>
              <View style={styles.modalBox}>
                <View style={styles.modalCancel}>
                  <TouchableOpacity onPress={() => togglePicker()}>
                    <Image
                      source={require('../../../../Assets/img/icCancel.png')}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => setGenderValue('male')}
                  style={{paddingBottom: 8}}>
                  <Text>{strings.profile_label_gender_male}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGenderValue('female')}
                  style={{paddingTop: 8, paddingBottom: 8}}>
                  <Text>{strings.profile_label_gender_female}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGenderValue('neutral')}
                  style={{paddingTop: 8, paddingBottom: 8}}>
                  <Text>{strings.profile_label_gender_neutral}</Text>
                </TouchableOpacity>
              </View>
            </Modal>
            <View
              style={[
                styles.oldPwFldStyle,
                oldPwAccess
                  ? oldPwValidate
                    ? {borderBottomColor: colors.azure}
                    : {borderBottomColor: colors.coral}
                  : null,
              ]}>
              <Text style={styles.oldPwText}>
                {strings.profile_label_oldpassword}
              </Text>
              <View style={styles.oldPwTextInputStyle}>
                <Image source={require('../../../../Assets/img/icLock.png')} />
                <TextInput
                  style={styles.oldPwTextInput}
                  placeholder={strings.profile_input_oldpassword}
                  placeholderTextColor={colors.brownGrey}
                  onChangeText={(text) =>
                    passwordValidation(text.trim(), 'old')
                  }
                  secureTextEntry={secureOldPw}
                />
                <TouchableOpacity
                  style={styles.icVisibilityHidden}
                  onPress={() => setSecureOldPw((prevState) => !prevState)}>
                  <Image
                    source={
                      secureOldPw
                        ? require('../../../../Assets/img/icVisibilityHidden.png')
                        : require('../../../../Assets/img/iconsIcVisibilityVisible.png')
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            {oldPwAccess ? (
              oldPwValidate ? null : (
                <View style={{width: width * 0.8, marginTop: height * 0.01}}>
                  <Text style={{color: colors.coral}}>
                    {strings.signup_error_password}
                  </Text>
                </View>
              )
            ) : null}
            <View
              style={[
                styles.newPwFldStyle,
                newPwAccess
                  ? newPwValidate
                    ? {borderBottomColor: colors.azure}
                    : {borderBottomColor: colors.coral}
                  : null,
              ]}>
              <Text style={styles.newPwText}>
                {strings.profile_label_newpassword}
              </Text>
              <View style={styles.newPwTextInputStyle}>
                <Image source={require('../../../../Assets/img/icLock.png')} />
                <TextInput
                  style={styles.newPwTextInput}
                  placeholder={strings.profile_input_newpassword}
                  placeholderTextColor={colors.brownGrey}
                  onChangeText={(text) =>
                    passwordValidation(text.trim(), 'new')
                  }
                  secureTextEntry={secureNewPW}
                />
                <TouchableOpacity
                  style={styles.icVisibilityHidden}
                  onPress={() => setSecureNewPw((prevState) => !prevState)}>
                  <Image
                    source={
                      secureNewPW
                        ? require('../../../../Assets/img/icVisibilityHidden.png')
                        : require('../../../../Assets/img/iconsIcVisibilityVisible.png')
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            {newPwAccess ? (
              newPwValidate ? null : (
                <View style={{width: width * 0.8, marginTop: height * 0.01}}>
                  <Text style={{color: colors.coral}}>
                    {strings.signup_error_password}
                  </Text>
                </View>
              )
            ) : null}
            <View
              style={[
                styles.rePwFldStyle,
                checkPwAccess
                  ? checkPw
                    ? {borderBottomColor: colors.azure}
                    : {borderBottomColor: colors.coral}
                  : null,
              ]}>
              <Text style={styles.rePwText}>
                {strings.profile_label_reenterpassword}
              </Text>
              <View style={styles.rePwTextInputStyle}>
                <Image source={require('../../../../Assets/img/icLock.png')} />
                <TextInput
                  style={styles.rePwTextInput}
                  placeholder={strings.profile_input_reenterpassword}
                  placeholderTextColor={colors.brownGrey}
                  onChangeText={(text) => setPw2(text.trim())}
                  secureTextEntry={secureRePw}
                />
                <TouchableOpacity
                  style={styles.icVisibilityHidden}
                  onPress={() => setSecureRePw((prevState) => !prevState)}>
                  <Image
                    source={
                      secureRePw
                        ? require('../../../../Assets/img/icVisibilityHidden.png')
                        : require('../../../../Assets/img/iconsIcVisibilityVisible.png')
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
            <View style={styles.restFldViewStyle}>
              <View style={styles.closeAccAndLogOut}>
                <TouchableOpacity onPress={() => showCloseAccountAlertWindow()}>
                  <Text style={styles.closeAccount}>
                    {strings.profile_button_deleteaccount}
                  </Text>
                </TouchableOpacity>
                <Modal
                  isVisible={closeAccountAlert}
                  onBackdropPress={() => setCloseAccountAlert(false)}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalCancel}>
                      <TouchableOpacity
                        onPress={() => setCloseAccountAlert(false)}>
                        <Image
                          source={require('../../../../Assets/img/icCancel.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalHeaderTextView}>
                      <Text style={styles.modalHeaderText}>
                        {strings.profile_popup_deleteaccount_title}
                      </Text>
                    </View>
                    <View style={styles.modalSubTextView}>
                      <Text style={styles.modalSubText}>
                        {strings.profile_popup_deleteaccount_contents}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity onPress={() => closeAccount()}>
                        <View
                          style={[
                            styles.modalButton,
                            {backgroundColor: colors.veryLightPink},
                          ]}>
                          <Text style={styles.modalButtonText}>
                            {strings.profile_popup_deleteaccount_button_delete}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setCloseAccountAlert(false)}>
                        <View style={styles.modalButton}>
                          <Text style={styles.modalButtonText}>
                            {strings.profile_popup_deleteaccount_button_cancel}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                <TouchableOpacity onPress={() => showLogOutAlertWindow()}>
                  <Text style={styles.logOut}>
                    {strings.profile_button_logout}
                  </Text>
                </TouchableOpacity>
                <Modal
                  isVisible={logOutAlert}
                  onBackdropPress={() => setLogOutAlert(false)}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalCancel}>
                      <TouchableOpacity onPress={() => setLogOutAlert(false)}>
                        <Image
                          source={require('../../../../Assets/img/icCancel.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalHeaderTextView}>
                      <Text style={styles.modalHeaderText}>
                        {strings.profile_popup_logout_title}
                      </Text>
                    </View>
                    <View style={styles.modalSubTextView}>
                      <Text style={styles.modalSubText}>
                        {strings.profile_popup_logout_contents}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => signOut(userInfo.userid, userInfo.apiKey)}>
                      <View
                        style={[
                          styles.modalButton,
                          {width: width * 0.8, marginTop: height * 0.08},
                        ]}>
                        <Text style={styles.modalButtonText}>
                          {strings.profile_popup_logout_ok}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
            </View>
            {canUpdate ? (
              <View style={{marginVertical: height * 0.028}}>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: colors.azure}]}
                  onPress={() => modifyProfile()}>
                  <Text style={styles.buttonText}>
                    {strings.profile_button_save}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{marginVertical: height * 0.028}}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>
                    {strings.profile_button_save}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.indicator}>
            <ActivityIndicator
              size="large"
              color={colors.azure}
              style={{marginTop: height * 0.35}}
            />
          </View>
        )}
      </View>
      <Modal isVisible={withdrawalAlert}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeaderTextView}>
            <Text style={styles.modalHeaderText}>
              {strings.profile_popup_deleteaccount_complete_contents}
            </Text>
          </View>
          <TouchableOpacity onPress={() => withdrawalComplete()}>
            <View
              style={[
                styles.modalButton,
                {width: width * 0.8, marginTop: height * 0.08},
              ]}>
              <Text style={styles.modalButtonText}>
                {strings.profile_popup_deleteaccount_complete_ok}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emailFldStyle: {
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
  emailTextInputStyle: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  emailTextInput: {
    width: width * 0.6875,
    marginLeft: 8,
    fontFamily: 'NotoSans',
    color: colors.brownGrey,
  },
  birthFldStyle: {
    flexDirection: 'column',
    width: width * 0.85,
    height: height * 0.0845,
    marginTop: height * 0.0422,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  birthText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  birthTextInputStyle: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  birthTextInput: {width: width * 0.75},
  icMiniarrowBottom: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    width: width * 0.85,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    borderRadius: 15,
    backgroundColor: colors.white,
    // alignItems: 'center',
  },
  genderFldStyle: {
    flexDirection: 'column',
    width: width * 0.85,
    height: height * 0.0845,
    marginTop: height * 0.0422,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  genderText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  genderTextInputStyle: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  genderTextInput: {width: width * 0.75},
  oldPwFldStyle: {
    flexDirection: 'column',
    width: width * 0.85,
    height: height * 0.0845,
    marginTop: height * 0.0422,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  oldPwText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  oldPwTextInputStyle: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  oldPwTextInput: {marginLeft: width * 0.025, width: width * 0.68},
  icVisibilityHidden: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newPwFldStyle: {
    flexDirection: 'column',
    width: width * 0.85,
    height: height * 0.0845,
    marginTop: height * 0.0422,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  newPwText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  newPwTextInputStyle: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  newPwTextInput: {marginLeft: width * 0.025, width: width * 0.68},
  rePwFldStyle: {
    flexDirection: 'column',
    width: width * 0.85,
    height: height * 0.0845,
    marginTop: height * 0.0422,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  rePwText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  rePwTextInputStyle: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  rePwTextInput: {marginLeft: width * 0.025, width: width * 0.68},
  restFldViewStyle: {
    flexDirection: 'column',
    width: width * 0.85,
    height: height * 0.084,
    justifyContent: 'flex-end',
  },
  closeAccAndLogOut: {flexDirection: 'row', justifyContent: 'space-between'},
  closeAccount: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
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
    width: width * 0.9,
    alignItems: 'center',
  },
  modalHeaderText: {fontSize: 22, fontFamily: 'NotoSans', fontWeight: 'bold'},
  modalSubTextView: {
    width: width * 0.75,
    marginTop: height * 0.0281,
  },
  modalSubText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 16,
    color: colors.brownGrey,
  },
  modalButton: {
    width: width * 0.3875,
    height: height * 0.0704,
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
    elevation: 1,
  },
  modalButtonText: {
    fontSize: 14,
    fontFamily: 'NotoSans',
    fontWeight: 'bold',
    color: colors.white,
  },
  logOut: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  button: {
    width: width * 0.85,
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
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.white,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
