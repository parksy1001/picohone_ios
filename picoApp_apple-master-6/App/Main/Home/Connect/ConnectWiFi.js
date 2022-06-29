import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  ActivityIndicator,
  NativeModules,
} from 'react-native';
import {LanguageContext} from '../../../context';
import {BleManager} from 'react-native-ble-plx';
import {PicoDevice} from './FindPicoToWiFi';
import {ScrollView} from 'react-native-gesture-handler';
import base64 from 'react-native-base64';
import colors from '../../../src/colors';
import NetInfo from '@react-native-community/netinfo';
import useTimer from '../../../src/hook/useTimer';

const { Wifi } = NativeModules;
export const bleManager = new BleManager();

const CONNECT_TIME = 30
const WIFI_REFRESH_TIME = 30

export const ConnectWiFi = ({navigation}) => {
  const strings = useContext(LanguageContext);

  const [isLoading, setIsLoading] = useState(false);
  const [count, isCountClear, startCount, stopCount] = useTimer()
  const [_, isWifiCountClear, startWifiCount] = useTimer()
  const [serial, setSerial] = useState('');

  const [isSecure, setIsSecure] = useState(true);
  const [currentSSID, setCurrentSSID] = useState(null);
  const [password, setPassword] = useState(null);

  const [firmware, setFirmware] = useState('')

  const [publicwifimodal, setPublicWifiModal] = useState(false);
  const [sorryModal, setSorryModal] = useState(false);
  const [wifiModal, setWiFiModal] = useState(false);
  const [checkWiFiModal, setCheckWiFiModal] = useState(false);
  // wifiList는 iOS에서 안 먹힘
  // const [wifiList, setWiFiList] = useState([]);

  // WiFi 세팅을 위한 분류 기준 선택 (보안/공용)
  /*
  const setWiFi = (wifiData) => {
    wifiData.capabilities.replace(/\[/gi, '').split(']')[0] != 'ESS'
      ? setWiFiSecure(wifiData)
      : setWiFiFree(wifiData);
  };

  // 비밀번호 없는 와이파이를 이용할 경우
  // 이거 맞음? F5개가...?
  const setWiFiFree = (wifiData) => {
    setPassword(0xfffff);
    setCurrentSSID(wifiData.SSID);
    connectDeviceToWiFi();
  };

  // 비밀번호 있는 와이파이를 이용할 경우
  const setWiFiSecure = (wifiData) => {
    setPassword('');
    setCurrentSSID(wifiData.SSID);
    setWiFiModal(true);
  };
  */

  const getSerialNum = () => {
    let temp = '';
    for (let i = 0; i < 6; i++) {
        let a = '' + getHexaChar(parseInt(PicoDevice.serial[i] / 16));
        let b = '' + getHexaChar(PicoDevice.serial[i] % 16);
        temp = temp + a + b;
    }
    setSerial(temp);
  };

  const getHexaChar = (props) => {
    switch (props) {
      case 10:
        return 'A';
        break;
      case 11:
        return 'B';
        break;
      case 12:
        return 'C';
        break;
      case 13:
        return 'D';
        break;
      case 14:
        return 'E';
        break;
      case 15:
        return 'F';
        break;
      default:
        return props;
        break;
    }
  };

  /*
   * wifi Level
   * android only
   *
   * upper -67dB => wifi4
   * between -67 and -70 => wifi3
   * under -70 => wifi2
   *
   * iOS에서 사용할 일이 없음.
   */
  /*
  const getWiFiLevelImage = (value) => {
    if (value >= -67) {
      return require('../../../../Assets/img/icWifi4.png');
    } else if (value >= -70 && value < -67) {
      return require('../../../../Assets/img/icWifi3.png');
    } else {
      return require('../../../../Assets/img/icWifi2.png');
    }
  };
  */

  var encryptPassword = function (peripheral, password) {
    let macAddress = replaceAll(peripheral, ':', '');
    let pwArray = toUTF8Array(password);
    let seed = new Array(password.length);
    for (let i = 0; i < toUTF8Array(macAddress).length; i++) {
      if (i < pwArray.length) {
        seed[i] = toUTF8Array(macAddress)[i];
      }
    }
    let result = new Array(pwArray.length);
    for (let i = 0; i < pwArray.length; i++) {
      result[i] = pwArray[i] ^ seed[i];
    }
    return bin2String(result);
  };

  const connectDeviceToWiFi = function() {
    setWiFiModal(false);
    setPublicWifiModal(false);
    setIsLoading(false);
    
    bleManager
      .readCharacteristicForDevice(
        PicoDevice.device.id,
        '0000180A',
        '00002A26-0000-1000-8000-00805f9b34fb'
      )
      .then(({ value }) => {
        setFirmware(base64.decode(value))
      })
    bleManager
      .writeCharacteristicWithResponseForDevice(
        PicoDevice.device.id,
        '0000ffe0-0000-1000-8000-00805f9b34fb',
        '0000ffe2-0000-1000-8000-00805f9b34fb',
        base64.encode(currentSSID),
      )
      .then((data) => {
        bleManager
          .writeCharacteristicWithResponseForDevice(
            PicoDevice.device.id,
            '0000ffe0-0000-1000-8000-00805f9b34fb',
            '0000ffe3-0000-1000-8000-00805f9b34fb',
            base64.encode(encryptPassword(serial, password)),
          )
          .then((data) => {
            PicoDevice.device.cancelConnection();
            startCount(CONNECT_TIME);
          })
          .catch((error) => navigation.navigate('Connect'));
      })
      .catch((error) => navigation.navigate('Connect'));
  };

  const connectDeviceToPublicWiFi = function() {
    setWiFiModal(false);
    setPublicWifiModal(false);
    setIsLoading(false);
    
    bleManager
      .readCharacteristicForDevice(
        PicoDevice.device.id,
        '0000180A',
        '00002A26-0000-1000-8000-00805f9b34fb'
      )
      .then(({ value }) => {
        setFirmware(base64.decode(value))
        console.log(base64.decode(value));
      })
    bleManager
      .writeCharacteristicWithResponseForDevice(
        PicoDevice.device.id,
        '0000ffe0-0000-1000-8000-00805f9b34fb',
        '0000ffe2-0000-1000-8000-00805f9b34fb',
        base64.encode(currentSSID),
      )
      .then((data) => {
        bleManager
          .writeCharacteristicWithResponseForDevice(
            PicoDevice.device.id,
            '0000ffe0-0000-1000-8000-00805f9b34fb',
            '0000ffe3-0000-1000-8000-00805f9b34fb',
            base64.encode(password),
          )
          .then((data) => {
            PicoDevice.device.cancelConnection();
            startCount(CONNECT_TIME);
          })
          .catch((error) => navigation.navigate('Connect'));
      })
      .catch((error) => navigation.navigate('Connect'));
  };

  /*
  function refreshWiFiList() {
    WifiManager.reScanAndLoadWifiList().then((wifiStringList) => {
      for (let i = 0; i < wifiStringList.length; i++) {
        if (wifiStringList[i].SSID.includes('5G')) {
          wifiStringList.splice(i, 1);
          i = i - 1;
        }
      }
      setWiFiList(wifiStringList);
    });
  }
  */

  // 최초 WiFiList 로드
  /*
  useEffect(() => {
    refreshWiFiList();
  }, []);
  */

  // 30초마다 WiFiList 갱신
  /*
  useEffect(() => {
    let refreshID = setInterval(() => refreshWiFiList(), 30000);
    return function cleanup() {
      clearInterval(refreshID);
    };
  });
  */

  useEffect(() => {
    NetInfo.configure({
      shouldFetchWiFiSSID: true,
    });

    NetInfo.fetch().then((state) => {
      if (state.type === 'wifi') {
        console.log(state);
        if (!state.details.ssid) {
          setCheckWiFiModal(true);
          return
        }
        Wifi.getWifiSecurityType().then(
          securityType => {
            console.log(state.details.ssid, {securityType})
            setCurrentSSID(state.details.ssid);
            if (securityType === 0) {
              setPublicWifiModal(true);
              setPassword('FFFFF')
            }
            else {
              setWiFiModal(true);
            }
          }
        )
        .catch((e) => {
          console.log(e);
          navigation.navigate('Connect')
        });
      } else {
        setCheckWiFiModal(true);
      }
    })
    .catch((e) => {
      console.log(e);
      navigation.navigate('Connect')
    });

    startWifiCount(WIFI_REFRESH_TIME)

    setTimeout(() => {
      setIsLoading(true);
    }, 3000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 3000);
    
    getSerialNum();
  }, []);

  useEffect(() => {
    let name = PicoDevice.device.name;

    console.log({serial});
    console.log(name);

    var date = new Date();
    date.setSeconds(date.getSeconds() - 20);
    date = date.toISOString();
    const start_time = date.substring(0, 4) + date.substring(5, 7) + date.substring(8, 10) + date.substring(11, 13) + date.substring(14, 16) + date.substring(17, 19);
    //console.log("start time is "+start_time);
    //var end_time= new Date();
    var d = new Date();
    var v = new Date();
    v.setMinutes(d.getMinutes() + 30);
    v = v.toISOString();
    //console.log(v);
    const end_time = v.substring(0, 4) + v.substring(5, 7) + v.substring(8, 10) + v.substring(11, 13) + v.substring(14, 16) + v.substring(17, 19);
    //var end_time = start_time
    //console.log("end time is "+end_time);
    if (count >= 0) {
      try {
        console.log('start of request');
        fetch('http://mqtt.brilcom.com:8080/mqtt/GetAirQualityBySec', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',//서버로 보낼 때 무엇으로 보내는 것인지 알려줌
          },
          body: JSON.stringify({
            serialNum: serial,
            startTime: start_time,
            endTime: end_time,
            type: 'Co2,Humid,Pm10,Pm25,Temperature,Tvoc',
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log('result is =====' + JSON.stringify(result));

            if (isCountClear) {
              // 30초간 Realtime DB에 데이터가 입력되지 않았으므로 와이파이 연결에 실패했다고 가정.
              setIsLoading(true);
              setSorryModal(true);
              return
            }

            if (result?.data?.length > 0) {
              stopCount()
              setIsLoading(true);
              navigation.navigate('SetUpPico', { id: serial, name, firmware });
            }
          });
      } catch (exception) {
        console.log('ERROR :: ', exception);
      }
    }
  }, [count, isCountClear]);

   // 한자리 수 숫자일 경우 십의 자리 수에 0추가
   function leadingZeros(n, digits) {
    let zero = '';
    n = n.toString();
    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++) zero += '0';
    }
    return zero + n;
  }

  // 전달받은 숫자가 음수이면 0으로 치환
  // RealtimeData 호출시 초가 0-2초 사이일 경우 음수로 가는 것을 방지
  const checkMinus = (props) => {
    if (props < 0) {
      return 0;
    } else {
      return props;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.listContainer}>
        {isLoading ? (
          <View></View>
        ) : (
          /*
          wifiList.map((wifiData) => (
            <TouchableOpacity
              style={styles.wifiListBox}
              onPress={() => setWiFi(wifiData)}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>{wifiData.SSID}</Text>
                <View style={{flexDirection: 'row'}}>
                  {wifiData.capabilities.replace(/\[/gi, '').split(']')[0] !=
                  'ESS' ? (
                    <Image
                      source={require('../../../../Assets/img/icLock.png')}
                    />
                  ) : null}
                  <Image
                    style={{marginLeft: 10}}
                    source={getWiFiLevelImage(wifiData.level)}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))
          */
          <View style={styles.indicator}>
            <ActivityIndicator size="large" color={colors.azure} />
          </View>
        )}
        {/* 와이파이 항목에 대한 비밀번호 입력창 Modal */}
        <Modal
          animationType="slide"
          statusBarTranslucent={true}
          transparent={true}
          visible={wifiModal}
          onDismiss={() => setWiFiModal(false)}
          onRequestClose={() => {
            setWiFiModal(false);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setWiFiModal(false)}>
                <Image
                  source={require('../../../../Assets/img/icCancel.png')}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {strings.wifisetting_3_popup_title}
              </Text>
              <View style={styles.networkBox}>
                <Text style={styles.networkText}>
                  {strings.wifisetting_3_popup_label_network}
                </Text>
                <Text style={styles.networkNameText}>{currentSSID}</Text>
              </View>
              <View style={styles.pwBox}>
                <Text style={styles.pwBoxText}>
                  {strings.wifisetting_3_popup_label_password}
                </Text>
                <View style={styles.pwInputBox}>
                  <Image
                    source={require('../../../../Assets/img/icLock.png')}
                  />
                  <TextInput
                    style={styles.pwInputBoxText}
                    placeholder={strings.wifisetting_3_popup_input_password}
                    placeholderTextColor={colors.brownGrey}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={isSecure}
                  />
                  <TouchableOpacity
                    style={styles.pwInputBoxSecure}
                    onPress={() => setIsSecure((prev) => !prev)}>
                    <Image
                      source={
                        isSecure
                          ? require('../../../../Assets/img/icVisibilityHidden.png')
                          : require('../../../../Assets/img/iconsIcVisibilityVisible.png')
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => connectDeviceToWiFi()}>
                <Text style={styles.buttonText}>
                  {strings.wifisetting_3_popup_button_ok}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* public 와이파이 항목에 대한 연결 Modal */}
        <Modal
          animationType="slide"
          statusBarTranslucent={true}
          transparent={true}
          visible={publicwifimodal}
          onDismiss={() => setPublicWifiModal(false)}
          onRequestClose={() => {
            setPublicWifiModal(false);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setPublicWifiModal(false)}>
                <Image source={require('../../../../Assets/img/icCancel.png')} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{strings.wifi_publicwifi_connect}</Text>
              <View style={styles.networkBox}>
                <Text style={styles.networkText}>{strings.wifisetting_3_popup_label_network}</Text>
                <Text style={styles.networkNameText}>{currentSSID}</Text>
              </View>
              {/* <View style={styles.pwBox}>
                <Text style={styles.pwBoxText}>{strings.wifisetting_3_popup_label_password}</Text>
                <View style={styles.pwInputBox}>
                  <Image source={require('../../../../Assets/img/icLock.png')} />
                  <TextInput
                    style={styles.pwInputBoxText}
                    placeholder={strings.wifisetting_3_popup_input_password}
                  />
               </View>
              </View>  */}

              <TouchableOpacity style={styles.buttonStyle} onPress={() => connectDeviceToPublicWiFi()}>
                <Text style={styles.buttonText}>{strings.wifisetting_3_popup_button_ok}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 와이파이 비밀번호가 맞지 않을 경우 발생하는 Modal */}
        <Modal
          animationType="slide"
          statusBarTranslucent={true}
          transparent={true}
          visible={sorryModal}
          onDismiss={() => setSorryModal(false)}
          onRequestClose={() => {
            setSorryModal(false);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setSorryModal(false)}>
                <Image
                  source={require('../../../../Assets/img/icCancel.png')}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {strings.wifisetting_3_popup_error_title}
              </Text>
              <Text style={styles.modalTitle}>
                {strings.wifisetting_3_popup_error}
              </Text>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  setSorryModal(false), navigation.navigate('Connect');
                }}>
                <Text style={styles.buttonText}>
                  {strings.wifisetting_3_popup_button_ok}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* wifi가 연결되지 않았을 경우 - 다른 형태의 인터넷 연결 혹은 인터넷 연결 없음 */}
        <Modal
          animationType="slide"
          statusBarTranslucent={true}
          transparent={true}
          visible={checkWiFiModal}
          onDismiss={() => setCheckWiFiModal(false)}
          onRequestClose={() => {
            setCheckWiFiModal(false);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setCheckWiFiModal(false)}>
                <Image
                  source={require('../../../../Assets/img/icCancel.png')}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {strings.wifisetting_3_popup_error_title}
              </Text>
              <Text style={styles.modalTitle}>
                {strings.wifisetting_3_popup_error}
              </Text>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  setCheckWiFiModal(false), navigation.navigate('Connect');
                }}>
                <Text style={styles.buttonText}>
                  {strings.wifisetting_3_popup_button_ok}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {backgroundColor: colors.white},
  listContainer: {marginTop: 20, alignItems: 'center'},
  wifiListBox: {
    width: width * 0.8,
    height: height * 0.0845,
    borderTopColor: colors.veryLightPink,
    borderTopWidth: 1,
    justifyContent: 'center',
  },
  indicator: {
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalBox: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalCancel: {position: 'absolute', right: 12, top: 12},
  modalTitle: {
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 18,
    marginBottom: 25,
  },
  networkBox: {
    width: width * 0.75,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  networkText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.blueGrey,
  },
  networkNameText: {
    fontFamily: 'NotoSans',
    fontSize: 14,
    color: colors.brownGrey,
    paddingVertical: 10,
  },
  pwBox: {
    width: width * 0.75,
    height: height * 0.075,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
    marginTop: 14,
  },
  pwBoxText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.blueGrey,
  },
  pwInputBox: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  pwInputBoxText: {width: width * 0.5, marginLeft: 8},
  pwInputBoxSecure: {position: 'absolute', right: 0},
  buttonStyle: {
    width: width * 0.7,
    height: 40,
    marginTop: height * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.azure,
    shadowColor: 'rgba(0, 172, 255, 0.2)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 2,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 12,
    color: colors.white,
  },
});

function toUTF8Array(str) {
  var utf8 = [];
  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    }
    // surrogate pair
    else {
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode =
        0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    }
  }
  return utf8;
}

function bin2String(array) {
  var result = '';
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

function replaceAll(str, org, dest) {
  return str.split(org).join(dest);
}
