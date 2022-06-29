import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  SettingContext,
  NoticeContext,
  TempContext,
  UserDetailInfoContext,
  LanguageContext,
} from '../../../context';
import ToggleSwitch from '../../../component/ToggleSwitch';
import colors from '../../../src/colors';
import Modal from 'react-native-modal';

export function Setting({navigation}) {
  const {changeNotification, changeTempMod} = useContext(SettingContext);
  const strings = useContext(LanguageContext);
  const userDetailInfo = useContext(UserDetailInfoContext);
  const isNoticeEnabled = useContext(NoticeContext);
  const isTempEnabled = useContext(TempContext);

  const [isNoticeAlert, setNoticeAlert] = useState(false);

  const toggleNoticeSwitch = () => {
    changeNotification();
    if (isNoticeEnabled === false) {
      setNoticeAlert(true);
    }
  };

  const toggleTempSwitch = () => {
    changeTempMod();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerViewStyle}>
        <Image source={require('../../../../Assets/img/imgPicohomeGood.png')} />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.editProfileEmail}>
            <Text style={styles.editEmail}>{userDetailInfo.Info.Email}</Text>
            <Image source={require('../../../../Assets/img/icEdit.png')} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.settingViewStyle}>
        <TouchableOpacity onPress={() => navigation.navigate('ViewAll')}>
          <View style={styles.managePicoHomeSetting}>
            <View style={styles.icStuff}>
              <Image source={require('../../../../Assets/img/icPico.png')} />
            </View>
            <View style={styles.manageMyPicoHomeTextStyle}>
              <Text style={styles.manageMyPiCoHomeText}>
                {strings.setting_list_managing}
              </Text>
            </View>
            <View style={styles.icNextArrow}>
              <Image
                source={require('../../../../Assets/img/icMiniarrowLeft.png')}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.notificationSetting}>
          <View style={styles.icNotification}>
            <Image
              source={require('../../../../Assets/img/icNotification.png')}
            />
          </View>
          <View style={styles.notificationTextStyle}>
            <Text style={styles.notificationText}>
              {strings.setting_list_notification}
            </Text>
          </View>
          <View style={styles.notiToggleButton}>
            <ToggleSwitch
              isOn={isNoticeEnabled}
              onColor={colors.azure}
              onToggle={toggleNoticeSwitch}
            />
            <Modal
              isVisible={isNoticeAlert}
              onBackdropPress={() => setNoticeAlert(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalCancel}>
                  <TouchableOpacity onPress={() => setNoticeAlert(false)}>
                    <Image
                      source={require('../../../../Assets/img/icCancel.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalHeaderTextView}>
                  <Text style={styles.modalHeaderText}>
                    {strings.setting_popup_title}
                  </Text>
                </View>
                <View style={styles.modalSubTextView}>
                  <Text style={styles.modalSubText}>
                    {strings.setting_popup_contents}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setNoticeAlert(false)}>
                  <View style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>
                      {strings.setting_popup_button_ok}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </View>
        <View style={styles.temperatureSetting}>
          <View style={styles.icTemperature}>
            <Image
              source={require('../../../../Assets/img/icTemperature.png')}
            />
          </View>
          <View style={styles.temperatureTextStyle}>
            <Text style={styles.temperatureText}>
              {strings.setting_list_temperature}
            </Text>
          </View>
          <View style={{position: 'absolute', right: 0}}>
            <ToggleSwitch
              isOn={isTempEnabled}
              onColor={colors.azure}
              offCircleColor={colors.azure}
              onToggle={toggleTempSwitch}
              temp={true}
            />
          </View>
        </View>
      </View>
      <View style={styles.linkFldViewStyle}>
        <TouchableOpacity
          style={styles.linkFldUnitStyle}
          onPress={() => navigation.navigate('WebView', 'amazon')}>
          <Image
            style={styles.icCart}
            source={require('../../../../Assets/img/icCart.png')}
          />
          <Text style={styles.storeText}>{strings.setting_list_store}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkFldUnitStyle}
          onPress={() => navigation.navigate('WebView', 'faq')}>
          <Image
            style={styles.icQuestion}
            source={require('../../../../Assets/img/icQuestion.png')}
          />
          <Text style={styles.infoText}>{strings.setting_list_help}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkFldUnitStyle}
          onPress={() => navigation.navigate('WebView', 'terms')}>
          <Image
            style={styles.icTerms}
            source={require('../../../../Assets/img/icTerms.png')}
          />
          <Text style={styles.termsText}>{strings.setting_list_terms}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.versionViewStyle}>
        <Text style={styles.versionStyle}>v.3.0.17</Text>
      </View>
    </View>
  );
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerViewStyle: {
    width: width,
    marginTop: height * 0.176,
    alignItems: 'center',
  },
  editProfileEmail: {
    flexDirection: 'row',
    margin: 4,
    justifyContent: 'center',
  },
  editEmail: {
    margin: 2,
    textAlign: 'center',
    // fontFamily: 'NotoSans-Regular',
    fontSize: 12,
    color: colors.brownishGrey,
  },
  settingViewStyle: {
    flexDirection: 'column',
    width: width * 0.85,
    marginTop: height * 0.06,
    justifyContent: 'space-around',
  },
  managePicoHomeSetting: {
    flexDirection: 'row',
    width: width * 0.85,
    height: height * 0.0845,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.veryLightPink,
  },
  icStuff: {
    marginHorizontal: width * 0.0125,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageMyPicoHomeTextStyle: {
    width: width * 0.6875,
    marginHorizontal: width * 0.0125,
    alignItems: 'flex-start',
  },
  manageMyPiCoHomeText: {
    // fontFamily: 'NotoSans-Regular',
    fontSize: 12,
    color: colors.black,
  },
  icNextArrow: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationSetting: {
    flexDirection: 'row',
    width: width * 0.85,
    height: height * 0.0845,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.veryLightPink,
  },
  icNotification: {
    marginHorizontal: width * 0.0125,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationTextStyle: {
    width: width * 0.6875,
    marginHorizontal: width * 0.0125,
    alignItems: 'flex-start',
  },
  notificationText: {
    // fontFamily: 'NotoSans-Regular',
    fontSize: 12,
    color: colors.black,
  },
  notiToggleButton: {position: 'absolute', right: 0},
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
  modalHeaderText: {fontSize: 22 /*fontFamily: 'NotoSans-Bold'*/},
  modalSubTextView: {
    width: width * 0.75,
    marginTop: height * 0.0281,
  },
  modalSubText: {
    /*fontFamily: 'NotoSans-Regular',*/ fontSize: 16,
    color: colors.brownGrey,
  },
  modalButton: {
    width: width * 0.8,
    height: height * 0.0704,
    marginTop: height * 0.0423,
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
    // fontFamily: 'NotoSans-Bold',
    color: colors.white,
  },
  temperatureSetting: {
    flexDirection: 'row',
    width: width * 0.85,
    height: height * 0.0845,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.veryLightPink,
    borderBottomWidth: 1,
    borderBottomColor: colors.veryLightPink,
  },
  icTemperature: {
    marginHorizontal: width * 0.0125,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatureTextStyle: {
    width: width * 0.6875,
    marginHorizontal: width * 0.0125,
    alignItems: 'flex-start',
  },
  temperatureText: {
    // fontFamily: 'NotoSans-Regular',
    fontSize: 12,
    color: colors.black,
  },
  linkFldViewStyle: {flexDirection: 'row', marginTop: height * 0.056},
  linkFldUnitStyle: {flexDirection: 'column', alignItems: 'center'},
  icCart: {
    width: 40,
    height: 40,
    marginHorizontal: 20,
    marginBottom: 4,
  },
  icQuestion: {
    width: 40,
    height: 40,
    marginHorizontal: 20,
    marginBottom: 4,
  },
  icTerms: {
    width: 40,
    height: 40,
    marginHorizontal: 20,
    marginBottom: 4,
  },
  storeText: {
    textAlign: 'center',
    // fontFamily: 'NotoSans-Regular',
    fontSize: 10,
    color: colors.brownGrey,
  },
  infoText: {
    textAlign: 'center',
    // fontFamily: 'NotoSans-Regular',
    fontSize: 10,
    color: colors.brownGrey,
  },
  termsText: {
    textAlign: 'center',
    // fontFamily: 'NotoSans-Regular',
    fontSize: 10,
    color: colors.brownGrey,
  },
  versionViewStyle: {
    marginTop: height * 0.127,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionStyle: {
    textAlign: 'center',
    // fontFamily: 'NotoSans-Regular',
    fontSize: 11,
    color: colors.brownGrey,
  },
});
