import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {LanguageContext} from '../../context';
import LinearGradient from 'react-native-linear-gradient';
import SwiperFlatList from 'react-native-swiper-flatlist';
import colors from '../../src/colors';

export const Tutorial = ({navigation}) => {
  const strings = useContext(LanguageContext);

  const [tutorial, setTutorial] = useState(true);

  const finishTutorial = () => {
    setTutorial(false);
    navigation.replace('RealTime');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,172,255,0.3)', 'transparent']}
        style={styles.linearGradientStyle}></LinearGradient>
      <View style={{position: 'absolute'}}>
        <Image
          style={{width: width, height: height * 0.1}}
          source={require('../../../Assets/img/waveLayerGood1.png')}
        />
      </View>
      <View style={{position: 'absolute'}}>
        <Image
          style={{width: width, height: height * 0.1}}
          source={require('../../../Assets/img/waveLayerGood2.png')}
        />
      </View>
      <View style={styles.headerStyle}>
        <View style={styles.headerViewStyle}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.icApps}>
              <Image source={require('../../../Assets/img/icApps.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icComments}>
              <Image source={require('../../../Assets/img/icComments.png')} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.icSettings}>
            <Image source={require('../../../Assets/img/icSettings.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.locationInfoStyle}>
        <View style={styles.locationDateTime}>
          <View style={styles.dateStyle}>
            <Text style={styles.dateText}>NOV.20</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.timeStyle}>
            <Text style={styles.timeText}>PM 19:00</Text>
          </View>
        </View>
        <View style={styles.locationPlaceStyle}>
          <Text style={styles.locationPlaceTextStyle}>Prospect Park Zoo</Text>
          <Image
            style={{marginLeft: 4}}
            source={require('../../../Assets/img/icMap.png')}
          />
        </View>
        <View style={styles.tempAndHumidityStyle}>
          <Text style={styles.temp}>21</Text>
          <Text style={styles.celsius}>°C</Text>
          <Text style={styles.humidity}>16</Text>
          <Text style={styles.percent}>%</Text>
        </View>
      </View>
      <View style={styles.stateStyle}>
        <View style={styles.stateViewStyle}>
          <Text style={styles.pm25Style}>PM2.5</Text>
          <View style={styles.pm25StateViewStyle}>
            <Text style={styles.pm25Layer}>2</Text>
            <Text style={styles.pm25StateUnit}>μg/m3</Text>
          </View>
        </View>
        <View style={styles.stateViewStyle}>
          <Text style={styles.pm10Style}>PM10</Text>
          <View style={styles.pm10StateViewStyle}>
            <Text style={styles.pm10Layer}>78</Text>
            <Text style={styles.pm10StateUnit}>μg/m3</Text>
          </View>
        </View>
        <View style={styles.stateViewStyle}>
          <Text style={styles.ozoneStyle}>Ozone</Text>
          <View style={styles.ozoneViewStyle}>
            <Text style={styles.ozoneLayer}>34</Text>
            <Text style={styles.ozoneStateUnit}>ppb</Text>
          </View>
        </View>
        <View style={styles.stateViewStyle}>
          <Text style={styles.ozoneStyle}>Pollen</Text>
          <View style={styles.ozoneViewStyle}>
            <Text style={styles.ozoneLayer}>5/5</Text>
            <Text style={styles.ozoneStateUnit}>Index</Text>
          </View>
        </View>
      </View>
      <View style={styles.swipeContainer}>
        <ImageBackground
          style={styles.picoHomeImageStyle}
          source={require('../../../Assets/img/PicoHomeShapeGood.png')}>
          <View style={styles.picoDeviceSetting}>
            <View style={{width: 30, height: 30}}>
              <Image
                source={require('../../../Assets/img/icSettingsWhite.png')}
              />
            </View>
          </View>
          <View style={styles.picoInfo}>
            <Text style={styles.picoId}>pico1</Text>
            <Text style={styles.picoPlace}>living room</Text>
            <Text style={styles.picoHomeState}>good</Text>
            <View style={styles.picoTempAndHumdi}>
              <Text style={styles.picoTemp}>21°C</Text>
              <Text>{'   '}</Text>
              <Text style={styles.picoHumdi}>16%</Text>
            </View>
          </View>
          <View style={styles.picoStateInfo}>
            <View style={styles.picoStatePm25Style}>
              <Text style={styles.picoStatePm25Text}>PM2.5</Text>
              <Image source={require('../../../Assets/img/icPm25.png')} />
              <Text style={styles.picoStatePm25}>2</Text>
              <Text style={styles.picoStatePm25Unit}>μg/m3</Text>
            </View>
            <View style={styles.picoStatePm10Style}>
              <Text style={styles.picoStatePm10Text}>PM10</Text>
              <Image source={require('../../../Assets/img/icPm10.png')} />
              <Text style={styles.picoStatePm10}>11</Text>
              <Text style={styles.picoStatePm10Unit}>μg/m3</Text>
            </View>
            <View style={styles.picoStateVOCStyle}>
              <Text style={styles.picoStateVOCText}>VOCs</Text>
              <Image source={require('../../../Assets/img/icVoc.png')} />
              <Text style={styles.picoStateVOC}>59</Text>
              <Text style={styles.picoStateVOCUnit}>ppb</Text>
            </View>
            <View style={styles.picoStateCO2Style}>
              <Text style={styles.picoStateCO2Text}>CO2</Text>
              <Image source={require('../../../Assets/img/icCo2.png')} />
              <Text style={styles.picoStateCO2}>4</Text>
              <Text style={styles.picoStateCO2Unit}>ppm</Text>
            </View>
          </View>
          <View style={styles.connectPico}>
            <TouchableOpacity style={styles.connectPicoPlus}>
              <Image
                style={styles.icAdd}
                source={require('../../../Assets/img/icAdd.png')}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        {/* Modal tutorial start*/}
        <Modal
          visible={tutorial}
          statusBarTranslucent={true}
          transparent={true}>
          <SwiperFlatList
            showPagination
            paginationDefaultColor={colors.veryLightPink}
            paginationActiveColor={colors.azure}
            paginationStyle={{marginBottom: 24}}
            paginationStyleItem={{width: 6, height: 6}}
            paginationActiveStyleItem={{width: 24, height: 6}}>
            {/* tutorial first screen*/}
            <View style={styles.tutorialBox}>
              <View style={styles.headerStyle}>
                <View style={[styles.headerViewStyle, {marginBottom: 10}]}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.icApps}>
                      <Image
                        source={require('../../../Assets/img/icAppsWhite.png')}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <Text style={{color: colors.white, marginLeft: width * 0.05}}>
                {strings.tutorial_1_contents}
              </Text>
              <View style={styles.skipBox}>
                <View></View>
                <TouchableOpacity
                  style={styles.skip}
                  onPress={() => finishTutorial()}>
                  <Text style={styles.skipText}>
                    {strings.tutorial_1_button_skip}
                  </Text>
                  <Image
                    source={require('../../../Assets/img/icMiniarrowLeft.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* tutorial second screen*/}
            <View style={styles.tutorialBox}>
              <View style={styles.headerStyle}>
                <View style={[styles.headerViewStyle, {marginBottom: 10}]}>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={[styles.icApps, {width: 24, height: 24}]}></View>
                    <View style={styles.icComments}>
                      <Image
                        source={require('../../../Assets/img/icCommentsWhite.png')}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={{width: width, flexDirection: 'row'}}>
                <View style={styles.message}></View>
                <Text style={{marginLeft: width * 0.0156, color: colors.white}}>
                  {strings.tutorial_2_contents}
                </Text>
              </View>
              <View style={styles.skipBox}>
                <View></View>
                <TouchableOpacity
                  style={styles.skip}
                  onPress={() => finishTutorial()}>
                  <Text style={styles.skipText}>
                    {strings.tutorial_2_button_skip}
                  </Text>
                  <Image
                    source={require('../../../Assets/img/icMiniarrowLeft.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* tutorial third screen*/}
            <View style={styles.tutorialBox}>
              <View style={styles.headerStyle}>
                <View style={[styles.headerViewStyle, {marginBottom: 10}]}>
                  <View></View>
                  <View style={styles.icSettings}>
                    <Image
                      source={require('../../../Assets/img/icSettingsWhiteBig.png')}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.icSettings,
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <View></View>
                <Text
                  style={{
                    color: colors.white,
                  }}>
                  {strings.tutorial_3_contents}
                </Text>
              </View>
              <View style={styles.skipBox}>
                <View></View>
                <TouchableOpacity
                  style={styles.skip}
                  onPress={() => finishTutorial()}>
                  <Text style={styles.skipText}>
                    {strings.tutorial_3_button_skip}
                  </Text>
                  <Image
                    source={require('../../../Assets/img/icMiniarrowLeft.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* tutorial fourth screen*/}
            <View style={[styles.tutorialBox, {alignItems: 'center'}]}>
              <View style={styles.headerStyle}>
                <View style={styles.headerViewStyle}>
                  <View></View>
                  <View
                    style={[styles.icSettings, {width: 24, height: 24}]}></View>
                </View>
              </View>
              <View style={styles.locationInfoStyle}>
                <View style={styles.locationDateTime}>
                  <View style={styles.dateStyle}>
                    <Text style={[styles.dateText, {color: colors.white}]}>
                      NOV.20
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.divider,
                      {backgroundColor: colors.white},
                    ]}></View>
                  <View style={styles.timeStyle}>
                    <Text style={[styles.timeText, {color: colors.white}]}>
                      PM 19:00
                    </Text>
                  </View>
                </View>
                <View style={styles.locationPlaceStyle}>
                  <Text
                    style={[
                      styles.locationPlaceTextStyle,
                      {color: colors.white},
                    ]}>
                    Prospect Park Zoo
                  </Text>
                  <Image
                    style={{marginLeft: 4}}
                    source={require('../../../Assets/img/icMapWhite.png')}
                  />
                </View>
                <View style={styles.tempAndHumidityStyle}>
                  <Text style={[styles.temp, {color: colors.white}]}>21</Text>
                  <Text style={[styles.celsius, {color: colors.white}]}>
                    °C
                  </Text>
                  <Text style={[styles.humidity, {color: colors.white}]}>
                    16
                  </Text>
                  <Text style={[styles.percent, {color: colors.white}]}>%</Text>
                </View>
              </View>
              <View style={styles.stateStyle}>
                <View style={styles.stateViewStyle}>
                  <Text style={[styles.pm25Style, {color: colors.white}]}>
                    PM2.5
                  </Text>
                  <View style={styles.pm25StateViewStyle}>
                    <Text style={[styles.pm25Layer, {color: colors.white}]}>
                      2
                    </Text>
                    <Text style={[styles.pm25StateUnit, {color: colors.white}]}>
                      μg/m3
                    </Text>
                  </View>
                </View>
                <View style={styles.stateViewStyle}>
                  <Text style={[styles.pm10Style, {color: colors.white}]}>
                    PM10
                  </Text>
                  <View style={styles.pm10StateViewStyle}>
                    <Text style={[styles.pm10Layer, {color: colors.white}]}>
                      78
                    </Text>
                    <Text style={[styles.pm10StateUnit, {color: colors.white}]}>
                      μg/m3
                    </Text>
                  </View>
                </View>
                <View style={styles.stateViewStyle}>
                  <Text style={[styles.ozoneStyle, {color: colors.white}]}>
                    Ozone
                  </Text>
                  <View style={styles.ozoneViewStyle}>
                    <Text style={[styles.ozoneLayer, {color: colors.white}]}>
                      34
                    </Text>
                    <Text
                      style={[styles.ozoneStateUnit, {color: colors.white}]}>
                      ppb
                    </Text>
                  </View>
                </View>
                <View style={styles.stateViewStyle}>
                  <Text style={[styles.ozoneStyle, {color: colors.white}]}>
                    Pollen
                  </Text>
                  <View style={styles.ozoneViewStyle}>
                    <Text style={[styles.ozoneLayer, {color: colors.white}]}>
                      5/5
                    </Text>
                    <Text
                      style={[styles.ozoneStateUnit, {color: colors.white}]}>
                      Index
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={{color: colors.white}}>
                {strings.tutorial_4_contents}
              </Text>
              <View style={styles.skipBox}>
                <View></View>
                <TouchableOpacity
                  style={styles.skip}
                  onPress={() => finishTutorial()}>
                  <Text style={styles.skipText}>
                    {strings.tutorial_4_button_skip}
                  </Text>
                  <Image
                    source={require('../../../Assets/img/icMiniarrowLeft.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* tutorial fifth screen*/}
            <View style={styles.tutorialBox}>
              <View style={styles.headerStyle}>
                <View style={styles.headerViewStyle}>
                  <View></View>
                  <View
                    style={[styles.icSettings, {width: 24, height: 24}]}></View>
                </View>
              </View>
              <View style={styles.locationInfoStyle}>
                <View style={styles.locationDateTime}>
                  <View style={[styles.divider, {opacity: 0}]}></View>
                </View>
                <View style={styles.locationPlaceStyle}>
                  <Text style={[styles.locationPlaceTextStyle, {opacity: 0}]}>
                    P
                  </Text>
                </View>
                <View style={styles.tempAndHumidityStyle}>
                  <Text style={[styles.temp, {opacity: 0}]}>2</Text>
                </View>
              </View>
              <View style={styles.stateStyle}>
                <View style={styles.stateViewStyle}>
                  <Text style={[styles.pm25Style, {opacity: 0}]}>P</Text>
                  <View style={styles.pm25StateViewStyle}>
                    <Text style={[styles.pm25Layer, {opacity: 0}]}>2</Text>
                  </View>
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <ImageBackground
                  style={[
                    styles.picoHomeImageStyle,
                    {backgroundColor: 'transparent'},
                  ]}>
                  <View style={styles.picoDeviceSetting}>
                    <View style={{width: 30, height: 30}}>
                      <Image
                        source={require('../../../Assets/img/icSettingsWhite.png')}
                      />
                    </View>
                  </View>
                  <Text style={styles.picoHomeSetting}>
                    {strings.tutorial_5_contents}
                  </Text>
                </ImageBackground>
              </View>
              <View style={styles.skipBox}>
                <View></View>
                <TouchableOpacity
                  style={styles.skip}
                  onPress={() => finishTutorial()}>
                  <Text style={styles.skipText}>
                    {strings.tutorial_5_button_skip}
                  </Text>
                  <Image
                    source={require('../../../Assets/img/icMiniarrowLeft.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* tutorial sixth index */}
            <View style={[styles.tutorialBox, {alignItems: 'center'}]}>
              <View style={styles.headerStyle}>
                <View style={styles.headerViewStyle}>
                  <View></View>
                  <View
                    style={[styles.icSettings, {width: 24, height: 24}]}></View>
                </View>
              </View>
              <View style={styles.locationInfoStyle}>
                <View style={styles.locationDateTime}>
                  <View style={[styles.divider, {opacity: 0}]}></View>
                </View>
                <View style={styles.locationPlaceStyle}>
                  <Text style={[styles.locationPlaceTextStyle, {opacity: 0}]}>
                    P
                  </Text>
                </View>
                <View style={styles.tempAndHumidityStyle}>
                  <Text style={[styles.temp, {opacity: 0}]}>2</Text>
                </View>
              </View>
              <View style={styles.stateStyle}>
                <View style={styles.stateViewStyle}>
                  <Text style={[styles.pm25Style, {opacity: 0}]}>P</Text>
                  <View style={styles.pm25StateViewStyle}>
                    <Text style={[styles.pm25Layer, {opacity: 0}]}>2</Text>
                  </View>
                </View>
              </View>
              <View style={styles.stateLayer}>
                <Text style={{color: colors.white}}>
                  {strings.tutorial_6_contents}
                </Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <ImageBackground
                  style={[
                    styles.picoHomeImageStyle,
                    {backgroundColor: 'transparent'},
                  ]}>
                  <View>
                    <View style={styles.picoInfo}>
                      <Text style={styles.picoId}>pico1</Text>
                      <Text style={styles.picoPlace}>living room</Text>
                      <Text style={styles.picoHomeState}>good</Text>
                      <View style={styles.picoTempAndHumdi}>
                        <Text style={styles.picoTemp}>21°C</Text>
                        <Text>{'   '}</Text>
                        <Text style={styles.picoHumdi}>16%</Text>
                      </View>
                    </View>
                    <View style={styles.picoStateInfo}>
                      <View style={styles.picoStatePm25Style}>
                        <Text style={styles.picoStatePm25Text}>PM2.5</Text>
                        <Image
                          source={require('../../../Assets/img/icPm25.png')}
                        />
                        <Text style={styles.picoStatePm25}>2</Text>
                        <Text style={styles.picoStatePm25Unit}>μg/m3</Text>
                      </View>
                      <View style={styles.picoStatePm10Style}>
                        <Text style={styles.picoStatePm10Text}>PM10</Text>
                        <Image
                          source={require('../../../Assets/img/icPm10.png')}
                        />
                        <Text style={styles.picoStatePm10}>11</Text>
                        <Text style={styles.picoStatePm10Unit}>μg/m3</Text>
                      </View>
                      <View style={styles.picoStateVOCStyle}>
                        <Text style={styles.picoStateVOCText}>VOCs</Text>
                        <Image
                          source={require('../../../Assets/img/icVoc.png')}
                        />
                        <Text style={styles.picoStateVOC}>59</Text>
                        <Text style={styles.picoStateVOCUnit}>ppb</Text>
                      </View>
                      <View style={styles.picoStateCO2Style}>
                        <Text style={styles.picoStateCO2Text}>CO2</Text>
                        <Image
                          source={require('../../../Assets/img/icCo2.png')}
                        />
                        <Text style={styles.picoStateCO2}>4</Text>
                        <Text style={styles.picoStateCO2Unit}>ppm</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.skipBox}>
                <View></View>
                <TouchableOpacity
                  style={styles.skip}
                  onPress={() => finishTutorial()}>
                  <Text style={styles.skipText}>
                    {strings.tutorial_6_button_skip}
                  </Text>
                  <Image
                    source={require('../../../Assets/img/icMiniarrowLeft.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* tutorial last screen */}
            <View style={styles.tutorialBox}>
              <View style={styles.headerStyle}>
                <View style={styles.headerViewStyle}>
                  <View></View>
                  <View
                    style={[styles.icSettings, {width: 24, height: 24}]}></View>
                </View>
              </View>
              <View style={styles.locationInfoStyle}>
                <View style={styles.locationDateTime}>
                  <View style={[styles.divider, {opacity: 0}]}></View>
                </View>
                <View style={styles.locationPlaceStyle}>
                  <Text style={[styles.locationPlaceTextStyle, {opacity: 0}]}>
                    P
                  </Text>
                </View>
                <View style={styles.tempAndHumidityStyle}>
                  <Text style={[styles.temp, {opacity: 0}]}>1</Text>
                </View>
              </View>
              <View style={styles.stateStyle}>
                <View style={styles.stateViewStyle}>
                  <Text style={[styles.pm25Style, {opacity: 0}]}>P</Text>
                  <View style={styles.pm25StateViewStyle}>
                    <Text style={[styles.pm25Layer, {opacity: 0}]}>2</Text>
                  </View>
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <ImageBackground
                  style={[
                    styles.picoHomeImageStyle,
                    {backgroundColor: 'transparent'},
                  ]}>
                  <View style={[styles.connectPico, {flexDirection: 'row'}]}>
                    <View
                      style={[
                        styles.connectPicoPlus,
                        {backgroundColor: colors.white},
                      ]}>
                      <Image
                        style={styles.icAdd}
                        source={require('../../../Assets/img/icAddMarineBlue.png')}
                      />
                    </View>
                    <Text style={{color: colors.white}}>
                      {strings.tutorial_7_contents}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.skipBox}>
                <View></View>
                <TouchableOpacity
                  style={styles.skip}
                  onPress={() => finishTutorial()}>
                  <Text style={styles.skipText}>
                    {strings.tutorial_7_button_skip}
                  </Text>
                  <Image
                    source={require('../../../Assets/img/icMiniarrowLeft.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SwiperFlatList>
        </Modal>
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');
const imageWidth = width * 0.9;
const imageHeight = height * 0.62;
const addWidth = 44;
const addHeight = 44;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  tutorialBox: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  message: {
    width: 24,
    height: 24,
    marginLeft: width * 0.05,
    marginRight: width * 0.0156,
  },
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
  dateStyle: {position: 'absolute', left: width * 0.365},
  dateText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.brownishGrey,
  },
  divider: {
    position: 'absolute',
    width: 1,
    height: 10,
    backgroundColor: colors.brownGrey,
  },
  timeStyle: {position: 'absolute', right: width * 0.343},
  timeText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.brownishGrey,
  },
  locationPlaceStyle: {flexDirection: 'row', justifyContent: 'center'},
  locationPlaceTextStyle: {
    textAlign: 'right',
    fontFamily: 'NotoSans',
    fontSize: 15,
    color: colors.marineBlue,
  },
  tempAndHumidityStyle: {flexDirection: 'row', justifyContent: 'flex-end'},
  temp: {
    fontFamily: 'NotoSans',
    fontSize: 14,
    color: colors.blueGrey,
  },
  celsius: {
    marginTop: 3,
    marginRight: 4,
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.blueGrey,
  },
  humidity: {
    marginLeft: 4,
    fontFamily: 'NotoSans',
    fontSize: 14,
    color: colors.blueGrey,
  },
  percent: {
    marginTop: 3,
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
    width: width * 0.156,
    height: width * 0.156,
    margin: width * 0.0312,
    alignItems: 'center',
    flexDirection: 'column',
  },
  pm25Style: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.blueGrey,
  },
  pm25StateViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pm25Layer: {
    fontFamily: 'NotoSans',
    fontSize: 20,
    color: colors.azure,
  },
  stateLayer: {
    position: 'absolute',
    top: 250,
    width: width * 0.8,
    alignItems: 'center',
  },
  pm25StateUnit: {
    marginLeft: 2,
    marginTop: 6.5,
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.blueGrey,
  },
  pm10Style: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.blueGrey,
  },
  pm10StateViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pm10Layer: {
    fontFamily: 'NotoSans',
    fontSize: 20,
    color: colors.coral,
  },
  pm10StateUnit: {
    marginLeft: 2,
    marginTop: 6.5,
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.blueGrey,
  },
  uvRayStyle: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.blueGrey,
  },
  uvRayViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uvRayLayer: {
    fontFamily: 'NotoSans',
    fontSize: 20,
    color: colors.azure,
  },
  uvRayStateUnit: {
    marginLeft: 2,
    marginTop: 6.5,
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.blueGrey,
  },
  ozoneStyle: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.blueGrey,
  },
  ozoneViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ozoneLayer: {
    fontFamily: 'NotoSans',
    fontSize: 20,
    color: colors.lightOrange,
  },
  ozoneStateUnit: {
    marginLeft: 2,
    marginTop: 6.5,
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.blueGrey,
  },
  pollenView: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  modalContainer: {
    width: width * 0.9,
    height: height * 0.45,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  modalCancel: {position: 'absolute', top: 12, right: 12},
  modalHeaderTextView: {
    width: width * 0.9,
    marginTop: height * 0.056,
    alignItems: 'center',
  },
  modalHeaderText: {fontSize: 22, fontFamily: 'NotoSans'},
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
    fontSize: 20,
    fontFamily: 'NotoSans',
    color: colors.white,
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
  picoDeviceSetting: {
    position: 'absolute',
    top: imageHeight * 0.22,
    right: imageWidth * 0.2,
    width: 16,
    height: 16,
  },
  picoHomeSetting: {
    position: 'absolute',
    top: imageHeight * 0.25,
    right: imageWidth * 0.2,
    color: colors.white,
    marginTop: 10,
  },
  picoInfo: {marginTop: imageHeight * 0.23},
  picoId: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 15,
    color: colors.white,
  },
  picoPlace: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 15,
    color: colors.white,
  },
  picoHomeState: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 30,
    color: colors.white,
  },
  picoTempAndHumdi: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  picoTemp: {
    fontFamily: 'NotoSans',
    fontSize: 15,
    color: colors.white,
  },
  picoHumdi: {
    fontFamily: 'NotoSans',
    fontSize: 15,
    color: colors.white,
  },
  picoStateInfo: {
    flexDirection: 'row',
    width: imageWidth,
    marginTop: imageHeight * 0.02,
    justifyContent: 'center',
  },
  picoStatePm25Style: {
    flexDirection: 'column',
    margin: width * 0.0312,
    alignItems: 'center',
  },
  picoStatePm25Text: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  picoStatePm25: {
    fontFamily: 'NotoSans',
    color: colors.white,
    fontSize: 25,
  },
  picoStatePm25Unit: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  picoStatePm10Style: {
    flexDirection: 'column',
    margin: width * 0.0312,
    alignItems: 'center',
  },
  picoStatePm10Text: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  picoStatePm10: {
    fontFamily: 'NotoSans',
    color: colors.white,
    fontSize: 25,
  },
  picoStatePm10Unit: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  picoStateVOCStyle: {
    flexDirection: 'column',
    margin: width * 0.0312,
    alignItems: 'center',
  },
  picoStateVOCText: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  picoStateVOC: {
    fontFamily: 'NotoSans',
    color: colors.white,
    fontSize: 25,
  },
  picoStateVOCUnit: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  picoStateCO2Style: {
    flexDirection: 'column',
    margin: width * 0.0312,
    alignItems: 'center',
  },
  picoStateCO2Text: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  picoStateCO2: {
    fontFamily: 'NotoSans',
    color: colors.white,
    fontSize: 25,
  },
  picoStateCO2Unit: {
    fontFamily: 'NotoSans',
    fontSize: 10,
    color: colors.white,
  },
  connectPico: {
    position: 'absolute',
    top: imageHeight * 0.715,
    left: imageWidth * 0.087,
  },
  connectPicoPlus: {
    width: addWidth,
    height: addHeight,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 10,
    backgroundColor: colors.marineBlue,
  },
  icAdd: {
    position: 'absolute',
    top: addHeight * 0.364,
    left: addWidth * 0.205,
  },
  skipBox: {
    position: 'absolute',
    right: 15,
    bottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skip: {flexDirection: 'row', marginTop: 20},
  skipText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.white,
  },
});
