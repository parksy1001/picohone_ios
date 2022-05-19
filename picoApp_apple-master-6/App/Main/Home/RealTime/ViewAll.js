import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  DeviceAndAirInfoContext,
  SettingContext,
  SnapShotAndCountContext,
  UserContext,
  DeviceContext,
  LanguageContext,
  OnlineContext,
} from '../../../context';
import Modal from 'react-native-modal';
import colors from '../../../src/colors';

export const ViewAll = ({navigation}) => {
  const {getDeviceState} = useContext(SettingContext);
  const strings = useContext(LanguageContext);
  const isOnline = useContext(OnlineContext);
  const userInfo = useContext(UserContext);

  const devices = useContext(DeviceContext);
  const deviceAndAirInfo = useContext(DeviceAndAirInfoContext);
  const snapShotAndCount = useContext(SnapShotAndCountContext);

  const numColumns = 3;

  let DeviceStateColor;
  let DeviceTextPlaceColor;
  let DeviceTextPicoColor;

  const [isLoading, setIsLoading] = useState(true);

  const [Good, setGood] = useState(0);
  const [Mod, setMod] = useState(0);
  const [Bad, setBad] = useState(0);
  const [VeryBad, setVeryBad] = useState(0);

  const [isDelete, setDelete] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(0);

  const toggleDelete = () => {
    setDelete((isDelete) => !isDelete);
  };

  // 디바이스 등록 삭제
  const removeDevice = (id) => {
    setDeleteModal(false);
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
        serialNum: devices[id].SerialNum,
        modelName: devices[id].ModelName,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.Msg === 'success') {
          console.log('Remove Success!');
          getDeviceState(userInfo.userid, userInfo.apiKey);
          setTimeout(() => {
            setIsLoading(true);
          }, 3000);
        } else {
          console.log(res.Msg);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    toggleDelete();
  };

  const getDeviceNum = (len) => {
    let good = 0;
    let mod = 0;
    let bad = 0;
    let vbad = 0;
    for (let i = 0; i < len; i++) {
      if (snapShotAndCount.length != 0 && snapShotAndCount[i].c >= 5) {
        continue;
      } else {
        if (
          0 <= deviceAndAirInfo[i].stateInfo.pm25 &&
          deviceAndAirInfo[i].stateInfo.pm25 <= 15
        ) {
          good = good + 1;
        } else if (
          16 <= deviceAndAirInfo[i].stateInfo.pm25 &&
          deviceAndAirInfo[i].stateInfo.pm25 <= 35
        ) {
          mod = mod + 1;
        } else if (
          36 <= deviceAndAirInfo[i].stateInfo.pm25 &&
          deviceAndAirInfo[i].stateInfo.pm25 <= 75
        ) {
          bad = bad + 1;
        } else {
          vbad = vbad + 1;
        }
      }
    }
    setGood(good);
    setMod(mod);
    setBad(bad);
    setVeryBad(vbad);
  };

  const getDeviceStateColor = (props) => {
    if (0 <= props && props <= 15) {
      DeviceStateColor = goodState.bgColor;
    } else if (16 <= props && props <= 35) {
      DeviceStateColor = modState.bgColor;
    } else if (36 <= props && props <= 75) {
      DeviceStateColor = badState.bgColor;
    } else {
      DeviceStateColor = veryBadState.bgColor;
    }
    return DeviceStateColor;
  };

  const getDeviceTextPlaceColor = (props) => {
    if (0 <= props && props <= 15) {
      DeviceTextPlaceColor = goodState.txtPlaceColor;
    } else if (16 <= props && props <= 35) {
      DeviceTextPlaceColor = modState.txtPlaceColor;
    } else if (36 <= props && props <= 75) {
      DeviceTextPlaceColor = badState.txtPlaceColor;
    } else {
      DeviceTextPlaceColor = veryBadState.txtPlaceColor;
    }
    return DeviceTextPlaceColor;
  };

  const getDeviceTextPicoColor = (props) => {
    if (0 <= props && props <= 15) {
      DeviceTextPicoColor = goodState.txtpiCo;
    } else if (16 <= props && props <= 35) {
      DeviceTextPicoColor = modState.txtpiCo;
    } else if (36 <= props && props <= 75) {
      DeviceTextPicoColor = badState.txtpiCo;
    } else {
      DeviceTextPicoColor = veryBadState.txtpiCo;
    }
    return DeviceTextPicoColor;
  };

  useEffect(() => {
    if (deviceAndAirInfo.length != 0) {
      getDeviceNum(deviceAndAirInfo.length);
    } else {
      getDeviceNum(0);
    }
  }, [deviceAndAirInfo]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{alignItems: 'center'}}>
          <View style={styles.deleteViewStyle}>
            <View></View>
            {isDelete ? (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => toggleDelete()}>
                <Image
                  source={require('../../../../Assets/img/icDeleteOff.png')}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => toggleDelete()}>
                <Image
                  source={require('../../../../Assets/img/icDeleteOn.png')}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.deviceNumberByPm25}>
            <Text style={styles.pm25Text}>PM2.5</Text>
            <View style={styles.deviceNumberView}>
              <View style={styles.deviceNumberBox}>
                <View style={goodState.indicator}></View>
                <Text style={goodState.text}>{Good}</Text>
              </View>
              <View style={styles.deviceNumberBox}>
                <View style={modState.indicator}></View>
                <Text style={modState.text}>{Mod}</Text>
              </View>
              <View style={styles.deviceNumberBox}>
                <View style={badState.indicator}></View>
                <Text style={badState.text}>{Bad}</Text>
              </View>
              <View style={styles.deviceNumberBox}>
                <View style={veryBadState.indicator}></View>
                <Text style={veryBadState.text}>{VeryBad}</Text>
              </View>
            </View>
          </View>
          <View style={styles.flatListView}>
            {devices.length != 0 && deviceAndAirInfo.length != 0 ? (
              <FlatList
                numColumns={numColumns}
                data={deviceAndAirInfo}
                keyExtractor={(item) => item.Id}
                renderItem={({item, index}) => (
                  <View key={index}>
                    {snapShotAndCount.length === deviceAndAirInfo.length ? (
                      snapShotAndCount[index].c >= 5 ? (
                        <View>
                          <View style={styles.deviceBgWhite}>
                            <View style={styles.bgColor}></View>
                            <View style={{alignItems: 'center'}}>
                              <View style={styles.devicePlace}>
                                <Text style={styles.txtPlaceColor}>
                                  {item.Description}
                                </Text>
                              </View>
                              <Text style={styles.txtpiCo}>
                                {item.PicoName}
                              </Text>
                            </View>
                          </View>
                          {isDelete ? (
                            <View style={styles.deviceDeleteButton}>
                              <TouchableOpacity
                                onPress={() => {
                                  setDeleteTarget(item.Id),
                                    setDeleteModal(true);
                                }}>
                                <Image
                                  source={require('../../../../Assets/img/icDeletePicohome.png')}
                                />
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                      ) : (
                        <View>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('DeviceStack', {
                                id: item.Id,
                                mod: 'state',
                                temp: item.stateInfo.temp,
                                humd: item.stateInfo.humd,
                              })
                            }>
                            <View style={styles.deviceBgWhite}>
                              <View
                                style={getDeviceStateColor(
                                  item.stateInfo.pm25,
                                )}></View>
                              <View style={{alignItems: 'center'}}>
                                <View style={styles.devicePlace}>
                                  <Text
                                    style={getDeviceTextPlaceColor(
                                      item.stateInfo.pm25,
                                    )}>
                                    {item.Description}
                                  </Text>
                                </View>
                                <Text
                                  style={getDeviceTextPicoColor(
                                    item.stateInfo.pm25,
                                  )}>
                                  {item.PicoName}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                          {isDelete ? (
                            <View style={styles.deviceDeleteButton}>
                              <TouchableOpacity
                                onPress={() => {
                                  setDeleteTarget(item.Id),
                                    setDeleteModal(true);
                                }}>
                                <Image
                                  source={require('../../../../Assets/img/icDeletePicohome.png')}
                                />
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                      )
                    ) : (
                      <View style={styles.deviceBgWhite}>
                        <View style={styles.indicator}>
                          <ActivityIndicator
                            size="large"
                            color={colors.azure}
                          />
                        </View>
                      </View>
                    )}
                    <Modal
                      isVisible={deleteModal}
                      onBackdropPress={() => setDeleteModal(false)}>
                      <View style={styles.modalContainer}>
                        <View style={styles.modalCancel}>
                          <TouchableOpacity
                            onPress={() => setDeleteModal(false)}>
                            <Image
                              source={require('../../../../Assets/img/icCancel.png')}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.modalHeaderTextView}>
                          <Text style={styles.modalHeaderText}>
                            {strings.viewall_popup_title}
                          </Text>
                        </View>
                        <View style={styles.modalSubTextView}>
                          <Text style={styles.modalSubText}>
                            {strings.viewall_popup_contents}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity
                            onPress={() => removeDevice(deleteTarget)}>
                            <View
                              style={[
                                styles.modalButton,
                                {backgroundColor: colors.veryLightPink},
                              ]}>
                              <Text style={styles.modalButtonText}>
                                {strings.viewall_popup_button_delete}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setDeleteModal(false)}>
                            <View style={styles.modalButton}>
                              <Text style={styles.modalButtonText}>
                                {strings.viewall_popup_button_cancel}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  </View>
                )}
              />
            ) : (
              <View style={{alignItems: 'center'}}>
                <Text style={{color: colors.azure}}>
                  {strings.viewall_label_empty}
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
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    alignItems: 'center',
    backgroundColor: colors.veryLightPink,
  },
  deleteViewStyle: {
    flexDirection: 'row',
    width: width,
    height: height * 0.075,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteButton: {margin: width * 0.05, marginTop: height * 0.1},
  deviceNumberByPm25: {marginTop: height * 0.0423, alignItems: 'center'},
  pm25Text: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 12,
    color: colors.greyishBrown,
  },
  deviceNumberView: {flexDirection: 'row'},
  deviceNumberBox: {
    margin: width * 0.03125,
    alignItems: 'center',
    flexDirection: 'row',
  },
  flatListView: {marginTop: height * 0.04},
  deviceBgWhite: {
    flexDirection: 'column',
    width: width * 0.281,
    height: width * 0.281,
    margin: width * 0.0156,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  bgColor: {
    width: width * 0.281,
    height: height * 0.0211,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.brownGrey,
    shadowColor: 'rgba(0, 172, 255, 0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  devicePlace: {
    width: width * 0.2,
    height: height * 0.0774,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtPlaceColor: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.brownGrey,
  },
  txtpiCo: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.brownGrey,
  },
  deviceDeleteButton: {
    position: 'absolute',
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
  modalHeaderText: {fontSize: 22, fontFamily: 'NotoSans'},
  modalSubTextView: {
    width: width * 0.75,
    marginTop: height * 0.0281,
    alignItems: 'center',
  },
  modalSubText: {fontSize: 16, color: colors.brownGrey, textAlign: 'center'},
  modalButton: {
    width: width * 0.3875,
    height: height * 0.0704,
    marginTop: height * 0.0423,
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
    fontSize: 14,
    fontFamily: 'NotoSans',
    color: colors.white,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const goodState = StyleSheet.create({
  indicator: {
    margin: 2,
    width: 8,
    height: 8,
    backgroundColor: colors.azure,
  },
  text: {
    margin: 2,
    fontFamily: 'NotoSans',
    fontSize: 16,
  },
  bgColor: {
    width: width * 0.281,
    height: height * 0.0211,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.azure,
    shadowColor: 'rgba(0, 172, 255, 0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  txtPlaceColor: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.azure,
  },
  txtpiCo: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.azure,
  },
});

const modState = StyleSheet.create({
  indicator: {
    margin: 2,
    width: 8,
    height: 8,
    backgroundColor: colors.lichen,
  },
  text: {
    margin: 2,
    fontFamily: 'NotoSans',
    fontSize: 16,
  },
  bgColor: {
    width: width * 0.281,
    height: height * 0.0211,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.lichen,
    shadowColor: 'rgba(121, 191, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  txtPlaceColor: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.darkLimeGreen,
  },
  txtpiCo: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.darkLimeGreen,
  },
});

const badState = StyleSheet.create({
  indicator: {
    margin: 2,
    width: 8,
    height: 8,
    backgroundColor: colors.lightOrange,
  },
  text: {
    margin: 2,
    fontFamily: 'NotoSans',
    fontSize: 16,
  },
  bgColor: {
    width: width * 0.281,
    height: height * 0.0211,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.lightOrange,
    shadowColor: 'rgba(255, 160, 64, 0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  txtPlaceColor: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.lightOrange,
  },
  txtpiCo: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.lightOrange,
  },
});

const veryBadState = StyleSheet.create({
  indicator: {
    margin: 2,
    width: 8,
    height: 8,
    backgroundColor: colors.coral,
  },
  text: {
    margin: 2,
    fontFamily: 'NotoSans',
    fontSize: 16,
  },
  bgColor: {
    width: width * 0.281,
    height: height * 0.0211,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.coral,
    shadowColor: 'rgba(252, 83, 69, 0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 1,
  },
  txtPlaceColor: {
    textAlign: 'center',
    fontFamily: 'NotoSans',
    fontSize: 13,
    color: colors.coral,
  },
  txtpiCo: {
    fontFamily: 'NotoSans',
    fontSize: 11,
    color: colors.coral,
  },
});
