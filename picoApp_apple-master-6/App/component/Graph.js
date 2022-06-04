import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, Shape } from 'react-native';
import { DeviceContext, PicoContext, UserContext } from '../context';
import { LineChart, Grid, XAxis, BarChart, AreaChart, Path } from 'react-native-svg-charts';
import { Circle, G, Rect, Text, ClipPath, Line, Defs, Svg } from 'react-native-svg';
import colors from '../src/colors';
import Tooltip from './Tooltip';
import cal from '../src/calculate';
import cnt from '../src/constant';

export const Graph = (props) => {
  let tempArray = [];
  let TimeArray = [
    "00:00", "00:15", "00:30", "00:45", "01:00", "01:15", "01:30", "01:45",
    "02:00", "02:15", "02:30", "02:45", "03:00", "03:15", "03:30", "03:45", "04:00", "04:15", "04:30", "04:45", "05:00", "05:15", "05:30", "05:45",
    "06:00", "06:15", "06:30", "06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45",
    "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45",
    "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45",
    "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45",
    "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45", "val"
  ];
  let min=10000;
  let max=0;
  let count=0;
  let tempArrayTime = [];
  let finalArray = [];
  const date = new Date();
  const userInfo = useContext(UserContext);
  const device = useContext(DeviceContext);
  const id = useContext(PicoContext);
  // 그래프에 섭씨 화씨 변경 적용하지 말자.
  // const tempMod = useContext(TempContext);

  const xAxisDataNum = [0, 3, 6, 9, 12, 15, 18, 21, 24];
  const axesSvg = { fontSize: 10, fill: 'grey' };
  const verticalContentInset = { top: 10, bottom: 10 };

  const xAxisHeight = 50;
  const air = [props.state];
  const [isLoading, setIsLoading] = useState(false);

  const [tooltipX, setToolTipX] = useState(0);
  const [tooltipY, setToolTipY] = useState(0);
  const [tooltipIndex, setToolTipIndex] = useState(0);
  const [tooltipColor, setToolTipColor] = useState(0);

  const [deviceAirInfo, setDeviceAirInfo] = useState(0);
  const [stateArray, setStateArray] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  const CustomLines = ({ x, y, data }) => {

    return data.map((value, index, array) => {

      if (index + 1 < array.length-1 ) {
        if (array[index] && array[index + 1]) {
          return (<Line key={index} stroke={'#E7E7E7'} strokeWidth={2} x1={x(index)} x2={x(index + 1)} y1={y(array[index])} y2={y(array[index + 1])}/>)
        } else {
          if ((array[index] == 0) && (0 < index)) {
            if (array[index - 1] && array[index + 1]) {
              return (<Line key={index} stroke={'#E7E7E7'} strokeWidth={2} x1={x(index-1)} x2={x(index + 1)} y1={y(array[index-1])} y2={y(array[index + 1])}/>)
            }
          } else {
             return ( <Line key={index} stroke={'transparent'} strokeWidth={2} x1={x(index)} x2={x(index + 1)} y1={y(array[index])} y2={y(array[index + 1])}/>)
            }
         }
        }
      });
    };

  const CustomDashedLines = ({ x, y, data }) => {

    return data.map((value, index, array) => {

      if ((index + 2 < array.length-2)) {

        if((array[index]!=0)&& (array[index+1]!=0)){

        }else if((array[index]==0)&& (array[index+1]==0)){

        }else {
          if(array[index]!=0){
            for( var i=index+2; i<array.length-2; i++){
              if((array[i]!= 0)) break;
            }
            if(array[i]!=0){
                return(<Line key={index} stroke={'#E7E7E7'} strokeWidth={2} x1={x(index)} x2={x(i)} y1={y(array[index])} y2={y(array[i])}/>);
              }
            }
        }
      }
    });
  };

  function getTimeBefore() {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();

    const time_diff = date.getTimezoneOffset() / 60;
    // 현재 날짜에서 주어진 parameter만큼 day 값을 뺐을 때 0 이하의 음수일 경우
    // day, month, year 값 변경 사항을 보정해준다.
    if (d - (props.day) <= 0) {
      // m(month)값이 1, 2, 4, 6, 8, 9, 11일 경우
      if (m === 1 || m === 2 || m === 4 || m === 6 || m === 8 || m === 9 || m === 11) {
        if (m === 1) {
          // m 값이 1일 경우
          y -= 1; // y 값에서 -1 => 해가 바뀐 경우
          m = 12; // m 값은 12로 설정 => 이전 해의 마지막 달
        } else {
          // 그 외
          m -= 1; // m 값에서 -1
        }
        d += 31 - props.day; // 이전 월의 날짜 최대값이 31이므로 (현재 날짜 + 31 - parameter)를 d에 대입
      }
      // m 값이 5, 7, 10, 12일 경우
      else if (m === 5 || m === 7 || m === 10 || m === 12) {
        m -= 1; // m 값에서 -1
        d += 30 - props.day; // 이전 월의 날짜 최대값이 30이므로 (현재 날짜 + 30 - parameter)를 d에 대입
      }
      // m 값이 3일 경우
      else {
        // y가 윤년일 경우
        if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
          // 이전 월(2월)의 날짜 최대값이 29이므로 (현재 날짜 + 29 - parameter)를 d에 대입
          d += 29 - props.day;
        }
        // y가 윤년이 아닐 경우
        else {
          // 이전 월(2월)의 날짜 최대값이 28이므로 (현재 날짜 + 28 - parameter)를 d에 대입
          d += 28 - props.day;
        }
        m = 2; // m 값에 2 대입
      }
    }
    // 현재 날짜에서 주어진 parameter만큼 day 값을 뺐을 때 1이상의 양수일 경우
    else {
      d = d - props.day; // 현재 날짜에서 parameter만큼 뺀 값을 d에 대입
    }
    
    // 'YYYY-MM-DD 00:00:00'의 형태의 문자열 s
    let s = leadingZeros(y, 4) + '-' + leadingZeros(m, 2) + '-' + leadingZeros(d, 2) + 'T' + '23:59:00.000';
    const year = parseInt(leadingZeros(y, 4));
    const month = parseInt(leadingZeros(m, 2));
    const day = parseInt(leadingZeros(d, 2));

    const new_date_start = new Date();
    new_date_start.setUTCFullYear(year, month - 1, day);
    new_date_start.setUTCHours(0);
    new_date_start.setUTCMinutes(0);
    new_date_start.setUTCSeconds(0);
    new_date_start.setUTCMilliseconds(0);
    new_date_start.setUTCHours(new_date_start.getUTCHours()+time_diff);

    let s1 = new_date_start.toISOString()
    s1= s1.substring(0,4)+s1.substring(5,7)+s1.substring(8,10)+s1.substring(11,13)+s1.substring(14,16)+s1.substring(17,19);
    const new_date_end = new Date();
    new_date_end.setUTCFullYear(new_date_start.getUTCFullYear(), new_date_start.getUTCMonth(), new_date_start.getUTCDate());
    new_date_end.setUTCHours(23);
    new_date_end.setUTCMinutes(59);
    new_date_end.setUTCSeconds(0);
    new_date_end.setUTCMilliseconds(0);

    let s2 = new_date_end.toISOString()
    s2= s2.substring(0,4)+s2.substring(5,7)+s2.substring(8,10)+s2.substring(11,13)+s2.substring(14,16)+s2.substring(17,19);

    console.log('getTimeBeforeResult : ' + s1 + ',' + s2);
    return [s1, s2];
  }

  // getTimeStamp() 보다 parameter의 값이 1 더 큼
  // getTimeStamp의 return값이 '2020-01-01'일 경우
  // getTimeBefore의 return값은 '2019-12-31'이 됨.
  function getTimeAfter() {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();

    const time_diff = date.getTimezoneOffset() / 60;

    if (d - (props.day) <= 0) {
      if (m === 1 || m === 2 || m === 4 || m === 6 || m === 8 || m === 9 || m === 11) {
        if (m === 1) {
          y -= 1;
          m = 12;
        } else {
          m -= 1;
        }
        d += 31 - (props.day);
      } else if (m === 5 || m === 7 || m === 10 || m === 12) {
        m -= 1;
        d += 30 - (props.day);
      } else {
        if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
          d += 29 - (props.day);
        } else {
          d += 28 - (props.day);
        }z
        m = 2;
      }
    } else {
      d = d - (props.day);
    }

    let s = leadingZeros(y, 4) + '-' + leadingZeros(m, 2) + '-' + leadingZeros(d, 2) + 'T' + '00:00:00.000';
    const year = parseInt(leadingZeros(y, 4));
    const month = parseInt(leadingZeros(m, 2));
    const day = parseInt(leadingZeros(d, 2));

    const new_date_start = new Date();
    new_date_start.setUTCFullYear(year, month - 1, day);
    new_date_start.setUTCHours(23);
    new_date_start.setUTCMinutes(59);
    new_date_start.setUTCSeconds(0);
    new_date_start.setUTCMilliseconds(0);
    new_date_start.setUTCHours(new_date_start.getUTCHours()+time_diff);
  

    let s1 = new_date_start.toISOString();
    s1= s1.substring(0,4)+s1.substring(5,7)+s1.substring(8,10)+s1.substring(11,13)+s1.substring(14,16)+s1.substring(17,19);

    const new_date_end = new Date();
    new_date_end.setUTCFullYear(new_date_start.getUTCFullYear(), new_date_start.getUTCMonth(), new_date_start.getUTCDate());
    new_date_end.setUTCHours(0);
    new_date_end.setUTCMinutes(0);
    new_date_end.setUTCSeconds(0);
    new_date_end.setUTCMilliseconds(0);

    let s2 = new_date_end.toISOString()
    s2= s2.substring(0,4)+s2.substring(5,7)+s2.substring(8,10)+s2.substring(11,13)+s2.substring(14,16)+s2.substring(17,19);

    console.log('getTimeAfterResult : ' + s2 + ',' + s1);
    return [s2, s1];
  }


  function leadingZeros(n, digits) {
    let zero = '';
    n = n.toString();

    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++) zero += '0';
    }
    return zero + n;
  }

  // State에 따라서 getDotColor 함수를 변경해준다.
  const setDotColorFunction = (value, index) => {
    var getDotColor = {
      // State가 Pm2.5일 경우

      Pm25: (value, index) => {
        if(index==96 || value ==0){
          return 'transparent';
        }
        if (cal.boundaryPM25(value) === cnt.PM25_GOOD)
          return colors.azure;
        else if (cal.boundaryPM25(value) === cnt.PM25_MOD)
          return colors.darkLimeGreen;
        else if (cal.boundaryPM25(value) === cnt.PM25_BAD)
          return colors.lightOrange;
        else if (cal.boundaryPM25(value) === cnt.PM25_VERY_BAD)
          return colors.coral;
      },
      // State가 Pm10일 경우
      Pm10: (value) => {
        if(index==96 || value ==0){
          return 'transparent';
        }
        else if (0 < value && value <= 30) {
          return colors.azure;
        } else if (31 <= value && value <= 80) {
          return colors.darkLimeGreen;
        } else if (81 <= value && value <= 150) {
          return colors.lightOrange;
        } else if (150 < value) {
          return colors.coral;
        }
      },
      // State가 Temperature일 경우
      Temperature: (value) => {
        if(index==96 || value ==0){
          return 'transparent';
        }
        else if (0 < value && value <= 9) {
          return colors.azure;
        } else if (9 < value && value <= 29) {
          return colors.darkLimeGreen;
        } else if (29 < value && value <= 49) {
          return colors.lightOrange; x
        } else if (49 < value) {
          return colors.coral;
        }
      },
      // State가 Humid일 경우
      Humid: (value) => {
        if(index==96 || value ==0){
          return 'transparent';
        }
        else  if (0 < value && value <= 39) {
          return colors.coral;
        } else if (39 < value && value <= 60) {
          return colors.darkLimeGreen;
        } else if (60 < value && value <= 100) {
          return colors.azure;
        }
      },
      // State가 VOCs일 경우
      Tvoc: (value) => {
        if(index==96 || value ==0){
          return 'transparent';
        }
        else if (0 < value && value <= 249) {
          return colors.azure;
        } else if (250 <= value && value <= 449) {
          return colors.darkLimeGreen;
        } else if (450 <= value) {
          return colors.coral;
        }
      },
      // State가 CO2일 경우
      Co2: (value) => {
        if(index==96 || value ==0){
          return 'transparent';
        }
        else if (0 < value && value <= 800) {
          return colors.azure;
        } else if (801 <= value && value <= 1000) {
          return colors.darkLimeGreen;
        } else if (1001 <= value && value <= 2000) {
          return colors.lightOrange;
        } else if (2000 < value) {
          return colors.coral;
        }
      },
    };
    // State에 맞는 getDotColor함수에 parameter로 value 전달 및 값 반환
    return getDotColor[props.state](value, index);
  };

  // State별 수치별 Min/Max Box width 변경
  const setMBoxWidth = (num) => {
    var setWidth = {
      // State가 Pm2.5일 경우
      Pm25: (num) => {
        num = num.toString();
        var numDigit = 1;
        numDigit = num.length;
        if (numDigit === 1) {
          return 90;
        } else if (numDigit === 2) {
          return 100;
        } else if (numDigit === 3) {
          return 110;
        } else {
          return 0;
        }
      },
      // State가 Pm10일 경우
      Pm10: (num) => {
        num = num.toString();
        var numDigit = num.length;
        if (numDigit === 1) {
          return 90;
        } else if (numDigit === 2) {
          return 100;
        } else if (numDigit === 3) {
          return 110;
        } else {
          return 0;
        }
      },
      // State가 Temperature일 경우
      Temperature: (num) => {
        num = num.toString();
        var numDigit = num.length;
        if (numDigit === 1) {
          return 70;
        } else if (numDigit === 2) {
          return 80;
        } else if (numDigit === 3) {
          return 90;
        } else {
          return 0;
        }
      },
      // State가 Humid일 경우
      Humid: (num) => {
        num = num.toString();
        var numDigit = num.length;
        if (numDigit === 1) {
          return 65;
        } else if (numDigit === 2) {
          return 75;
        } else if (numDigit === 3) {
          return 85;
        } else {
          return 0;
        }
      },
      // State가 VOCs일 경우
      Tvoc: (num) => {
        num = num.toString();
        var numDigit = num.length;
        if (numDigit === 1) {
          return 80;
        } else if (numDigit === 2) {
          return 90;
        } else if (numDigit === 3) {
          return 97;
        } else {
          return 0;
        }
      },
      // State가 CO2일 경우
      Co2: (num) => {
        num = num.toString();
        var numDigit = num.length;
        if (numDigit === 1) {
          return 80;
        } else if (numDigit === 2) {
          return 90;
        } else if (numDigit === 3) {
          return 100;
        } else if (numDigit === 4) {
          return 107;
        } else {
          return 0;
        }
      },
    };
    // State에 맞는 getDotColor함수에 parameter로 value 전달 및 값 반환
    return setWidth[props.state](num);
  };

  // State에 따라 알맞은 Tooltip의 단위 반환
  function setUnit(stateName) {
    if (stateName === 'Pm25' || stateName === 'Pm10') {
      return '㎍/㎥';
    } else if (stateName === 'Tvoc') {
      return 'ppb';
    } else if (stateName === 'Co2') {
      return 'ppm';
    } else if (stateName === 'Temperature') {
      return '°C';
    } else if (stateName === 'Humid') {
      return '%';
    }
  }

  const setStateNameForAPI = (stateName) => {
    if (stateName === 'Pm25')
      return 'pm25'
    else if (stateName === 'Pm10')
      return 'pm10'
    else if (stateName === 'Temperature')
      return 'temperature'
    else if (stateName === 'Humid')
      return 'humidity'
    else if (stateName === 'Tvoc')
      return 'tvoc'
    else if (stateName === 'Co2')
      return 'co2'
  }

  /**
   * UTC 에서 local 시간으로 바꿨을 때 하루를 걸칠 수 밖에 없음
   * 예: 2022-05-26T15:00:00 ~ 2022-05-27T14:45:00 (UTC 27일 기준으로 했을 때의 한국 시간)
   * 이렇게 GetAirQualityForChart API 로 보내면 에러("Query condition time period 24 Hour within")가 나기 때문에 
   * <getTimeBefore> 2022-05-26T15:00:00 ~ 2022-05-26T23:59:00 
   * <getTimeAfter> 2022-05-27T00:00:00 ~ 2022-05-27T14:45:00 2번 나눠서 API 를 호출함
   */
  function makeDeviceAirInfo() {
    const [s1, s2] = getTimeBefore()
    const [s3, s4] = getTimeAfter()
    let tempDeviceAirInfo = []

    try {
      fetch('http://mqtt.brilcom.com:8080/mqtt/GetAirQualityForChart', {
        method: 'POST',

        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',//서버로 보낼 때 무엇으로 보내는 것인지 알려줌
        },
        body: JSON.stringify({
          serialNum: device[id].SerialNum,
          // serialNum: "AC67B25CC502",
          startTime: s1,
          endTime: s2,
          type: props.state
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.result === 'success') {
          tempDeviceAirInfo = [...res.data]

            fetch('http://mqtt.brilcom.com:8080/mqtt/GetAirQualityForChart', {
              method: 'POST',
      
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',//서버로 보낼 때 무엇으로 보내는 것인지 알려줌
              },
              body: JSON.stringify({
                serialNum: device[id].SerialNum,
                // serialNum: "AC67B25CC502",
                startTime: s3,
                endTime: s4,
                type: props.state
              }),
            })
              .then((response) => response.json())
              .then((res) => {
                tempDeviceAirInfo = [...tempDeviceAirInfo, ...res.data]
                
                const timezoneOffset = new Date().getTimezoneOffset() * 60000;

                // UTC 시간으므로 로컬 시간으로 바꿔줘야 함.
                tempDeviceAirInfo = tempDeviceAirInfo.map(item => {
                  return {
                  ...item,
                  ReportTime: new Date(new Date(item.ReportTime) * 1 - timezoneOffset).toISOString(),
                  }
              })
                setDeviceAirInfo(tempDeviceAirInfo);
            })
          }
       })
    } catch (exception) {
      console.log('ERROR :: ', 'GetAirQualityForChart', exception);
    }
  }



  //mqtt 이전 버전
  {/*
  function makeDeviceAirInfo() {
    fetch('https://us-central1-pico-home.cloudfunctions.net/GetAirInfo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userInfo.userid,
        serialNum: device[id].SerialNum,
        startTime: getTimeBefore(),
        endTime: getTimeStamp(),
        apiKey: userInfo.apiKey
      }),
    })
      .then((response) => response.json())
      .then((res) => {

       //console.log(res.Info.AirInfo[0].ReportTime);
       const ReportTime = res.Info.AirInfo[0].ReportTime;

       console.log(ReportTime);
       const AirType= res.Info.AirInfo[0][props.state];
       console.log(AirType);
       setDeviceAirInfo(ReportTime, AirType);

    });

  };
*/}
  // 그래프의 값을 Dot으로 표현
  const Decorator = ({ x, y, data, line }) => {
    return data.map((value, index) => (
      <Circle
        key={index}
        cx={x(index)}
        cy={y(value)}
        r={2}
        fill={setDotColorFunction(value,index)}
        // Dot 크기가 작아서 그런건지 터치가 빠르게 반응을 안 한다.
        onPress={() => {
          setToolTipX(value);
          setToolTipY(value);
          setToolTipIndex(index);
          setToolTipColor(setDotColorFunction(value));
        }}/>
        ));
      };


  // 일정 구간('YYYY-MM-DD 00:00:00' ~ 'YYYY-MM-DD 00:00:00')동안 측정된 AirInfo를 가져온다.
  // deviceAirInfo를 업데이트
  useEffect(() => {
    makeDeviceAirInfo();
  }, []);

  // deviceAirInfo가 변경될 경우
  useEffect(() => {
    
    try {
      for (let i = 0; i < deviceAirInfo.length; i++) {
        tempArray.push(parseFloat(deviceAirInfo[i][setStateNameForAPI(props.state)]));
        tempArrayTime.push(deviceAirInfo[i]['ReportTime'].substring(11, 16));
      }
      
      for (let i = 0; i < 96; i++) {
        for (let j = 0; j < tempArray.length; j++) {
          if (TimeArray[i] == tempArrayTime[j]) {
            finalArray[i] = tempArray[j];
          }
        }
      }

      for (let i = 0; i < 96; i++) {
        if (finalArray[i] == null) {
          finalArray[i] = 0;
        }
      }
      
      setMinValue(Math.min.apply(null, finalArray)); // 최소값을 저장
      setMaxValue(Math.max.apply(null, finalArray)); // 최대값을 저장

      for (let i = 0; i < 96; i++) {
        if(finalArray[i]>max){
            max=finalArray[i];
        }
      }

      for (let i = 0; i < 96; i++) {
        if (finalArray[i] != 0) {
          if(finalArray[i]<min){
            min=finalArray[i];
          }
          count++
        }
      }

      if(count === 0){
        min=0;
      }

      setMinValue(min);
      setMaxValue(max);
      finalArray[96]= max+min;
      setStateArray(finalArray);
      setIsLoading(true);

      setTimeout(() => {
        tempArray = [];
        finalArray=[];
      }, 1000);

    } catch (exception) {
      //console.log(exception);
    }

  }, [deviceAirInfo]);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <LineChart
          style={{ flex: 1 }}
          data={stateArray}
          gridMin={0}
          yMin={minValue - 150}
          yMax={maxValue + 100}
          contentInset={{ top: 20, bottom: 50 }}
        >
          <CustomLines />
          <CustomDashedLines/>
          <Grid />
          <Decorator />
          <G>
            <Rect
              x={10}
              y={5}
              rx={5}
              ry={5}
              width={setMBoxWidth(maxValue)}
              height={30}
              fill={colors.white}
              stroke={colors.veryLightPink}
            />
            <Text x={20} y={25} stroke={setDotColorFunction(maxValue)}>
              Max : {maxValue} {setUnit(props.state)}
            </Text>
          </G>

          <G>
            <Rect
              x={10}
              y={315}
              rx={5}
              ry={5}
              width={setMBoxWidth(minValue)}
              height={30}
              fill={colors.white}
              stroke={colors.veryLightPink}
            />
            <Text x={20} y={335} stroke={setDotColorFunction(minValue)}>
              Min : {minValue} {setUnit(props.state)}
            </Text>
          </G>
          <Tooltip
            tooltipX={tooltipX}
            tooltipY={tooltipY}
            color={tooltipColor}
            index={tooltipIndex}
            dataLength={stateArray.length}
            state={props.state}
          />
        </LineChart>
      ) : (
          <View style={styles.indicator}>
            <ActivityIndicator size="large" color={colors.azure} />
          </View>
        )}
      <XAxis
        style={{ height: xAxisHeight }}
        data={xAxisDataNum}
        formatLabel={(index) => xAxisDataNum[index]}
        contentInset={{ left: 10, right: 10 }}
        svg={axesSvg}
      />

    </View>

  );
};

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
