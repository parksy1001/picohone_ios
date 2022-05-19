import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  DeviceContext,
  LanguageContext,
  PicoContext,
  PlaceListContext,
  SettingContext,
  UserContext,
} from '../../../context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import colors from '../../../src/colors';
import {color} from 'react-native-reanimated';

export const EditDeviceSetting = () => {
  const {getDeviceState} = useContext(SettingContext);
  const strings = useContext(LanguageContext);
  const userInfo = useContext(UserContext);
  const device = useContext(DeviceContext);
  const placeList = useContext(PlaceListContext);
  const id = useContext(PicoContext);

  const oriDeviceName = device[id].PicoName;
  const oriDevicePlace = device[id].Description;

  const [isLoading, setIsLoading] = useState(true);

  const [newDeviceName, setNewDeviceName] = useState(oriDeviceName);
  const [newDevicePlace, setNewDevicePlace] = useState(oriDevicePlace);
  const [deviceNameAccess, setDeviceNameAccess] = useState(false);
  const [devicePlaceAccess, setDevicePlaceAccess] = useState(false);

  const [showPlace, setShowPlace] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);

  const togglePicker = () => {
    setShowPlace(false);
  };

  const checkNameAccess = (text) => {
    if (text === '') {
      setDeviceNameAccess(false);
      setNewDeviceName(oriDeviceName);
    } else {
      setDeviceNameAccess(true);
      setNewDeviceName(text);
    }
  };

  const checkPlaceAccess = (text) => {
    if (text === '') {
      setDevicePlaceAccess(false);
      // setNewDevicePlace(oriDevicePlace);
    } else {
      setDevicePlaceAccess(true);
      setNewDevicePlace(text);
    }
  };

  const pickPlace = (text) => {
    checkPlaceAccess(text);
    setShowPlace(false);
  };

  const modifyDeviceInfo = () => {
    setIsLoading(false);
    fetch('https://us-central1-pico-home.cloudfunctions.net/UpdateDeviceInfo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userInfo.userid,
        apiKey: userInfo.apiKey,
        deviceId: device[id].DeviceId,
        picoName: newDeviceName,
        description: newDevicePlace,
        firmwareVersion: device[id].FirmwareVersion,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Msg === 'success') {
          console.log('Update Success!');
          getDeviceState(userInfo.userid, userInfo.apiKey);
          setTimeout(() => {
            setIsLoading(true);
          }, 1000);
        } else {
          console.log('Error Occur!');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setCanUpdate(false);
  };

  const makePlaceList = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => pickPlace(item)}
        style={{alignItems: 'center', paddingTop: 8, paddingBottom: 8}}>
        <Text>{item}</Text>
      </TouchableOpacity>
    );
  };

  const addPlaceList = () => {
    let tempPlaceList = placeList;
    let s = '';
    tempPlaceList.push(newDevicePlace);

    for (let i = 0; i < tempPlaceList.length; i++) {
      if (i === tempPlaceList.length - 1) {
        s = s + tempPlaceList[i];
      } else {
        s = s + tempPlaceList[i] + '/';
      }
    }

    AsyncStorage.setItem('placeList', s);
    setShowAddPlace(false);
  };

  const resetModal = () => {
    setShowPlace(false);
    setShowAddPlace(false);
  };

  const checkCanUpdate = () => {
    if (deviceNameAccess || devicePlaceAccess) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setCanUpdate(checkCanUpdate());
  }, [deviceNameAccess, devicePlaceAccess]);

  // console.log(oriDeviceName);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {isLoading ? (
        <View style={styles.container}>
          <View style={styles.fldViewStyle}>
            <Text style={styles.picoNameText}>
              {strings.wifisetting_4_label_name}
            </Text>
            <View style={styles.picoNameTextBox}>
              <TextInput
                style={styles.picoNameTextInput}
                onChangeText={(text) => checkNameAccess(text)}
                placeholder={oriDeviceName}
                placeholderTextColor={colors.brownGrey}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowPlace((prev) => !prev)}>
            <View style={styles.fldViewStyle}>
              <Text style={styles.placeText}>
                {strings.wifisetting_4_label_place}
              </Text>
              <View style={styles.placeTextBox}>
                <TextInput
                  style={styles.placeTextInput}
                  onChangeText={(text) => checkPlaceAccess(text)}
                  placeholder={oriDevicePlace}
                  placeholderTextColor={colors.brownGrey}
                  value={devicePlaceAccess ? newDevicePlace : null}
                />
                <View style={styles.icVisibilityHidden}>
                  <Image
                    source={require('../../../../Assets/img/icMiniarrowBottom.png')}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <Modal isVisible={showPlace} onBackdropPress={() => togglePicker()}>
            {showAddPlace ? (
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => resetModal()}>
                  <Image
                    source={require('../../../../Assets/img/icCancel.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {strings.wifisetting_4_popup_title}
                </Text>
                <View style={styles.fldViewStyle}>
                  <Text style={styles.modalText}>
                    {strings.wifisetting_4_popup_label_place}
                  </Text>
                  <View style={styles.addPlaceTextBox}>
                    <TextInput
                      style={styles.placeTextInput}
                      placeholder={strings.wifisetting_4_popup_label_place}
                      placeholderTextColor={colors.brownGrey}
                      onChangeText={(text) => checkPlaceAccess(text.trim())}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.placeList}
                  onPress={() => addPlaceList()}>
                  <Text style={styles.buttonText}>
                    {strings.wifisetting_4_popup_button_ok}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setShowPlace(false)}>
                  <Image
                    source={require('../../../../Assets/img/icCancel.png')}
                  />
                </TouchableOpacity>
                <FlatList
                  data={placeList}
                  renderItem={(item) => makePlaceList(item)}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowAddPlace(true);
                  }}
                  style={{paddingTop: 8, paddingBottom: 8}}>
                  <Text style={{color: '#999'}}>
                    {strings.wifisetting_4_select_place_add}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Modal>
          <View style={styles.editButtonView}>
            {canUpdate ? (
              <TouchableOpacity
                style={[
                  styles.editButtonStyle,
                  {backgroundColor: colors.azure},
                ]}
                onPress={() => modifyDeviceInfo()}>
                <Text style={styles.editButtonText}>
                  {strings.profile_button_save}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editButtonStyle}>
                <Text style={styles.editButtonText}>
                  {strings.profile_button_save}
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={colors.azure} />
        </View>
      )}
    </TouchableWithoutFeedback>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  picoNameText: {
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.brownGrey,
  },
  picoNameTextBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  picoNameTextInput: {
    fontFamily: 'NotoSans',
    fontSize: 14,
    color: colors.greyishBrown,
  },
  fldViewStyle: {
    flexDirection: 'column',
    width: width * 0.8,
    height: height * 0.0845,
    marginTop: height * 0.0422,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  placeText: {
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.brownGrey,
  },
  placeTextBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeTextInput: {
    fontFamily: 'NotoSans',
    fontSize: 14,
    color: colors.greyishBrown,
  },
  placeList: {
    width: width * 0.75,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
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
  modalView: {
    borderRadius: 15,
    paddingVertical: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  modalCancel: {position: 'absolute', right: 12, top: 12},
  modalTitle: {
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 18,
    marginBottom: 20,
  },
  modalBox: {
    flexDirection: 'column',
    width: width * 0.75,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.greyishBrown,
  },
  modalText: {
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.brownGrey,
  },
  addPlaceTextBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icVisibilityHidden: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonView: {marginTop: height * 0.49},
  editButtonStyle: {
    width: width * 0.85,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.veryLightPink,
    shadowColor: 'rgba(0, 172, 255, 0.2)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  editButtonText: {
    fontFamily: 'NotoSans',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 12,
    color: colors.white,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
