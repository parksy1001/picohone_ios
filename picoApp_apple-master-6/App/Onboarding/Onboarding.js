import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {LanguageContext} from '../context';
import SwiperFlatList from 'react-native-swiper-flatlist';
import colors from '../src/colors';

export const Onboarding = ({navigation}) => {
  const strings = useContext(LanguageContext);
  return (
    <View style={styles.container}>
      <SwiperFlatList
        showPagination
        paginationActiveColor={colors.azure}
        paginationDefaultColor={colors.veryLightPink}
        paginationStyle={{marginBottom: 32}}
        paginationStyleItem={{width: 6, height: 6}}
        // node module update하면 property 임의로 추가해 놓은 것들 없어지드라...
        /* paginationActiveStyleItem={{ width: 24, height: 6 }} */
      >
        <View style={styles.swipeStyle}>
          <Image source={require('../../Assets/img/imgOnboarding1.png')} />
          <Text style={styles.titleText}>{strings.onboarding_1_title}</Text>
          <Text style={styles.subText}>{strings.onboarding_1_contents}</Text>
          <TouchableOpacity
            style={styles.skip}
            onPress={() => navigation.replace('Main')}>
            <Text style={styles.skipText}>
              {strings.onboarding_1_button_skip}
            </Text>
            <Image source={require('../../Assets/img/icMiniarrowLeft.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.swipeStyle}>
          <Image source={require('../../Assets/img/imgCheck.png')} />
          <Image
            style={{marginTop: 8}}
            source={require('../../Assets/img/imgPicohomeBasic.png')}
          />
          <Text style={styles.titleText}>{strings.onboarding_2_title}</Text>
          <Text style={styles.subText}>{strings.onboarding_2_contents}</Text>
          <TouchableOpacity
            style={styles.skip}
            onPress={() => navigation.replace('Main')}>
            <Text style={styles.skipText}>
              {strings.onboarding_2_button_skip}
            </Text>
            <Image source={require('../../Assets/img/icMiniarrowLeft.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.swipeStyle}>
          <Image source={require('../../Assets/img/imgOnboarding2.png')} />
          <Text style={styles.titleText}>{strings.onboarding_3_title}</Text>
          <Text style={styles.subText}>{strings.onboarding_3_contents}</Text>
          <TouchableOpacity
            style={styles.skip}
            onPress={() => navigation.replace('Main')}>
            <Text style={styles.skipText}>
              {strings.onboarding_3_button_skip}
            </Text>
            <Image source={require('../../Assets/img/icMiniarrowLeft.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.swipeStyle}>
          <Image source={require('../../Assets/img/imgPicohomeBasic.png')} />
          <Text style={[styles.titleText, {width: width * 0.678}]}>
            {strings.onboarding_4_title}
          </Text>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => navigation.replace('Main')}>
            <Text style={styles.buttonText}>
              {strings.onboarding_4_button_start}
            </Text>
          </TouchableOpacity>
        </View>
      </SwiperFlatList>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  swipeStyle: {
    flex: 1,
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    width: width * 0.85,
    marginTop: 40,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 17,
    color: colors.azure,
  },
  subText: {
    width: width * 0.85,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.brownishGrey,
  },
  skip: {flexDirection: 'row', marginTop: 20},
  skipText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownishGrey,
  },
  buttonStyle: {
    width: width * 0.8,
    height: 40,
    marginTop: 20,
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
    elevation: 2,
  },
  buttonText: {
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.white,
  },
});
