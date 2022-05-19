import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {LanguageContext} from '../../../context';
import colors from '../../../src/colors';

export const FindWiFi = ({navigation}) => {
  const strings = useContext(LanguageContext);

  return (
    <View style={styles.container}>
      <View style={styles.titleViewStyle}>
        <Text style={styles.title}>{strings.wifisetting_2_subtitle}</Text>
      </View>
      <View style={styles.textViewStyle}>
        <Text style={styles.text}>{strings.wifisetting_2_contents}</Text>
      </View>
      <View style={styles.wifiView}>
        <Image source={require('../../../../Assets/img/imgWifi.png')} />
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ConnectWiFi')}>
          <Text style={styles.buttonText}>
            {strings.wifisetting_2_button_find}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  titleViewStyle: {
    width: width * 0.85,
    marginTop: height * 0.0423,
  },
  title: {
    width: width * 0.85,
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 15,
    color: colors.azure,
  },
  textViewStyle: {
    width: width * 0.85,
    marginTop: 16,
  },
  text: {
    width: width * 0.85,
    fontFamily: 'NotoSans',
    fontSize: 12,
    lineHeight: 20,
    color: '#757575',
  },
  wifiView: {
    marginTop: height * 0.181,
  },
  buttonView: {position: 'absolute', top: height * 0.74},
  button: {
    width: width * 0.85,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
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
  buttonText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 12,
    color: colors.white,
  },
});
