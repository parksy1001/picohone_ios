import React, {useState, useEffect, useMemo, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  AuthContext,
  // FCMTokenContext,
  SignInContext,
  SignInErrorContext,
  UserContext,
  PlaceListContext,
  LocaleContext,
} from '../context';
import {HomeStackScreen} from './Home/HomeStack';
import {AuthStackScreen} from '../Auth/AuthStack';
import {ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import initialPlace from '../src/InitialPlace';
import colors from '../src/colors';

const MainStack = createStackNavigator();
export const MainStackScreen = () => {
  // const fcmToken = useContext(FCMTokenContext);
  const locale = useContext(LocaleContext);

  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [signInState, setSignInState] = useState(true);
  const [signInErrorMessage, setSignInErrorMessage] = useState('');

  const [placeList, setPlaceList] = useState([]);

  const authContext = useMemo(() => {
    return {
      signIn: async (id, pw, sns, pType, pToken, email) => {
        try {
          let response = await fetch(
            'https://us-central1-pico-home.cloudfunctions.net/Login',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: id,
                password: pw,
                kind: sns,
                phoneType: pType,
                phoneToken: pToken,
                email: email,
              }),
            },
          );
          let post = await response.json();
          if (post.Msg === 'success') {
            setSignInState(true);
            setUserToken(post.Info);
            AsyncStorage.setItem('alreadyLogin', JSON.stringify(post.Info));
          } else {
            setSignInState(false);
            setSignInErrorMessage(post.Msg);
          }
        } catch (err) {
          console.error(err);
        }
      },

      signOut: (id, key) => {
        fetch('https://us-central1-pico-home.cloudfunctions.net/Logout', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userid: id,
            apiKey: key,
          }),
        }).catch((error) => {
          console.error(error);
        });
        setUserToken(null);
        AsyncStorage.removeItem('alreadyLogin');
      },
    };
  }, []);

  /*
  const assignFCM = () => {
    fetch(
      'https://us-central1-pico-home.cloudfunctions.net/assignFCMTokenToUser',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fcmToken: fcmToken,
          userid: userToken.userid,
        }),
      },
    )
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((error) => console.error(error));
  };
  */

  useEffect(() => {
    AsyncStorage.getItem('alreadyLogin').then((value) => {
      setUserToken(JSON.parse(value));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('placeList').then((value) => {
      if (value === null) {
        AsyncStorage.setItem('placeList', initialPlace[locale]);
      } else {
        setPlaceList(value.split('/'));
      }
    });
  });

  useEffect(() => {
    if (userToken != null) {
      // assignFCM();
    }
  }, [userToken]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <UserContext.Provider value={userToken}>
        <SignInContext.Provider value={signInState}>
          <SignInErrorContext.Provider value={signInErrorMessage}>
            <PlaceListContext.Provider value={placeList}>
              {!isLoading ? (
                <MainStack.Navigator headerMode="none">
                  {userToken ? (
                    <MainStack.Screen
                      name="Home"
                      component={HomeStackScreen}
                      options={{
                        headerBackTitleStyle: {
                          color: 'transparent',
                        },
                        animationEnabled: false,
                      }}
                    />
                  ) : (
                    <MainStack.Screen
                      name="Auth"
                      component={AuthStackScreen}
                      options={{
                        headerBackTitleStyle: {
                          color: 'transparent',
                        },
                        animationEnabled: false,
                      }}
                    />
                  )}
                </MainStack.Navigator>
              ) : (
                <View style={styles.indicator}>
                  <ActivityIndicator size="large" color={colors.azure} />
                </View>
              )}
            </PlaceListContext.Provider>
          </SignInErrorContext.Provider>
        </SignInContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
