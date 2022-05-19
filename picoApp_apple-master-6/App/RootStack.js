import React, {useState, useEffect} from 'react';
import {NativeModules} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {FirstLaunchContext, LanguageContext, LocaleContext} from './context';
import {OnboardingStackScreen} from './Onboarding/OnboardingStack';
import {MainStackScreen} from './Main/MainStack';
import {Splash} from './Splash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalizedStrings from 'react-native-localization';
import english from './src/Languages/en';
import japanese from './src/Languages/ja';
import korean from './src/Languages/kr';

/**
 * 사용자 언어 설정
 * Mobile Device에 설정된 language로 설정
 */

const getLocale = () => {
  let locale =
    NativeModules.SettingsManager.settings.AppleLocale ||
    NativeModules.SettingsManager.settings.AppleLanguages[0];

  if (locale.slice(0, 2) === 'ko') {
    locale = 'ko';
  } else if (locale.slice(0, 2) === 'ja') {
    locale = 'ja';
  } else {
    locale = 'en';
  }
  //console.log(locale);
  return locale;
};

const strings = new LocalizedStrings({
  en: english,
  ja: japanese,
  ko: korean,
});
const locale = getLocale();

const RootStack = createStackNavigator();
export const RootStackScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
      } else {
        setFirstLaunch(false);
      }
    });
  }, []);

  useEffect(() => {
    strings.setLanguage(locale);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <FirstLaunchContext.Provider value={firstLaunch}>
      <LocaleContext.Provider value={locale}>
        <LanguageContext.Provider value={strings}>
          {!isLoading ? (
            <RootStack.Navigator headerMode="none">
              {firstLaunch ? (
                <RootStack.Screen
                  name="Onboarding"
                  component={OnboardingStackScreen}
                  options={{animationEnabled: false}}
                />
              ) : (
                <RootStack.Screen
                  name="Main"
                  component={MainStackScreen}
                  options={{animationEnabled: false}}
                />
              )}
            </RootStack.Navigator>
          ) : (
            <Splash />
          )}
        </LanguageContext.Provider>
      </LocaleContext.Provider>
    </FirstLaunchContext.Provider>
  );
};
