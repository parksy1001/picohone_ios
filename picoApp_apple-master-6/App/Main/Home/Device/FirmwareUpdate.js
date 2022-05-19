import React from 'react';
import {StyleSheet, View, Image, Dimensions} from 'react-native';
import colors from '../../../src/colors';

export const FirmwareUpdate = () => {
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <Image source={require('../../../../Assets/img/messageArrow.png')} />
        <Image
          source={require('../../../../Assets/img/imgPicohomeBigUpdate.png')}
        />
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    backgroundColor: colors.white,
  },
  bodyContainer: {marginTop: height * 0.2, alignItems: 'center'},
});
