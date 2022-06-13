import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
  // NativeModules,
} from 'react-native';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {LanguageContext} from '../../../context';
import {PicoDevice} from './FindPicoToScan';
import colors from '../../../src/colors';

export const Scan = ({navigation}) => {
  const strings = useContext(LanguageContext);

  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  const [pm25, setPm25] = useState(PicoDevice.data != null ? '-' : 0);
  const [pm10, setPm10] = useState(PicoDevice.data != null ? '-' : 0);
  const [temp, setTemp] = useState(PicoDevice.data != null ? '-' : 0);
  const [humd, setHumd] = useState(PicoDevice.data != null ? '-' : 0);
  const [vocs, setVOCs] = useState(PicoDevice.data != null ? '-' : 0);
  const [co2, setCO2] = useState(PicoDevice.data != null ? '-' : 0);

  // 1초 마다 블루투스 연결된 PiCO로 부터 데이터를 읽어오기 위해 호출
  function tick() {
    update();
  }

  function update() {
    PicoDevice.reload();
    setPm25(PicoDevice.data != null ? PicoDevice.data.pm25.value : 0);
    setPm10(PicoDevice.data != null ? PicoDevice.data.pm10.value : 0);
    setTemp(PicoDevice.data != null ? PicoDevice.data.temp.value : 0);
    setHumd(PicoDevice.data != null ? PicoDevice.data.humd.value : 0);
    setVOCs(PicoDevice.data != null ? PicoDevice.data.vocs.value : 0);
    setCO2(PicoDevice.data != null ? PicoDevice.data.co2.value : 0);
    if (count > 5) {
      setIsLoading(true);
    }
    if (count < 10) {
      setCount(count + 1);
    }
  }

  const getPm25Color = (value) => {
    if (0 <= value && value <= 15) {
      return colors.azure;
    } else if (16 <= value && value <= 35) {
      return colors.darkLimeGreen;
    } else if (36 <= value && value <= 75) {
      return colors.lightOrange;
    } else {
      return colors.coral;
    }
  };

  const getPm25Picture = (value) => {
    if (0 <= value && value <= 15) {
      return require('../../../../Assets/img/icPm25Blue.png');
    } else if (16 <= value && value <= 35) {
      return require('../../../../Assets/img/icPm25Green.png');
    } else if (36 <= value && value <= 75) {
      return require('../../../../Assets/img/icPm25Orange.png');
    } else {
      return require('../../../../Assets/img/icPm25Red.png');
    }
  };

  const getPm10Color = (value) => {
    if (0 <= value && value <= 30) {
      return colors.azure;
    } else if (31 <= value && value <= 80) {
      return colors.darkLimeGreen;
    } else if (81 <= value && value <= 150) {
      return colors.lightOrange;
    } else {
      return colors.coral;
    }
  };

  const getPm10Picture = (value) => {
    if (0 <= value && value <= 30) {
      return require('../../../../Assets/img/icPm10Blue.png');
    } else if (31 <= value && value <= 80) {
      return require('../../../../Assets/img/icPm10Green.png');
    } else if (81 <= value && value <= 150) {
      return require('../../../../Assets/img/icPm10Orange.png');
    } else {
      return require('../../../../Assets/img/icPm10Red.png');
    }
  };

  const getTemperatureColor = (value) => {
    if (value <= 9) {
      return colors.azure;
    } else if (9 < value && value <= 29) {
      return colors.darkLimeGreen;
    } else if (29 < value && value <= 49) {
      return colors.lightOrange;
    } else {
      return colors.coral;
    }
  };

  const getTemperaturePicture = (value) => {
    if (value <= 9) {
      return require('../../../../Assets/img/icTemperatureSettingBlue.png');
    } else if (9 < value && value <= 29) {
      return require('../../../../Assets/img/icTemperatureSettingGreen.png');
    } else if (29 < value && value <= 49) {
      return require('../../../../Assets/img/icTemperatureSettingOrange.png');
    } else {
      return require('../../../../Assets/img/icTemperatureSettingRed.png');
    }
  };

  const getHumidColor = (value) => {
    if (0 <= value && value <= 39) {
      return colors.lightOrange;
    } else if (39 < value && value <= 60) {
      return colors.darkLimeGreen;
    } else {
      return colors.azure;
    }
  };

  const getHumidPicture = (value) => {
    if (0 <= value && value <= 39) {
      return require('../../../../Assets/img/icHumidityOrange.png');
    } else if (39 < value && value <= 60) {
      return require('../../../../Assets/img/icHumidityGreen.png');
    } else {
      return require('../../../../Assets/img/icHumidityBlue.png');
    }
  };

  const getTvocColor = (value) => {
    if (0 <= value && value <= 249) {
      return colors.azure;
    } else if (250 <= value && value <= 449) {
      return colors.darkLimeGreen;
    } else {
      return colors.coral;
    }
  };

  const getTvocPicture = (value) => {
    if (0 <= value && value <= 249) {
      return require('../../../../Assets/img/icVocBlue.png');
    } else if (250 <= value && value <= 449) {
      return require('../../../../Assets/img/icVocGreen.png');
    } else {
      return require('../../../../Assets/img/icVocRed.png');
    }
  };

  const getCo2Color = (value) => {
    if (0 <= value && value <= 800) {
      return colors.azure;
    } else if (801 <= value && value <= 1000) {
      return colors.darkLimeGreen;
    } else if (1001 <= value && value <= 2000) {
      return colors.lightOrange;
    } else {
      return colors.coral;
    }
  };

  const getCo2Picture = (value) => {
    if (0 <= value && value <= 800) {
      return require('../../../../Assets/img/icCo2Blue.png');
    } else if (801 <= value && value <= 1000) {
      return require('../../../../Assets/img/icCo2Green.png');
    } else if (1001 <= value && value <= 2000) {
      return require('../../../../Assets/img/icCo2Orange.png');
    } else {
      return require('../../../../Assets/img/icCo2Red.png');
    }
  };

  // 1초 마다 블루투스에서 가져오는 값 갱신
  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  return (
    <View style={styles.container}>
      {/*
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => navigation.navigate('Connect')}>
          <Image source={require('../../../../Assets/img/icArrowLeft.png')} />
        </TouchableOpacity>
      </View>
      */}
      {isLoading ? (
        <View>
          <View style={{height: height * 0.05}}></View>
          <View style={styles.box}>
            <View style={styles.stateBox}>
              <View
                style={[
                  styles.bgStateBar,
                  {backgroundColor: getPm25Color(pm25)},
                ]}></View>
              <Image style={styles.icPm25} source={getPm25Picture(pm25)} />
              <Text style={[styles.pm25, {color: getPm25Color(pm25)}]}>
                {strings.scan_label_pm25}
              </Text>
              <View style={styles.pm25ValueView}>
                <Text style={[styles.pm25Value, {color: getPm25Color(pm25)}]}>
                  {pm25}
                </Text>
              </View>
              <Text style={[styles.pm25m3, {color: getPm25Color(pm25)}]}>
                μg/m³
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.stateBox}>
              <View
                style={[
                  styles.bgStateBar,
                  {backgroundColor: getPm10Color(pm10)},
                ]}></View>
              <Image style={styles.icPm10} source={getPm10Picture(pm10)} />
              <Text style={[styles.pm10, {color: getPm10Color(pm10)}]}>
                {strings.scan_label_pm10}
              </Text>
              <View style={styles.pm10ValueView}>
                <Text style={[styles.pm10Value, {color: getPm10Color(pm10)}]}>
                  {pm10}
                </Text>
              </View>
              <Text style={[styles.pm10m3, {color: getPm10Color(pm10)}]}>
                μg/m³
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.stateBox}>
              <View
                style={[
                  styles.bgStateBar,
                  {backgroundColor: getTemperatureColor(temp)},
                ]}></View>
              <Image
                style={styles.icTemp}
                source={getTemperaturePicture(temp)}
              />
              <Text
                style={[
                  styles.temperature,
                  {color: getTemperatureColor(temp)},
                ]}>
                {strings.scan_label_temperature}
              </Text>
              <View style={styles.tempValueView}>
                <Text
                  style={[
                    styles.temperatureValue,
                    {color: getTemperatureColor(temp)},
                  ]}>
                  {temp}
                </Text>
              </View>
              <Text
                style={[
                  styles.temperatureC,
                  {color: getTemperatureColor(temp)},
                ]}>
                °C
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.stateBox}>
              <View
                style={[
                  styles.bgStateBar,
                  {backgroundColor: getHumidColor(humd)},
                ]}></View>
              <Image style={styles.icHumdi} source={getHumidPicture(humd)} />
              <Text style={[styles.humidity, {color: getHumidColor(humd)}]}>
                {strings.scan_label_humidity}
              </Text>
              <View style={styles.humdiValueView}>
                <Text
                  style={[styles.humidityValue, {color: getHumidColor(humd)}]}>
                  {humd}
                </Text>
              </View>
              <Text
                style={[styles.humidityPercent, {color: getHumidColor(humd)}]}>
                %
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.stateBox}>
              <View
                style={[
                  styles.bgStateBar,
                  {backgroundColor: getTvocColor(vocs)},
                ]}></View>
              <Image style={styles.icVoc} source={getTvocPicture(vocs)} />
              <Text style={[styles.Voc, {color: getTvocColor(vocs)}]}>
                {strings.scan_label_vocs}
              </Text>
              <View style={styles.vocValueView}>
                <Text style={[styles.VocValue, {color: getTvocColor(vocs)}]}>
                  {vocs}
                </Text>
              </View>
              <Text style={[styles.Vocppb, {color: getTvocColor(vocs)}]}>
                ppb
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.stateBox}>
              <View
                style={[
                  styles.bgStateBar,
                  {backgroundColor: getCo2Color(co2)},
                ]}></View>
              <Image style={styles.icCO2} source={getCo2Picture(co2)} />
              <Text style={[styles.CO2, {color: getCo2Color(co2)}]}>
                {strings.scan_label_co2}
              </Text>
              <View style={styles.co2ValueView}>
                <Text style={[styles.CO2Value, {color: getCo2Color(co2)}]}>
                  {co2}
                </Text>
              </View>
              <Text style={[styles.CO2ppm, {color: getCo2Color(co2)}]}>
                ppm
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={colors.azure} />
        </View>
      )}
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.veryLightPink,
  },
  indicator: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  backButton: {
    position: 'absolute',
    width: width * 0.9,
    top: height * 0.055,
    left: width * 0.04,
  },
  box: {
    width: width * 0.9,
    height: height * 0.1126,
    margin: height * 0.0105,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  stateBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bgStateBar: {
    width: 12,
    height: height * 0.1126,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: colors.veryLightPink,
  },
  icPm25: {
    marginLeft: width * 0.05,
  },
  pm25: {
    marginLeft: width * 0.025,
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.veryLightPink,
  },
  pm25ValueView: {
    position: 'absolute',
    marginLeft: width * 0.5,
    width: width * 0.25,
  },
  pm25Value: {
    textAlign: 'right',
    fontFamily: 'glogo',
    fontSize: 40,
    lineHeight: 35,
    color: colors.veryLightPink,
  },
  pm25m3: {
    position: 'absolute',
    marginLeft: width * 0.77,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.veryLightPink,
  },
  icPm10: {
    marginLeft: width * 0.05,
  },
  pm10: {
    marginLeft: width * 0.025,
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.azure,
  },
  pm10ValueView: {
    position: 'absolute',
    marginLeft: width * 0.5,
    width: width * 0.25,
  },
  pm10Value: {
    textAlign: 'right',
    fontFamily: 'glogo',
    fontSize: 40,
    lineHeight: 35,
    color: colors.azure,
  },
  pm10m3: {
    position: 'absolute',
    marginLeft: width * 0.77,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.azure,
  },
  icTemp: {
    marginLeft: width * 0.05,
  },
  temperature: {
    marginLeft: width * 0.025,
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.azure,
  },
  tempValueView: {
    position: 'absolute',
    marginLeft: width * 0.5,
    width: width * 0.25,
  },
  temperatureValue: {
    textAlign: 'right',
    fontFamily: 'glogo',
    fontSize: 40,
    lineHeight: 35,
    color: colors.azure,
  },
  temperatureC: {
    position: 'absolute',
    marginLeft: width * 0.77,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.azure,
  },
  icHumdi: {
    marginLeft: width * 0.05,
  },
  humidity: {
    marginLeft: width * 0.025,
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.azure,
  },
  humdiValueView: {
    position: 'absolute',
    marginLeft: width * 0.5,
    width: width * 0.25,
  },
  humidityValue: {
    textAlign: 'right',
    fontFamily: 'glogo',
    fontSize: 40,
    lineHeight: 35,
    color: colors.azure,
  },
  humidityPercent: {
    position: 'absolute',
    marginLeft: width * 0.77,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.azure,
  },
  icVoc: {
    marginLeft: width * 0.05,
  },
  Voc: {
    marginLeft: width * 0.025,
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.coral,
  },
  vocValueView: {
    position: 'absolute',
    marginLeft: width * 0.5,
    width: width * 0.25,
  },
  VocValue: {
    textAlign: 'right',
    fontFamily: 'glogo',
    fontSize: 40,
    lineHeight: 35,
    color: colors.coral,
  },
  Vocppb: {
    position: 'absolute',
    marginLeft: width * 0.77,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.coral,
  },
  icCO2: {
    marginLeft: width * 0.05,
  },
  CO2: {
    marginLeft: width * 0.025,
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.lightOrange,
  },
  co2ValueView: {
    position: 'absolute',
    marginLeft: width * 0.5,
    width: width * 0.25,
  },
  CO2Value: {
    textAlign: 'right',
    fontFamily: 'glogo',
    fontSize: 40,
    lineHeight: 35,
    color: colors.lightOrange,
  },
  CO2ppm: {
    position: 'absolute',
    marginLeft: width * 0.77,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.lightOrange,
  },
});
