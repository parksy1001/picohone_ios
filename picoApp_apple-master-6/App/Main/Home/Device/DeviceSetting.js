import React, {useContext, useState,useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  DeviceContext,
  LanguageContext,
  PicoContext,
  SettingContext,
  UserContext,
} from '../../../context';
import useCheckFirmwareVersion from '../../../src/hook/useCheckFirmwareVersion';
import Modal from 'react-native-modal';
import colors from '../../../src/colors';

export const DeviceSetting = ({navigation}) => {
  const {getDeviceState} = useContext(SettingContext);
  const strings = useContext(LanguageContext);
  const userInfo = useContext(UserContext);
  const device = useContext(DeviceContext);
  const id = useContext(PicoContext);
  const [getLatestFirmwareVersion, getDeviceFirmwareVersion] = useCheckFirmwareVersion()

  const [isLoading, setIsLoading] = useState(true);
  const [isLatestVersion, setIsLatestVersion] = useState(true);
  const [serialNum, setSerialNum] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [isFirmwareUpdate, setIsFirmwareUpdate] = useState(false);

  useEffect(() => {

    setSerialNum(device[id].SerialNum.substring(0,2)+':'+device[id].SerialNum.substring(2,4)+':'+device[id].SerialNum.substring(4,6)+':'
    +device[id].SerialNum.substring(6,8)+':'+device[id].SerialNum.substring(8,10)+':'+device[id].SerialNum.substring(10,12));

  }); 

  useEffect(() => {
    checkFirmwareUpdate()
  }, [])

  // 디바이스 등록 삭제
  const removeDeviceAndEscape = () => {
    setIsLoading(false);
    fetch('https://us-central1-pico-home.cloudfunctions.net/UnregisterDevice', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userInfo.userid, // userInfo.userid
        apiKey: userInfo.apiKey, // userInfo.apiKey
        serialNum: device[id].SerialNum,
        modelName: device[id].ModelName,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.Msg === 'success') {
          console.log('Remove Success!');
          getDeviceState(userInfo.userid, userInfo.apiKey);
          setTimeout(() => {
            navigation.navigate('RealTime');
          }, 3000);
        } else {
          console.log(res.Msg);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const checkFirmwareUpdate = async () => {
    setIsLoading(false)
    
    const latestVersion = await getLatestFirmwareVersion(id)
    const verson = await getDeviceFirmwareVersion(id)
    
    setIsLatestVersion((latestVersion > verson) || (latestVersion < verson))
    setIsLoading(true)
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.bodyContainer}>
          <View style={styles.menuViewStyle}>
            <View style={styles.menuStyle}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ExternalLinkage')}>
                <View style={styles.externalLinkageViewStyle}>
                  <View style={styles.externalLinkageStyle}>
                    <Text style={styles.externalLinkageText}>
                      {strings.devicesetting_list_voiceservice}
                    </Text>
                    <Image
                      source={require('../../../../Assets/img/icMiniarrowLeft.png')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditDeviceSetting')}>
                <View style={styles.editDeviceSettingViewStyle}>
                  <View style={styles.editDeviceSettingStyle}>
                    <Text style={styles.editDeviceSettingText}>
                      {strings.devicesetting_list_editpicohome}
                    </Text>
                    <Image
                      source={require('../../../../Assets/img/icMiniarrowLeft.png')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDeleteModal(true)}>
                <View style={styles.deleteDeviceViewStyle}>
                  <View style={styles.deleteDeviceStyle}>
                    <Text style={styles.deleteDeviceText}>
                      {strings.devicesetting_list_deletedevice}
                    </Text>
                    <Image
                      source={require('../../../../Assets/img/icMiniarrowLeft.png')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <Modal
                isVisible={deleteModal}
                onBackdropPress={() => setDeleteModal(false)}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalCancel}>
                    <TouchableOpacity onPress={() => setDeleteModal(false)}>
                      <Image
                        source={require('../../../../Assets/img/icCancel.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalHeaderTextView}>
                    <Text style={styles.modalHeaderText}>
                      {strings.devicesetting_popup_title}
                    </Text>
                  </View>
                  <View style={styles.modalSubTextView}>
                    <Text style={styles.modalSubText}>
                      {strings.devicesetting_popup_contents}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => removeDeviceAndEscape()}>
                      <View
                        style={[
                          styles.modalButton,
                          {backgroundColor: colors.veryLightPink},
                        ]}>
                        <Text style={styles.modalButtonText}>
                          {strings.devicesetting_popup_button_delete}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDeleteModal(false)}>
                      <View style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>
                          {strings.devicesetting_popup_button_cancel}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <View style={styles.firmwareVersionViewStyle}>
                <View style={styles.firmwareVersionStyle}>
                  <View style={{flexDirection: "row"}}>
                      <Text style={styles.firmwareVersionText}>{strings.devicesetting_list_firmware}</Text>
                      <Text style={styles.firmwareVersion}>  v {device[id].FirmwareVersion}</Text>
                    </View>
                  <TouchableOpacity 
                    disabled={isLatestVersion}
                    onPress={() => setIsFirmwareUpdate(true)}
                  >
                    <Text style={isLatestVersion ? styles.firmwareVersion : styles.firmwareVersionUpdate}>
                      {isLatestVersion ? strings.devicesetting_firmware_vesion_latest : strings.devicesetting_firmware_vesion_update}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.macaddressViewStyle}>
                <View style={styles.firmwareVersionStyle}>
                  <Text style={styles.firmwareVersionText}>{strings.devicesetting_list_macaddress}</Text>
                  <Text style={styles.firmwareVersion}>{serialNum}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <Modal isVisible={isFirmwareUpdate} onBackdropPress={() => setIsFirmwareUpdate(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalCancel}>
                <TouchableOpacity onPress={() => setIsFirmwareUpdate(false)}>
                  <Image source={require('../../../../Assets/img/icCancel.png')} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalHeaderTextView}>
                <Text style={styles.modalHeaderText}>{strings.popup_firmwareupdate_title}</Text>
              </View>
              <View style={styles.modalSubTextView}>
                <Text style={styles.modalSubTextNotCenter}>{strings.popup_firmwareupdate_contents}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsFirmwareUpdate(false)}>
                <View style={[styles.modalButton, { width: width * 0.8 }]}>
                  <Text style={styles.modalButtonText}>{strings.main_popup_pollen_button_ok}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* latestVersion ? (
            <View style={styles.latestVersionView}>
              <View style={styles.latestVersionStyle}>
                <Text style={styles.latestVersionText}>{strings.devicesetting_firmware_button_latest}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.updateVersionButtonView} onPress={() => null}>
              <View style={styles.updateVersionButtonStyle}>
                <Text style={styles.updateVersionButtonText}>{strings.devicesetting_firmware_button_need}</Text>
              </View>
            </TouchableOpacity>
          ) */}
        </View>
      ) : (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={colors.azure} />
        </View>
      )}
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  bodyContainer: {flex: 1, paddingTop: 24, alignItems: 'center'},
  menuViewStyle: {
    width: width * 0.85,
  },
  menuStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  externalLinkageViewStyle: {
    height: height * 0.0845,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.veryLightPink,
  },
  externalLinkageStyle: {
    flexDirection: 'row',
    width: width * 0.85,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  externalLinkageText: {
    fontFamily: 'NotoSans',
    fontSize: 12,
  },
  editDeviceSettingViewStyle: {
    height: height * 0.0845,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.veryLightPink,
  },
  editDeviceSettingStyle: {
    flexDirection: 'row',
    width: width * 0.85,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editDeviceSettingText: {
    fontFamily: 'NotoSans',
    fontSize: 12,
  },
  deleteDeviceViewStyle: {
    height: height * 0.0845,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.veryLightPink,
  },
  deleteDeviceStyle: {
    flexDirection: 'row',
    width: width * 0.85,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteDeviceText: {
    fontFamily: 'NotoSans',
    fontSize: 12,
  },
  modalContainer: {
    width: width * 0.9,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
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
    fontFamily: 'NotoSans-Bold',
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
    fontSize: 16,
    color: colors.brownGrey,
  },
  modalSubTextNotCenter: {
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.brownGrey,
  },
  modalButton: {
    width: width * 0.3875,
    height: height * 0.0704,
    marginTop: height * 0.0423,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.azure,
  },
  modalButtonText: {
    fontSize: 14,
    fontFamily: 'NotoSans-Bold',
    fontWeight: '800',
    fontStyle: 'normal',
    color: colors.white,
  },
  firmwareVersionViewStyle: {
    height: height * 0.0845,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.veryLightPink,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  macaddressViewStyle: {
    height: height * 0.0845,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  firmwareVersionStyle: {
    flexDirection: 'row',
    width: width * 0.85,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  firmwareVersionText: {
    fontFamily: 'NotoSans',
    fontSize: 12,
  },
  firmwareVersion: {
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.brownishGrey,
  },
  firmwareVersionUpdate: {
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.reddishPink,
  },
  latestVersionView: {position: 'absolute', bottom: 32},
  latestVersionStyle: {
    width: width * 0.8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.azure,
    borderRadius: 30,
  },
  latestVersionText: {
    fontFamily: 'NotoSans-Bold',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 12,
    color: colors.azure,
  },
  updateVersionButtonView: {position: 'absolute', bottom: 32},
  updateVersionButtonStyle: {
    width: width * 0.8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.azure,
    borderRadius: 30,
  },
  updateVersionButtonText: {
    fontFamily: 'NotoSans-Bold',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 12,
    color: colors.azure,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
