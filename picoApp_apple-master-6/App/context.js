import React from 'react';

export const FCMTokenContext = React.createContext();

/**
 *  FirstLaunchContext
 *
 *  어플이 처음 실행되었는지 아닌지 저장
 *  처음 실행되었을 경우 true
 *  한 번이라도 실행되었을 경우 false
 *
 */
export const FirstLaunchContext = React.createContext();

/**
 *  LanguageContext
 *
 *  사용자의 핸드폰 Locale Language로
 *  어플의 Language Setting
 *
 */
export const LanguageContext = React.createContext();
export const LocaleContext = React.createContext();

/*
export const FontFamilyContext = React.createContext();
*/
export const PlaceListContext = React.createContext();

export const SignUpContext = React.createContext();

export const NewUserInfoContext = React.createContext();
export const NewUserPWContext = React.createContext();
export const NewUserIdContext = React.createContext();

export const AuthContext = React.createContext();
export const SignInContext = React.createContext();
export const SignInErrorContext = React.createContext();

/**
 *  UserContext
 *
 *  userToken의 값 저장
 *  userInfo.userid
 *  userInfo.apiKey
 *
 */
export const UserContext = React.createContext();

/**
 *  DeviceContext
 *
 *  HomeStack에서 Home을 RealTimeStack으로 분리
 *  deviceAndAirInfo가 Home과 ViewAll에서만 사용됨
 *  따라서 DeviceStack의 컴포넌트들이 Device의 정보가 필요
 *  Device의 정보를 담는 Context 생성
 *
 *  .DeviceId
 *  .Description
 *  .PicoName
 *  .ModelName
 *  .SerialNum
 *  .FirmwareVersion
 *
 */
export const DeviceContext = React.createContext();

/**
 *  DeviceAndAirInfoContext
 *
 *  1. device의 정보
 *  2. device가 Realtime으로 저장하는 airInfo
 *  위의 두가지 정보를 가지고 있다.
 *  RealTimeStack에서만 사용됨.
 *  Home과 ViewAll에서 쓰임
 *
 *  .Id // DB에서 불러온 순서의 Index
 *  .DeviceId
 *  .Description
 *  .PicoName
 *  .ModelName
 *  .SerialNum
 *  .FirmwareVersion
 *  .stateInfo.Pm25
 *            .Pm10
 *            .temp
 *            .humd
 *            .co2
 *            .vocs
 *
 */
export const DeviceAndAirInfoContext = React.createContext();

/**
 *  SnapShotAndCountContext
 *
 *  device가 realtime database에서 불러온 SnapShot저장
 *  realtime database에서 불러오지 못할 경우 count + 1
 *  count가 5이상이면 (2초마다 1씩 증가하므로 총 10초간 데이터를 불러오지 못하면)
 *  internet연결이 되어있지 않은것으로 판단
 *
 */
export const SnapShotAndCountContext = React.createContext();

export const OnlineContext = React.createContext();

/**
 *  SettingContext
 *
 *  memo되어있는 function
 *  1. changeNotification
 *  2. changeTempMod
 *  3. getUserDetailInfo
 *  4. getDeviceState
 *
 *  Notification On/Off
 *  Temperature °F/°C
 *  유저 상세정보 Load
 *  유저가 가지고 있는 기기들의 메타 데이터 Load
 *
 */
export const SettingContext = React.createContext();

/**
 *  NoticeContext
 *
 *  Notification On인지 Off인지 저장
 *  true가 On, false가 Off
 *
 */
export const NoticeContext = React.createContext();

/**
 *  TempContext
 *
 *  '°F' or '°C'인지 저장
 *  true가 화씨 false가 섭씨
 *
 */
export const TempContext = React.createContext();

/**
 *  PicoContext
 *
 *  device가 저장된 순서대로 부여받은 Id 저장
 *
 */
export const PicoContext = React.createContext();

export const StateContext = React.createContext();
export const StateExplainContext = React.createContext();

export const TempChartContext = React.createContext();
export const HumChartContext = React.createContext();

export const UserDetailInfoContext = React.createContext();

/**
 *  BackToFromContext
 *
 *  Scan 페이지가 AuthStack에 있으면 'SignIn'저장
 *  Scan 페이지가 ConnectStack에 있으면 'Connect'저장
 *
 */
export const BackToFromContext = React.createContext();
