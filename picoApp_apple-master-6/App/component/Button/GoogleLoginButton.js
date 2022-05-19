import React, {useState, useEffect, useContext} from 'react';
import {Image, TouchableOpacity, Alert, Platform} from 'react-native';
import {AuthContext, LanguageContext} from '../../context';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {WEB_CLIENT_ID} from '../../../utils/keys';
import uuid from 'react-native-uuid';

export const GoogleLoginButton = () => {
  const {signIn} = useContext(AuthContext);
  const strings = useContext(LanguageContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);

  async function logIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      setIsLoggedIn(true);
      signIn(
        userInfo.user.id,
        '',
        'google',
        Platform.OS,
        uuid.v1(),
        userInfo.user.email,
      );
      setError(null);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // when user cancels sign in process,
        Alert.alert('Process Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // when in progress already
        Alert.alert('Process in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // when play services not available
        Alert.alert('Play services are not available');
      } else {
        // some other error
        Alert.alert(
          strings.google_login_error_title,
          strings.google_login_error_context,
        );
        console.log(error);
        setError(error);
      }
    }
  }

  async function logOut() {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setIsLoggedIn(false);
    } catch (error) {
      Alert.alert('Something else went wrong... ', error.toString());
    }
  }

  function configureGoogleSign() {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      accountName: '',
    });
  }

  useEffect(() => {
    configureGoogleSign();
  }, []);

  if (isLoggedIn)
    return (
      <TouchableOpacity onPress={() => logOut()}>
        <Image source={require('../../../Assets/img/icGoogle.png')} />
      </TouchableOpacity>
    );
  return (
    <TouchableOpacity onPress={() => logIn()}>
      <Image source={require('../../../Assets/img/icGoogle.png')} />
    </TouchableOpacity>
  );
};
