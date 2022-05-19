import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Onboarding} from './Onboarding';
import {MainStackScreen} from '../Main/MainStack';

const OnboardingStack = createStackNavigator();
export const OnboardingStackScreen = () => (
  <OnboardingStack.Navigator headerMode="none">
    <OnboardingStack.Screen name="Start" component={Onboarding} />
    <OnboardingStack.Screen
      name="Main"
      component={MainStackScreen}
      options={{animationEnabled: false}}
    />
  </OnboardingStack.Navigator>
);
