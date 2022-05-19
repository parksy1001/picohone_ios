import React, {useContext} from 'react';
import {G, Rect, Text} from 'react-native-svg';
import {TempContext} from '../context';
import colors from '../src/colors';

const Tooltip = ({x, y, tooltipY, color, index, state}) => {
  const tempMod = useContext(TempContext);
  // State에 따라 알맞은 Tooltip의 단위 반환
  function setUnit(stateName) {
    if (stateName === 'Pm25' || stateName === 'Pm10') {
      return '㎍/㎥';
    } else if (stateName === 'Tvoc') {
      return 'ppb';
    } else if (stateName === 'Co2') {
      return 'ppm';
    } else if (stateName === 'Temperature') {
      return tempMod ? '°F' : '°C';
    } else if (stateName === 'Humid') {
      return '%';
    }
  }

  // State에 따라 알맞은 Tooltip의 단위 반환
  function setTooltipBoxWidth(num) {
    var setWidth = {
      // State가 Pm2.5일 경우
      Pm25: (num) => {
        num = num.toString();
        numDigit = num.length;
        if (numDigit === 1) {
          return 55;
        } else if (numDigit === 2) {
          return 60;
        } else if (numDigit === 3) {
          return 65;
        } else {
          return 0;
        }
      },
      // State가 Pm10일 경우
      Pm10: (num) => {
        num = num.toString();
        numDigit = num.length;
        if (numDigit === 1) {
          return 55;
        } else if (numDigit === 2) {
          return 60;
        } else if (numDigit === 3) {
          return 65;
        } else {
          return 0;
        }
      },
      // State가 Temperature일 경우
      Temperature: (num) => {
        num = num.toString();
        numDigit = num.length;
        if (numDigit === 1) {
          return 45;
        } else if (numDigit === 2) {
          return 50;
        } else if (numDigit === 3) {
          return 55;
        } else {
          return 0;
        }
      },
      // State가 Humid일 경우
      Humid: (num) => {
        num = num.toString();
        numDigit = num.length;
        if (numDigit === 1) {
          return 38;
        } else if (numDigit === 2) {
          return 42;
        } else if (numDigit === 3) {
          return 48;
        } else {
          return 0;
        }
      },
      // State가 VOCs일 경우
      Tvoc: (num) => {
        num = num.toString();
        numDigit = num.length;
        if (numDigit === 1) {
          return 47;
        } else if (numDigit === 2) {
          return 53;
        } else if (numDigit === 3) {
          return 60;
        } else {
          return 0;
        }
      },
      // State가 CO2일 경우
      Co2: (num) => {
        num = num.toString();
        numDigit = num.length;
        if (numDigit === 1) {
          return 52;
        } else if (numDigit === 2) {
          return 57;
        } else if (numDigit === 3) {
          return 62;
        } else if (numDigit === 4) {
          return 68;
        } else {
          return 0;
        }
      },
    };
    // State에 맞는 getDotColor함수에 parameter로 value 전달 및 값 반환
    return setWidth[state](num);
  }

  return (
    <G x={x(index)} y={y(tooltipY)}>
      <Rect
        x={-35}
        y={5}
        width={setTooltipBoxWidth(tooltipY)}
        height={30}
        fill={color}
        ry={5}
        rx={5}
      />
      <Text x={-25} y={23} stroke={colors.white} fontSize="10">
        {tooltipY} {setUnit(state)}
      </Text>
    </G>
  );
};

export default Tooltip;
