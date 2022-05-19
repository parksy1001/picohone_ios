import React, {useState, useContext} from 'react';
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
  Platform,
} from 'react-native';
import colors from '../src/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import {NewUserInfoContext} from '../context';

export const SignUp2 = ({navigation}) => {
  var userInfo = useContext(NewUserInfoContext);

  const [userName, setUserName] = useState(null);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [gender, setGender] = useState('gender');
  const [showGender, setShowGender] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const togglePicker = () => {
    setShowGender((prev) => !prev);
  };

  const setGenderValue = (gender) => {
    setGender(gender);
    setShowGender((prev) => !prev);
  };

  function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
  }

  const checkSignUp = () => {
    if (userName) {
      if (date) {
        if (gender) {
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
  };

  const updateProfile = async () => {
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
            userid: userInfo.userid, // userInfo.userid,
            apiKey: userInfo.apiKey, // userInfo.apiKey,
            name: userName,
            gender: gender,
            birthday: date,
            notification: 'Yes',
            currentPassword: '',
            newPassword: '',
          }),
        },
      );
      let post = await response.json();
      if (post.Msg === 'success') {
        console.log('SignUp complete!');
        navigation.navigate('SignIn');
      } else {
        console.log(post.Msg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const goSignUp = () => {
    updateProfile();
  };

  const signUpOk = checkSignUp();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.fldViewStyle}>
          <Text style={styles.userText}>User name</Text>
          <View style={styles.userTextInputView}>
            <Image source={require('../../Assets/img/icUser.png')} />
            <TextInput
              style={styles.userTextInputStyle}
              onChangeText={(text) => setUserName(text)}
              placeholder="User name"
            />
          </View>
        </View>
        <TouchableOpacity style={styles.fldViewStyle} onPress={showDatepicker}>
          <Text style={styles.birthText}>Birth</Text>
          <View style={styles.birthTextInputView}>
            <Text style={styles.birthTextInputStyle}>
              {replaceAll(date.toLocaleDateString(), '/', '.')}
            </Text>
            <View style={styles.icVisibilityHidden}>
              <Image
                source={require('../../Assets/img/icMiniarrowBottom.png')}
              />
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                locale="en-us"
                value={date}
                mode={mode}
                dateFormat="month day year"
                is24Hour={true}
                display="spinner"
                onChange={onChange}
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fldViewStyle}
          onPress={() => togglePicker()}>
          <Text style={styles.genderText}>Gender</Text>
          <View style={styles.genderTextInputView}>
            <Text
              style={[
                styles.genderTextInputStyle,
                gender === 'gender'
                  ? {color: colors.brownGrey}
                  : {color: colors.black},
              ]}>
              {gender}
            </Text>
            <View style={styles.icVisibilityHidden}>
              <Image
                source={require('../../Assets/img/icMiniarrowBottom.png')}
              />
            </View>
          </View>
          <Modal isVisible={showGender} onBackdropPress={() => togglePicker()}>
            <View
              style={{
                backgroundColor: '#efefef',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setGenderValue('male')}
                style={{paddingTop: 8, paddingBottom: 8}}>
                <Text>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGenderValue('female')}
                style={{paddingTop: 8, paddingBottom: 8}}>
                <Text>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGenderValue('neutral')}
                style={{paddingTop: 8, paddingBottom: 8}}>
                <Text>Neutral</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => togglePicker()}
                style={{paddingTop: 8, paddingBottom: 8}}>
                <Text style={{color: '#999'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </TouchableOpacity>
        {signUpOk ? (
          <View style={styles.buttonNextView}>
            <TouchableOpacity
              style={[styles.buttonStyle, {backgroundColor: colors.azure}]}
              onPress={() => goSignUp()}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.buttonStyle}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        )}
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
});
