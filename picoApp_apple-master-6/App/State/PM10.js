import React, {useContext, useState} from 'react';
import {View, Text, Dimensions, NativeModules} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {Graph} from '../component/Graph';
import week from '../src/week';
import colors from '../src/colors';
import {LocaleContext} from '../context';

const FirstRoute = () => (
  <View style={{width: width, height: height * 0.5}}>
    <Graph state="Pm10" day={6} />
  </View>
);

const SecondRoute = () => (
  <View style={{width: width, height: height * 0.5}}>
    <Graph state="Pm10" day={5} />
  </View>
);

const ThirdRoute = () => (
  <View style={{width: width, height: height * 0.5}}>
    <Graph state="Pm10" day={4} />
  </View>
);

const FourthRoute = () => (
  <View style={{width: width, height: height * 0.5}}>
    <Graph state="Pm10" day={3} />
  </View>
);

const FifthRoute = () => (
  <View style={{width: width, height: height * 0.5}}>
    <Graph state="Pm10" day={2} />
  </View>
);

const SixthRoute = () => (
  <View style={{width: width, height: height * 0.5}}>
    <Graph state="Pm10" day={1} />
  </View>
);

const SeventhRoute = () => (
  <View style={{width: width, height: height * 0.5}}>
    <Graph state="Pm10" day={0} />
  </View>
);

export const PM10Graph = () => {
  const locale = useContext(LocaleContext);

  const [date, setDate] = useState(new Date());
  const [index, setIndex] = useState(6);
  const [routes] = useState([
    {key: 'first', title: getTimeStamp(6)},
    {key: 'second', title: getTimeStamp(5)},
    {key: 'third', title: getTimeStamp(4)},
    {key: 'fourth', title: getTimeStamp(3)},
    {key: 'fifth', title: getTimeStamp(2)},
    {key: 'sixth', title: getTimeStamp(1)},
    {key: 'seventh', title: getTimeStamp(0)},
  ]);

  function getTimeStamp(day) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();

    if (d - day <= 0) {
      if (
        m === 1 ||
        m === 2 ||
        m === 4 ||
        m === 6 ||
        m === 8 ||
        m === 9 ||
        m === 11
      ) {
        if (m === 1) {
          y -= 1;
          m = 12;
        } else {
          m -= 1;
        }
        d += 31 - day;
      } else if (m === 5 || m === 7 || m === 10 || m === 12) {
        m -= 1;
        d += 30 - day;
      } else {
        if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
          d += 29 - day;
        } else {
          d += 28 - day;
        }
        m = 2;
      }
    } else {
      d = d - day;
    }

    // parameter가 적용된 날짜의 요일 정보를 저장
    let dayOfWeek =
      week[locale][
        new Date(
          leadingZeros(y, 4) +
            '-' +
            leadingZeros(m, 2) +
            '-' +
            leadingZeros(d, 2),
        ).getDay()
      ];

    let s = dayOfWeek + ' ' + leadingZeros(m, 2) + '/' + leadingZeros(d, 2);
    return s;
  }

  function leadingZeros(n, digits) {
    let zero = '';
    n = n.toString();

    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++) zero += '0';
    }
    return zero + n;
  }

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
    fifth: FifthRoute,
    sixth: SixthRoute,
    seventh: SeventhRoute,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderLabel={({route, focused, color}) => (
        <Text
          style={{
            width: width * 0.3,
            textAlign: 'center',
            fontFamily: 'NotoSans',
            color,
          }}>
          {focused ? route.title : route.title.split(' ')[1]}
        </Text>
      )}
      activeColor={colors.greyishBrown}
      inactiveColor={colors.brownGrey}
      indicatorStyle={{backgroundColor: 'transparent'}}
      tabStyle={{width: width * 0.3}}
      style={{
        backgroundColor: colors.veryLightPink,
        elevation: 0,
      }}
      scrollEnabled={true}
    />
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
    />
  );
};

const {width, height} = Dimensions.get('window');
