import React, {useContext} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {LanguageContext} from '../../context';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../src/colors';

export const CO2Explain = () => {
  const strings = useContext(LanguageContext);
  return (
    <>
      <View>
        <LinearGradient
          style={styles.linearGradientStyle}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
          location={[0, 0.32, 0.76, 1]}
          colors={[
            'rgb(0, 172, 255)',
            'rgb(121, 191, 0)',
            'rgb(255, 195, 52)',
            'rgb(252, 83, 69)',
          ]}></LinearGradient>
        <View style={styles.linearGradientTextViewStyle}>
          <Text style={styles.linearGradientText}>400</Text>
          <Text
            style={[styles.linearGradientText, {marginLeft: width * 0.1812}]}>
            800
          </Text>
          <Text style={[styles.linearGradientText, {marginLeft: width * 0.16}]}>
            1,000
          </Text>
          <Text style={[styles.linearGradientText, {marginLeft: width * 0.16}]}>
            2,000
          </Text>
        </View>
      </View>
      <View style={styles.stateGradeTextViewStyle}>
        <Text style={styles.stateGradeText}>
          {strings.detail_tip_info_level_co2_1}
        </Text>
        <Text style={styles.stateGradeText}>
          {strings.detail_tip_info_level_co2_2}
        </Text>
        <Text style={styles.stateGradeText}>
          {strings.detail_tip_info_level_co2_3}
        </Text>
        <Text style={styles.stateGradeText}>
          {strings.detail_tip_info_level_co2_4}
        </Text>
        <Text style={styles.stateGradeText}>
          {strings.detail_tip_info_level_co2_unit}
        </Text>
      </View>
      <View style={styles.tipTextViewSecond}>
        <Text style={styles.tipText}>
          {strings.detail_tip_info_contents_co2_1}
        </Text>
        <Text style={styles.tipText}>
          {strings.detail_tip_info_contents_co2_2}
        </Text>
        <View style={{marginBottom: 40}}></View>
      </View>
    </>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  linearGradientStyle: {
    marginTop: 16,
    width: width * 0.9,
    height: 9,
    borderRadius: 4.5,
  },
  linearGradientTextViewStyle: {
    flexDirection: 'row',
    marginTop: 4,
  },
  linearGradientText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownishGrey,
  },
  tipTextViewFirst: {width: width * 0.9, height: 80},
  tipTextViewSecond: {width: width * 0.9},
  tipText: {
    color: '#757575',
    fontFamily: 'NotoSans',
    fontSize: 12,
    lineHeight: 20,
    marginTop: 16,
  },
  stateGradeTextViewStyle: {width: width * 0.9, marginTop: 16},
  stateGradeText: {
    color: '#757575',
    fontSize: 12,
    fontFamily: 'NotoSans',
    lineHeight: 20,
  },
});
