import React, { useContext, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { TempContext } from '../context';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Circle, Polygon, Text, G, Rect } from 'react-native-svg';
import colors from '../src/colors';

export const ComfortZone = (props) => {
  const tempMod = useContext(TempContext);
  const Ydata = [0, 20, 40, 60, 80, 100];
  const Xdata = tempMod ? [59, 68, 77, 86, 95] : [15, 20, 25, 30, 35];

  let summer = '';
  let winter = '';

  const axesSvg = { fontSize: 10, fill: 'grey' };

  const comfortzoneverticalContentInset = { top: 5, bottom: 15 };
  const xAxisHeight = 50;

  const [date, setDate] = useState(new Date());
  const [temp, setTemp] = useState((Math.round(props.temp / 10.0) - 15) * UCZWidth);
  const [humd, setHumd] = useState((100 - Math.round(props.humd / 10.0)) * 2);

  winter =
    winter +
    (4 * UCZWidth + HUCZWidth) +
    ',27.0 ' +
    (8 * UCZWidth + HUCZWidth) +
    ',83.4 ' +
    (9 * UCZWidth + HUCZWidth) +
    ',154.0 ' +
    (5 * UCZWidth + HUCZWidth) +
    ',141.4';
  summer =
    summer +
    (7 * UCZWidth + HUCZWidth) +
    ',41.0 ' +
    11 * UCZWidth +
    ',85.4 ' +
    12 * UCZWidth +
    ',160.4 ' +
    (8 * UCZWidth + HUCZWidth) +
    ',151.2';

  const getWinterOrSummer = () => {
    let m = date.getMonth() + 1;
    let d = date.getDate();
    if (m === 1 || m === 2 || m === 3 || m === 11 || m === 12) {
      return 'winter';
    } else if (5 <= m && m <= 9) {
      return 'summer';
    } else {
      if (m === 4) {
        if (1 <= d <= 15) {
          return 'winter';
        } else {
          return 'summer';
        }
      } else if (m === 10) {
        if (1 <= d <= 15) {
          return 'summer';
        } else {
          return 'winter';
        }
      }
    }
  };

  // 동절기, 하절기 구분 Comfort Zone 내, 외 구분 색 변경
  function checkSeason(temp, humd) {
    let checkComfort = {
      winter: (temp, humd) => {
        let c1 = -57.2 * temp + 1201.9;
        let c2 = -1.575 * temp + 61.5875;
        let c3 = -7.05 * temp + 223.975;
        let c4 = -35.3 * temp + 887.5;
        if (humd >= c1 && humd >= c2 && humd <= c3 && humd <= c4) {
          return colors.azure;
        } else {
          return colors.blueGrey;
        }
      },
      summer: (temp, humd) => {
        let c1 = -55.1 * temp + 1239.75;
        let c2 = -1.314 * temp + 55.279;
        let c3 = -6.343 * temp + 222.2175;
        let c4 = -37.5 * temp + 1032.3;
        if (humd >= c1 && humd >= c2 && humd <= c3 && humd <= c4) {
          return colors.azure;
        } else {
          return colors.blueGrey;
        }
      },
    };
    return checkComfort[getWinterOrSummer()](temp, humd);
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ height: 250, padding: 20, flexDirection: 'row' }}>
        <YAxis data={Ydata} formatLabel={(value) => value} svg={axesSvg} contentInset={comfortzoneverticalContentInset} />
        <View style={{ marginLeft: 10 }}>
          <View
            style={{
              width: width * 0.8,
              height: 210,
            }}>
            <LineChart style={{ height: 200 }} data={Ydata}>
              {/*
                동절기(10월16일~4월15일)
                19.5°C, 86.5% / 23.5°C, 58.3% / 24.5°C, 23.0% / 20.5°C, 29.3%
                하절기(4월16일~10월15일)
                22.5°C, 79.5% / 26.0°C, 57.3% / 27.0°C, 19.8% / 23.5°C, 24.4%
              */}
              <Polygon
                points={getWinterOrSummer() === 'winer' ? summer : winter}
                fill="rgba(0, 172, 255, 0.4)"
                strokeWidth="1"
                opacity="70"
              />
              <Circle cx={temp} cy={humd} r={5} fill={colors.white} stroke={colors.veryLightPink} />
              <Circle
                cx={temp}
                cy={humd}
                r={2}
                fill={checkSeason(Math.round(props.temp / 10.0), Math.round(props.humd / 10.0))}
              />
              <G>
                <Rect
                  x={temp + 10}
                  y={humd - 15}
                  rx={5}
                  ry={5}
                  width={80}
                  height={30}
                  fill={colors.white}
                  stroke={colors.veryLightPink}
                />
                <Text
                  x={temp + 20}
                  y={humd + 5}
                  stroke={checkSeason(Math.round(props.temp / 10.0), Math.round(props.humd / 10.0))}>
                  {tempMod ? Math.round((props.temp / 10.0) * 1.8 + 32) : Math.round(props.temp / 10.0)}
                  {tempMod ? '°F' : '°C'} / {Math.round(props.humd / 10.0)}%
                </Text>
              </G>
              <Grid />
            </LineChart>
          </View>
          <XAxis
            style={{
              marginHorizontal: -10,
              height: xAxisHeight,
              marginVertical: 10,
            }}
            data={Xdata}
            formatLabel={(index) => Xdata[index]}
            contentInset={{ left: 10, right: 10 }}
            svg={axesSvg}
          />
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');
// Comfort Zone Width
const CZWidth = width * 0.8;
// Quarter Comfort Zone Width
const QCZWidth = CZWidth * 0.25;
// Unit Comfort Zone Width
// Half Unit Comfort Zone Width
const UCZWidth = QCZWidth * 0.2;
const HUCZWidth = QCZWidth * 0.1;

const styles = StyleSheet.create({});
