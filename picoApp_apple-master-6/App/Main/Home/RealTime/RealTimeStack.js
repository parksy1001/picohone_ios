import React, { useState, useEffect, useContext } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  DeviceContext,
  DeviceAndAirInfoContext,
  SnapShotAndCountContext,
  LanguageContext,
  OnlineContext,
} from '../../../context';
import { Home } from './Home';
import { ViewAll } from './ViewAll';
import database from '@react-native-firebase/database';
import NetInfo from '@react-native-community/netinfo';
import colors from '../../../src/colors';

var co2=[], humid=[], pm10=[], pm25=[], temperature=[], tvoc=[];

const RealTimeStack = createStackNavigator();
export const RealTimeStackScreen = () => {
  const strings = useContext(LanguageContext);
  // 이전 snapshot이랑 count 확인을 위해 만들어 놓았는데
  // 생각보다 좀 불안정한 것 같다.
  let deviceTempSnapAndCount = [];
  let deviceTempAirInfo = [];
  let deviceAirInfo = [];
  // Internet 연결 확인 필요.

  const devices = useContext(DeviceContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const [airInfoState, setAirInfoState] = useState([]);
  const [deviceAndAirInfo, setDeviceAndAirInfo] = useState([]);
  const [deviceSnapAndCount, setDeviceSnapAndCount] = useState([]);

  const [refresh, setRefresh] = useState(true);

  // RealtimeData를 호출
  const getRealtimeAirInfo2 = (idx) => {

    var date= new Date();
    date.setSeconds(date.getSeconds()-10);
    date= date.toISOString();
    var start_time= date.substring(0,4)+date.substring(5,7)+date.substring(8,10)+date.substring(11,13)+date.substring(14,16)+date.substring(17,19);
    var d = new Date();
    var v = new Date();
    v.setMinutes(d.getMinutes()+30);
    v=v.toISOString();
    var end_time= v.substring(0,4)+v.substring(5,7)+v.substring(8,10)+v.substring(11,13)+v.substring(14,16)+v.substring(17,19);

      try {
        fetch('http://mqtt.brilcom.com:8080/mqtt/GetAirQuality', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',//서버로 보낼 때 무엇으로 보내는 것인지 알려줌
          },
          body: JSON.stringify({

            "serialNum" : devices[idx].SerialNum,
            "startTime" : start_time,
            "endTime"   : end_time,
            "type" : "Co2,Humid,Pm10,Pm25,Temperature,Tvoc"
          }),
        })
          .then((response) => response.json())
          .then((res) => {

            if (res.data.length>0) {
              co2[idx]= res.data[0].Co2;
              humid[idx]= res.data[0].Humid;
              pm10[idx]= res.data[0].Pm10;
              pm25[idx]= res.data[0].Pm25;
              temperature[idx]= res.data[0].Temperature;
              tvoc[idx]= res.data[0].Tvoc;
            }
          });
      } catch (exception) {
        console.log('ERROR :: ', exception);
      }
  };

  const getRealtimeAirInfo = (idx) => {
    let year = database().getServerTime().getFullYear();
    let month = leadingZeros(database().getServerTime().getMonth() + 1, 2);
    let day = leadingZeros(database().getServerTime().getUTCDate(), 2);
    let hour = leadingZeros(database().getServerTime().getUTCHours(), 2);
    let min = leadingZeros(database().getServerTime().getMinutes(), 2);
    let sec = leadingZeros(checkMinus(database().getServerTime().getSeconds() - 1), 2);
    let uri = '/devices/' + devices[idx].SerialNum + '/' + year + month + day + hour + min + sec;

    
    database()
      .ref(uri)
      .once('value')
      .then((snapshot) => {
        snapshotToArray(snapshot, idx);
      });
      
  };


  // 전달받은 숫자가 음수이면 0으로 치환
  // RealtimeData 호출시 초가 0-2초 사이일 경우 음수로 가는 것을 방지
  const checkMinus = (props) => {
    if (props < 0) {
      return 0;
    } else {
      return props;
    }
  };

  // 한자리 수 숫자일 경우 십의 자리 수에 0추가
  function leadingZeros(n, digits) {
    let zero = '';
    n = n.toString();
    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++) zero += '0';
    }
    return zero + n;
  }

  // 데이터 오브젝트를 스트링으로 변환 후 deviceTempAirInfo에 push



  function snapshotToArray(snapshot, idx) {
    //let item = snapshot.val();
    let item = {"value": "10050100050100f403017c0101a901000401"};
    let s = '000000000000000000000000000000000000';
    // 데이터 오브젝트를 불러오지 못했으면 s를 0으로 나열한 값으로 대체
    // 하지만 이건 이제 옜날 방법이다.
    let a = new Object();
    a.s = s;
    a.c = 5;
    if (item === null) {
      // item이 null이고 이전 snapshot이 있다면
      // 단순히 Realtime DB에서 정보를 load하지 못했거나
      // 기기가 어플 시작 후 중간에 꺼진 것
      if (deviceSnapAndCount[idx]) {
        // count가 5보다 작으면 count에 1추가
        // 이전 스냅샷을 그대로 현재 스냅샷에 사용
        if (deviceSnapAndCount[idx].c < 5) {
          a.c = deviceSnapAndCount[idx].c + 1;
          a.s = deviceSnapAndCount[idx].s;
        } else {
          /* count가 5이상이면 offline 처리, 기기가 꺼진것으로 간주한다. */
        }
        deviceTempAirInfo.push(a.s);
        deviceTempSnapAndCount.push(a);
      }
      // item이 null이고 이전 snapshot이 없다면
      // 최초 시작 직후 그리고 기기가 꺼져있는 채로 어플 시작한 경우
      // 바로 count를 5로 만들어서 오프라인 표시
      else {
        deviceTempAirInfo.push(a.s);
        deviceTempSnapAndCount.push(a);
      }
    }
    // item이 null이 아니고 Realtime DB에서 값을 load했을 경우
    else {
      //console.log('Get realtime data success!');
      // 현재 스냅샷에 불러온 값을 저장
      // count를 0으로 초기화
      a.s = item.value;
      a.c = 0;
      deviceTempAirInfo.push(a.s);
      deviceTempSnapAndCount.push(a);
    }
  }

  // 36자리 info data parsing
  const makeStat = (props) => {
    let stat = props.substring(0, 4);
    let sum = 0;  
    let hex = 4096;
    for (let i = 0; i < 4; i++) {
      let c = stat.charAt(i);
      sum += parseInt(c, 16) * hex;
      hex /= 16; // hex : 4096->256->16->1
    }
    return sum;
  };

  // 등록된 Device들의 정보가 바뀌면 airInfo 새로 Load.
  // refresh값이 변경 될 경우 airInfo 새로 Load.
  useEffect(() => {

    if (devices.length != 0) {
      for (let i = 0; i < devices.length; i++) {
        getRealtimeAirInfo2(i);
        getRealtimeAirInfo(i);     
      }
    } else {
      setDeviceAndAirInfo([]);
      setDeviceSnapAndCount([]);
    }
    setTimeout(() => {
      setAirInfoState(deviceTempAirInfo);
      setDeviceSnapAndCount(deviceTempSnapAndCount);
    }, 1000);

  }, [devices, refresh]);

  // 3초 마다 한번씩 refresh값 변경 realtime database에 접근
  useEffect(() => {

    let time10 = setInterval(() => {
      NetInfo.fetch().then((state) => {

        if (!state.isConnected) {
          setIsOnline(false);
        } else {
          setIsOnline(true);
        }
      });
      setRefresh((prev) => !prev);
    }, 3000);
    return function cleanup() {
      clearInterval(time10);
    };
  });

  // airInfoState가 변경될 경우 해당 정보를 토대로 새로운 airInfo를 생성.
  useEffect(() => {
    // 여기도 처리를 이렇게 해야할까?
    //console.log("airInfoState"+airInfoState);
    if (airInfoState.length != 0) {
      if (devices.length != 0) {
        // 이걸 이렇게 바인딩 시켜야 하나ㅠ
        if (airInfoState.length === devices.length && deviceSnapAndCount.length === devices.length) {
          for (let i = 0; i < devices.length; i++) {
            let a = new Object();
            a.Id = i;
            a.Description = devices[i].Description;
            a.DeviceId = devices[i].DeviceId;
            a.ModelName = devices[i].ModelName;
            a.PicoName = devices[i].PicoName;
            a.SerialNum = devices[i].SerialNum;

            let stateInfo = new Object();
            stateInfo.pm25 = parseInt(pm25[i]);
            stateInfo.pm10 = parseInt(pm10[i]);
            stateInfo.temp = parseInt(temperature[i]);
            stateInfo.humd = parseInt(humid[i]);
            stateInfo.co2 =  parseInt(co2[i]);
            stateInfo.vocs = parseInt(tvoc[i]);
            a.stateInfo = stateInfo;

            deviceAirInfo.push(a);
          }
          setDeviceAndAirInfo(deviceAirInfo);
        }
      } else {
        setDeviceAndAirInfo([]);
        setDeviceSnapAndCount([]);
      }
    }
  }, [airInfoState]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 1000);
  }, []);

  return (
    <DeviceAndAirInfoContext.Provider value={deviceAndAirInfo}>
      <SnapShotAndCountContext.Provider value={deviceSnapAndCount}>
        <OnlineContext.Provider value={isOnline}>
          {isLoading ? (
            <RealTimeStack.Navigator>
              <RealTimeStack.Screen
                name="Home"
                component={Home}
                options={{
                  headerShown: false,
                }}
              />
              <RealTimeStack.Screen
                name="ViewAll"
                component={ViewAll}
                options={{
                  title: strings.viewall_title,
                  headerTransparent: true,
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    fontFamily: 'NotoSans-Bold',
                  },
                  headerBackImage: () => <Image source={require('../../../../Assets/img/icArrowLeft.png')} />,
                }}
              />
            </RealTimeStack.Navigator>
          ) : (
            <View style={styles.indicator}>
              <ActivityIndicator size="large" color={colors.azure} />
            </View>
          )}
        </OnlineContext.Provider>
      </SnapShotAndCountContext.Provider>
    </DeviceAndAirInfoContext.Provider>
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
