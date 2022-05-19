import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {
  LanguageContext,
  PlaceListContext,
  SettingContext,
  UserContext,
} from '../../../context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import colors from '../../../src/colors';

export const SetUpPico = ({navigation, route}) => {
  const {getDeviceState} = useContext(SettingContext);
  const strings = useContext(LanguageContext);
  const userInfo = useContext(UserContext);
  const placeList = useContext(PlaceListContext);

  const {id} = route.params;
  const {name} = route.params;

  const [isLoading, setIsLoading] = useState(true);

  const [newDeviceName, setNewDeviceName] = useState(
    strings.wifisetting_4_input_name,
  );
  const [newDevicePlace, setNewDevicePlace] = useState(
    strings.wifisetting_4_select_place_room,
  );
  const [devicePlaceAccess, setDevicePlaceAccess] = useState(false);

  const [showPlace, setShowPlace] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [registError, setRegistError] = useState(false);

  const pickPlace = (text) => {
    checkPlaceAccess(text);
    setShowPlace(false);
  };

  const checkPlaceAccess = (text) => {
    if (text === '') {
      setDevicePlaceAccess(false);
    } else {
      setDevicePlaceAccess(true);
      setNewDevicePlace(text);
    }
  };

  const goHome = () => {
    setRegistError(false);
    setTimeout(() => {
      navigation.navigate('RealTime');
    }, 1000);
  };

  const registDevice = () => {
    setIsLoading(false);
    fetch('https://us-central1-pico-home.cloudfunctions.net/RegisterDevice', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userInfo.userid, // userInfo.userid,
        apiKey: userInfo.apiKey, // userInfo.apiKey,
        serialNum: id,
        modelName: name,
        firmwareVersion: '01.01.07',
        picoName: newDeviceName,
        description: newDevicePlace,
        lang: '',
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Msg === 'success') {
          console.log('regist success');
          getDeviceState(userInfo.userid, userInfo.apiKey);
          setTimeout(() => {
            navigation.navigate('RealTime');
          }, 3000);
        } else {
          console.log('Error Occur!');
          if (res.Msg === 'Already registered device.') {
            setRegistError(true);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
    setDevicePlaceAccess(true);
    setShowAddPlace(false);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View>
          <View style={styles.box}>
            <Text style={styles.picoNameText}>
              {strings.wifisetting_4_label_name}
            </Text>
            <View style={styles.picoNameBox}>
              <TextInput
                style={styles.picoNameTextInput}
                onChangeText={(text) => setNewDeviceName(text.trim())}
                placeholder={strings.wifisetting_4_input_name}
                placeholderTextColor={colors.brownGrey}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowPlace(true)}>
            <View style={styles.placeContainer}>
              <Text style={styles.placeText}>
                {strings.wifisetting_4_label_place}
              </Text>
              <View style={styles.placeTextBox}>
                <TextInput
                  style={styles.placeTextInput}
                  onChangeText={(text) => checkPlaceAccess(text.trim())}
                  placeholder={strings.wifisetting_4_select_place_room}
                  placeholderTextColor={colors.brownGrey}
                  value={devicePlaceAccess ? newDevicePlace : null}
                />
                <View style={styles.icMiniarrowBottom}>
                  <Image
                    source={require('../../../../Assets/img/icMiniarrowBottom.png')}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <Modal
            isVisible={showPlace}
            onBackdropPress={() => setShowPlace(false)}>
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
          {/*
          <Modal
            isVisible={showAddPlace}
            onBackdropPress={() => setShowAddPlace(false)}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowAddPlace(false)}>
                <Image
                  source={require('../../../../Assets/img/icCancel.png')}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {strings.wifisetting_4_popup_title}
              </Text>
              <View style={styles.modalBox}>
                <Text style={{color: colors.black}}>
                  {strings.wifisetting_4_popup_label_place}
                </Text>
                <TextInput
                  style={styles.placeTextInput}
                  onChangeText={(text) => checkPlaceAccess(text.trim())}
                />
              </View>
              <TouchableOpacity
                style={styles.placeList}
                onPress={() => addPlaceList()}>
                <Text style={styles.buttonText}>
                  {strings.wifisetting_4_popup_button_ok}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          */}
          <View style={styles.picoHomeBig}>
            <Image
              source={require('../../../../Assets/img/imgPicohomeBig.png')}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => registDevice()}>
            <Text style={styles.buttonText}>
              {strings.wifisetting_4_button_start}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={colors.azure} />
        </View>
      )}
      <Modal isVisible={registError}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {strings.wifisetting_4_regist_error_title}
          </Text>
          <Text style={styles.modalSubText}>
            {strings.wifisetting_4_regist_error_text}
          </Text>
          <TouchableOpacity style={styles.placeList} onPress={() => goHome()}>
            <Text style={styles.buttonText}>
              {strings.wifisetting_4_regist_error_button_ok}
            </Text>
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
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  box: {
    flexDirection: 'column',
    width: width * 0.85,
    height: height * 0.0845,
    marginTop: 24,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  picoNameText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  picoNameBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  picoNameTextInput: {
    fontFamily: 'NotoSans',
    fontSize: 14,
    color: colors.greyishBrown,
  },
  placeContainer: {
    flexDirection: 'column',
    width: width * 0.85,
    height: height * 0.0845,
    marginTop: height * 0.0423,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  placeText: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  placeTextBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeTextViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeTextInput: {
    fontFamily: 'NotoSans',
    fontSize: 14,
    color: colors.greyishBrown,
  },
  icMiniarrowBottom: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalView: {
    borderRadius: 15,
    paddingVertical: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  modalCancel: {position: 'absolute', right: 12, top: 12},
  modalTitle: {
    fontFamily: 'NotoSans-Bold',
    fontWeight: '800',
    fontStyle: 'normal',
    fontSize: 18,
    marginBottom: 20,
  },
  fldViewStyle: {
    flexDirection: 'column',
    width: width * 0.75,
    height: height * 0.0845,
    marginTop: height * 0.0422,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
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
  modalSubText: {
    fontSize: 14,
    fontFamily: 'NotoSans',
    color: colors.brownGrey,
  },
  modalBox: {
    flexDirection: 'column',
    width: width * 0.75,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.greyishBrown,
  },
  picoHomeBig: {marginTop: height * 0.1, alignItems: 'center'},
  button: {
    position: 'absolute',
    top: height * 0.74,
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
  boxInput: {
    fontFamily: 'NotoSans',
    fontSize: 14,
    color: colors.greyishBrown,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
