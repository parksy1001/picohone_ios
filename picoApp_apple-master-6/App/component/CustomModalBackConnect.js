import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BackToFromContext, LanguageContext} from '../context';
import Modal from 'react-native-modal';
import colors from '../src/colors';

export default function CustomModal(props) {
  const navigation = useNavigation();
  const strings = useContext(LanguageContext);

  const [isVisible, setVisible] = useState(true);

  const goNext = () => {
    if (props.close === 'Yes') {
      setVisible(false);
    } else {
      setVisible(false);
      navigation.navigate('Connect');
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() =>
        props.close === 'Yes'
          ? setVisible(false)
          : navigation.navigate('Connect')
      }>
      <View style={styles.modalContainer}>
        <View style={styles.modalCancel}>
          <TouchableOpacity onPress={() => goNext()}>
            <Image source={require('../../Assets/img/icCancel.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalHeaderTextView}>
          <Text style={styles.modalHeaderText}>{props.modalHeaderText}</Text>
        </View>
        <View style={styles.modalSubTextView}>
          <Text style={styles.modalSubText}>{props.modalSubText}</Text>
        </View>
        <TouchableOpacity onPress={() => goNext()}>
          <View style={[styles.modalButton, {width: width * 0.8}]}>
            <Text style={styles.modalButtonText}>
              {strings.popup_button_ok}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    width: width * 0.9,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  modalCancel: {position: 'absolute', top: 12, right: 12},
  modalHeaderTextView: {
    width: width * 0.9,
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: 22,
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
  },
  modalSubTextView: {
    width: width * 0.75,
    marginTop: height * 0.03,
  },
  modalSubText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 14,
    color: colors.brownGrey,
  },
  modalButton: {
    width: width * 0.3875,
    height: height * 0.0704,
    marginTop: height * 0.07,
    marginHorizontal: 4,
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
    elevation: 1,
  },
  modalButtonText: {
    fontSize: 20,
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    color: colors.white,
  },
});
