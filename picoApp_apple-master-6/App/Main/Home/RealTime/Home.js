import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  NativeModules,
  Linking
} from 'react-native';
import {
  AuthContext,
  UserContext,
  DeviceAndAirInfoContext,
  TempContext,
  SnapShotAndCountContext,
  LanguageContext,
  DeviceContext,
  OnlineContext,
  LocaleContext,
} from '../../../context';
import useCheckFirmwareVersion from '../../../src/hook/useCheckFirmwareVersion';
import LinearGradient from 'react-native-linear-gradient';
import BitSwiper from 'react-native-bit-swiper';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import Modal from 'react-native-modal';
import colors from '../../../src/colors';
import cal from '../../../src/calculate';
import cnt from '../../../src/constant';
import {useStateCallbackAfter500} from '../../../src/hook/useStateCallback';

export const Home = ({navigation}) => {
  const strings = useContext(LanguageContext);
  const isOnline = useContext(OnlineContext);
  const locale = useContext(LocaleContext);

  Geocoder.init('AIzaSyADiif-VkiHzwaWfz1RsvoWF5ZjhdGfmpo', {
    language: locale,
  });

  const devices = useContext(DeviceContext);
  const deviceAndAirInfo = useContext(DeviceAndAirInfoContext);
  // const deviceAndAirInfo = [
  //   {stateInfo: {"co2": 464, "humid": 53, "Lat": "", "Lng": "", "pm10": 7, "pm25": 10, "ReportTime": "20220613125200", "Temperature": "27.4", "vocs": 11, "dataType": "M", "ip": "172.30.1.9", "myreport": "2022-06-13 21:52:00", "serialNum": "AC67B25CC392"}},
  //   {stateInfo: {"co2": 464, "humid": 53, "Lat": "", "Lng": "", "pm10": 7, "pm25": 10, "ReportTime": "20220613125200", "Temperature": "27.4", "vocs": 11, "dataType": "M", "ip": "172.30.1.9", "myreport": "2022-06-13 21:52:00", "serialNum": "AC67B25CC392"}},
  // ]
  const snapShotAndCount = useContext(SnapShotAndCountContext);
  const tempMod = useContext(TempContext);
  const userInfo = useContext(UserContext);
  const { signOut } = useContext(AuthContext);
  
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [addressName, setAddressName] = useState('-');
  
  const [date, setDate] = useState(new Date());
  const [amPm, setAmPm] = useState('AM');
  const [publicAirInfo, setPublicAirInfo] = useState(null);
  
  const [publicStateInfo, setPublicStateInfo] = useState(null);
  const [publicPm25, setPublicPm25] = useState(0);
  const [publicPm10, setPublicPm10] = useState(0);
  const [publicO3, setPublicO3] = useState(0);
  const [publicPollenTree, setPublicPollenTree] = useState(0);
  const [publicPollenWeed, setPublicPollenWeed] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [pollenExplain, setPollenEx] = useState(false);
  const [isOffLine, setIsOffLine] = useState(false);
  
  const [connectInfo, setConnectInfo]= useStateCallbackAfter500(false);
  const [isFirmwareUpdate, setIsFirmwareUpdate] = useStateCallbackAfter500(false);
  const [isForcedLogout, setIsForcedLogout] = useStateCallbackAfter500(false);
  
  const [getLatestFirmwareVersion, getDeviceFirmwareVersion] = useCheckFirmwareVersion()

  const compareFirmwareVersion = async (id) => {
    const latestVersion = await getLatestFirmwareVersion(id)
    const verson = await getDeviceFirmwareVersion(id)

    return ((latestVersion > verson) || (latestVersion < verson))
  }
  const isShowFirmwareUpdate = async () => {
    let isLatestVersion = true

    await Promise.all(devices.map(async (_, id) => {
      isLatestVersion = await compareFirmwareVersion(id)
    }))
    
    setIsFirmwareUpdate(!isLatestVersion)
  }

  function open_WhatsApp() {
 
    Linking.openURL("https://apps.apple.com/kr/app/picohome/id1330540218");

  }

  // 1초 마다 Screen render
  // Hour와 Minute 갱신을 위해서 사용
  // 인터넷이 연결되어 있는지 1초마다 확인
  function tick() {
    setDate(new Date());
    makeAmPm();
  }

  // Hour값이 12보다 작으면 'AM'반환
  // Hour값이 12보다 크면 'PM'반환
  function makeAmPm() {
    if (date.getHours() < 12) {
      setAmPm('AM');
    } else {
      setAmPm('PM');
    }
  }

  // Month와 Day정보 return
  function monthAndDay() {
    let month = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    let monthIdx = date.getMonth();
    let dayIdx = leadingZeros(date.getDate(), 2);
    let s = month[monthIdx] + '.' + dayIdx;
    return s;
  }

  // 한자리 수 숫자일 경우 십의 자리 수에 0추가
  function leadingZeros(n, digits) {
    let zero = '';
    n = n.toString();
    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++) zero += '0';
    }
    return zero + n;
  }

  /*
   *  publicAirInfo의 Pm25를 기준
   *  Background의 color 색상 변경
   *  Background Layer1과 Layer2의 색상 변경
   *  4가지 상태 변화 존재
   *  Good : colors.azure
   *  Moderate : colors.darkLimeGreen
   *  Bad : colors.lightOrange
   *  Very Bad : colors.coral
   */

  // Background color값 반환
  const getBackgroundState = value => {
    if (cal.boundaryPM25(value) === cnt.PM25_GOOD)
      return 'rgba(0, 172, 255, 0.3)';
    else if (cal.boundaryPM25(value) === cnt.PM25_MOD)
      return 'rgba(121, 191, 0, 0.3)';
    else if (cal.boundaryPM25(value) === cnt.PM25_BAD)
      return 'rgba(255, 160, 64, 0.3)';
    else if (cal.boundaryPM25(value) === cnt.PM25_VERY_BAD)
      return 'rgba(252, 83, 69, 0.3)';
  };

  // Background Layer1의 color에 해당하는 이미지 반환
  const getBackWaveLayerState1 = value => {
    if (cal.boundaryPM25(value) === cnt.PM25_GOOD)
      return require('../../../../Assets/img/waveLayerGood1.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_MOD)
      return require('../../../../Assets/img/waveLayerModerate1.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_BAD)
      return require('../../../../Assets/img/waveLayerBad1.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_VERY_BAD)
      return require('../../../../Assets/img/waveLayerVeryBad1.png');
  };

  // Background Layer2의 color에 해당하는 이미지 반환
  const getBackWaveLayerState2 = value => {
    if (cal.boundaryPM25(value) === cnt.PM25_GOOD)
      return require('../../../../Assets/img/waveLayerGood2.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_MOD)
      return require('../../../../Assets/img/waveLayerModerate2.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_BAD)
      return require('../../../../Assets/img/waveLayerBad2.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_VERY_BAD)
      return require('../../../../Assets/img/waveLayerVeryBad2.png');
  }

  // public Pm25의 color값 반환
  const getPublicPm25TextColor = value => {
    if (cal.boundaryPM25(value) === cnt.PM25_GOOD)
      return { color: colors.azure };
    else if (cal.boundaryPM25(value) === cnt.PM25_MOD)
      return { color: colors.darkLimeGreen };
    else if (cal.boundaryPM25(value) === cnt.PM25_BAD)
      return { color: colors.lightOrange };
    else if (cal.boundaryPM25(value) === cnt.PM25_VERY_BAD)
      return { color: colors.coral };
  };

  // public Pm10의 color값 반환
  const getPublicPm10TextColor = (props) => {
    if (0 <= props && props <= 30) {
      return {color: colors.azure};
    } else if (31 <= props && props <= 80) {
      return {color: colors.darkLimeGreen};
    } else if (81 <= props && props <= 150) {
      return {color: colors.lightOrange};
    } else {
      return {color: colors.coral};
    }
  };

  // public Ozone의 color값 반환
  // Ozone의 ppb기준 상태 수치 필요 (현재는 임의 설정)
  const getPublicO3TextColor = (props) => {
    if (0 <= props && props <= 50) {
      return {color: colors.azure};
    } else if (51 <= props && props <= 100) {
      return {color: colors.darkLimeGreen};
    } else if (101 <= props && props <= 150) {
      return {color: colors.lightOrange};
    } else {
      return {color: colors.coral};
    }
  };

  // public Pollen_Tree의 color값 반환
  const getPublicPollenTreeTextColor = (props) => {
    if (props === null) {
      return {color: colors.blueGrey};
    } else if (props === 0 || props === 1) {
      return {color: colors.azure};
    } else if (props === 2) {
      return {color: colors.darkLimeGreen};
    } else if (props === 3 || props === 4) {
      return {color: colors.lightOrange};
    } else {
      return {color: colors.coral};
    }
  };

  // public Pollen_Weed의 color값 반환
  const getPublicPollenWeedTextColor = (props) => {
    if (props === null) {
      return {color: colors.blueGrey};
    } else if (props === 0 || props === 1) {
      return {color: colors.azure};
    } else if (props === 2) {
      return {color: colors.darkLimeGreen};
    } else if (props === 3 || props === 4) {
      return {color: colors.lightOrange};
    } else {
      return {color: colors.coral};
    }
  };

  // 현재 위치의 Temperature/Humid/Uv 정보를 가저온다.
  function getPublicWeatherInfo() {
    fetch(
      'https://us-central1-pico-home.cloudfunctions.net/GetPublicWeatherInfo',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userInfo.userid, // userInfo.userid,
          latitude: latitude,
          longitude: longitude,
          apiKey: userInfo.apiKey, // userInfo.apiKey,
        }),
      },
    )
      .then((response) => response.json())
      .then((res) => {
        if (res.Status === 'ERROR' && res.Msg === 'err_invalid_api_key')
          setIsForcedLogout(true)
        else
          setPublicAirInfo(res)
      })
      .catch((error) => {
        //console.error(error);
      });
  }

  // Device의 Pm25 측정 값 상태 반환
  const getHomeState = value => {
    if (cal.boundaryPM25(value) === cnt.PM25_GOOD)
      return strings.main_state_good;
    else if (cal.boundaryPM25(value) === cnt.PM25_MOD)
      return strings.main_state_moderate;
    else if (cal.boundaryPM25(value) === cnt.PM25_BAD)
      return strings.main_state_poor;
    else if (cal.boundaryPM25(value) === cnt.PM25_VERY_BAD)
      return strings.main_state_verypoor;
  };

  // Device의 Pm25 측정 값에 해당하는 Device Background 이미지 반환
  const getHomeSource = value => {
    if (cal.boundaryPM25(value) === cnt.PM25_GOOD)
      return require('../../../../Assets/img/imgHouseBlue.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_MOD)
      return require('../../../../Assets/img/imgHouseGreen.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_BAD)
      return require('../../../../Assets/img/imgHouseOrange.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_VERY_BAD)
      return require('../../../../Assets/img/imgHouseRed.png');
  };

  // Device의 Pm25 측정 값에 해당하는 Picohome 이미지 반환
  const getPicoHomeSource = value => {
    if (cal.boundaryPM25(value) === cnt.PM25_GOOD)
      return require('../../../../Assets/img/imgPicohomeGood.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_MOD)
      return require('../../../../Assets/img/imgPicohomeModerate.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_BAD)
      return require('../../../../Assets/img/imgPicohomeBad.png');
    else if (cal.boundaryPM25(value) === cnt.PM25_VERY_BAD)
      return require('../../../../Assets/img/imgPicohomeVerybad.png');
  };

  // 현재 위치의 위도(latitude), 경도(longitude)값 설정
  // 현재 위치의 위,경도를 기준으로 Temperature/Humid/Ozone 설정
  useEffect(() => {
    isShowFirmwareUpdate()

    Geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  // 현재 위치의 위,경도 값을 기준으로 주소지 설정
  useEffect(() => {
    if (latitude != null && longitude != null) {
      getPublicWeatherInfo(); // Temperature/Humid/Ozone 설정
      Geocoder.from(latitude, longitude)
        .then((res) => {
          let position = res.results[0].address_components;
          let len = res.results[0].address_components.length;
          //console.log(len);
          let address = '';
          for (let i = len - 3; i >= len-5; i--) {
            if (i === len-5) {
              address += position[i].long_name;
              break;
            }
            address = address + position[i].long_name + ' ';
          }
          setAddressName(address); // 주소지 설정
        })
        .catch((error) => console.warn(error));
    }
  }, [latitude, longitude]);

  // 주소지가 설정되었을 때를 기준 위,경도 값으로
  // 현재 위치의 Pm25/Pm10/Ozone값을 담은 PublicStateInfo 설정
  useEffect(() => {
    if (latitude != null && longitude != null) {
      let url =
      'https://api.tomorrow.io/v4/timelines?location=' +
      latitude +
      ',' +
      longitude +
      '&fields=particulateMatter25,particulateMatter10,pollutantO3,treeIndex,weedIndex&timesteps=current&units=metric&apikey=pyZzjTuiJMvG8VZSfF9PqPxXXPlizgo5';
      fetch(url)
        .then((response) => response.json())
        .then((responseJson) => setPublicStateInfo(responseJson));
    }
  }, [addressName]);

  // PublicStateInfo가 설정되면
  // 내부의 Pm25/Pm10/Ozone값을 각각 설정
  useEffect(() => {
    try{
      setPublicPm25(publicStateInfo.data.timelines[0].intervals[0].values.particulateMatter25);
      setPublicPm10(publicStateInfo.data.timelines[0].intervals[0].values.particulateMatter10);
      setPublicO3(publicStateInfo.data.timelines[0].intervals[0].values.pollutantO3);
      setPublicPollenTree(publicStateInfo.data.timelines[0].intervals[0].values.treeIndex);
      setPublicPollenWeed(publicStateInfo.data.timelines[0].intervals[0].values.weedIndex);
    }catch(exception){
      setPublicPm25(0);
      setPublicPm10(0);
      setPublicO3(0);
      setPublicPollenTree(0);
      setPublicPollenWeed(0);
    }
    
  }, [publicStateInfo]);

  // 1초 마다 Screen rendering
  useEffect(() => {
    let timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  useEffect(() => {


    try {
      fetch('https://pico-home.web.app/version.json', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',//서버로 보낼 때 무엇으로 보내는 것인지 알려줌
        },
        body: JSON.stringify({


        }),
      })
        .then((response) => response.json())
        .then((res) => {

          //console.log(res);
          //console.log(res.version);

        if(res.version != "3.0.16"){
          //console.log("different version");
          setConnectInfo(true);
        }else{
          //console.log("same version");
        }
       });
    } catch (exception) {
      //console.log('ERROR :: ', exception);
    }

    
  }, []);

  useEffect(() => {
    setTimeout(() => {
      //console.log('check');
      setIsLoading(true);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{alignItems: 'center'}}>
          <LinearGradient
            colors={[getBackgroundState(parseInt(publicPm25)), 'transparent']}
            style={styles.linearGradientStyle}></LinearGradient>
          <View style={{position: 'absolute'}}>
            <Image
              style={{width: width, height: height * 0.1}}
              source={getBackWaveLayerState1(parseInt(publicPm25))}
            />
          </View>
          <View style={{position: 'absolute'}}>
            <Image
              style={{width: width, height: height * 0.1}}
              source={getBackWaveLayerState2(parseInt(publicPm25))}
            />
          </View>
          <View style={styles.headerStyle}>
            <View style={styles.headerViewStyle}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={styles.icApps}
                  onPress={() => navigation.navigate('ViewAll')}>
                  <Image
                    source={require('../../../../Assets/img/icApps.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.icComments}
                  onPress={() => navigation.navigate('Message')}>
                  <Image
                    source={require('../../../../Assets/img/icComments.png')}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.icSettings}
                onPress={() => navigation.navigate('Setting')}>
                <Image
                  source={require('../../../../Assets/img/icSettings.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.locationInfoStyle}>
            <View style={styles.locationDateTime}>
              <View style={styles.dateStyle}>
                <Text
                  style={styles.dateText}
                  allowFontScaling={false}
                >
                  {monthAndDay()}
                </Text>
              </View>
              <View style={styles.divider}></View>
              <View style={styles.timeStyle}>
                <Text
                  style={styles.timeText}
                  allowFontScaling={false}
                >
                  {amPm}
                </Text>
                <Text
                  style={styles.timeText}
                  allowFontScaling={false}
                >
                  {leadingZeros(date.getHours(), 2)}
                </Text>
                <Text
                  style={styles.timeText}
                  allowFontScaling={false}
                >
                  {':'}
                </Text>
                <Text
                  style={styles.timeText}
                  allowFontScaling={false}
                >
                  {leadingZeros(date.getMinutes(), 2)}
                </Text>
              </View>
            </View>
            <View style={styles.locationPlaceStyle}>
              <Text
                style={styles.locationPlaceTextStyle}
                allowFontScaling={false}
              >
                {addressName}
              </Text>
              <Image
                style={{marginLeft: 4}}
                source={require('../../../../Assets/img/icMap.png')}
              />
            </View>
            <View style={styles.tempAndHumidityStyle}>
              <Text
                style={styles.temp}
                allowFontScaling={false}
              >
                {publicAirInfo != null
                  ? tempMod
                    ? parseInt(
                        publicAirInfo.Info.WeatherInfo.Temperature * 1.8 + 32,
                      )
                    : parseInt(publicAirInfo.Info.WeatherInfo.Temperature)
                  : '-'}
              </Text>
              <Text
                style={styles.tempMod}
                allowFontScaling={false}
              >
                {tempMod ? '°F' : '°C'}
              </Text>
              <Text
                style={styles.humidity}
                allowFontScaling={false}
              >
                {publicAirInfo ? publicAirInfo.Info.WeatherInfo.Humid : '-'}
              </Text>
              <Text
                style={styles.percent}
                allowFontScaling={false}
              >
                %
              </Text>
            </View>
          </View>
          <View style={styles.stateStyle}>
            <View style={styles.stateViewStyle}>
              <Text
                style={styles.pm25Style}
                allowFontScaling={false}
              >
                {strings.main_label_pm25}
              </Text>
              <View style={styles.pm25StateViewStyle}>
                <Text
                  style={[styles.pm25Layer, getPublicPm25TextColor(parseInt(publicPm25))]}
                  allowFontScaling={false}
                >
                  {parseInt(publicPm25)}
                </Text>
                <Text
                  style={styles.pm25StateUnit}
                  allowFontScaling={false}
                >
                  {strings.main_label_pm_unit}
                </Text>
              </View>
            </View>
            <View style={styles.stateViewStyle}>
              <Text
                style={styles.pm10Style}
                allowFontScaling={false}
              >
                {strings.main_label_pm10}
              </Text>
              <View style={styles.pm10StateViewStyle}>
                <Text
                  style={[styles.pm10Layer, getPublicPm10TextColor(parseInt(publicPm10))]}
                  allowFontScaling={false}
                >
                  {parseInt(publicPm10)}
                </Text>
                <Text
                  style={styles.pm10StateUnit}
                  allowFontScaling={false}
                >
                  {strings.main_label_pm_unit}
                </Text>
              </View>
            </View>
            <View style={styles.stateViewStyle}>
              <Text
                style={styles.ozoneStyle}
                allowFontScaling={false}
              >
                {strings.main_label_ozone}
              </Text>
              <View style={styles.ozoneViewStyle}>
                <Text
                  style={[styles.ozoneLayer, getPublicO3TextColor(publicO3)]}
                  allowFontScaling={false}
                >
                  {parseInt(publicO3)}
                </Text>
                <Text
                  style={styles.ozoneStateUnit}
                  allowFontScaling={false}
                >
                  {strings.main_label_ppb}
                </Text>
              </View>
            </View>
            <View style={styles.stateViewStyle}>
            <Text
                style={styles.pollenStyle}
                allowFontScaling={false}
              >
                {strings.main_label_pollen}
              </Text>
              <View style={styles.pollenViewStyle}>
                {publicPollenTree === null ? (
                  <Text style={styles.pollenText}>-</Text>
                ) : (
                  <Text
                    style={[styles.pollenLayer, getPublicPollenTreeTextColor(publicPollenTree)]}
                    allowFontScaling={false}
                  >
                    {publicPollenTree.toString()}
                  </Text>
                )}
                <Text
                  style={[styles.pollenStateUnit, { marginRight: 2 }]}
                  allowFontScaling={false}
                >
                  /
                </Text>
                {publicPollenWeed === null ? (
                  <Text style={styles.pollenText}>-</Text>
                ) : (
                  <Text
                    style={[styles.pollenLayer, getPublicPollenWeedTextColor(publicPollenWeed)]}
                    allowFontScaling={false}
                  >
                    {publicPollenWeed.toString()}
                  </Text>
                )}
                <Text
                  style={styles.pollenStateUnit}
                  allowFontScaling={false}
                >
                  {strings.main_label_index}
                </Text>
              </View>
            </View>
            <View style={styles.pollenView}>
              <TouchableOpacity onPress={() => setPollenEx(true)}>
                <Image
                  source={require('../../../../Assets/img/icInformation.png')}
                />
              </TouchableOpacity>
            </View>
            <Modal
              isVisible={pollenExplain}
              onBackdropPress={() => setPollenEx(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalCancel}>
                  <TouchableOpacity onPress={() => setPollenEx(false)}>
                    <Image
                      source={require('../../../../Assets/img/icCancel.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalHeaderTextView}>
                  <Text style={styles.modalHeaderText}>
                    {strings.main_popup_pollen_title}
                  </Text>
                </View>
                <View style={styles.modalSubTextView}>
                  <Text style={styles.modalSubText}>
                    {strings.main_popup_pollen_contents_title}
                  </Text>
                  <Text style={styles.modalSubText}></Text>
                  <Text style={[styles.modalSubText, {fontWeight: 'bold'}]}>
                    {strings.main_popup_pollen_contents_text1}
                  </Text>
                  <Text style={styles.modalSubText}>
                    {strings.main_popup_pollen_contents_text2}
                  </Text>
                  <Text style={styles.modalSubText}>
                    {strings.main_popup_pollen_contents_text3}
                  </Text>
                  <Text style={styles.modalSubText}>
                    {strings.main_popup_pollen_contents_text4}
                  </Text>
                  <Text style={styles.modalSubText}>
                    {strings.main_popup_pollen_contents_text5}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setPollenEx(false)}>
                  <View style={[styles.modalButton, {width: width * 0.8}]}>
                    <Text style={styles.modalButtonText}>
                      {strings.main_popup_pollen_button_ok}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
       
          {!isOnline || devices.length === 0 ? (
            <View style={styles.viewBox}>
              <ImageBackground
                source={require('../../../../Assets/img/imgHouseBgShadow.png')}
                style={styles.whiteBox}
                imageStyle={{resizeMode: 'stretch'}}
              >
                <ImageBackground
                  source={require('../../../../Assets/img/imgHouseGrey.png')}
                  style={styles.stateBox}
                  imageStyle={{resizeMode: 'stretch'}}
                >
                  <Image
                    source={require('../../../../Assets/img/imgPicohomeOff.png')}
                    style={styles.picoOff}
                  />
                  <View style={styles.picoInfo}>
                    <Text style={styles.picoOffText}>
                      {strings.main_no_picohome_title}
                    </Text>
                  </View>
                  <View style={(styles.picoStateInfo, styles.picoOffInfo)}>
                    <Text style={styles.picoOffInfoText}>
                      {strings.main_no_picohome_contents}
                    </Text>
                  </View>
                  <View style={styles.connectPico}>
                    <TouchableOpacity
                      style={styles.connectPicoPlus}
                      onPress={() =>
                        isOnline
                          ? navigation.navigate('ConnectStack')
                          : setIsOffLine(true)
                      }>
                      <Image
                        style={styles.icAdd}
                        source={require('../../../../Assets/img/icAdd.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </ImageBackground>
              <Modal
                isVisible={isOffLine}
                onBackdropPress={() => setIsOffLine(false)}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalCancel}>
                    <TouchableOpacity onPress={() => setIsOffLine(false)}>
                      <Image
                        source={require('../../../../Assets/img/icCancel.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalHeaderTextView}>
                    <Text style={styles.modalHeaderText}>
                      {strings.popup_offline_title}
                    </Text>
                  </View>
                  <View style={styles.modalSubTextView}>
                    <Text style={styles.modalSubText}>
                      {strings.popup_offline_contents}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setIsOffLine(false)}>
                    <View style={[styles.modalButton, {width: width * 0.8}]}>
                      <Text style={styles.modalButtonText}>
                        {strings.popup_button_ok}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          ) : (
            <View>
              {devices.length != 0 && deviceAndAirInfo.length != 0 ? (
                <BitSwiper
                  items={deviceAndAirInfo}
                  style={{width: width}}
                  itemWidth="85%" // 활성 아이템의 넓이
                  itemScaleAlign="middle" // 정렬 위치 (top, middle, bottom)
                  inactiveItemScale={0.8} // 비활성 아이템의 스케일
                  inactiveItemOpacity={1} // 비활성 아이템의 투명도
                  inactiveItemOffset={40} // 비활성 아이템 표시 넓이
                  onItemRender={(item, index) => (
                    <View key={index} style={styles.swiperBox}>
                      {snapShotAndCount.length === deviceAndAirInfo.length ? (
                        // snapShotAndCount[index].c >= 5 ? (
                        isNaN(item.stateInfo.co2) ? (
                          <View>
                            <ImageBackground
                              source={require('../../../../Assets/img/imgHouseBgShadow.png')}
                              style={styles.whiteBox}
                              imageStyle={{resizeMode: 'stretch'}}
                            >
                              <ImageBackground
                                source={require('../../../../Assets/img/imgHouseGrey.png')}
                                style={styles.stateBox}
                                imageStyle={{resizeMode: 'stretch'}}
                              >
                                <Image
                                  source={require('../../../../Assets/img/imgPicohomeOff.png')}
                                  style={styles.picoOff}
                                />
                                <View style={styles.picoInfo}>
                                  <Text style={styles.picoOffText}>
                                    {strings.popup_offline_title}
                                  </Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    style={[
                                      styles.picoOffText,
                                      {fontSize: 20},
                                    ]}>
                                    {item.PicoName}
                                  </Text>
                                  <Text
                                    style={{fontSize: 20, color: colors.azure}}>
                                    {' '}
                                    -{' '}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.picoOffText,
                                      {fontSize: 20},
                                    ]}>
                                    {item.Description}
                                  </Text>
                                </View>
                                <View style={styles.connectPico}>
                                  <TouchableOpacity
                                    style={[
                                      styles.connectPicoPlus,
                                      {backgroundColor: colors.azure},
                                    ]}
                                    onPress={() =>
                                      navigation.navigate('ConnectStack')
                                    }>
                                    <Image
                                      style={styles.icAdd}
                                      source={require('../../../../Assets/img/icAdd.png')}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </ImageBackground>
                            </ImageBackground>
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('DeviceStack', {
                                id: item.Id,
                                mod: 'state',
                                temp: item.stateInfo.temp,
                                humd: item.stateInfo.humd,
                              })
                            }>
                            <ImageBackground
                              source={require('../../../../Assets/img/imgHouseBgShadow.png')}
                              style={styles.whiteBox}
                              imageStyle={{resizeMode: 'stretch'}}
                            >
                              <ImageBackground
                                source={getHomeSource(item.stateInfo.pm25)}
                                style={
                                  // 이렇게 위치를 맞추면 의미가 없다.
                                  // 핸드폰 크기에 따라서 비율이 변하기 때문에
                                  // 고정 크기를 이용하면 크게 상관은 없지만
                                  // 어떤 핸드폰에서는 PiCO Home이 지나치게 작아 보일 수 있다.
                                  styles.stateBox
                                }
                                imageStyle={{resizeMode: 'stretch'}}
                              >
                                <Image
                                  source={getPicoHomeSource(
                                    item.stateInfo.pm25,
                                  )}
                                  style={{width: 72, height: 72}}
                                />
                                <View style={styles.picoDeviceSetting}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      navigation.navigate('DeviceStack', {
                                        id: item.Id,
                                        mod: 'setting',
                                        temp: 0,
                                        humd: 0,
                                      })
                                    }>
                                    <Image
                                      source={require('../../../../Assets/img/icSettingsWhite.png')}
                                    />
                                  </TouchableOpacity>
                                </View>
                                <Text
                                  style={styles.picoName}
                                  allowFontScaling={false}
                                >
                                  {item.PicoName}
                                </Text>
                                <Text
                                  style={styles.picoPlace}
                                  allowFontScaling={false}
                                >
                                  {item.Description}
                                </Text>
                                <Text
                                  style={styles.picoHomeState}
                                  allowFontScaling={false}
                                >
                                  {getHomeState(item.stateInfo.pm25)}
                                </Text>
                                <View style={styles.picoTempAndHumdi}>
                                <Text
                                    style={styles.picoTemp}
                                    allowFontScaling={false}
                                  >
                                    {tempMod
                                      ? Math.round((item.stateInfo.temp) * 1.8 + 32)
                                      : Math.round(item.stateInfo.temp)}
                                  </Text>
                                  <Text
                                    style={styles.picoTempUnit}
                                    allowFontScaling={false}
                                  >
                                    {tempMod ? '°F' : '°C'}
                                  </Text>
                                  <Text>{'   '}</Text>
                                  <Text
                                    style={styles.picoHumdi}
                                    allowFontScaling={false}
                                  >
                                    {Math.round(item.stateInfo.humd)}
                                  </Text>
                                  <Text
                                    style={styles.picoHumdiUnit}
                                    allowFontScaling={false}
                                  >
                                    %
                                  </Text>
                                </View>
                                <View style={styles.picoStateInfo}>
                                  <View style={styles.picoStatePm25Style}>
                                  <View style={{ height: 45, justifyContent: 'center' }}>
                                      <Text
                                        style={styles.picoStatePm25Text}
                                        allowFontScaling={false}
                                      >
                                        {strings.main_label_pm25}
                                      </Text>
                                    </View>
                                    <Image 
                                      source={require('../../../../Assets/img/icPm25.png')} 
                                    />
                                    <Text
                                      style={styles.picoStatePm25}
                                      allowFontScaling={false}
                                    >
                                      {item.stateInfo.pm25}
                                    </Text>
                                    <Text
                                      style={styles.picoStatePm25Unit}
                                      allowFontScaling={false}
                                    >
                                      {strings.main_label_pm_unit}
                                    </Text>
                                  </View>
                                  <View style={styles.picoStatePm10Style}>
                                    <View style={{ height: 45, justifyContent: 'center' }}>
                                      <Text
                                        style={styles.picoStatePm10Text}
                                        allowFontScaling={false}
                                      >
                                        {strings.main_label_pm10}
                                      </Text>
                                    </View>
                                    <Image source={require('../../../../Assets/img/icPm10.png')} />
                                    <Text
                                      style={styles.picoStatePm10}
                                      allowFontScaling={false}
                                    >
                                      {item.stateInfo.pm10}
                                    </Text>
                                    <Text
                                      style={styles.picoStatePm10Unit}
                                      allowFontScaling={false}
                                    >
                                      {strings.main_label_pm_unit}
                                    </Text>
                                  </View>
                                  <View style={styles.picoStateVOCStyle}>
                                    <View style={{ height: 45, justifyContent: 'center' }}>
                                      <Text
                                        style={[
                                          styles.picoStateVOCText,
                                          strings.getLanguage() !== 'en_US' && { marginBottom: 15 }
                                        ]}
                                        allowFontScaling={false}
                                      >
                                        {strings.main_label_vocs}
                                      </Text>
                                    </View>
                                    <Image source={require('../../../../Assets/img/icVoc.png')} />
                                    <Text
                                      style={styles.picoStateVOC}
                                      allowFontScaling={false}
                                    >
                                      {item.stateInfo.vocs}
                                    </Text>
                                    <Text
                                      style={styles.picoStateVOCUnit}
                                      allowFontScaling={false}
                                    >
                                      {strings.main_label_ppb}
                                    </Text>
                                  </View>
                                  <View style={styles.picoStateCO2Style}>
                                    <View style={{ height: 45, justifyContent: 'center' }}>
                                      <Text
                                        style={styles.picoStateCO2Text}
                                        allowFontScaling={false}
                                      >
                                        {strings.scan_label_co2}
                                      </Text>
                                    </View>
                                    <Image source={require('../../../../Assets/img/icCo2.png')} />
                                    <Text
                                      style={styles.picoStateCO2}
                                      allowFontScaling={false}
                                    >
                                      {item.stateInfo.co2}
                                    </Text>
                                    <Text
                                      style={styles.picoStateCO2Unit}
                                      allowFontScaling={false}
                                    >
                                      {strings.main_label_ppm}
                                    </Text>
                                  </View>
                                </View>
                                <View style={styles.connectPico}>
                                  <TouchableOpacity
                                    style={styles.connectPicoPlus}
                                    onPress={() =>
                                      navigation.navigate('ConnectStack')
                                    }>
                                    <Image
                                      style={styles.icAdd}
                                      source={require('../../../../Assets/img/icAdd.png')}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </ImageBackground>
                            </ImageBackground>
                          </TouchableOpacity>
                        )
                      ) : (
                        <View style={styles.indicator}>
                          <ActivityIndicator
                            size="large"
                            color={colors.azure}
                          />
                        </View>
                      )}
                    </View>
                  )}
                />
              ) : (
                <View style={styles.indicator}>
                  <ActivityIndicator size="large" color={colors.azure} />
                </View>
              )}
            </View>
          )}
         
        </View>
      ) : (
        <View style={[styles.indicator, {height: height}]}>
          <ActivityIndicator size="large" color={colors.azure} />
        </View>
      )}
    <Modal 
      isVisible={connectInfo} 
      onBackdropPress={() => setConnectInfo(false)}
      onModalHide={() => {
        // 모달 여러개를 띄우기 위해 modal 값을 토글 함
        if (isFirmwareUpdate) {
          setIsFirmwareUpdate(false, () => setIsFirmwareUpdate(true));
        } else if (isForcedLogout) {
          setIsForcedLogout(false, () => setIsForcedLogout(true));
        }
      }}
      style={{zIndex: 1}}
    >
        <View style={styles.modalContainer}>
          <View style={styles.modalCancel}>
            <TouchableOpacity onPress={() => setConnectInfo(false)}>
              <Image source={require('../../../../Assets/img/icCancel.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalHeaderTextView}>
            <Text style={styles.modalHeaderText}>{strings.main_popup_title}</Text>
          </View>
          <View style={styles.modalSubTextView}>
            <Text style={styles.modalSubText}>{strings.main_popup}</Text>
          </View>
          <TouchableOpacity onPress={()=>open_WhatsApp()}>
            <View style={[styles.modalButton, { width: width * 0.8 }]}>
              <Text style={styles.modalButtonText}>{strings.main_popup_button}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal 
        isVisible={isFirmwareUpdate} 
        onBackdropPress={() => setIsFirmwareUpdate(false)}
        onModalHide={() => {
          // 모달 여러개를 띄우기 위해 modal 값을 토글 함
          if (connectInfo) {
            setConnectInfo(false, () => setConnectInfo(true));
          } else if (isForcedLogout) {
            setIsForcedLogout(false, () => setIsForcedLogout(true));
          }
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCancel}>
            <TouchableOpacity onPress={() => setIsFirmwareUpdate(false)}>
              <Image source={require('../../../../Assets/img/icCancel.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalHeaderTextView}>
            <Text style={styles.modalHeaderText}>{strings.popup_firmwareupdate_title}</Text>
          </View>
          <View style={styles.modalSubTextView}>
            <Text style={styles.modalSubTextNotCenter}>{strings.popup_firmwareupdate_contents}</Text>
          </View>
          <TouchableOpacity onPress={() => setIsFirmwareUpdate(false)}>
            <View style={[styles.modalButton, { width: width * 0.8 }]}>
              <Text style={styles.modalButtonText}>{strings.main_popup_pollen_button_ok}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal 
        isVisible={isForcedLogout}
        onModalHide={() => {
          // 모달 여러개를 띄우기 위해 modal 값을 토글 함
          if (connectInfo) {
            setConnectInfo(false, () => setConnectInfo(true), 500);
          } else if (isFirmwareUpdate) {
            setIsFirmwareUpdate(false, () => setIsFirmwareUpdate(true), 500);
          }
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalSubTextView}>
            <Text style={styles.modalSubText}>{strings.popup_auto_logout_contents}</Text>
          </View>
          <TouchableOpacity onPress={() => signOut()}>
            <View style={[styles.modalButton, { width: width * 0.8 }]}>
              <Text style={styles.modalButtonText}>{strings.popup_button_ok}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const {width, height} = Dimensions.get('window');
const imageWidth = width * 0.9;
const imageHeight = height * 0.62;
const addWidth = 35;
const addHeight = 35;

/*
const 'NotoSans-Bold' = fontFamily[locale].NotoSansB;
const 'NotoSans-Regular' = fontFamily[locale].NotoSansR;
*/

const styles = StyleSheet.create({
  container: {
    height: height,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradientStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 210,
  },
  linearFldPosition: {
    position: 'absolute',
    top: 0,
  },
  tutorialContainer: {
    width: width,
    height: height,
  },
  headerStyle: {
    width: width,
    marginTop: height * 0.0316,
    alignItems: 'center',
  },
  headerViewStyle: {
    flexDirection: 'row',
    width: width,
    margin: width * 0.05,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icApps: {
    marginLeft: width * 0.05,
    marginRight: width * 0.0156,
  },
  icComments: {marginLeft: width * 0.0156},
  icSettings: {marginRight: width * 0.05},
  locationInfoStyle: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  locationDateTime: {
    width: width,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateStyle: {position: 'absolute', left: width * 0.36},
  dateText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: '600',
    fontStyle: 'normal',
    fontSize: 10,
    color: colors.brownishGrey,
  },
  divider: {
    position: 'absolute',
    width: 1,
    height: 10,
    backgroundColor: colors.brownGrey,
  },
  timeStyle: {position: 'absolute', flexDirection: 'row', right: width * 0.343},
  timeText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: '600',
    fontStyle: 'normal',
    fontSize: 10,
    color: colors.brownishGrey,
  },
  locationPlaceStyle: {
    width: width * 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  locationPlaceTextStyle: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 15,
    color: colors.marineBlue,
  },
  tempAndHumidityStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  temp: {
    fontFamily: 'NotoSans',
    fontWeight: '600',
    fontStyle: 'normal',
    fontSize: 14,
    color: colors.blueGrey,
  },
  tempMod: {
    marginTop: 4,
    marginRight: 4,
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.blueGrey,
  },
  humidity: {
    marginLeft: 4,
    fontFamily: 'NotoSans',
    fontWeight: '600',
    fontStyle: 'normal',
    fontSize: 14,
    color: colors.blueGrey,
  },
  percent: {
    marginTop: 4,
    marginLeft: 2,
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.blueGrey,
  },
  stateStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  stateViewStyle: {
    height: width * 0.156,
    margin: width * 0.0312,
    alignItems: 'center',
    flexDirection: 'column',
  },
  pm25Style: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 13.75,
    marginBottom: 3,
    color: colors.blueGrey,
  },
  pm25StateViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pm25Layer: {
    fontFamily: 'glogo',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 32,
    lineHeight: 30,
  },
  pm25StateUnit: {
    marginLeft: 2,
    marginTop: 7,
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 10,
    color: colors.blueGrey,
  },
  pm10Style: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 13.75,
    marginBottom: 3,
    color: colors.blueGrey,
  },
  pm10StateViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pm10Layer: {
    fontFamily: 'glogo',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 32,
    lineHeight: 30,
  },
  pm10StateUnit: {
    marginLeft: 2,
    marginTop: 7,
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 10,
    color: colors.blueGrey,
  },
  ozoneStyle: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 13.75,
    marginBottom: 3,
    color: colors.blueGrey,
  },
  ozoneViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ozoneLayer: {
    fontFamily: 'glogo',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 32,
    lineHeight: 30,
  },
  ozoneStateUnit: {
    marginLeft: 2,
    marginTop: 7,
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 10,
    color: colors.blueGrey,
  },
  pollenStyle: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 13.75,
    marginBottom: 3,
    color: colors.blueGrey,
  },
  pollenViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollenText: {
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    marginTop: 10,
    color: colors.blueGrey,
  },
  pollenLayer: {
    fontFamily: 'glogo',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 32,
    lineHeight: 30,
  },
  pollenStateUnit: {
    marginLeft: 2,
    marginTop: 7,
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 10,
    color: colors.blueGrey,
  },
  pollenView: {
    position: 'absolute',
    right: 5,
    top: 0,
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
  modalHeaderText: {
    fontSize: 22,
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
  },
  modalSubTextView: {
    width: width * 0.75,
    marginTop: height * 0.0281,
  },
  modalSubText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 14,
    color: colors.brownGrey,
  },
  modalSubTextNotCenter: {
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.brownGrey,
  },
  modalButton: {
    width: width * 0.35,
    height: height * 0.07,
    marginTop: height * 0.04,
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
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: colors.white,
  },
  viewBox: {
    width: width * 0.9,
    alignItems: 'center',
  },
  picoHomeContainer: {
    marginTop: height * 0.05281,
  },
  swipeContainer: {width: width, alignItems: 'center'},
  picoHomeImageStyle: {
    flexDirection: 'column',
    width: imageWidth,
    height: imageHeight,
    marginTop: height * 0.06,
    borderRadius: 15,
    backgroundColor: colors.white,
  },
  picoOff: {width: 72, height: 72},
  picoInfo: {
    marginTop: 30,
  },
  picoOffText: {
    color: colors.azure,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 30,
  },
  picoDeviceSetting: {
    position: 'absolute',
    top: 80,
    right: 5,
  },
  picoName: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 10,
    color: colors.white,
  },
  picoPlace: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 13,
    color: colors.white,
  },
  picoHomeState: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 30,
    textShadowColor: 'rgba(27, 142, 255, 0.58)',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 4,
    color: colors.white,
  },
  picoTempAndHumdi: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  picoTemp: {
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 12,
    color: colors.white,
  },
  picoTempUnit: {
    marginTop: 2,
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 10,
    color: colors.white,
  },
  picoHumdi: {
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 12,
    color: colors.white,
  },
  picoHumdiUnit: {
    marginTop: 2,
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 10,
    color: colors.white,
  },
  picoStateInfo: {
    flexDirection: 'row',
    width: imageWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picoOffInfo: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 5,
  },
  picoOffInfoText: {
    color: colors.azure,
    fontFamily: 'NotoSans',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  picoStatePm25Style: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  picoStatePm25Text: {
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 12,
    color: colors.white,
  },
  picoStatePm25: {
    fontFamily: 'glogo',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 32,
    lineHeight: 30,
    marginTop: 5,
    color: colors.white,
  },
  picoStatePm25Unit: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  picoStatePm10Style: {
    flexDirection: 'column',
    marginLeft: width * 0.015,
    alignItems: 'center',
  },
  picoStatePm10Text: {
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 12,
    color: colors.white,
  },
  picoStatePm10: {
    fontFamily: 'glogo',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 32,
    lineHeight: 30,
    marginTop: 5,
    color: colors.white,
  },
  picoStatePm10Unit: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  picoStateVOCStyle: {
    flexDirection: 'column',
    marginLeft: width * 0.015,
    alignItems: 'center',
  },
  picoStateVOCText: {
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 12,
    textAlign: 'center',
    color: colors.white,
  },
  picoStateVOC: {
    fontFamily: 'glogo',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 32,
    lineHeight: 30,
    marginTop: 5,
    color: colors.white,
  },
  picoStateVOCUnit: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  picoStateCO2Style: {
    flexDirection: 'column',
    marginLeft: width * 0.015,
    alignItems: 'center',
  },
  picoStateCO2Text: {
    fontFamily: 'NotoSans',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 12,
    color: colors.white,
  },
  picoStateCO2: {
    fontFamily: 'glogo',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 32,
    lineHeight: 30,
    marginTop: 5,
    color: colors.white,
  },
  picoStateCO2Unit: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  connectPico: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  connectPicoPlus: {
    width: addWidth,
    height: addHeight,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 10,
    backgroundColor: colors.marineBlue,
  },
  whiteBox: {
    width: width * 0.96,
    height: width * 1.0,
    alignItems: 'center',
  },
  stateBox: {
    position: 'absolute',
    top: 22,
    width: width * 0.77,
    height: width * 0.81,
    alignItems: 'center',
  },
  icAdd: {
    position: 'absolute',
    top: addHeight * 0.28,
    left: addWidth * 0.15,
  },
  swiperBox: {
    width: width * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    height: height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalContainer: {
    width: width * 0.9,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  modalCancel: { position: 'absolute', top: 12, right: 12 },
  modalHeaderTextView: {
    width: width * 0.9,
    alignItems: 'center',
  },
  modalHeaderText: { fontSize: 22, fontFamily: 'NotoSans' },
  modalSubTextView: {
    width: width * 0.75,
    marginTop: height * 0.0281,
  },
  modalSubText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 14,
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
    color: colors.white,
  },

});
