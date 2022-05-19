import React /*{useState, useEffect, useCallback}*/ from 'react';
import {StatusBar, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {RootStackScreen} from './RootStack';
// import messaging from '@react-native-firebase/messaging';

LogBox.ignoreAllLogs(); // warning, error 메시지 무시

function App() {
  /*
  const [fcmToken, setFcmToken] = useState(null);

  // get user FCM Token
  const getFcmToken = async () => {
    let token = await messaging().getToken();
    if (token) {
      //console.log(fcmToken);
      console.log('Your Firebase Token is:', token);
      setFcmToken(token);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  // FCM request permission
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFcmToken(); //<---- Add this
      console.log('Authorization status:', authStatus);
    }
  };

  // FCM listener
  const foregroundListener = useCallback(() => {
    messaging().onMessage(async (message) => {
      console.log(message);
    });
  }, []);

  useEffect(() => {
    foregroundListener();
  }, []);

  // application 실행시 1초간 loading
  useEffect(() => {
    requestUserPermission();
  }, []);
  */

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <RootStackScreen />
    </NavigationContainer>
  );
}

export default App;
