import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  HumChartContext,
  LanguageContext,
  TempChartContext,
} from '../../../context';
import {ScrollView} from 'react-native-gesture-handler';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {ComfortZone} from '../../../component/ComfortZone';
import {PM25Graph} from '../../../State/PM25';
import {PM10Graph} from '../../../State/PM10';
import {TempGraph} from '../../../State/Temp';
import {HumidGraph} from '../../../State/Humdi';
import {VOCsGraph} from '../../../State/VOCs';
import {CO2Graph} from '../../../State/CO2';
import {Pm25Explain} from '../../../component/Explain/Pm25Explain';
import {Pm10Explain} from '../../../component/Explain/Pm10Explain';
import {VOCsExplain} from '../../../component/Explain/VOCsExplain';
import {CO2Explain} from '../../../component/Explain/CO2Explain';

import colors from '../../../src/colors';

const FirstRoute = () => <PM25Graph />; // <View style={{ backgroundColor: colors.reddishPink }}></View>;

const SecondRoute = () => <PM10Graph />; // <View style={{ backgroundColor: colors.azure }}></View>;

const ThirdRoute = () => <TempGraph />; // <View style={{ backgroundColor: colors.greyishBrown }}></View>;

const FourthRoute = () => <HumidGraph />; // <View style={{ backgroundColor: colors.coral }}></View>;

const FifthRoute = () => <VOCsGraph />; // <View style={{ backgroundColor: colors.dark }}></View>;

const SixthRoute = () => <CO2Graph />; // <View style={{ backgroundColor: colors.darkLimeGreen }}></View>;

export const StateTabScreen = () => {
  const strings = useContext(LanguageContext);
  const temp = useContext(TempChartContext);
  const humd = useContext(HumChartContext);

  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);

  const [routes] = React.useState([
    {key: 'first', title: strings.details_graph_label_pm25},
    {key: 'second', title: strings.details_graph_label_pm10},
    {key: 'third', title: strings.details_graph_label_temperature},
    {key: 'fourth', title: strings.details_graph_label_humidity},
    {key: 'fifth', title: strings.details_graph_label_vocs},
    {key: 'sixth', title: strings.details_graph_label_co2},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
    fifth: FifthRoute,
    sixth: SixthRoute,
  });

  const [openTip, setOpenTip] = useState(false);

  const [statePm25, setStatePm25] = useState(true);
  const [statePm10, setStatePm10] = useState(false);
  const [stateVOCs, setStateVOCs] = useState(false);
  const [stateCO2, setStateCO2] = useState(false);

  const activePm25 = () => {
    setStatePm25(true);
    setStatePm10(false);
    setStateVOCs(false);
    setStateCO2(false);
  };

  const activePm10 = () => {
    setStatePm25(false);
    setStatePm10(true);
    setStateVOCs(false);
    setStateCO2(false);
  };

  const activeVOCs = () => {
    setStatePm25(false);
    setStatePm10(false);
    setStateVOCs(true);
    setStateCO2(false);
  };

  const activeCO2 = () => {
    setStatePm25(false);
    setStatePm10(false);
    setStateVOCs(false);
    setStateCO2(true);
  };

  /* 곧 업데이트될 예정입니다.
  const [house, setHouse] = useState(true);
  const [office, setOffice] = useState(false);
  const [car, setCar] = useState(false);
  const [outDoor, setOutDoor] = useState(false);

  const activeHouse = () => {
    setHouse(true);
    setOffice(false);
    setCar(false);
    setOutDoor(false);
  };

  const activeOffice = () => {
    setHouse(false);
    setOffice(true);
    setCar(false);
    setOutDoor(false);
  };

  const activeCar = () => {
    setHouse(false);
    setOffice(false);
    setCar(true);
    setOutDoor(false);
  };

  const activeOutDoor = () => {
    setHouse(false);
    setOffice(false);
    setCar(false);
    setOutDoor(true);
  };
  */

  const getExplain = () => {
    if (
      statePm25 === true &&
      statePm10 === false &&
      stateVOCs === false &&
      stateCO2 === false
    ) {
      return <Pm25Explain />;
    } else if (
      statePm25 === false &&
      statePm10 === true &&
      stateVOCs === false &&
      stateCO2 === false
    ) {
      return <Pm10Explain />;
    } else if (
      statePm25 === false &&
      statePm10 === false &&
      stateVOCs === true &&
      stateCO2 === false
    ) {
      return <VOCsExplain />;
    } else if (
      statePm25 === false &&
      statePm10 === false &&
      stateVOCs === false &&
      stateCO2 === true
    ) {
      return <CO2Explain />;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderLabel={({route, focused, color}) => (
        <Text style={{color, margin: 5}}>{route.title}</Text>
      )}
      activeColor={colors.azure}
      inactiveColor={colors.brownGrey}
      indicatorStyle={{backgroundColor: colors.azure}}
      tabStyle={{width: 'auto'}}
      style={{backgroundColor: colors.white}}
      scrollEnabled={true}
    />
  );

  useEffect(() => {
    console.log('update once!');
    setTimeout(() => {
      setIsLoading(true);
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
        />
        <View style={{width: width}}>
          <Text style={styles.comfortZoneText}>
            {strings.details_subtitle_comfortzone}
          </Text>
        </View>

        {isLoading ? (
          <ComfortZone temp={temp} humd={humd} />
        ) : (
          <View style={styles.indicator}>
            <ActivityIndicator size="large" color={colors.azure} />
          </View>
        )}

        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={{marginTop: 30, flexDirection: 'row'}}
            onPress={() => setOpenTip((previousState) => !previousState)}>
            <Text style={styles.tipText}>Tip</Text>
            <Image
              source={
                openTip
                  ? require('../../../../Assets/img/iconsIcMiniarrowTop.png')
                  : require('../../../../Assets/img/iconsIcMiniarrowBottom.png')
              }
            />
          </TouchableOpacity>
          {openTip ? (
            <View style={styles.tipStyle}>
              {/* 곧 업데이트될 예정입니다.
            <View style={styles.place}>
              <View style={styles.placeStyle}>
                {house ? <View style={styles.placeActivatedDot}></View> : <View style={styles.placeInactivatedDot}></View>}
                <TouchableOpacity style={house ? styles.placeActivated : styles.placeInactivated} onPress={() => activeHouse()}>
                  <Image source={require('../../../../Assets/img/icHouse.png')} />
                </TouchableOpacity>
                <View style={styles.placeTextViewStyle}>
                  <Text style={house ? styles.placeActivatedText : styles.placeInactivatedText}>House</Text>
                </View>
              </View>
              <View style={styles.placeStyle}>
                {office ? <View style={styles.placeActivatedDot}></View> : <View style={styles.placeInactivatedDot}></View>}
                <TouchableOpacity
                  style={office ? styles.placeActivated : styles.placeInactivated}
                  onPress={() => activeOffice()}>
                  <Image source={require('../../../../Assets/img/icOffice.png')} />
                </TouchableOpacity>
                <View style={styles.placeTextViewStyle}>
                  <Text style={office ? styles.placeActivatedText : styles.placeInactivatedText}>Office</Text>
                </View>
              </View>
              <View style={styles.placeStyle}>
                {car ? <View style={styles.placeActivatedDot}></View> : <View style={styles.placeInactivatedDot}></View>}
                <TouchableOpacity style={car ? styles.placeActivated : styles.placeInactivated} onPress={() => activeCar()}>
                  <Image source={require('../../../../Assets/img/icCar.png')} />
                </TouchableOpacity>
                <View style={styles.placeTextViewStyle}>
                  <Text style={car ? styles.placeActivatedText : styles.placeInactivatedText}>Car</Text>
                </View>
              </View>
              <View style={styles.placeStyle}>
                {outDoor ? <View style={styles.placeActivatedDot}></View> : <View style={styles.placeInactivatedDot}></View>}
                <TouchableOpacity
                  style={outDoor ? styles.placeActivated : styles.placeInactivated}
                  onPress={() => activeOutDoor()}>
                  <Image source={require('../../../../Assets/img/icOutdoor.png')} />
                </TouchableOpacity>
                <View style={styles.placeTextViewStyle}>
                  <Text style={outDoor ? styles.placeActivatedText : styles.placeInactivatedText}>Outdoor</Text>
                </View>
              </View>
            </View>
            <View style={styles.tipTextViewFirst}>
              <Text style={[styles.tipText, { marginTop: 0 }]}>
                Today you can use artificial tears to clean your eyes after going out.
              </Text>
              <Text style={styles.tipText}>And the best way to prevent yourself is to wash your hands often.</Text>
            </View>
            */}
              <View style={styles.state}>
                <View style={styles.stateStyle}>
                  {statePm25 ? (
                    <View style={styles.stateActivatedDot}></View>
                  ) : (
                    <View style={styles.stateInactivatedDot}></View>
                  )}
                  <TouchableOpacity
                    style={
                      statePm25
                        ? styles.stateActivated
                        : styles.stateInactivated
                    }
                    onPress={() => activePm25()}>
                    <Image
                      source={require('../../../../Assets/img/icPm25.png')}
                    />
                  </TouchableOpacity>
                  <View style={styles.stateTextViewStyle}>
                    <Text
                      style={
                        statePm25
                          ? styles.stateActivatedText
                          : styles.stateInactivatedText
                      }>
                      {strings.detail_tip_info_label_pm25}
                    </Text>
                  </View>
                </View>
                <View style={styles.stateStyle}>
                  {statePm10 ? (
                    <View style={styles.stateActivatedDot}></View>
                  ) : (
                    <View style={styles.stateInactivatedDot}></View>
                  )}
                  <TouchableOpacity
                    style={
                      statePm10
                        ? styles.stateActivated
                        : styles.stateInactivated
                    }
                    onPress={() => activePm10()}>
                    <Image
                      source={require('../../../../Assets/img/icPm10.png')}
                    />
                  </TouchableOpacity>
                  <View style={styles.stateTextViewStyle}>
                    <Text
                      style={
                        statePm10
                          ? styles.stateActivatedText
                          : styles.stateInactivatedText
                      }>
                      {strings.detail_tip_info_label_pm10}
                    </Text>
                  </View>
                </View>
                <View style={styles.stateStyle}>
                  {stateVOCs ? (
                    <View style={styles.stateActivatedDot}></View>
                  ) : (
                    <View style={styles.stateInactivatedDot}></View>
                  )}
                  <TouchableOpacity
                    style={
                      stateVOCs
                        ? styles.stateActivated
                        : styles.stateInactivated
                    }
                    onPress={() => activeVOCs()}>
                    <Image
                      source={require('../../../../Assets/img/icVoc.png')}
                    />
                  </TouchableOpacity>
                  <View style={styles.stateTextViewStyle}>
                    <Text
                      style={
                        stateVOCs
                          ? styles.stateActivatedText
                          : styles.stateInactivatedText
                      }>
                      {strings.detail_tip_info_label_vocs}
                    </Text>
                  </View>
                </View>
                <View style={styles.stateStyle}>
                  {stateCO2 ? (
                    <View style={styles.stateActivatedDot}></View>
                  ) : (
                    <View style={styles.stateInactivatedDot}></View>
                  )}
                  <TouchableOpacity
                    style={
                      stateCO2 ? styles.stateActivated : styles.stateInactivated
                    }
                    onPress={() => activeCO2()}>
                    <Image
                      source={require('../../../../Assets/img/icCo2.png')}
                    />
                  </TouchableOpacity>
                  <View style={styles.stateTextViewStyle}>
                    <Text
                      style={
                        stateCO2
                          ? styles.stateActivatedText
                          : styles.stateInactivatedText
                      }>
                      {strings.detail_tip_info_label_co2}
                    </Text>
                  </View>
                </View>
              </View>
              {getExplain()}
              <View style={{marginBottom: 40}}></View>
            </View>
          ) : (
            <View style={{marginVertical: 40}}></View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: colors.white,
  },
  scene: {
    height: height * 0.5,
  },
  comfortZoneText: {
    marginLeft: 12,
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.greyishBrown,
  },
  indicator: {
    height: height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  text: {
    fontFamily: 'NotoSans',
    color: colors.brownGrey,
  },
  tipStyle: {alignItems: 'center', flexDirection: 'column', marginTop: 20},
  /* 곧 업데이트될 예정입니다.
  place: { flexDirection: 'row', width: width * 0.9 },
  placeStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 16,
    marginHorizontal: width * 0.05,
  },
  placeActivatedDot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: colors.azure,
  },
  placeInactivatedDot: {
    width: 6,
    height: 6,
    borderRadius: 5,
  },
  placeActivated: {
    marginTop: 8,
    width: 48,
    height: 48,
    backgroundColor: colors.azure,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeInactivated: {
    marginTop: 8,
    width: 48,
    height: 48,
    backgroundColor: colors.veryLightPink,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeTextViewStyle: { marginTop: 4 },
  placeActivatedText: { color: colors.azure, fontFamily: 'regular' },
  placeInactivatedText: { color: colors.brownGrey, fontFamily: 'regular' },
  tipTextViewFirst: { width: width * 0.9, height: 80 },
  tipTextViewSecond: { width: width * 0.9 },
  tipText: {
    color: '#757575',
    lineHeight: 20,
    fontStyle: 'normal',
    fontSize: 12,
    letterSpacing: 0,
    marginTop: 16,
  },
  */
  stateStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
    marginHorizontal: width * 0.05,
  },
  state: {flexDirection: 'row', marginTop: 16},
  stateActivatedDot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: colors.azure,
  },
  stateInactivatedDot: {
    width: 6,
    height: 6,
  },
  stateActivated: {
    marginTop: 8,
    width: 48,
    height: 48,
    backgroundColor: colors.azure,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateInactivated: {
    marginTop: 8,
    width: 48,
    height: 48,
    backgroundColor: colors.veryLightPink,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateTextViewStyle: {marginTop: 4},
  stateActivatedText: {
    color: colors.azure,
    fontFamily: 'NotoSans',
    textAlign: 'center',
  },
  stateInactivatedText: {
    color: colors.brownGrey,
    fontFamily: 'NotoSans',
    textAlign: 'center',
  },
});
