import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import colors from '../../src/colors';

/**
 *
 * 후후 여기를 정말 어떻게 해야할지 아주 속상하네요 증말
 *
 */

export const Message = () => {
  return <View style={styles.container}></View>;
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { height: height, backgroundColor: colors.white },
});
