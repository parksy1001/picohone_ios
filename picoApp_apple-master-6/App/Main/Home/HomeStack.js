import React, {useState, useEffect, useContext, useMemo} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  UserContext,
  FirstLaunchContext,
  DeviceContext,
  SettingContext,
  NoticeContext,
  TempContext,
  UserDetailInfoContext,
  LanguageContext,
} from '../../context';
import {Tutorial} from './Tutorial';
import {RealTimeStackScreen} from './RealTime/RealTimeStack';
import {DeviceStackScreen} from './Device/DeviceStack';
import {Setting} from './Setting/Setting';
import {Profile} from './Setting/Profile';
import {Message} from './Message';
import {ConnectStackScreen} from './Connect/ConnectStack';
import {WebViewScreen} from './WebView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../src/colors';

/**
 * Realtime Database에서 정보를 실시간으로 가져오는 로직을 개선하고 싶다.
 * 현재 너무 복잡하다고 생각되어짐ㅠ
 *
 * 정리를 할 필요가 있다.
 *
 * userInfo가 update -> getDeviceState(), getUserDetailInfo() 실행
 * devices가 update -> @@ 등록된 device의 수만큼 getRealtimeAirInfo(i) 실행
 * devices 배열에 저장된 순서대로 i번째 device의 Realtime 수치들을 Load
 * snapshotToArray를 통해서 Realtime 수치를 deviceTempAirInfo에 push
 * Realtime 수치를 읽어오지 못할경우 (snapshot에 null 반환될 경우) 모든 수치를 '0'으로 채우고 deviceTempAirInfo에 push
 * setAirInfoState()를 통해 airInfoState를 deviceTempAirInfo로 update
 * airInfoState가 update -> deviceAirInfo에 i번째 device의 정보와 airInfo를 push
 * setDeviceAndAirInfo()를 통해 deviceAndAirInfo를 deviceAirInfo로 update
 *
 * 10초마다 refresh값 update
 * refresh가 update -> 위의 과정에서 @@ 로 시작하는 부분 부터 반복
 *
 * 아 이거... 구조를 바꿔야 하나ㅠ
 * 입금되었으니 해야할거 같은데....
 *
 ************************************************************************************
 *
 * 새로 개선함
 *
 *
 */
const HomeStack = createStackNavigator();
export const HomeStackScreen = () => {
  const strings = useContext(LanguageContext);
  const firstLaunch = useContext(FirstLaunchContext);
  const userInfo = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(false);
  const [tempMod, setTempMod] = useState(false); // Temperature Mod Change / false : Celsius / true : Fahrenheit
  const [devices, setDevices] = useState([]);
  const [userDetailInfo, setUserDetailInfo] = useState(null);

  // HomeStack의 자식 컴포넌트에서 HomeStack의 함수들을 사용할 수 있게 해줌.
  // settingContext를 호출하기만 하면 하위 컴포넌트 어디서든 memo등록된 함수 호출 가능.
  const settingContext = useMemo(() => {
    return {
      // Notification의 상태 변경
      changeNotification: () => {
        setNotification((prev) => !prev);
      },

      // TempMod false : °C / true : °F 상태 변경
      changeTempMod: () => {
        setTempMod((prev) => !prev);
      },

      // user의 상세 정보를 Load.
      getUserDetailInfo: (id, key) => {
        fetch('https://us-central1-pico-home.cloudfunctions.net/GetProfile', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userid: id, // userInfo.userid,
            apiKey: key, // userInfo.apiKey,
          }),
        })
          .then((response) => response.json())
          .then((res) => setUserDetailInfo(res))
          .catch((error) => {
            console.error(error);
          });
      },

      // 디바이스의 메타데이터 Load.
      // regist time이 없으면 device 순서 조절이 힘들다.
      // api에서 나오는 순서대로 순서가 만들어진다.
      getDeviceState: (id, key) => {
        fetch('https://us-central1-pico-home.cloudfunctions.net/GetDevInfo', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userid: id, // userInfo.userid
            apiKey: key, // userInfo.apiKey
          }),
        })
          .then((response) => response.json())
          .then((res) => setDevices(res.Info.Devices))
          .catch((error) => {
            console.error(error);
          });
      },
    };
  });

  // user에게 등록된 디바이스들의 메타데이터 Load.
  const getDeviceState = () => {
    fetch('https://us-central1-pico-home.cloudfunctions.net/GetDevInfo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userInfo.userid, // userInfo.userid
        apiKey: userInfo.apiKey, // userInfo.apiKey
      }),
    })
      .then((response) => response.json())
      .then((res) => setDevices(res.Info.Devices))
      .catch((error) => {
        console.error(error);
      });
  };

  // user detail info를 호출 후 저장
  const getUserDetailInfo = () => {
    fetch('https://us-central1-pico-home.cloudfunctions.net/GetProfile', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userInfo.userid, // userInfo.userid,
        apiKey: userInfo.apiKey, // userInfo.apiKey,
      }),
    })
      .then((response) => response.json())
      .then((res) => setUserDetailInfo(res))
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // 어플이 실행 되었을 경우 value가 없으면 notification false 설정 및 저장
    // value가 있으면 value값으로 설정
    AsyncStorage.getItem('noticeOn').then((value) => {
      if (value === null) {
        AsyncStorage.setItem('noticeOn', 'false');
      } else {
        if (value === 'true') {
          setNotification(true);
        } else {
          setNotification(false);
        }
      }
    });
    // 어플이 실행 되었을 경우 value가 없으면 Temperature모드 false : '°C'로 설정 및 저장
    // value가 있으면 value값으로 설정
    AsyncStorage.getItem('tempMod').then((value) => {
      if (value === null) {
        AsyncStorage.setItem('tempMod', 'false');
      } else {
        if (value === 'true') {
          setTempMod(true);
        } else {
          setTempMod(false);
        }
      }
    });
  }, []);

  // notification On/Off 설정 불러오기 및 저장
  useEffect(() => {
    if (notification != null) {
      AsyncStorage.setItem('noticeOn', notification.toString());
    }
  }, [notification]);

  // '°F' or '°C' 설정 불러오기 및 저장
  useEffect(() => {
    if (tempMod != null) {
      AsyncStorage.setItem('tempMod', tempMod.toString());
    }
  }, [tempMod]);

  useEffect(() => {
    getDeviceState();
    getUserDetailInfo();
    // 데이터가 정렬될 동안 2초간 기다림
    setTimeout(() => {
      setIsLoading(true);
    }, 2000);
  }, [userInfo]);

  return (
    <SettingContext.Provider value={settingContext}>
      <NoticeContext.Provider value={notification}>
        <TempContext.Provider value={tempMod}>
          <UserDetailInfoContext.Provider value={userDetailInfo}>
            <DeviceContext.Provider value={devices}>
              {isLoading ? (
                <HomeStack.Navigator>
                  {firstLaunch ? (
                    <HomeStack.Screen
                      name="Tutorial"
                      component={Tutorial}
                      options={{headerShown: false}}
                    />
                  ) : null}
                  <HomeStack.Screen
                    name="RealTime"
                    component={RealTimeStackScreen}
                    options={{
                      headerBackTitleStyle: {
                        color: 'transparent',
                      },
                      headerShown: false,
                    }}
                  />
                  <HomeStack.Screen
                    name="DeviceStack"
                    component={DeviceStackScreen}
                    options={{
                      headerShown: false,
                      headerBackTitleStyle: {
                        color: 'transparent',
                      },
                    }}
                  />
                  <HomeStack.Screen
                    name="Setting"
                    component={Setting}
                    options={{
                      title: strings.setting_title,
                      headerTransparent: true,
                      headerTitleAlign: 'center',
                      headerTitleStyle: {
                        fontFamily: 'NotoSans',
                      },
                      headerBackTitleStyle: {
                        color: 'transparent',
                      },
                      headerBackImage: () => (
                        <Image
                          style={{marginLeft: width * 0.05}}
                          source={require('../../../Assets/img/icArrowLeft.png')}
                        />
                      ),
                    }}
                  />
                  <HomeStack.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                      title: strings.profile_title,
                      headerStyle: {
                        shadowColor: 'transparent',
                        elevation: 0,
                      },
                      headerTitleAlign: 'center',
                      headerTitleStyle: {
                        fontFamily: 'NotoSans',
                      },
                      headerBackTitleStyle: {
                        color: 'transparent',
                      },
                      headerBackImage: () => (
                        <Image
                          style={{marginLeft: width * 0.05}}
                          source={require('../../../Assets/img/icArrowLeft.png')}
                        />
                      ),
                    }}
                  />
                  <HomeStack.Screen
                    name="ConnectStack"
                    component={ConnectStackScreen}
                    options={{
                      headerBackTitleStyle: {
                        color: 'transparent',
                      },
                      headerShown: false,
                    }}
                  />
                  <HomeStack.Screen
                    name="Message"
                    component={Message}
                    options={{
                      title: 'Message',
                      headerTransparent: true,
                      headerTitleAlign: 'center',
                      headerTitleStyle: {
                        fontFamily: 'NotoSans',
                      },
                      headerBackTitleStyle: {
                        color: 'transparent',
                      },
                      headerBackImage: () => (
                        <Image
                          style={{marginLeft: width * 0.05}}
                          source={require('../../../Assets/img/icArrowLeft.png')}
                        />
                      ),
                    }}
                  />
                  <HomeStack.Screen
                    name="WebView"
                    component={WebViewScreen}
                    options={{
                      headerBackTitleStyle: {
                        color: 'transparent',
                      },
                      headerShown: false,
                    }}
                  />
                </HomeStack.Navigator>
              ) : (
                <View style={styles.indicator}>
                  <ActivityIndicator size="large" color={colors.azure} />
                </View>
              )}
            </DeviceContext.Provider>
          </UserDetailInfoContext.Provider>
        </TempContext.Provider>
      </NoticeContext.Provider>
    </SettingContext.Provider>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
