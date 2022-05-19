import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {LanguageContext} from '../../../context';
import {BleManager} from 'react-native-ble-plx';
import colors from '../../../src/colors';
import Modal from 'react-native-modal';

export const Connect = ({navigation}) => {
  const bleManager = new BleManager();

  const strings = useContext(LanguageContext);
  const [connectInfo, setConnectInfo] = useState(false);
  const [bleModal, setBleModal] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);

  // 블루투스 권한 요청 처리
  // 블루투스 On => 바로 Find PiCOHOME
  // 블루투스 Off => 권한요청 Modal => Allow : Find PiCOHOME / Deny : Modal Off, stay
  const getBLEPermission = () => {
    bleManager.state().then((res) => {
      if (res === 'PoweredOff') {
        setBleModal(true);
      } else {
        navigation.navigate('FindPicoToScan', {strings: strings});
      }
    });
  };

  const onBleGoScan = () => {
    bleManager.enable();
    setScanLoading(true);
    setTimeout(() => {
      setBleModal(false);
      setScanLoading(false);
      navigation.navigate('FindPicoToScan', {strings: strings});
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.noticeButton}>
        <TouchableOpacity onPress={() => setConnectInfo(true)}>
          <Image source={require('../../../../Assets/img/icInformation.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <Text style={styles.finishSetup}>
          {strings.connecting_list_bluetooth}
        </Text>
        <Text style={styles.useWithBluetooth}>
          {strings.connecting_contents_bluetooth}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => getBLEPermission()}>
          <Text style={styles.buttonText}>
            {strings.connecting_button_bluetooth}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <Text style={styles.continueToSetUp}>
          {strings.connecting_list_wifi}
        </Text>
        <Text style={styles.useWithWiFiNetwo}>
          {strings.connecting_contents_wifi}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('FindPicoToWiFi', {strings: strings})
          }>
          <Text style={styles.buttonText}>
            {strings.connecting_button_wifi}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Modal Hide */}
      <Modal isVisible={bleModal} onBackdropPress={() => setBleModal(false)}>
        <View>
          {scanLoading ? (
            <View style={[styles.modalContainer, {height: height * 0.3}]}>
              <View style={styles.indicator}>
                <ActivityIndicator size="large" color={colors.azure} />
              </View>
            </View>
          ) : (
            <View style={styles.modalContainer}>
              <View style={styles.modalCancel}>
                <TouchableOpacity onPress={() => setBleModal(false)}>
                  <Image
                    source={require('../../../../Assets/img/icCancel.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.modalHeaderTextView}>
                <Text style={styles.modalHeaderText}>
                  {strings.ble_permission_popup_title}
                </Text>
              </View>
              <View style={styles.modalSubTextView}>
                <Text style={styles.modalSubText}>
                  {strings.ble_permission_popup_contents}
                </Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => setBleModal(false)}>
                  <View style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>
                      {strings.login_popup_button_ok}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/* 
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => setBleModal(false)}>
                  <View
                    style={[
                      styles.modalButton,
                      {backgroundColor: colors.veryLightPink},
                    ]}>
                    <Text style={styles.modalButtonText}>
                      {strings.ble_permission_popup_button_deny}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onBleGoScan()}>
                  <View style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>
                      {strings.ble_permission_popup_button_allow}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              */}
            </View>
          )}
        </View>
      </Modal>
      <Modal
        isVisible={connectInfo}
        onBackdropPress={() => setConnectInfo(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalCancel}>
            <TouchableOpacity onPress={() => setConnectInfo(false)}>
              <Image source={require('../../../../Assets/img/icCancel.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalHeaderTextView}>
            <Text style={styles.modalHeaderText}>
              {strings.connecting_popup_title}
            </Text>
          </View>
          <View style={styles.modalSubTextView}>
            <Text style={styles.modalSubText}>
              {strings.connecting_popup_contents}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setConnectInfo(false)}>
            <View style={[styles.modalButton, {width: width * 0.8}]}>
              <Text style={styles.modalButtonText}>OK</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
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
    height: height * 0.375,
    margin: width * 0.025,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  noticeButton: {
    width: width * 0.9,
    marginTop: height * 0.05,
    alignItems: 'flex-end',
  },
  button: {
    position: 'absolute',
    bottom: 24,
    width: width * 0.75,
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
    elevation: 2,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.white,
  },
  finishSetup: {
    marginTop: height * 0.0933,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 15,
    color: colors.azure,
  },
  useWithBluetooth: {
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    lineHeight: 20,
    color: colors.brownishGrey,
  },
  continueToSetUp: {
    marginTop: height * 0.0933,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 15,
    color: colors.azure,
  },
  useWithWiFiNetwo: {
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    lineHeight: 20,
    color: colors.brownishGrey,
  },
  modalContainer: {
    width: width * 0.9,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: height * 0.0281,
  },
  modalSubText: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 14,
    color: colors.brownGrey,
  },
  modalButton: {
    width: width * 0.75,
    height: height * 0.07,
    marginTop: height * 0.0423,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.azure,
  },
  modalButtonText: {
    fontSize: 14,
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    color: colors.white,
  },
});
