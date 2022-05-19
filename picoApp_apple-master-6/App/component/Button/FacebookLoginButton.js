import React, {useState, useContext} from 'react';
import {Image, TouchableOpacity, Platform} from 'react-native';
import {AuthContext} from '../../context';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import uuid from 'react-native-uuid';

export const FacebookLoginButton = () => {
  const {signIn} = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = useState(false);

  if (Platform.OS === 'android') {
    LoginManager.setLoginBehavior('web_only');
  }

  function login() {
    LoginManager.logInWithPermissions(['email', 'public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('login is cancelled.');
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            const accessToken = data.accessToken;
            const responseInfoCallback = (error, result) => {
              if (error) {
                console.log('Error fetching data=', error);
              } else {
                signIn(
                  result.id,
                  '',
                  'facebook',
                  Platform.OS,
                  uuid.v1(),
                  result.email,
                );
                setLoggedIn(true);
              }
            };
            const infoRequest = new GraphRequest(
              '/me',
              {
                accessToken,
                parameters: {
                  fields: {
                    string: 'email,id',
                  },
                },
              },
              responseInfoCallback,
            );
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      function (error) {
        logout();
      },
    );
  }

  function logout() {
    LoginManager.logOut();
    setLoggedIn(false);
  }

  if (loggedIn)
    return (
      <TouchableOpacity onPress={logout}>
        <Image source={require('../../../Assets/img/icFacebook.png')} />
      </TouchableOpacity>
    );
  return (
    <TouchableOpacity onPress={login}>
      <Image source={require('../../../Assets/img/icFacebook.png')} />
    </TouchableOpacity>
  );
};
