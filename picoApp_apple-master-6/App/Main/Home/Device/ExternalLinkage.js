import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {LanguageContext} from '../../../context';
import colors from '../../../src/colors';

export const ExternalLinkage = () => {
  const strings = useContext(LanguageContext);
  return (
    <View style={styles.container}>
      <View style={[styles.box, {marginTop: height * 0.1}]}>
        <Text style={styles.alexaSetup}>{strings.voiceservice_list_alexa}</Text>
        <Text style={styles.alexaText}>{strings.voiceservice_contents}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.amazon.dee.app&hl=ko&gl=US',
            )
          }>
          <Text style={styles.buttonText}>
            {strings.voiceservice_list_alexa}
          </Text>
        </TouchableOpacity>
      </View>
      {/*
      <View style={styles.box}>
        <Text style={styles.googleSetUp}>Google Home</Text>
        <Text style={styles.googleText}>
          Check the indoor environment in real time through Google Home, and get
          recommendations for customized improvements.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => null}>
          <Text style={styles.buttonText}>GOOGLE HOME</Text>
        </TouchableOpacity>
      </View>
      */}
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    marginTop: height * 0.0423,
    alignItems: 'center',
    backgroundColor: colors.veryLightPink,
  },
  box: {
    width: width * 0.9,
    height: height * 0.376,
    margin: width * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  button: {
    position: 'absolute',
    width: width * 0.75,
    height: 40,
    bottom: 35,
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
  alexaSetup: {
    position: 'absolute',
    top: 35,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 15,
    color: colors.azure,
  },
  alexaText: {
    position: 'absolute',
    top: 80,
    width: 256,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    lineHeight: 20,
    color: '#757575',
  },
  googleSetUp: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 15,
    color: colors.azure,
  },
  googleText: {
    width: 256,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    lineHeight: 20,
    color: colors.brownishGrey,
  },
});
