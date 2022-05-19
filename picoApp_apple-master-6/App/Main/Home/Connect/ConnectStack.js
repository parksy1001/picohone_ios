import React, {useContext} from 'react';
import {Dimensions, Image, TouchableOpacity} from 'react-native';
import {LanguageContext} from '../../../context';
import {createStackNavigator} from '@react-navigation/stack';
import {Connect} from './Connect';
import {FindWiFi} from './FindWiFi';
import {SetUpPico} from './SetUpPico';
import {ConnectWiFi} from './ConnectWiFi';
import {Scan} from './Scan';
import FindPicoToScan from './FindPicoToScan';
import FindPicoToWiFi from './FindPicoToWiFi';

import colors from '../../../src/colors';

const ConnectStack = createStackNavigator();
export const ConnectStackScreen = ({navigation}) => {
  const strings = useContext(LanguageContext);
  return (
    <ConnectStack.Navigator>
      <ConnectStack.Screen
        name="Connect"
        component={Connect}
        options={{
          title: strings.connecting_title,
          headerTransparent: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'NotoSans',
            fontWeight: '800',
            fontStyle: 'normal',
          },
          headerBackTitleStyle: {
            color: 'transparent',
          },
          headerBackImage: () => (
            <Image
              style={{marginLeft: width * 0.05}}
              source={require('../../../../Assets/img/icArrowLeft.png')}
            />
          ),
        }}
      />
      <ConnectStack.Screen
        name="FindWiFi"
        component={FindWiFi}
        options={{
          title: strings.wifisetting_2_title,
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: colors.white,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'NotoSans',
            fontWeight: '800',
            fontStyle: 'normal',
          },
          headerBackTitleStyle: {
            color: 'transparent',
          },
          headerBackImage: () => null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Connect')}>
              <Image
                style={{marginLeft: width * 0.05}}
                source={require('../../../../Assets/img/icArrowLeft.png')}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ConnectStack.Screen
        name="FindPicoToScan"
        component={FindPicoToScan}
        options={{
          title: strings.wifisetting_1_title,
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: colors.white,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'NotoSans',
            fontWeight: '800',
            fontStyle: 'normal',
          },
          headerBackTitleStyle: {
            color: 'transparent',
          },
          headerBackImage: () => (
            <Image
              style={{marginLeft: width * 0.05}}
              source={require('../../../../Assets/img/icArrowLeft.png')}
            />
          ),
        }}
      />
      <ConnectStack.Screen
        name="FindPicoToWiFi"
        component={FindPicoToWiFi}
        options={{
          title: strings.wifisetting_1_title,
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: colors.white,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'NotoSans',
            fontWeight: '800',
            fontStyle: 'normal',
          },
          headerBackTitleStyle: {
            color: 'transparent',
          },
          headerBackImage: () => (
            <Image
              style={{marginLeft: width * 0.05}}
              source={require('../../../../Assets/img/icArrowLeft.png')}
            />
          ),
        }}
      />
      <ConnectStack.Screen
        name="Scan"
        component={Scan}
        options={{
          title: 'Scan',
          headerTransparent: 'true',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'NotoSans',
            fontWeight: '800',
            fontStyle: 'normal',
          },
          headerBackTitleStyle: {
            color: 'transparent',
          },
          headerBackImage: () => null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Connect')}>
              <Image
                style={{marginLeft: width * 0.05}}
                source={require('../../../../Assets/img/icArrowLeft.png')}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ConnectStack.Screen
        name="ConnectWiFi"
        component={ConnectWiFi}
        options={{
          title: strings.wifisetting_3_title,
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: colors.white,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'NotoSans',
            fontWeight: '800',
            fontStyle: 'normal',
          },
          headerBackTitleStyle: {
            color: 'transparent',
          },
          headerBackImage: () => (
            <Image
              style={{marginLeft: width * 0.05}}
              source={require('../../../../Assets/img/icArrowLeft.png')}
            />
          ),
        }}
      />
      <ConnectStack.Screen
        name="SetUpPico"
        component={SetUpPico}
        options={{
          title: strings.wifisetting_4_title,
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: colors.white,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'NotoSans',
            fontWeight: '800',
            fontStyle: 'normal',
          },
          headerBackTitleStyle: {
            color: 'transparent',
          },
          headerBackImage: () => (
            <Image
              style={{marginLeft: width * 0.05}}
              source={require('../../../../Assets/img/icArrowLeft.png')}
            />
          ),
        }}
      />
    </ConnectStack.Navigator>
  );
};

const {width} = Dimensions.get('window');
