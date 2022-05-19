import React, {useState, useContext} from 'react';
import {Image, TouchableOpacity, Platform} from 'react-native';
import {AuthContext} from '../../context';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';
import uuid from 'react-native-uuid';

export const AppleLoginButton = () => {
  const {signIn} = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = useState(false);

  const onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL],
    });

    // get current authentication state for user
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // console.log(appleAuthRequestResponse);

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      const {identityToken, email, user} = appleAuthRequestResponse;

      let decoded = jwt_decode(identityToken);
      // console.log(decoded);

      signIn(decoded.sub, '', 'apple', Platform.OS, uuid.v1(), decoded.email);
      setLoggedIn(true);
    }
  };

  /*
  if (loggedIn)
    return (
      <TouchableOpacity onPress={() => logOut()}>
        <Image source={require('../../../Assets/img/appleIcon.png')} />
      </TouchableOpacity>
    );
  */

  return (
    <TouchableOpacity onPress={() => onAppleButtonPress()}>
      <Image source={require('../../../Assets/img/appleIcon.png')} />
    </TouchableOpacity>
  );
};
