import React, {useState, useMemo, useContext} from 'react';
import {Dimensions, Image, TouchableOpacityComponent} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  SignUpContext,
  NewUserPWContext,
  NewUserIdContext,
  LanguageContext,
} from '../context';
import {SignIn} from './SignIn';
import {ChangePassword} from './ChangePw';
import {CreateAccount} from './CreateAccount';
import {SignUp1} from './SignUp1';
import {SignUp2} from './SignUp2';
import {Scan} from './Scan';
import FindPicoToScan from './FindPicoToScan';
import colors from '../src/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { WebViewScreen } from '../Main/Home/WebView';

const AuthStack = createStackNavigator();
export const AuthStackScreen = ({navigation}) => {
  const strings = useContext(LanguageContext);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const signUpContext = useMemo(() => {
    return {
      setIdPw: (id, pw) => {
        setId(id);
        setPw(pw);
      },
      signUp: async (id, pw) => {
        try {
          let response = await fetch(
            'https://us-central1-pico-home.cloudfunctions.net/SignUp',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: id,
                password: pw,
              }),
            },
          );
          let post = await response.json();
          if (post.Msg === 'success') {
            navigation.navigate('CreateAccount');
            return { emailExist: false }
          } else if (post.Msg === 'User id is aleady existed.'){
            return { emailExist: true }
          }
        } catch (err) {
          console.error("SignUp", err);
        }
      },
    };
  });

  return (
    <SignUpContext.Provider value={signUpContext}>
      <NewUserIdContext.Provider value={id}>
        <NewUserPWContext.Provider value={pw}>
          <AuthStack.Navigator>
            <AuthStack.Screen
              name="SignIn"
              component={SignIn}
              options={{headerShown: false}}
            />
            <AuthStack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{
                title: strings.changepw_title,
                headerStyle: {
                  borderBottomWidth: 0,
                  backgroundColor: colors.white,
                  shadowOpacity: 0,
                  elevation: 0,
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: 'NotoSans',
                  fontWeight: '800',
                  fontStyle: 'normal',
                },
                headerBackTitleStyle: {
                  color: 'transparent',
                },
                headerBackImage: () => (
                  <Image
                    style={{marginLeft: width * 0.05}}
                    source={require('../../Assets/img/icArrowLeft.png')}
                  />
                ),
              }}
            />
            <AuthStack.Screen
              name="SignUp1"
              component={SignUp1}
              options={{
                title: strings.signup_title,
                headerStyle: {
                  borderBottomWidth: 0,
                  backgroundColor: colors.white,
                  shadowOpacity: 0,
                  elevation: 0,
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: 'NotoSans',
                  fontWeight: '800',
                  fontStyle: 'normal',
                },
                headerBackTitleStyle: {
                  color: 'transparent',
                },
                headerBackImage: () => (
                  <Image
                    style={{marginLeft: width * 0.05}}
                    source={require('../../Assets/img/icArrowLeft.png')}
                  />
                ),
              }}
            />
            <AuthStack.Screen
              name="CreateAccount"
              component={CreateAccount}
              options={{
                title: strings.confirmemail_title,
                headerTransparent: 'true',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: 'NotoSans',
                  fontWeight: '800',
                  fontStyle: 'normal',
                },
                headerBackTitleStyle: {
                  color: 'transparent',
                },
                headerBackImage: () => (
                  <Image
                    style={{marginLeft: width * 0.05}}
                    source={require('../../Assets/img/icArrowLeft.png')}
                  />
                ),
              }}
            />
            <AuthStack.Screen
              name="SignUp2"
              component={SignUp2}
              options={{
                title: 'Sign Up',
                headerStyle: {
                  borderBottomWidth: 0,
                  backgroundColor: colors.white,
                  shadowOpacity: 0,
                  elevation: 0,
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: 'NotoSans',
                  fontWeight: '800',
                  fontStyle: 'normal',
                },
                headerBackTitleStyle: {
                  color: 'transparent',
                },
                headerBackImage: () => (
                  <Image
                    style={{marginLeft: width * 0.05}}
                    source={require('../../Assets/img/icArrowLeft.png')}
                  />
                ),
              }}
            />
            <AuthStack.Screen
              name="FindPicoToScan"
              component={FindPicoToScan}
              options={{
                title: strings.wifisetting_1_title,
                headerStyle: {
                  borderBottomWidth: 0,
                  backgroundColor: colors.white,
                  shadowOpacity: 0,
                  elevation: 0,
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: 'NotoSans',
                  fontWeight: '800',
                  fontStyle: 'normal',
                },
                headerBackTitleStyle: {
                  color: 'transparent',
                },
                headerBackImage: () => (
                  <Image
                    style={{marginLeft: width * 0.05}}
                    source={require('../../Assets/img/icArrowLeft.png')}
                  />
                ),
              }}
            />
            <AuthStack.Screen
              name="Scan"
              component={Scan}
              options={
                //==
                {gestureEnabled:false},
                {title: strings.scan_title,
                headerTransparent: 'true',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: 'NotoSans',
                  fontWeight: '800',
                  fontStyle: 'normal',
                },
              
                headerBackTitleStyle: {
                  color: 'transparent',
                },
                
                headerBackImage: () => null,
                headerLeft: () => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('SignIn')}>
                    <Image
                      style={{marginLeft: width * 0.05}}
                      source={require('../../Assets/img/icArrowLeft.png')}
                    />
                  </TouchableOpacity>
                ),
              
            }}
            />
            <AuthStack.Screen
              name="WebView"
              component={WebViewScreen}
              options={{
                title: "",
                headerStyle: {
                  borderBottomWidth: 0,
                  backgroundColor: colors.white,
                  shadowOpacity: 0,
                  elevation: 0,
                },
                headerBackTitleStyle: {
                  color: 'transparent',
                },
                headerBackImage: () => (
                  <Image
                    style={{marginLeft: width * 0.05}}
                    source={require('../../Assets/img/icArrowLeft.png')}
                  />
                ),
              }}
            />
          </AuthStack.Navigator>
        </NewUserPWContext.Provider>
      </NewUserIdContext.Provider>
    </SignUpContext.Provider>
  );
};

const {width} = Dimensions.get('window');
